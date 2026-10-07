import type { Route } from 'next'
import type { PlanTrackId } from '@/lib/onboarding/plan'

export type DayMark = 'fe' | 'da' | 'missed' | 'today' | 'later'
export type NodeState = 'mastered' | 'progress' | 'todo'

/** Everything PrismDashboard shows, so the real page and the canvas sample render the same view. */
export type DashboardData = {
  firstName: string | null
  trialDaysLeft?: number
  intro: { text: string; accent?: string }
  resume: {
    eyebrow: string
    title: string
    detail: string
    modulePct: number
    href: Route | null
    action: string
    visual: { label: string; value: string }
  } | null
  week: { days: DayMark[]; count: number; goal: number; note: string }
  review: { due: number; minutes: number; card: { before: string; accent: string; after: string } | null }
  minutes: { day: string; fe: number; da: number }[]
  project: {
    title: string
    passed: number
    total: number
    checks: { label: string; ok: boolean }[]
    href: Route
    note?: string
  }
  path: {
    trackTitle: string
    mastered: number
    total: number
    nodes: { name: string; state: NodeState; pct?: number }[]
    check: { title: string; detail: string; href: Route; action: string }
  }
  tracks: { id: PlanTrackId; name: string; note: string; pct: number; action: string; href: Route }[]
}

/** Everything PrismDashboardNew shows. */
export type NewDashboardData = {
  firstName: string | null
  plan: string
  banner: { text: string; accent: string; link: { label: string; href: Route } }
  first: { eyebrow: string; title: string; summary: string; href: Route | null; action: string }
  checklist: { label: string; done: boolean }[]
  week: { count: number; goal: number; today: number }
  tutor: { title: string; body: string; link: { label: string; href: Route } }
  others: { id: PlanTrackId; name: string; line: string; action: string; href: Route }[]
}
