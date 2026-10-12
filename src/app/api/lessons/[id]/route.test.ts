// @vitest-environment node
import { beforeEach, expect, it, vi } from 'vitest'

const lessons = [
  { id: 'fe-01-01', free: true, packUrl: 'https://example.test/fe-01-01.json' },
  { id: 'fe-02-01', free: false, packUrl: 'lessons-pro/front-end-web-development/fe-02-01.v1.json' },
]
const session = { claims: null as { sub: string } | null, isPro: false }
const loadPack = vi.fn()

vi.mock('@/lib/lessons/catalogue', () => ({ listPublishedLessons: async () => lessons }))
vi.mock('@/lib/lessons/packs', () => ({ loadPack }))
vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getClaims: async () => ({ data: session.claims ? { claims: session.claims } : null }) },
    rpc: async () => ({ data: session.isPro }),
  }),
}))

const { GET } = await import('./route')
const get = (id: string) =>
  GET(new Request(`https://learn.practicode.tech/api/lessons/${id}`), { params: Promise.resolve({ id }) })

beforeEach(() => {
  session.claims = null
  session.isPro = false
  loadPack.mockReset()
  loadPack.mockResolvedValue({ id: 'fe-02-01', steps: [] })
})

it('asks visitors to sign in', async () => {
  expect((await get('fe-02-01')).status).toBe(401)
  expect(loadPack).not.toHaveBeenCalled()
})

it('refuses signed-in learners without Pro', async () => {
  session.claims = { sub: 'u1' }
  expect((await get('fe-02-01')).status).toBe(403)
  expect(loadPack).not.toHaveBeenCalled()
})

it('gives Pro members the pack, never cached by shared caches', async () => {
  session.claims = { sub: 'u1' }
  session.isPro = true
  const res = await get('fe-02-01')
  expect(res.status).toBe(200)
  expect(res.headers.get('cache-control')).toBe('private, no-store')
  expect(await res.json()).toEqual({ id: 'fe-02-01', steps: [] })
})

it('answers 404 for free, unknown and malformed lessons', async () => {
  session.claims = { sub: 'u1' }
  session.isPro = true
  for (const id of ['fe-01-01', 'fe-09-09', '..%2F.env']) expect((await get(id)).status).toBe(404)
  expect(loadPack).not.toHaveBeenCalled()
})

it('reports a pack that fails to load without leaking why', async () => {
  session.claims = { sub: 'u1' }
  session.isPro = true
  loadPack.mockRejectedValue(new Error('storage said no'))
  vi.spyOn(console, 'error').mockImplementation(() => {})
  const res = await get('fe-02-01')
  expect(res.status).toBe(502)
  expect(await res.text()).not.toContain('storage')
})
