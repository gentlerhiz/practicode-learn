import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RunnerFixtures } from './runner-fixtures'

export const metadata: Metadata = {
  title: 'Runner fixtures',
  robots: { index: false, follow: false },
}

/**
 * Test-only: exercises the code runner in the e2e suite. It exists only in builds made with
 * PCL_FIXTURES=1, which Playwright's test server sets; deployments never set it, so they answer 404.
 */
export default function RunnerFixturePage() {
  if (process.env.PCL_FIXTURES !== '1') notFound()
  return <RunnerFixtures />
}
