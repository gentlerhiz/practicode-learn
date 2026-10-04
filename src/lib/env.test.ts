import { describe, expect, it } from 'vitest'
import { parsePublicEnv } from './env'

describe('parsePublicEnv', () => {
  it('fills safe defaults for local development', () => {
    const env = parsePublicEnv({})
    expect(env.NEXT_PUBLIC_SITE_URL).toBe('http://localhost:3000')
    expect(env.NEXT_PUBLIC_CONTENT_SOURCE).toBe('samples')
  })
  it('rejects a site URL that is not a URL', () => {
    expect(() => parsePublicEnv({ NEXT_PUBLIC_SITE_URL: 'learn practicode' })).toThrow()
  })
  it('requires Supabase settings when content comes from Supabase', () => {
    expect(() => parsePublicEnv({ NEXT_PUBLIC_CONTENT_SOURCE: 'supabase' })).toThrow(/SUPABASE/)
  })
})
