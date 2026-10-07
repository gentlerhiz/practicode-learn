/**
 * The learner's plan from onboarding: a track, a daily time and a starting point. It's kept in the
 * browser until sign-up, then saved with the account (Supabase user metadata).
 */
export const PLAN_STORAGE_KEY = 'pc-plan-v1'

export const PLAN_TRACKS = [
  {
    id: 'fe',
    slug: 'front-end-web-development',
    name: 'Front-End Web Development',
    line: 'Build websites that look right on every screen.',
    meta: '15 modules · Beginner',
    open: true,
  },
  {
    id: 'da',
    slug: 'data-analysis',
    name: 'Data Analysis',
    line: 'Turn messy spreadsheets into clear answers.',
    meta: '11 modules · Beginner',
    open: false,
  },
  {
    id: 'ux',
    slug: 'ui-ux-product-design',
    name: 'UI/UX Product Design',
    line: 'Design apps people actually enjoy using.',
    meta: '11 modules · Beginner',
    open: false,
  },
  {
    id: 'ai',
    slug: 'ai-machine-learning',
    name: 'AI & Machine Learning',
    line: 'Train models in Python and learn where AI goes wrong.',
    meta: '12 modules · Intermediate',
    open: false,
  },
] as const

export const PLAN_TIMES = [
  { id: 't10', label: '10 min a day', week: 'about 70 minutes a week', pace: 'Module 1 done in about a week' },
  { id: 't20', label: '20 min a day', week: 'about 2 hours a week', pace: 'Module 1 done in four or five days' },
  { id: 't30', label: '30 min a day', week: 'about 3 hours a week', pace: 'Module 1 done in three days' },
  { id: 'tw', label: 'Weekends only', week: 'a couple of hours each weekend', pace: 'Module 1 done in one or two weekends' },
] as const

export const PLAN_LEVELS = [
  { id: 'l0', label: 'Never', start: 'Right at the beginning', note: 'We will start right at the beginning.' },
  { id: 'l1', label: 'A little', start: 'Knows a little', note: 'You can test out of anything you already know.' },
  { id: 'l2', label: 'Quite a bit', start: 'Has done quite a bit', note: 'Take a quick check and skip ahead.' },
] as const

export type PlanTrackId = (typeof PLAN_TRACKS)[number]['id']
export type PlanTimeId = (typeof PLAN_TIMES)[number]['id']
export type PlanLevelId = (typeof PLAN_LEVELS)[number]['id']
export type LearningPlan = { track: PlanTrackId; time: PlanTimeId; level: PlanLevelId }

export const DEFAULT_PLAN: LearningPlan = { track: 'fe', time: 't20', level: 'l0' }

const has = <T extends { id: string }>(list: readonly T[], id: unknown): id is T['id'] =>
  list.some((item) => item.id === id)

/** Reads a plan from storage, a form field or user metadata. Anything unrecognised gives the default. */
export function parsePlan(value: unknown): LearningPlan {
  let raw: unknown = value
  if (typeof value === 'string') {
    try {
      raw = JSON.parse(value)
    } catch {
      return DEFAULT_PLAN
    }
  }
  if (!raw || typeof raw !== 'object') return DEFAULT_PLAN
  const { track, time, level } = raw as Record<string, unknown>
  return has(PLAN_TRACKS, track) && has(PLAN_TIMES, time) && has(PLAN_LEVELS, level)
    ? { track, time, level }
    : DEFAULT_PLAN
}

export const planTrack = (plan: LearningPlan) => PLAN_TRACKS.find((t) => t.id === plan.track) ?? PLAN_TRACKS[0]
export const planTime = (plan: LearningPlan) => PLAN_TIMES.find((t) => t.id === plan.time) ?? PLAN_TIMES[1]
export const planLevel = (plan: LearningPlan) => PLAN_LEVELS.find((t) => t.id === plan.level) ?? PLAN_LEVELS[0]

/** The sentence under "Your plan:" on onboarding. Tracks whose lessons aren't open say so. */
export function planSummary(plan: LearningPlan): string {
  const track = planTrack(plan)
  const time = planTime(plan)
  if (!track.open) {
    return `${track.name}, ${time.week}. Its lessons open soon. ${PLAN_TRACKS[0].name} is ready to start today.`
  }
  return `${track.name}, ${time.week}. That gets ${time.pace}. ${planLevel(plan).note}`
}
