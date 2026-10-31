import 'server-only'
import type { Route } from 'next'
import { getTrackContent } from '@/content/tracks'
import { PackError } from '@/lib/lessons/schema'
import { PRO_BUCKET } from '@/lib/lessons/types'
import { createClient } from '@/lib/supabase/server'
import { allCheckNames, type CheckResult } from './checks'
import { parseProjectPack, type ProjectFile, type ProjectPack } from './schema'

export type ProjectStatus = 'locked' | 'open' | 'draft' | 'passed' | 'soon'

export type ProjectSummary = {
  id: string | null
  track: string
  trackTitle: string
  module: number
  title: string
  description: string | null
  status: ProjectStatus
  /** Lessons done and in all, for the project's module. */
  lessons: { done: number; total: number }
  /** Checks passing when last run, and in all. */
  checks: { passed: number; total: number }
  passedAt: string | null
  href: Route | null
}

type Catalogue = {
  id: string
  track_slug: string
  module: number
  slug: string
  title: string
  description: string
  free: boolean
  version: number
  checks: number
  needs_site: boolean
  pack_path: string
}

const projectHref = (p: Pick<Catalogue, 'track_slug' | 'slug'>) =>
  `/projects/${p.track_slug}/${p.slug}` as Route

/**
 * Every module project in these courses, as the learner stands with each: published projects from the
 * catalogue, and the syllabus's projects that aren't written yet. A project opens when its module's
 * lessons are all complete.
 */
export async function listProjects(tracks: string[]): Promise<ProjectSummary[]> {
  if (!tracks.length) return []
  const supabase = await createClient()
  const [catalogue, work, lessons, progress] = await Promise.all([
    supabase
      .from('projects')
      .select(
        'id, track_slug, module, slug, title, description, free, version, checks, needs_site, pack_path',
      )
      .in('track_slug', tracks),
    supabase.from('project_work').select('project_id, status, results, passed_at'),
    supabase.from('lessons').select('id, track_slug, module').in('track_slug', tracks),
    supabase.from('lesson_progress').select('lesson_id, status'),
  ])
  const done = new Set((progress.data ?? []).filter((p) => p.status === 'completed').map((p) => p.lesson_id))
  const workOf = new Map((work.data ?? []).map((w) => [w.project_id, w]))
  const out: ProjectSummary[] = []
  for (const slug of tracks) {
    const track = getTrackContent(slug)
    if (!track) continue
    for (const m of track.modules) {
      if (!m.project) continue
      const moduleLessons = (lessons.data ?? []).filter((l) => l.track_slug === slug && l.module === m.number)
      const lessonCount = {
        done: moduleLessons.filter((l) => done.has(l.id)).length,
        total: moduleLessons.length,
      }
      const p = (catalogue.data ?? []).find((c) => c.track_slug === slug && c.module === m.number)
      if (!p) {
        out.push({
          id: null,
          track: slug,
          trackTitle: track.title,
          module: m.number,
          title: m.project,
          description: null,
          status: 'soon',
          lessons: lessonCount,
          checks: { passed: 0, total: 0 },
          passedAt: null,
          href: null,
        })
        continue
      }
      const w = workOf.get(p.id)
      const results = Array.isArray(w?.results) ? (w.results as CheckResult[]) : []
      const total = p.checks + 4
      const unlocked = lessonCount.total > 0 && lessonCount.done === lessonCount.total
      const status: ProjectStatus =
        w?.status === 'passed' ? 'passed' : w ? 'draft' : unlocked ? 'open' : 'locked'
      out.push({
        id: p.id,
        track: slug,
        trackTitle: track.title,
        module: p.module,
        title: p.title,
        description: p.description,
        status,
        lessons: lessonCount,
        checks: { passed: status === 'passed' ? total : results.filter((r) => r.pass).length, total },
        passedAt: w?.passed_at ?? null,
        href: status === 'locked' ? null : projectHref(p),
      })
    }
  }
  return out
}

export type ProjectView = {
  meta: Catalogue
  /** Null when the project is part of Pro and this learner doesn't have it. */
  pack: ProjectPack | null
  files: ProjectFile[]
  siteUrl: string | null
  status: 'draft' | 'passed' | 'new'
  results: CheckResult[]
  savedAt: string | null
  unlocked: boolean
  lessons: { done: number; total: number }
  checkNames: string[]
}

/**
 * A project's pack, or null when it's part of Pro and this client's learner doesn't have it: Pro project
 * packs are only handed to Pro members, by the storage policy on the bucket.
 */
export async function projectPack(
  supabase: Awaited<ReturnType<typeof createClient>>,
  meta: Pick<Catalogue, 'free' | 'pack_path'>,
): Promise<ProjectPack | null> {
  if (meta.free) {
    const url = supabase.storage.from('lessons-free').getPublicUrl(meta.pack_path).data.publicUrl
    const res = await fetch(url, { cache: 'force-cache' })
    if (!res.ok) throw new PackError(`The project couldn’t be downloaded (HTTP ${res.status}).`)
    return parseProjectPack(await res.json())
  }
  const { data, error } = await supabase.storage.from(PRO_BUCKET).download(meta.pack_path)
  return error || !data ? null : parseProjectPack(JSON.parse(await data.text()))
}

/** One project, with the learner's saved work. Null when there's no such project. */
export async function loadProject(track: string, slug: string): Promise<ProjectView | null> {
  const supabase = await createClient()
  const { data: meta } = await supabase
    .from('projects')
    .select('id, track_slug, module, slug, title, description, free, version, checks, needs_site, pack_path')
    .eq('track_slug', track)
    .eq('slug', slug)
    .maybeSingle()
  if (!meta) return null

  const [work, lessons, progress] = await Promise.all([
    supabase
      .from('project_work')
      .select('files, site_url, status, results, updated_at')
      .eq('project_id', meta.id)
      .maybeSingle(),
    supabase.from('lessons').select('id').eq('track_slug', track).eq('module', meta.module),
    supabase.from('lesson_progress').select('lesson_id').eq('status', 'completed'),
  ])
  const done = new Set((progress.data ?? []).map((p) => p.lesson_id))
  const ids = (lessons.data ?? []).map((l) => l.id)
  const lessonCount = { done: ids.filter((id) => done.has(id)).length, total: ids.length }

  const pack = await projectPack(supabase, meta)
  if (!pack) {
    return {
      meta,
      pack: null,
      files: [],
      siteUrl: null,
      status: 'new',
      results: [],
      savedAt: null,
      unlocked: false,
      lessons: lessonCount,
      checkNames: [],
    }
  }
  const saved =
    Array.isArray(work.data?.files) && work.data.files.length ? (work.data.files as ProjectFile[]) : null
  return {
    meta,
    pack,
    // Saved files replace the starter's, file by file; readonly files always come from the pack.
    files: pack.files.map((f) => (f.readonly ? f : (saved?.find((s) => s.name === f.name) ?? f))),
    siteUrl: work.data?.site_url ?? null,
    status: work.data ? (work.data.status === 'passed' ? 'passed' : 'draft') : 'new',
    results: Array.isArray(work.data?.results) ? (work.data.results as CheckResult[]) : [],
    savedAt: work.data?.updated_at ?? null,
    unlocked: lessonCount.total > 0 && lessonCount.done === lessonCount.total,
    lessons: lessonCount,
    checkNames: allCheckNames(pack.checks),
  }
}
