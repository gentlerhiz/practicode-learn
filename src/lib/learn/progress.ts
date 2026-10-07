import 'server-only'
import type { Route } from 'next'
import { cache } from 'react'
import { getTrackContent, type TrackContent } from '@/content/tracks'
import { listPublishedLessons } from '@/lib/lessons/catalogue'
import { createClient } from '@/lib/supabase/server'

export type LessonStatus = 'not_started' | 'started' | 'completed'

export type LessonView = {
  id: string
  number: number
  title: string
  minutes?: number
  description?: string
  href: Route | null
  status: LessonStatus
}

export type ModuleView = {
  number: number
  title: string
  summary: string
  free: boolean
  project?: string
  lessons: LessonView[]
}

export type LearnerTrack = {
  trackTitle: string
  track: TrackContent
  modules: ModuleView[]
  progress: { lesson_id: string; status: string; updated_at: string; active_seconds: number; steps_done: number }[]
  events: string[]
}

export const OPEN_TRACK = 'front-end-web-development'
const PREFIX: Record<string, string> = { 'front-end-web-development': 'fe' }
const pad = (n: number) => String(n).padStart(2, '0')

/**
 * The open track as this learner sees it: every module and lesson from the syllabus, with a link for
 * each published lesson (matched by id, as the content build names them) and the learner's status.
 */
export const loadLearnerTrack = cache(async (slug: string = OPEN_TRACK): Promise<LearnerTrack> => {
  const track = getTrackContent(slug)!
  const supabase = await createClient()
  const [published, progressResult, eventsResult] = await Promise.all([
    listPublishedLessons(slug),
    supabase
      .from('lesson_progress')
      .select('lesson_id, status, updated_at, active_seconds, steps_done')
      .order('updated_at', { ascending: false }),
    supabase
      .from('learning_events')
      .select('occurred_at')
      .gte('occurred_at', new Date(Date.now() - 8 * 86_400_000).toISOString()),
  ])
  const progress = progressResult.data ?? []
  const statusOf = new Map(progress.map((p) => [p.lesson_id, p.status as LessonStatus]))
  const prefix = PREFIX[slug] ?? slug
  const modules: ModuleView[] = track.modules.map((m) => ({
    number: m.number,
    title: m.title,
    summary: m.summary,
    free: Boolean(m.free),
    project: m.project,
    lessons: m.lessons.map((l, i) => {
      const id = `${prefix}-${pad(m.number)}-${pad(i + 1)}`
      const meta = published.find((p) => p.id === id)
      return {
        id,
        number: i + 1,
        title: meta?.title ?? l.title,
        minutes: meta?.minutes ?? l.minutes,
        description: meta?.description,
        href: meta ? (`/learn/${meta.track}/${meta.slug}` as Route) : null,
        status: statusOf.get(id) ?? 'not_started',
      }
    }),
  }))
  return { trackTitle: track.title, track, modules, progress, events: (eventsResult.data ?? []).map((e) => e.occurred_at) }
})

/** Where to carry on: the lesson in progress most recently, else the first open lesson not yet done. */
export function nextLesson(data: LearnerTrack) {
  const all = data.modules.flatMap((m) => m.lessons.map((l) => ({ module: m, lesson: l })))
  const recent = data.progress
    .filter((p) => p.status === 'started')
    .map((p) => all.find((x) => x.lesson.id === p.lesson_id && x.lesson.href))
    .find(Boolean)
  return { item: recent ?? all.find((x) => x.lesson.href && x.lesson.status !== 'completed'), inProgress: Boolean(recent) }
}

/** Every module and lesson, for the search box in the top bar. */
export function searchEntries(data: LearnerTrack) {
  return data.modules.flatMap((m) => [
    { label: m.title, meta: `${data.track.title} · Module ${m.number}`, href: `/my-tracks#module-${m.number}` as Route },
    ...m.lessons.map((l) => ({
      label: l.title,
      meta: `Module ${m.number} · Lesson ${l.number}${l.href ? '' : ' · opens soon'}`,
      href: l.href ?? (`/my-tracks#module-${m.number}` as Route),
    })),
  ])
}
