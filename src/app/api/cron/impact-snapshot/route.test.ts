import { beforeEach, describe, expect, it, vi } from 'vitest'

const rpc = vi.fn()
const upsert = vi.fn()
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => ({ rpc, from: () => ({ upsert }) }),
}))

const { GET } = await import('./route')

const SECRET = 'cron-secret-for-tests-'.padEnd(40, 'x')
const call = (authorization?: string) =>
  GET(
    new Request('https://learn.practicode.tech/api/cron/impact-snapshot', {
      headers: authorization ? { authorization } : {},
    }),
  )

describe('monthly impact snapshot', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
    vi.stubEnv('CRON_SECRET', SECRET)
    rpc.mockReset().mockResolvedValue({ data: { registered_learners: 3 }, error: null })
    upsert.mockReset().mockResolvedValue({ error: null })
  })

  it('refuses requests without the right cron secret', async () => {
    expect((await call()).status).toBe(401)
    expect((await call('Bearer wrong')).status).toBe(401)
    expect(rpc).not.toHaveBeenCalled()
  })

  it('refuses everything when no cron secret is configured', async () => {
    vi.stubEnv('CRON_SECRET', '')
    expect((await call('Bearer ')).status).toBe(401)
  })

  it('saves this month’s figures when Vercel Cron calls with the secret', async () => {
    const response = await call(`Bearer ${SECRET}`)
    expect(response.status).toBe(200)
    expect(rpc).toHaveBeenCalledWith('impact_summary')
    expect(upsert).toHaveBeenCalledWith({
      month: expect.stringMatching(/^\d{4}-\d{2}-01$/),
      metrics: { registered_learners: 3 },
    })
  })

  it('reports a failure when the snapshot cannot be saved', async () => {
    upsert.mockResolvedValue({ error: { message: 'down' } })
    expect((await call(`Bearer ${SECRET}`)).status).toBe(500)
  })
})
