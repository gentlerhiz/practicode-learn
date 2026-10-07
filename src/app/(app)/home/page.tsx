import type { Metadata } from 'next'
import { DashboardView } from '@/components/app/dashboard/dashboard-view'
import { NewDashboardView } from '@/components/app/dashboard/new-dashboard-view'
import { AppPage } from '@/components/app/shell/app-shell'
import { requireUser } from '@/lib/auth/require-user'
import { buildDashboard, buildNewDashboard, isNewLearner } from '@/lib/learn/dashboard'
import { loadLearnerTrack } from '@/lib/learn/progress'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Home',
  description: 'Your PractiCode Learn home.',
  path: '/home',
  noindex: true,
})

/** PrismDashboardNew until the first lesson starts, then PrismDashboard. */
export default async function HomePage() {
  const [user, track] = await Promise.all([requireUser(), loadLearnerTrack()])
  const now = new Date()
  return isNewLearner(track) ? (
    <AppPage>
      <NewDashboardView data={buildNewDashboard(track, user.name, user.plan, now)} />
    </AppPage>
  ) : (
    <AppPage topBar="full">
      <DashboardView data={buildDashboard(track, user.name, now)} />
    </AppPage>
  )
}
