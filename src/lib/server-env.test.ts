import { afterEach, describe, expect, it, vi } from 'vitest'
import { serverEnv } from './server-env'

describe('serverEnv', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('reads one secret even when another is missing, so sign-in never waits on the cron secret', () => {
    vi.stubEnv('SUPABASE_SECRET_KEY', `sb_secret_${'x'.repeat(31)}`)
    vi.stubEnv('CRON_SECRET', '')
    expect(serverEnv().SUPABASE_SECRET_KEY).toMatch(/^sb_secret_/)
  })

  it('names the secret that is missing', () => {
    vi.stubEnv('CRON_SECRET', '')
    expect(() => serverEnv().CRON_SECRET).toThrow(/CRON_SECRET/)
  })
})
