import type { Metadata } from 'next'
import { DashboardView } from '@/components/app/dashboard/dashboard-view'
import { AppPage, AppShell } from '@/components/app/shell/app-shell'
import { requirePreviews } from '@/lib/fixtures/gate'
import { SAMPLE_DASHBOARD, SAMPLE_USER } from '@/lib/fixtures/samples'

export const metadata: Metadata = { title: 'Dashboard preview', robots: { index: false, follow: false } }

/** PrismDashboard with the canvas's sample learner. */
export default function DashboardPreview() {
  requirePreviews()
  return (
    <AppShell user={SAMPLE_USER} search={[]}>
      <AppPage topBar="full">
        <DashboardView data={SAMPLE_DASHBOARD} />
      </AppPage>
    </AppShell>
  )
}
