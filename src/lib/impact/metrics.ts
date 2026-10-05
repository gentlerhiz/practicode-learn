/**
 * The figures impact_summary() returns, in the order the admin page shows them, with the plain-language
 * definition from docs/product/impact-metrics.md ("Definitions in code").
 */
export const METRICS = [
  {
    key: 'registered_learners',
    label: 'Registered learners',
    unit: '',
    definition: 'Accounts with a confirmed email address.',
  },
  {
    key: 'learners_started_a_lesson',
    label: 'Learners who started a lesson',
    unit: '',
    definition: 'Learners with progress saved on at least one lesson.',
  },
  {
    key: 'lessons_completed',
    label: 'Lessons completed',
    unit: '',
    definition: 'Completed lessons, counted once per learner per lesson.',
  },
  {
    key: 'active_learners_28d',
    label: 'Active learners (28 days)',
    unit: '',
    definition: 'Learners who completed a lesson in the last 28 days.',
  },
  {
    key: 'hours_of_learning',
    label: 'Hours of active learning',
    unit: 'h',
    definition:
      'Time on visible lesson pages. Gaps over 2 minutes count as 2 minutes, and each lesson is capped at ten times its length.',
  },
  {
    key: 'countries_reached',
    label: 'Countries reached',
    unit: '',
    definition: 'Countries learners signed up from, read from the connection at first sign-in.',
  },
  {
    key: 'activation_rate_24h',
    label: 'Activation within 24 hours',
    unit: '%',
    definition:
      'Learners who completed a lesson within a day of signing up, among accounts older than a day.',
  },
  {
    key: 'week4_retention',
    label: 'Week-4 retention',
    unit: '%',
    definition: 'Learners active in their fourth week, among accounts older than 28 days.',
  },
  {
    key: 'module1_completion',
    label: 'Module 1 completion',
    unit: '%',
    definition: 'Learners who completed every Module 1 lesson, among those who started one.',
  },
  {
    key: 'offline_completions',
    label: 'Offline completions',
    unit: '',
    definition: 'Lessons completed without a connection and saved when the device was back online.',
  },
] as const

export type MetricKey = (typeof METRICS)[number]['key']
export type ImpactSummary = Partial<Record<MetricKey, number | null>> & { measured_at?: string }

export const DEFINITIONS_URL =
  'https://github.com/gentlerhiz/practicode-learn/blob/main/docs/product/impact-metrics.md#definitions-in-code'

/** A figure as shown: thousands separators, its unit, or a plain note when there isn't enough data. */
export function formatMetric(value: number | null | undefined, unit: string): string {
  if (value === null || value === undefined) return 'Not enough data yet'
  const number = value.toLocaleString('en-GB', { maximumFractionDigits: 1 })
  return unit === '%' ? `${number}%` : unit ? `${number} ${unit}` : number
}
