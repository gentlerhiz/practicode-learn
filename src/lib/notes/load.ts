import 'server-only'
import { getTrackContent } from '@/content/tracks'
import { listPublishedLessons } from '@/lib/lessons/catalogue'
import { loadPack } from '@/lib/lessons/packs'
import { projectPack } from '@/lib/projects/load'
import { createClient } from '@/lib/supabase/server'
import { buildNotes, type ModuleNotes } from './content'

export type NotesResult =
  | { kind: 'ok'; notes: ModuleNotes; free: boolean }
  | { kind: 'missing' }
  | { kind: 'sign-in' }
  | { kind: 'pro' }

/**
 * A published module's notes, for whoever is asking. Module 1 is free, so its notes are for anyone; the
 * rest need a signed-in Pro member, and their packs are downloaded with the learner's own session, so
 * storage hands them over only to Pro members.
 */
export async function loadModuleNotes(track: string, module: number): Promise<NotesResult> {
  const content = getTrackContent(track)
  const syllabus = content?.modules.find((m) => m.number === module)
  if (!content || !syllabus || syllabus.soon) return { kind: 'missing' }
  const lessons = (await listPublishedLessons(track)).filter((l) => l.module === module)
  if (!lessons.length) return { kind: 'missing' }

  const free = lessons.every((l) => l.free)
  const supabase = await createClient()
  if (!free) {
    const { data } = await supabase.auth.getClaims()
    if (!data?.claims?.sub) return { kind: 'sign-in' }
    const { data: isPro } = await supabase.rpc('is_pro')
    if (isPro !== true) return { kind: 'pro' }
  }

  const brief = async () => {
    const { data } = await supabase
      .from('projects')
      .select('free, pack_path')
      .eq('track_slug', track)
      .eq('module', module)
      .maybeSingle()
    return data ? projectPack(supabase, data) : null
  }
  const [packs, project] = await Promise.all([
    Promise.all(lessons.map((l) => loadPack(l, supabase))),
    // The notes still work without the brief: they fall back to the syllabus's line about the project.
    brief().catch(() => null),
  ])
  return { kind: 'ok', free, notes: buildNotes({ course: content.title, module: syllabus, packs, project }) }
}
