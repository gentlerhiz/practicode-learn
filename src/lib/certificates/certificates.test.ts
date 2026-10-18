import { beforeEach, describe, expect, it, vi } from 'vitest'

// An in-memory stand-in for the private bucket and the two tables the certificate reads.
const files = new Map<string, string>()
let bucket = false
let lessons: { id: string; module: number }[] = []
let completed: string[] = []
let projects: { id: string }[] = []
let passed: string[] = []

const query = (rows: () => unknown[]) => {
  const chain = {
    select: () => chain,
    eq: () => chain,
    in: () => chain,
    then: (done: (r: { data: unknown[]; error: null }) => unknown) => done({ data: rows(), error: null }),
  }
  return chain
}

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => ({
    from: (table: string) =>
      table === 'lessons'
        ? query(() => lessons)
        : table === 'projects'
          ? query(() => projects)
          : table === 'project_work'
            ? query(() => passed.map((project_id) => ({ project_id })))
            : query(() => completed.map((lesson_id) => ({ lesson_id }))),
    storage: {
      createBucket: async () => {
        bucket = true
        return { error: null }
      },
      from: () => ({
        download: async (path: string) =>
          files.has(path)
            ? { data: new Blob([files.get(path)!]), error: null }
            : { data: null, error: { message: 'Object not found' } },
        upload: async (path: string, body: Blob) => {
          if (!bucket) return { error: { message: 'Bucket not found' } }
          if (files.has(path)) return { error: { message: 'The resource already exists' } }
          files.set(path, await body.text())
          return { error: null }
        },
        remove: async (paths: string[]) => {
          for (const p of paths) files.delete(p)
          return { error: null }
        },
      }),
    },
  }),
}))

const { certificateFor, findCertificate, isCertificateCode, newCode, certificateDate } =
  await import('./certificates')

const LEARNER = { id: '6f1d2c1e-8a8b-4c3d-9e2f-1a2b3c4d5e6f', name: 'Chiamaka Obi' }
const TRACK = 'front-end-web-development'

beforeEach(() => {
  files.clear()
  bucket = false
  lessons = [
    { id: 'fe-01-01', module: 1 },
    { id: 'fe-01-02', module: 1 },
    { id: 'fe-02-01', module: 2 },
  ]
  completed = []
  projects = []
  passed = []
})

describe('certificate codes', () => {
  it('are readable, unambiguous and checkable', () => {
    for (let i = 0; i < 50; i++) {
      const code = newCode(TRACK)
      expect(code).toMatch(/^PCL-FE-[0-9A-Z]{4}-[0-9A-Z]{4}$/)
      expect(code.slice(7)).not.toMatch(/[ILOU]/)
      expect(isCertificateCode(code)).toBe(true)
    }
    expect(isCertificateCode('PCL-FE-7Q4M-2K9O')).toBe(false)
    expect(isCertificateCode('../../etc/passwd')).toBe(false)
  })

  it('dates read the same everywhere', () => {
    expect(certificateDate('2026-10-18T23:30:00.000Z')).toBe('18 October 2026')
  })
})

describe('certificateFor', () => {
  it('shows progress until every lesson is complete', async () => {
    completed = ['fe-01-01', 'fe-02-01']
    expect(await certificateFor(LEARNER, TRACK)).toEqual({
      certificate: null,
      completed: 2,
      total: 3,
      projects: { passed: 0, total: 0 },
      needsName: false,
    })
    expect(files.size).toBe(0)
  })

  it('waits for a name to print', async () => {
    completed = ['fe-01-01', 'fe-01-02', 'fe-02-01']
    expect(await certificateFor({ ...LEARNER, name: '  ' }, TRACK)).toEqual({
      certificate: null,
      completed: 3,
      total: 3,
      projects: { passed: 0, total: 0 },
      needsName: true,
    })
  })

  it('issues once every lesson is complete, and only once', async () => {
    completed = ['fe-01-01', 'fe-01-02', 'fe-02-01', 'fe-99-99']
    const first = await certificateFor(LEARNER, TRACK)
    expect(first.certificate).toMatchObject({
      name: 'Chiamaka Obi',
      lessons: 3,
      modules: 2,
      revokedAt: null,
      track: TRACK,
    })
    const again = await certificateFor({ ...LEARNER, name: 'Someone Else' }, TRACK)
    expect(again.certificate?.code).toBe(first.certificate!.code)
    expect(again.certificate?.name).toBe('Chiamaka Obi')
    expect(await findCertificate(first.certificate!.code)).toEqual(first.certificate)
    expect(files.size).toBe(2)
  })

  it('waits for every published project to pass', async () => {
    completed = ['fe-01-01', 'fe-01-02', 'fe-02-01']
    projects = [{ id: 'fe-p01' }, { id: 'fe-p02' }]
    passed = ['fe-p01']
    expect(await certificateFor(LEARNER, TRACK)).toMatchObject({
      certificate: null,
      projects: { passed: 1, total: 2 },
    })
    passed = ['fe-p01', 'fe-p02']
    expect((await certificateFor(LEARNER, TRACK)).certificate).toMatchObject({ projects: 2, lessons: 3 })
  })

  it('finds nothing for an unknown or malformed code', async () => {
    expect(await findCertificate('PCL-FE-AAAA-BBBB')).toBeNull()
    expect(await findCertificate('records/x')).toBeNull()
  })
})
