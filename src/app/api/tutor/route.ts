import { z } from 'zod'
import { listPublishedLessons } from '@/lib/lessons/catalogue'
import { loadPack } from '@/lib/lessons/packs'
import { createClient } from '@/lib/supabase/server'
import { SYSTEM_PROMPT, stepContext } from '@/lib/tutor/context'
import { askModel, TutorUnavailable } from '@/lib/tutor/groq'

const PRIVATE = { 'Cache-Control': 'private, no-store' }
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: PRIVATE })

const Quota = z.object({ used: z.number(), cap: z.number(), id: z.string().nullable().optional() })

const Ask = z.object({
  lessonId: z.string().regex(/^[a-z]{2}-\d{2}-\d{2}$/),
  step: z.number().int().min(0).max(99),
  question: z.string().trim().min(1).max(500),
  /** Earlier turns on this step, so "explain it fully" can follow a hint. */
  history: z
    .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(2000) }))
    .max(6)
    .default([]),
  selected: z.string().max(20).optional(),
  files: z
    .array(z.object({ name: z.string().max(60), lang: z.string().max(20), code: z.string().max(20_000) }))
    .max(6)
    .optional(),
})

/** Today's questions: { used, cap }. */
export async function GET() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims?.sub) return json({ error: 'Sign in first' }, 401)
  const quota = await supabase.rpc('tutor_quota')
  if (quota.error) return json({ error: 'Could not read your questions' }, 500)
  return json(Quota.parse(quota.data))
}

/**
 * Asks the AI tutor about one lesson step. The lesson comes from our own catalogue (a Pro one only for
 * Pro members), never from the browser, so the tutor is grounded in the real step. Each question takes
 * one from the learner's daily cap; if the AI can't answer, it's given back.
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims?.sub) return json({ error: 'Sign in first' }, 401)

  const parsed = Ask.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return json({ error: 'That question couldn’t be read' }, 400)
  const ask = parsed.data

  const meta = (await listPublishedLessons()).find((l) => l.id === ask.lessonId)
  if (!meta) return json({ error: 'Lesson not found' }, 404)
  if (!meta.free) {
    const { data: isPro } = await supabase.rpc('is_pro')
    if (isPro !== true) return json({ error: 'This lesson is part of Pro' }, 403)
  }

  let context: string
  try {
    context = stepContext(await loadPack(meta, supabase), ask.step, { selected: ask.selected, files: ask.files })
  } catch (error) {
    console.error(`Tutor could not load ${ask.lessonId}`, error)
    return json({ error: 'The lesson could not be loaded' }, 502)
  }

  const claim = await supabase.rpc('tutor_claim', { p_lesson: ask.lessonId, p_step: ask.step, p_question: ask.question })
  if (claim.error) return json({ error: 'Could not count your question' }, 500)
  const quota = Quota.parse(claim.data)
  if (!quota.id) return json({ error: 'limit', used: quota.used, cap: quota.cap }, 429)

  try {
    const answer = await askModel([
      { role: 'system', content: `${SYSTEM_PROMPT}\n\n=== The lesson step ===\n${context}` },
      ...ask.history,
      { role: 'user', content: ask.question },
    ])
    await supabase.rpc('tutor_settle', { p_id: quota.id, p_answer: answer })
    return json({ answer, used: quota.used, cap: quota.cap })
  } catch (error) {
    await supabase.rpc('tutor_settle', { p_id: quota.id, p_answer: null })
    if (!(error instanceof TutorUnavailable)) throw error
    console.error('Tutor unavailable', error.message)
    return json({ error: 'busy', used: quota.used - 1, cap: quota.cap }, 503)
  }
}
