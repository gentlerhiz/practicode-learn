import type { Metadata } from 'next'
import { AppShell } from '@/components/app/shell/app-shell'
import { LoadingView } from '@/components/app/shell/loading-view'
import { requirePreviews } from '@/lib/fixtures/gate'
import { SAMPLE_USER } from '@/lib/fixtures/samples'

export const metadata: Metadata = { title: 'Loading preview', robots: { index: false, follow: false } }

/** PrismLoading: the skeleton the app shows while a signed-in page loads. */
export default function LoadingPreview() {
  requirePreviews()
  return (
    <AppShell user={SAMPLE_USER} search={[]}>
      <LoadingView />
    </AppShell>
  )
}
