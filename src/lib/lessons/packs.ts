import 'server-only'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { PackError, parsePack, type LessonPack } from './schema'
import type { LessonMeta } from './types'

const SAMPLE_PACK = /^content\/samples\/packs\/[a-z]{2}-\d{2}-\d{2}\.json$/

async function download(url: string): Promise<unknown> {
  // Pack paths include their version and never change, so the cache can keep them.
  const response = await fetch(url, { cache: 'force-cache' })
  if (!response.ok) throw new PackError(`The lesson pack couldn't be downloaded (HTTP ${response.status}).`)
  return response.json()
}

/**
 * Downloads (or, for samples, reads) a lesson pack and checks it against the format. Anything that
 * isn't exactly the lesson the catalogue promised throws a PackError, which lesson pages show as an error.
 */
export async function loadPack(meta: LessonMeta): Promise<LessonPack> {
  let json: unknown
  if (meta.packUrl.startsWith('https://')) {
    json = await download(meta.packUrl)
  } else if (SAMPLE_PACK.test(meta.packUrl)) {
    json = JSON.parse(await readFile(path.join(process.cwd(), meta.packUrl), 'utf8'))
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
