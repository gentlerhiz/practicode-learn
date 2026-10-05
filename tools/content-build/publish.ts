// Publishes built lesson packs to Supabase: uploads the packs whose content changed, upserts the catalogue
// rows, then asks the app to refresh the pages that show them.
// Usage: node tools/content-build/publish.ts --packs <dir> --catalogue <file> [--dry-run]
// Environment: SUPABASE_URL and SUPABASE_SECRET_KEY (CI secrets; locally .env.local, which points at dev),
// and optionally REVALIDATE_URL with REVALIDATE_SECRET.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { createClient } from '@supabase/supabase-js'
import { parsePack } from '../../src/lib/lessons/schema.ts'
import type { CatalogueEntry } from '../../src/lib/lessons/types.ts'

// Track rows are created on first publish only; afterwards they're managed in the database.
const TRACKS: Record<string, { title: string; status: 'live' | 'coming_soon'; position: number }> = {
  'front-end-web-development': { title: 'Front-End Web Development', status: 'live', position: 1 },
  'data-analysis': { title: 'Data Analysis', status: 'coming_soon', position: 2 },
  'ui-ux-product-design': { title: 'UI/UX Product Design', status: 'coming_soon', position: 3 },
  'ai-and-machine-learning': { title: 'AI & Machine Learning', status: 'coming_soon', position: 4 },
}

/** Which lessons to upload: new ones, and ones whose content or version changed. */
export function planPublish(local: CatalogueEntry[], remote: CatalogueEntry[]) {
  const published = new Map(remote.map((r) => [r.id, r]))
  const upload: CatalogueEntry[] = []
  const unchanged: string[] = []
  for (const entry of local) {
    const current = published.get(entry.id)
    if (current && current.hash === entry.hash && current.version === entry.version) unchanged.push(entry.id)
    else upload.push(entry)
  }
  return { upload, unchanged }
}

/** The pages that show changed lessons: each lesson, its track page and the sitemap, once each. */
export function pagesToRefresh(changed: CatalogueEntry[]): string[] {
  if (!changed.length) return []
  const lessons = changed.map((e) => `/learn/${e.track}/${e.slug}`)
  const tracks = [...new Set(changed.map((e) => `/tracks/${e.track}`))]
  return [...lessons, ...tracks, '/sitemap.xml']
}

export const packPath = (e: Pick<CatalogueEntry, 'id' | 'version'>) => `${e.id}/v${e.version}.json`

async function main() {
  const { values } = parseArgs({
    options: { packs: { type: 'string' }, catalogue: { type: 'string' }, 'dry-run': { type: 'boolean' } },
  })
  if (!values.packs || !values.catalogue) {
    console.error('Usage: node tools/content-build/publish.ts --packs <dir> --catalogue <file> [--dry-run]')
    process.exit(2)
  }
  if (fs.existsSync('.env.local')) process.loadEnvFile('.env.local')
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY
  if (!url || !key) {
    console.error('Set SUPABASE_URL and SUPABASE_SECRET_KEY.')
    process.exit(2)
  }
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })

  // 1. The built catalogue, and what is published now.
  const local: CatalogueEntry[] = JSON.parse(fs.readFileSync(values.catalogue, 'utf8'))
  const { data: rows, error: readError } = await db
    .from('lessons')
    .select(
      'id, track_slug, module, lesson, slug, title, description, minutes, free, version, steps, bytes, hash',
    )
  if (readError) throw new Error(`Could not read the published lessons: ${readError.message}`)
  const remote: CatalogueEntry[] = rows.map(({ track_slug, ...r }) => ({ ...r, track: track_slug }))
  const { upload, unchanged } = planPublish(local, remote)
  console.log(
    `${upload.length} to publish, ${unchanged.length} unchanged (${unchanged.join(', ') || 'none'}).`,
  )
  if (values['dry-run'] || !upload.length) return

  // 2. Upload each changed pack to a versioned path, which never changes once written.
  for (const entry of upload) {
    const pack = parsePack(JSON.parse(fs.readFileSync(path.join(values.packs, `${entry.id}.json`), 'utf8')))
    const bucket = entry.free ? 'lessons-free' : 'lessons-pro'
    const { error } = await db.storage.from(bucket).upload(packPath(entry), JSON.stringify(pack), {
      upsert: true,
      cacheControl: '31536000',
      contentType: 'application/json',
    })
    if (error) throw new Error(`Could not upload ${entry.id}: ${error.message}`)
    console.log(`✓ uploaded ${bucket}/${packPath(entry)}`)
  }

  // 3. The catalogue rows (tracks first, because lessons point at them).
  const trackRows = [...new Set(upload.map((e) => e.track))].map((slug) => ({
    slug,
    ...(TRACKS[slug] ?? { title: slug, status: 'coming_soon' as const, position: 99 }),
  }))
  const tracks = await db.from('tracks').upsert(trackRows, { onConflict: 'slug', ignoreDuplicates: true })
  if (tracks.error) throw new Error(`Could not save the tracks: ${tracks.error.message}`)
  const lessons = await db.from('lessons').upsert(
    upload.map((e) => ({
      id: e.id,
      track_slug: e.track,
      module: e.module,
      lesson: e.lesson,
      slug: e.slug,
      title: e.title,
      description: e.description,
      minutes: e.minutes,
      free: e.free,
      version: e.version,
      steps: e.steps,
      bytes: e.bytes,
      hash: e.hash,
      pack_path: packPath(e),
      published_at: new Date().toISOString(),
    })),
  )
  if (lessons.error) throw new Error(`Could not save the lessons: ${lessons.error.message}`)
  console.log(`✓ catalogue updated (${upload.map((e) => e.id).join(', ')})`)

  // 4. Ask the app to rebuild the pages that show these lessons.
  const paths = pagesToRefresh(upload)
  if (!process.env.REVALIDATE_URL || !process.env.REVALIDATE_SECRET) {
    console.log('REVALIDATE_URL not set, so pages refresh on the next deploy.')
    return
  }
  const res = await fetch(process.env.REVALIDATE_URL, {
    method: 'POST',
    headers: { authorization: `Bearer ${process.env.REVALIDATE_SECRET}`, 'content-type': 'application/json' },
    body: JSON.stringify({ paths }),
  })
  if (!res.ok) throw new Error(`Refreshing the pages failed (HTTP ${res.status}).`)
  console.log(`✓ refreshed ${paths.length} pages`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e instanceof Error ? e.message : e)
    process.exit(1)
  })
}
