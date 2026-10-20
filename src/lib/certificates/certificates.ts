import 'server-only'
import { randomInt } from 'node:crypto'
import { z } from 'zod'
import { findCourse } from '@/content/catalogue'
import { getTrackContent, isComplete } from '@/content/tracks'
import { createAdminClient } from '@/lib/supabase/admin'
import { layoutCertificate, type CertificateInput } from './document'

/**
 * Certificates. A learner earns one by completing every lesson in a course, once all of it is published. Records live in a
 * private storage bucket that only the server reads and writes, with the secret key:
 *   records/<code>.json                  the certificate, as issued (the name can't change afterwards)
 *   learners/<learner id>/<track>.json   which code a learner holds for a track
 * Module checks and the final exam don't exist yet, so a certificate claims only what the learner did:
 * every lesson, and every project published when it was issued. Certificates issued before projects
 * opened (18 October 2026) stay valid; they show no projects.
 */
const BUCKET = 'certificates'

// Crockford's base 32: no I, L, O or U, so a code read aloud or copied by hand can't be mistaken.
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
const CODE = /^PCL-[A-Z]{2}-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/

export const certificateSchema = z.object({
  code: z.string().regex(CODE),
  learnerId: z.uuid(),
  track: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(80),
  issuedAt: z.iso.datetime(),
  lessons: z.int().positive(),
  modules: z.int().positive(),
  /** Projects passed for it. Certificates issued before projects opened have none. */
  projects: z.int().min(0).default(0),
  revokedAt: z.iso.datetime().nullable(),
})
export type Certificate = z.infer<typeof certificateSchema>

export const isCertificateCode = (code: string) => CODE.test(code)

export function newCode(track: string): string {
  const part = () => Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('')
  return `PCL-${findCourse(track)?.code.toUpperCase() ?? 'XX'}-${part()}-${part()}`
}

const recordPath = (code: string) => `records/${code}.json`
const learnerPath = (learnerId: string, track: string) => `learners/${learnerId}/${track}.json`

async function readJson(path: string): Promise<unknown> {
  const { data, error } = await createAdminClient().storage.from(BUCKET).download(path)
  if (error || !data) return null
  try {
    return JSON.parse(await data.text())
  } catch {
    return null
  }
}

/** Writes a new file; false when one is already there. Creates the private bucket on first use. */
async function create(path: string, value: unknown): Promise<boolean> {
  const storage = createAdminClient().storage
  const body = new Blob([JSON.stringify(value)], { type: 'application/json' })
  const put = () =>
    storage.from(BUCKET).upload(path, body, { upsert: false, contentType: 'application/json' })
  let { error } = await put()
  if (error && /bucket not found/i.test(error.message)) {
    const made = await storage.createBucket(BUCKET, { public: false })
    if (made.error && !/already exists/i.test(made.error.message)) throw made.error
    ;({ error } = await put())
  }
  if (!error) return true
  if (/already exists|duplicate/i.test(error.message)) return false
  throw error
}

/** The certificate with this code, or null. */
export async function findCertificate(code: string): Promise<Certificate | null> {
  if (!isCertificateCode(code)) return null
  const parsed = certificateSchema.safeParse(await readJson(recordPath(code)))
  return parsed.success && parsed.data.code === code ? parsed.data : null
}

/** The certificate this learner holds for a track, or null. */
export async function learnerCertificate(learnerId: string, track: string): Promise<Certificate | null> {
  const index = z.object({ code: z.string() }).safeParse(await readJson(learnerPath(learnerId, track)))
  if (!index.success) return null
  const found = await findCertificate(index.data.code)
  return found?.learnerId === learnerId ? found : null
}

export type CertificateState =
  | { certificate: Certificate }
  | {
      certificate: null
      completed: number
      total: number
      projects: { passed: number; total: number }
      needsName: boolean
      /** The course still has modules to come, so nobody can finish it yet. */
      unfinished: boolean
    }

/**
 * The learner's certificate for a course. Issues it the first time every published lesson is complete,
 * every published project has passed, and the learner has a name to print on it, but never while the
 * course still has modules to come: finishing Module 1 of a new course isn't finishing the course. Safe to call on every
 * visit: it issues at most once.
 */
export async function certificateFor(
  learner: { id: string; name: string | null },
  track: string,
): Promise<CertificateState> {
  const held = await learnerCertificate(learner.id, track)
  if (held) return { certificate: held }

  const db = createAdminClient()
  const { data: lessons, error } = await db.from('lessons').select('id, module').eq('track_slug', track)
  if (error) throw error
  const ids = (lessons ?? []).map((l) => l.id)
  const { data: done, error: progressError } = ids.length
    ? await db
        .from('lesson_progress')
        .select('lesson_id')
        .eq('learner_id', learner.id)
        .eq('status', 'completed')
        .in('lesson_id', ids)
    : { data: [], error: null }
  if (progressError) throw progressError
  const completed = new Set((done ?? []).map((d) => d.lesson_id)).size
  const total = ids.length
  const { data: projectRows, error: projectError } = await db
    .from('projects')
    .select('id')
    .eq('track_slug', track)
  if (projectError) throw projectError
  const projectIds = (projectRows ?? []).map((p) => p.id)
  const { data: passedRows, error: workError } = projectIds.length
    ? await db
        .from('project_work')
        .select('project_id')
        .eq('learner_id', learner.id)
        .eq('status', 'passed')
        .in('project_id', projectIds)
    : { data: [], error: null }
  if (workError) throw workError
  const projects = { passed: (passedRows ?? []).length, total: projectIds.length }
  const name = learner.name?.trim() ?? ''
  const content = getTrackContent(track)
  const unfinished = !content || !isComplete(content)
  if (unfinished || total === 0 || completed < total || projects.passed < projects.total || !name)
    return { certificate: null, completed, total, projects, needsName: !name, unfinished }

  const certificate: Certificate = {
    code: newCode(track),
    learnerId: learner.id,
    track,
    name: name.slice(0, 80),
    issuedAt: new Date().toISOString(),
    lessons: total,
    modules: new Set((lessons ?? []).map((l) => l.module)).size,
    projects: projects.total,
    revokedAt: null,
  }
  await create(recordPath(certificate.code), certificate)
  // Two visits at once can both get here: the first index file wins, and the other record is removed.
  if (!(await create(learnerPath(learner.id, track), { code: certificate.code }))) {
    await createAdminClient()
      .storage.from(BUCKET)
      .remove([recordPath(certificate.code)])
    const winner = await learnerCertificate(learner.id, track)
    if (winner) return { certificate: winner }
  }
  return { certificate }
}

/** Dates on certificates read the same everywhere: 18 October 2026, in UTC. */
export const certificateDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

/** The page anyone can open to check a certificate. */
export const certificateUrl = (code: string, site: string) => `${site.replace(/\/$/, '')}/certificate/${code}`

// The two lines on each course's badge; courses not listed show their short name.
const BADGE: Record<string, [string, string]> = {
  'front-end-web-development': ['Front-End', 'Web Development'],
  'back-end-web-development': ['Back-End', 'Web Development'],
  'it-fundamentals': ['IT', 'Fundamentals'],
  'introduction-to-cybersecurity': ['Cybersecurity', 'Introduction'],
}

/** What the certificate document shows for this certificate. */
export function documentFor(c: Certificate, site: string): CertificateInput {
  const title = getTrackContent(c.track)?.title ?? c.track
  const course = findCourse(c.track)
  return {
    name: c.name,
    course: title,
    badge: BADGE[c.track] ?? [course?.short ?? title, ''],
    detail: `All ${c.modules} modules · ${c.lessons} lessons${c.projects ? ` · ${c.projects} projects` : ''}${course ? ` · ${course.alignment}` : ''}`,
    issued: certificateDate(c.issuedAt),
    code: c.code,
    url: certificateUrl(c.code, site),
  }
}

/** The certificate, laid out for drawing on a page. */
export const certificateShapes = (c: Certificate, site: string) => layoutCertificate(documentFor(c, site))
