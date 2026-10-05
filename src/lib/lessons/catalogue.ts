import 'server-only'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { cache } from 'react'
import { publicEnv } from '@/lib/env'
import type { Database } from '@/types/database'
import type { CatalogueEntry, LessonMeta } from './types'

const SAMPLE_CATALOGUE = path.join(process.cwd(), 'content', 'samples', 'catalogue.json')

async function fromSamples(): Promise<LessonMeta[]> {
  const entries: CatalogueEntry[] = JSON.parse(await readFile(SAMPLE_CATALOGUE, 'utf8'))
  return entries.map((e) => ({
    id: e.id,
    track: e.track,
    module: e.module,
    lesson: e.lesson,
    slug: e.slug,
    title: e.title,
    description: e.description,
    minutes: e.minutes,
    free: e.free,
    version: e.version,
    packUrl: `content/samples/packs/${e.id}.json`,
  }))
}

// The catalogue is public, so it's read without a session: lesson pages can be static.
async function fromSupabase(): Promise<LessonMeta[]> {
  const supabase = createClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL!,
    publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
  const { data, error } = await supabase
    .from('lessons')
    .select('id, track_slug, module, lesson, slug, title, description, minutes, free, version, pack_path')
    .order('module')
    .order('lesson')
  if (error) throw new Error(`Could not read the lesson catalogue: ${error.message}`)
  return data.map((r) => ({
    id: r.id,
    track: r.track_slug,
    module: r.module,
    lesson: r.lesson,
    slug: r.slug,
    title: r.title,
    description: r.description,
    minutes: r.minutes,
    free: r.free,
    version: r.version,
    // Free packs are public. Pro packs need a signed URL after a plan check, which arrives with plans.
    packUrl: r.free ? supabase.storage.from('lessons-free').getPublicUrl(r.pack_path).data.publicUrl : '',
  }))
}

const loadCatalogue = cache(() =>
  publicEnv.NEXT_PUBLIC_CONTENT_SOURCE === 'supabase' ? fromSupabase() : fromSamples(),
)

/** Published lessons in course order, optionally for one track. */
export async function listPublishedLessons(track?: string): Promise<LessonMeta[]> {
  const lessons = await loadCatalogue()
  return lessons
    .filter((l) => !track || l.track === track)
    .sort((a, b) => a.module - b.module || a.lesson - b.lesson)
}

export async function getLesson(track: string, slug: string): Promise<LessonMeta | null> {
  const lessons = await loadCatalogue()
  return lessons.find((l) => l.track === track && l.slug === slug) ?? null
}
