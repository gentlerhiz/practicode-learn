import type { Metadata, Route } from 'next'
import { DashboardView } from '@/components/app/dashboard/dashboard-view'
import type { DashboardData } from '@/components/app/dashboard/types'
import { NewDashboardView } from '@/components/app/dashboard/new-dashboard-view'
import { AppPage } from '@/components/app/shell/app-shell'
import { requireUser } from '@/lib/auth/require-user'
import { currentTrackSlug, enrolledTracks } from '@/lib/learn/courses'
import { buildDashboard, buildNewDashboard, isNewLearner } from '@/lib/learn/dashboard'
import { loadLearnerTrack } from '@/lib/learn/progress'
import { listProjects } from '@/lib/projects/load'
import { loadReviewSummary } from '@/lib/review/load'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Home',
  description: 'Your PractiCode Learn home.',
  path: '/home',
  noindex: true,
})

/** The project to show on the dashboard: the one under way, else the next to open. */
async function currentProject(): Promise<DashboardData['project'] | null> {
  const projects = await listProjects((await enrolledTracks()).map((t) => t.slug))
  const p =
    projects.find((x) => x.status === 'draft') ??
    projects.find((x) => x.status === 'open') ??
    projects.find((x) => x.status === 'locked')
  if (!p) return null
  return {
    title: p.title,
    passed: p.checks.passed,
    total: p.status === 'locked' ? 0 : p.checks.total,
    checks: [],
    href: p.href ?? ('/projects' as Route),
    note:
      p.status === 'locked'
        ? `Opens when you finish Module ${p.module}’s lessons: ${p.lessons.done} of ${p.lessons.total} done.`
        : p.status === 'open'
          ? `Ready to start: ${p.description ?? 'a project briefed like a real job.'}`
          : `In progress. Run the checks to see what’s left.`,
  }
}

/** PrismDashboardNew until the first lesson starts, then PrismDashboard. */
export default async function HomePage() {
  const user = await requireUser()
  const track = await loadLearnerTrack(await currentTrackSlug(user.plan))
  const now = new Date()
  if (isNewLearner(track)) {
    return (
      <AppPage>
        <NewDashboardView data={buildNewDashboard(track, user.name, user.plan, now)} />
      </AppPage>
    )
  }
  const [review, project] = await Promise.all([loadReviewSummary(), currentProject()])
  const data = buildDashboard(track, user.name, now)
  data.review = {
    due: review.due,
    minutes: Math.max(1, Math.ceil((review.due * 12) / 60)),
    card: review.next ? { before: review.next, accent: '', after: '' } : null,
    days: review.daysThisWeek,
  }
  if (project) data.project = project
  return (
    <AppPage topBar="full">
      <DashboardView data={data} />
    </AppPage>
  )
}
