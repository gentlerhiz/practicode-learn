'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const File = z.object({
  name: z.string().min(1).max(80),
  lang: z.string().min(1).max(20),
  code: z.string().max(60000),
  readonly: z.literal(true).optional(),
})
const Result = z.object({
  name: z.string().max(500),
  pass: z.boolean(),
  message: z.string().max(2000).optional(),
})
const Work = z.object({
  projectId: z.string().regex(/^[a-z]{2}-p\d{2}$/),
  version: z.number().int().min(1),
  files: z.array(File).max(8),
  siteUrl: z
    .string()
    .trim()
    .max(280)
    .refine((u) => u === '' || /^https:\/\/\S{4,}$/.test(u), 'Use the full address, starting with https://')
    .optional(),
  results: z.array(Result).max(40).optional(),
})
type WorkInput = z.input<typeof Work>

/** Saves a draft: the learner's files (readonly ones aren't theirs, so they're left out), and more. */
export async function saveProject(
  input: WorkInput,
): Promise<{ ok: true; savedAt: string } | { ok: false; error: string }> {
  const parsed = Work.safeParse(input)
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'That couldn’t be saved.' }
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const learner = data?.claims?.sub
  if (!learner) return { ok: false, error: 'Log in again to save your work.' }

  const { projectId, version, files, siteUrl, results } = parsed.data
  const savedAt = new Date().toISOString()
  const fields = {
    project_version: version,
    files: files.filter((f) => !f.readonly),
    updated_at: savedAt,
    ...(siteUrl !== undefined ? { site_url: siteUrl || null } : {}),
    ...(results ? { results } : {}),
  }
  // Update first: learners can't change a row's keys, so an upsert's update would be refused.
  const updated = await supabase
    .from('project_work')
    .update(fields)
    .eq('project_id', projectId)
    .select('project_id')
  if (updated.error) return { ok: false, error: 'Your work couldn’t be saved. Check your connection.' }
  if (!updated.data.length) {
    const created = await supabase
      .from('project_work')
      .insert({ learner_id: learner, project_id: projectId, ...fields })
    if (created.error) return { ok: false, error: 'Your work couldn’t be saved. Check your connection.' }
  }
  return { ok: true, savedAt }
}

const REASONS: [RegExp, string][] = [
  [/every check/, 'Every check has to pass first. Run the checks again.'],
  [/self-review/, 'Tick every self-review question first.'],
  [/lessons first/, 'Finish this module’s lessons first.'],
  [/address/, 'Add the address where your project is live.'],
]

/** Submits a project: saves it, then asks the database to mark it passed. */
export async function submitProject(
  input: WorkInput & { review: boolean[] },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const saved = await saveProject(input)
  if (!saved.ok) return saved
  const review = z.array(z.boolean()).min(1).max(8).safeParse(input.review)
  if (!review.success) return { ok: false, error: 'Tick every self-review question first.' }
  const supabase = await createClient()
  const { error } = await supabase.rpc('pass_project', {
    p_project: input.projectId,
    p_results: input.results ?? [],
    p_review: review.data,
  })
  if (error)
    return {
      ok: false,
      error: REASONS.find(([re]) => re.test(error.message))?.[1] ?? 'That didn’t submit. Try again.',
    }
  revalidatePath('/projects')
  revalidatePath('/certificates')
  return { ok: true }
}
