import 'server-only'
import type { Route } from 'next'
import { getTrackContent } from '@/content/tracks'
import { createClient } from '@/lib/supabase/server'
import { daysReviewed, pickSession, previews, type CardState } from './schedule'

export type SessionCard = {
  id: string
  track: string
  trackTitle: string
  lesson: string
  lessonHref: Route
  front: string
  back: string
  /** When the card would come back after Again, Hard, Good and Easy. */
  next: [string, string, string, string]
}

export type ReviewSummary = {
  /** Cards waiting today, across every course, capped at the daily limit. */
  due: number
  /** Cards from finished lessons, in all. */
  total: number
  daysThisWeek: number
  /** The next card's question, as plain text, for the dashboard. */
  next: string | null
  /** Today's cards for each course. */
  courses: { slug: string; title: string; due: number }[]
}

type Row = {
  id: string
  position: number
  front: string
  back: string
  lessons: {
    id: string
    title: string
    slug: string
    track_slug: string
    module: number
    lesson: number
  } | null
}

/** The learner's cards (only lessons they've completed, by row-level security) and their review state. */
async function read() {
  const supabase = await createClient()
  const now = new Date()
  const [cards, states, log] = await Promise.all([
    supabase
      .from('lesson_cards')
      .select('id, position, front, back, lessons(id, title, slug, track_slug, module, lesson)'),
    supabase
      .from('review_cards')
      .select(
        'card_id, due, stability, difficulty, elapsed_days, scheduled_days, learning_steps, reps, lapses, state, last_review',
      ),
    supabase
      .from('review_log')
      .select('reviewed_at')
      .gte('reviewed_at', new Date(now.getTime() - 7 * 86_400_000).toISOString()),
  ])
  const all = ((cards.data ?? []) as unknown as Row[])
    .filter((c) => c.lessons)
    .map((c) => ({
      ...c,
      lessons: c.lessons!,
      order: c.lessons!.module * 10_000 + c.lessons!.lesson * 100 + c.position,
    }))
  const stateOf = new Map<string, CardState>((states.data ?? []).map(({ card_id, ...s }) => [card_id, s]))
  return { all, stateOf, now, times: (log.data ?? []).map((l) => l.reviewed_at) }
}

/** Today's review session, for every course or one. */
export async function loadSession(
  course?: string,
): Promise<{ cards: SessionCard[]; summary: ReviewSummary }> {
  const { all, stateOf, now, times } = await read()
  const session = pickSession(course ? all.filter((c) => c.lessons.track_slug === course) : all, stateOf, now)
  return {
    cards: session.map((c) => ({
      id: c.id,
      track: c.lessons.track_slug,
      trackTitle: getTrackContent(c.lessons.track_slug)?.title ?? c.lessons.track_slug,
      lesson: `Lesson ${c.lessons.module}.${c.lessons.lesson}: ${c.lessons.title}`,
      lessonHref: `/learn/${c.lessons.track_slug}/${c.lessons.slug}` as Route,
      front: c.front,
      back: c.back,
      next: previews(stateOf.get(c.id) ?? null, now),
    })),
    summary: summarise(all, stateOf, now, times),
  }
}

/** Counts for the dashboard and the course filter, without building a session. */
export async function loadReviewSummary(): Promise<ReviewSummary> {
  const { all, stateOf, now, times } = await read()
  return summarise(all, stateOf, now, times)
}

function summarise(
  all: Awaited<ReturnType<typeof read>>['all'],
  stateOf: Map<string, CardState>,
  now: Date,
  times: string[],
): ReviewSummary {
  const slugs = [...new Set(all.map((c) => c.lessons.track_slug))]
  const today = pickSession(all, stateOf, now)
  return {
    due: today.length,
    next: today[0]
      ? today[0].front
          .replace(/<[^>]+>/g, '')
          .replace(/&#x27;|&#39;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
      : null,
    total: all.length,
    daysThisWeek: daysReviewed(times, now),
    courses: slugs.map((slug) => ({
      slug,
      title: getTrackContent(slug)?.title ?? slug,
      due: pickSession(
        all.filter((c) => c.lessons.track_slug === slug),
        stateOf,
        now,
      ).length,
    })),
  }
}
