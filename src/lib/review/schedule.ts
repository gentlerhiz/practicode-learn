import { createEmptyCard, fsrs, type Card, type Grade } from 'ts-fsrs'

/**
 * Spaced review with FSRS, the open-source scheduler Anki uses: each card comes back just before the
 * learner would forget it. Pure functions, so they're the same on the server and in tests.
 */
const scheduler = fsrs({ enable_fuzz: true })

/** At most this many cards a day: a short habit beats a long pile. */
export const DAILY_CAP = 20

export type CardState = {
  due: string
  stability: number
  difficulty: number
  elapsed_days: number
  scheduled_days: number
  learning_steps: number
  reps: number
  lapses: number
  state: number
  last_review: string | null
}

const toCard = (s: CardState | null, now: Date): Card =>
  s
    ? {
        due: new Date(s.due),
        stability: s.stability,
        difficulty: s.difficulty,
        elapsed_days: s.elapsed_days,
        scheduled_days: s.scheduled_days,
        learning_steps: s.learning_steps,
        reps: s.reps,
        lapses: s.lapses,
        state: s.state,
        last_review: s.last_review ? new Date(s.last_review) : undefined,
      }
    : createEmptyCard(now)

const fromCard = (c: Card): CardState => ({
  due: c.due.toISOString(),
  stability: c.stability,
  difficulty: Math.min(10, Math.max(0, c.difficulty)),
  elapsed_days: Math.max(0, Math.round(c.elapsed_days)),
  scheduled_days: Math.max(0, Math.round(c.scheduled_days)),
  learning_steps: Math.max(0, c.learning_steps),
  reps: c.reps,
  lapses: c.lapses,
  state: c.state,
  last_review: c.last_review ? c.last_review.toISOString() : null,
})

/** The card's state after a rating: 1 Again, 2 Hard, 3 Good, 4 Easy. A card never seen starts empty. */
export function rate(state: CardState | null, rating: 1 | 2 | 3 | 4, now = new Date()): CardState {
  return fromCard(scheduler.next(toCard(state, now), now, rating as Grade).card)
}

/** "in 10 min", "in 3 days": how long until the card comes back. */
export function untilLabel(due: Date, now: Date): string {
  const minutes = Math.max(1, Math.round((due.getTime() - now.getTime()) / 60000))
  if (minutes < 60) return `in ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `in ${hours} ${hours === 1 ? 'hour' : 'hours'}`
  const days = Math.round(hours / 24)
  if (days < 31) return `in ${days} ${days === 1 ? 'day' : 'days'}`
  const months = Math.round(days / 30)
  return `in ${months} ${months === 1 ? 'month' : 'months'}`
}

/** When the card would come back after each rating, for the labels under the four buttons. */
export function previews(state: CardState | null, now = new Date()): [string, string, string, string] {
  const all = scheduler.repeat(toCard(state, now), now)
  return [1, 2, 3, 4].map((g) => untilLabel(all[g as Grade].card.due, now)) as [
    string,
    string,
    string,
    string,
  ]
}

/**
 * Today's session: cards that are due, the most overdue first, then cards not seen yet, in lesson
 * order, up to DAILY_CAP in all.
 */
export function pickSession<T extends { id: string; order: number }>(
  cards: T[],
  states: Map<string, CardState>,
  now = new Date(),
  cap = DAILY_CAP,
): T[] {
  const due = cards
    .filter((c) => states.has(c.id) && new Date(states.get(c.id)!.due) <= now)
    .sort((a, b) => states.get(a.id)!.due.localeCompare(states.get(b.id)!.due))
  const fresh = cards.filter((c) => !states.has(c.id)).sort((a, b) => a.order - b.order)
  return [...due, ...fresh].slice(0, cap)
}

/** How many different days, in the last 7, had at least one review (UTC dates). */
export function daysReviewed(times: string[], now = new Date()): number {
  const since = now.getTime() - 7 * 86_400_000
  return new Set(times.filter((t) => new Date(t).getTime() > since).map((t) => t.slice(0, 10))).size
}
