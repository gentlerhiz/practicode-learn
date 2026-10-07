import type { Route } from 'next'
import type { DashboardData, DayMark, NewDashboardData } from '@/components/app/dashboard/types'
import { PLAN_TRACKS, parsePlan, planTime, planTrack } from '@/lib/onboarding/plan'
import { activeDays, minutesByDay, moduleShare, weekStart } from './stats'

export type LessonState = 'not_started' | 'started' | 'completed'

/** The learner's track, as src/lib/learn/progress.ts loads it (kept here so this file stays pure). */
export type LearnerTrackData = {
  trackTitle: string
  modules: {
    number: number
    title: string
    summary: string
    free: boolean
    project?: string
    lessons: { id: string; number: number; title: string; minutes?: number; description?: string; href: Route | null; status: LessonState }[]
  }[]
  progress: { lesson_id: string; status: string; updated_at: string; active_seconds: number; steps_done: number }[]
  events: string[]
}

const WEEK_GOAL = 5
// The one-line pitches on the new-learner dashboard (PrismDashboardNew).
const OTHER_LINES: Record<string, string> = {
  da: 'Tidy messy spreadsheets and build dashboards people read.',
  ux: 'Talk to users and design screens people can click through.',
  ai: 'Train models in Python and learn where AI goes wrong.',
}
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const firstNameOf = (name: string | null) => name?.trim().split(/\s+/)[0] || null
const shortName = (title: string) => title.split(':')[0]!.trim()

export const isNewLearner = (data: LearnerTrackData) =>
  data.modules.every((m) => m.lessons.every((l) => l.status === 'not_started'))

function nextUp(data: LearnerTrackData) {
  const all = data.modules.flatMap((m) => m.lessons.map((lesson) => ({ module: m, lesson })))
  const recent = data.progress
    .filter((p) => p.status === 'started')
    .map((p) => all.find((x) => x.lesson.id === p.lesson_id && x.lesson.href))
    .find(Boolean)
  const started = recent ?? all.find((x) => x.lesson.href && x.lesson.status === 'started')
  return { item: started ?? all.find((x) => x.lesson.href && x.lesson.status !== 'completed'), inProgress: Boolean(started) }
}

function weekNote(count: number) {
  const left = WEEK_GOAL - count
  const tail = 'Missing a day doesn’t reset anything.'
  if (left <= 0) return `You’ve hit your goal this week. ${tail}`
  if (left === 1) return `One more day and you’ve hit your goal. ${tail}`
  return `${['Two', 'Three', 'Four', 'Five'][left - 2]} more days and you’ve hit your goal. ${tail}`
}

/** PrismDashboard, from the learner's real progress. Anything without a backend yet says so. */
export function buildDashboard(data: LearnerTrackData, name: string | null, now: Date): DashboardData {
  const { item, inProgress } = nextUp(data)
  const active = activeDays(data.events, now)
  const today = Math.floor((now.getTime() - weekStart(now).getTime()) / 86_400_000)
  const days: DayMark[] = active.map((on, i) => (on ? 'fe' : i < today ? 'missed' : i === today ? 'today' : 'later'))
  const count = active.filter(Boolean).length
  const perDay = minutesByDay(data.progress, now)
  const firstModule = data.modules[0]!

  const nodes = data.modules.map((m) => {
    const pct = moduleShare(m.lessons.map((l) => l.status))
    const touched = m.lessons.some((l) => l.status !== 'not_started')
    return pct === 100
      ? { name: shortName(m.title), state: 'mastered' as const }
      : touched
        ? { name: shortName(m.title), state: 'progress' as const, pct }
        : { name: shortName(m.title), state: 'todo' as const }
  })
  const current = item?.module ?? firstModule

  return {
    firstName: firstNameOf(name),
    intro: item
      ? inProgress
        ? { text: `You stopped partway through ${item.lesson.title}.`, accent: 'Pick up right where you left off.' }
        : { text: `Next up: ${item.lesson.title}.`, accent: item.lesson.minutes ? `About ${item.lesson.minutes} minutes.` : undefined }
      : { text: 'You’ve finished every lesson that’s open so far.', accent: 'New lessons are on the way.' },
    resume: item
      ? {
          eyebrow: `Front-End · Module ${item.module.number} · Lesson ${item.lesson.number}`,
          title: item.lesson.title,
          detail: item.lesson.minutes ? `Lesson ${item.lesson.number} · about ${item.lesson.minutes} min` : `Lesson ${item.lesson.number}`,
          modulePct: moduleShare(item.module.lessons.map((l) => l.status)),
          href: item.lesson.href,
          action: inProgress ? 'Jump Back In' : 'Start Lesson',
          visual: { label: `Module ${item.module.number}`, value: shortName(item.module.title) },
        }
      : null,
    week: { days, count, goal: WEEK_GOAL, note: weekNote(count) },
    review: { due: 0, minutes: 0, card: null },
    minutes: perDay.map((fe, i) => ({ day: DAYS[i]!, fe, da: 0 })),
    project: {
      title: current.project ?? 'Module project',
      passed: 0,
      total: 0,
      checks: [],
      href: '/projects' as Route,
      note: 'Projects with automatic checks open with the full track. You’ll see each check here as your work passes it.',
    },
    path: {
      trackTitle: 'Front-End',
      mastered: nodes.filter((n) => n.state === 'mastered').length,
      total: nodes.length,
      nodes,
      check: {
        title: `Module ${current.number} check`,
        detail: `Questions on ${shortName(current.title)} · pass with 80% to master it. Opens soon.`,
        href: `/checks/${current.number}` as Route,
        action: 'See the Check',
      },
    },
    tracks: PLAN_TRACKS.map((t) =>
      t.open
        ? {
            id: t.id,
            name: t.name,
            note: `${nodes.filter((n) => n.state === 'mastered').length} of ${nodes.length}`,
            pct: Math.round((nodes.filter((n) => n.state === 'mastered').length / nodes.length) * 100),
            action: 'Continue',
            href: (item?.lesson.href ?? '/my-tracks') as Route,
          }
        : { id: t.id, name: t.name, note: 'Opens soon', pct: 0, action: 'See Track', href: '/#tracks' as Route },
    ),
  }
}

/** PrismDashboardNew, for a learner who hasn't started a lesson yet. */
export function buildNewDashboard(data: LearnerTrackData, name: string | null, plan: unknown, now: Date): NewDashboardData {
  const chosen = parsePlan(plan)
  const first = data.modules[0]!.lessons.find((l) => l.href) ?? data.modules[0]!.lessons[0]!
  const track = planTrack(chosen)
  const minutes = planTime(chosen).label.replace(' min a day', ' minutes a day')
  return {
    firstName: firstNameOf(name),
    plan: track.open ? `${track.name}, ${minutes}.` : `${track.name} opens soon, so you’re starting with Front-End Web Development, ${minutes}.`,
    banner: { text: 'Module 1 is free for good.', accent: 'Pro, with every module, launches with the full track.', link: { label: 'What’s in Pro?', href: '/pricing' as Route } },
    first: {
      eyebrow: `Front-End · Module 1 · Lesson ${first.number}`,
      title: first.title,
      summary:
        first.description ??
        `Find out what really happens when you open a website. It takes about ${first.minutes ?? 10} minutes, and you’ll guess before you’re told.`,
      href: first.href,
      action: 'Start Your First Lesson',
    },
    checklist: [
      { label: 'Create your account', done: true },
      { label: 'Finish your first lesson', done: data.modules.some((m) => m.lessons.some((l) => l.status === 'completed')) },
      { label: 'Do your first daily review', done: false },
      { label: 'Open a lesson to keep it offline', done: false },
    ],
    week: {
      count: activeDays(data.events, now).filter(Boolean).length,
      goal: WEEK_GOAL,
      today: Math.floor((now.getTime() - weekStart(now).getTime()) / 86_400_000),
    },
    tutor: {
      title: 'Your AI tutor is on its way',
      body: 'Stuck on an exercise? Every step has three hints today. The tutor arrives soon, with 5 questions a day on Free.',
      link: { label: 'See how it helps', href: '/#tutor' as Route },
    },
    others: PLAN_TRACKS.filter((t) => t.id !== 'fe').map((t) => ({
      id: t.id,
      name: t.name,
      line: OTHER_LINES[t.id] ?? t.line,
      action: 'Opens soon',
      href: '/#tracks' as Route,
    })),
  }
}
