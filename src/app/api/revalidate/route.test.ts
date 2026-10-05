import { beforeEach, expect, it, vi } from 'vitest'

const revalidatePath = vi.fn()
vi.mock('next/cache', () => ({ revalidatePath }))

const { POST } = await import('./route')

const SECRET = 's'.repeat(40)
const call = (body: unknown, authorization?: string) =>
  POST(
    new Request('https://learn.practicode.tech/api/revalidate', {
      method: 'POST',
      headers: authorization ? { authorization } : {},
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  )

beforeEach(() => {
  vi.unstubAllEnvs()
  vi.stubEnv('REVALIDATE_SECRET', SECRET)
  revalidatePath.mockReset()
})

it('refuses requests without the secret', async () => {
  expect((await call({ paths: ['/'] })).status).toBe(401)
  expect((await call({ paths: ['/'] }, 'Bearer wrong')).status).toBe(401)
  expect(revalidatePath).not.toHaveBeenCalled()
})

it('refuses everything when no secret is configured', async () => {
  vi.stubEnv('REVALIDATE_SECRET', '')
  expect((await call({ paths: ['/'] }, 'Bearer ')).status).toBe(401)
})

it('refuses paths that are not ours, and bodies that are not JSON', async () => {
  expect((await call({ paths: ['https://evil.com'] }, `Bearer ${SECRET}`)).status).toBe(400)
  expect((await call('not json', `Bearer ${SECRET}`)).status).toBe(400)
  expect(revalidatePath).not.toHaveBeenCalled()
})

it('refreshes each listed page', async () => {
  const res = await call(
    { paths: ['/learn/front-end-web-development/what-happens', '/sitemap.xml'] },
    `Bearer ${SECRET}`,
  )
  expect(res.status).toBe(200)
  expect(revalidatePath).toHaveBeenCalledWith('/learn/front-end-web-development/what-happens')
  expect(revalidatePath).toHaveBeenCalledWith('/sitemap.xml')
})
