import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLesson } from '@/lib/lessons/catalogue'
import { loadPack } from '@/lib/lessons/packs'
import { PlayerFixture } from './player-fixture'

export const metadata: Metadata = { title: 'Player fixture', robots: { index: false, follow: false } }

/**
 * Test-only: the sample lesson in the player, from any step (?step=N), for the e2e suite. It exists only
 * in builds made with PCL_FIXTURES=1, like the runner fixtures.
 */
export default async function PlayerFixturePage({ searchParams }: PageProps<'/fixtures/player'>) {
  if (process.env.PCL_FIXTURES !== '1') notFound()
  const meta = await getLesson('samples', 'every-step')
  if (!meta) notFound()
  const pack = await loadPack(meta)
  const { step } = await searchParams
  const startAt = Number(typeof step === 'string' ? step : 0) || 0
  return (
    <main id="main" className="px-4 py-10">
      <PlayerFixture pack={pack} startAt={startAt} />
    </main>
  )
}
