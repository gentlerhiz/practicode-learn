/**
 * Small figures for the learner's own pages (dashboard, My Tracks), worked out from their progress rows
 * and learning events. Days are UTC days, Monday first, so the server and tests agree.
 */
const DAY = 86_400_000

export function weekStart(now: Date): Date {
  const midnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const sinceMonday = (new Date(midnight).getUTCDay() + 6) % 7
  return new Date(midnight - sinceMonday * DAY)
}

const dayIndex = (iso: string, start: Date) => Math.floor((Date.parse(iso) - start.getTime()) / DAY)

/** Monday to Sunday: was there any learning activity that day? */
export function activeDays(eventTimes: string[], now: Date): boolean[] {
  const start = weekStart(now)
  const days = Array<boolean>(7).fill(false)
  for (const t of eventTimes) {
    const i = dayIndex(t, start)
    if (i >= 0 && i < 7) days[i] = true
  }
  return days
}

/** Minutes of active learning per day this week, counting each lesson on the day it was last worked on. */
export function minutesByDay(rows: { updated_at: string; active_seconds: number }[], now: Date): number[] {
  const start = weekStart(now)
  const seconds = Array<number>(7).fill(0)
  for (const row of rows) {
    const i = dayIndex(row.updated_at, start)
    if (i >= 0 && i < 7) seconds[i]! += row.active_seconds
  }
  return seconds.map((s) => Math.round(s / 60))
}

/** The completed share of a module, as a whole percentage. */
export function moduleShare(statuses: string[]): number {
  if (!statuses.length) return 0
  return Math.round((statuses.filter((s) => s === 'completed').length / statuses.length) * 100)
}

/** The line under the learner's name in the sidebar. Everyone is on Free until plans launch. */
export function joinedLabel(joinedAt: string | null, now: Date): string {
  if (!joinedAt) return 'Free plan'
  const joined = new Date(joinedAt)
  if (weekStart(joined).getTime() === weekStart(now).getTime() && joined.getUTCDate() === now.getUTCDate()) {
    return 'Free · joined today'
  }
  return `Free · joined ${joined.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' })}`
}
