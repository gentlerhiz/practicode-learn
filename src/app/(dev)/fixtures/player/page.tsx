import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLesson } from '@/lib/lessons/catalogue'
import { loadPack } from '@/lib/lessons/packs'
import { parsePack } from '@/lib/lessons/schema'
import { PlayerFixture } from './player-fixture'

export const metadata: Metadata = { title: 'Player fixture', robots: { index: false, follow: false } }

/**
 * Test-only: the sample lesson in the player, from any step (?step=N), for the e2e suite. It exists only
 * in builds made with PCL_FIXTURES=1, like the runner fixtures.
 */
export default async function PlayerFixturePage({ searchParams }: PageProps<'/fixtures/player'>) {
  if (process.env.PCL_FIXTURES !== '1') notFound()
  // ?id=fe-06-04 opens a built pack from PCL_PACKS_DIR instead (the content repo's dist/packs), Pro lessons
  // included, for the layout sweep in tests/manual/layout-sweep.mjs.
  const { step, id } = await searchParams
  let pack
  if (typeof id === 'string' && /^[a-z]{2}-\d{2}-\d{2}$/.test(id) && process.env.PCL_PACKS_DIR) {
    pack = parsePack(JSON.parse(await readFile(path.join(process.env.PCL_PACKS_DIR, `${id}.json`), 'utf8')))
  } else {
    const meta = await getLesson('samples', 'every-step')
    if (!meta) notFound()
    pack = await loadPack(meta)
  }
  const startAt = Number(typeof step === 'string' ? step : 0) || 0
  // The player renders its own <main id="main">, so the fixture adds no wrapper of its own.
  return <PlayerFixture pack={pack} startAt={startAt} />
}
