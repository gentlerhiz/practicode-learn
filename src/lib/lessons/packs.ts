import 'server-only'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { PackError, parsePack, type LessonPack } from './schema'
import { PRO_BUCKET, type LessonMeta } from './types'

const SAMPLE_PACK = /^content\/samples\/packs\/[a-z]{2}-\d{2}-\d{2}\.json$/

async function download(url: string): Promise<unknown> {
  // Pack paths include their version and never change, so the cache can keep them.
  const response = await fetch(url, { cache: 'force-cache' })
  if (!response.ok) throw new PackError(`The lesson pack couldn't be downloaded (HTTP ${response.status}).`)
  return response.json()
}

/** Downloads a Pro pack with the learner's own session; storage only hands it to Pro members. */
async function downloadPro(supabase: SupabaseClient<Database>, packPath: string): Promise<unknown> {
  const { data, error } = await supabase.storage.from(PRO_BUCKET).download(packPath)
  if (error || !data)
    throw new PackError(`The Pro lesson pack couldn't be downloaded (${error?.message ?? 'empty'}).`)
  return JSON.parse(await data.text())
}

/**
 * Downloads (or, for samples, reads) a lesson pack and checks it against the format. Anything that
 * isn't exactly the lesson the catalogue promised throws a PackError, which lesson pages show as an error.
 * Pro packs need `learner`, a client signed in as the learner asking for it.
 */
export async function loadPack(meta: LessonMeta, learner?: SupabaseClient<Database>): Promise<LessonPack> {
  let json: unknown
  const proPath = meta.packUrl.startsWith(`${PRO_BUCKET}/`) ? meta.packUrl.slice(PRO_BUCKET.length + 1) : null
  if (meta.packUrl.startsWith('https://')) {
    json = await download(meta.packUrl)
  } else if (proPath) {
    if (!learner) throw new PackError('A Pro lesson pack can only be downloaded for a signed-in learner.')
    json = await downloadPro(learner, proPath)
  } else if (SAMPLE_PACK.test(meta.packUrl)) {
    // A path fixed to the samples folder (the id is checked by SAMPLE_PACK), so the build traces only
    // that folder into the server bundle, not the whole project.
    const file = path.join(process.cwd(), 'content', 'samples', 'packs', path.basename(meta.packUrl))
    json = JSON.parse(await readFile(file, 'utf8'))
  } else {
    throw new PackError(
      meta.packUrl ? 'This lesson pack is in an unknown place.' : 'This lesson isn’t available yet.',
    )
  }
  const pack = parsePack(json)
  if (pack.id !== meta.id || pack.version !== meta.version) {
    throw new PackError(
      `Expected ${meta.id} version ${meta.version}, got ${pack.id} version ${pack.version}.`,
    )
  }
  return pack
}
