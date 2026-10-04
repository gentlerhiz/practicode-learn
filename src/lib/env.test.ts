import { describe, expect, it } from 'vitest'
import { parsePublicEnv } from './env'

describe('parsePublicEnv', () => {
  it('fills safe defaults for local development', () => {
    const env = parsePublicEnv({})
    expect(env.NEXT_PUBLIC_SITE_URL).toBe('http://localhost:3000')
    expect(env.NEXT_PUBLIC_CONTENT_SOURCE).toBe('samples')
  })
  it('treats empty values, as in a freshly copied .env.example, as not set', () => {
    const env = parsePublicEnv({
      NEXT_PUBLIC_SITE_URL: '',
      NEXT_PUBLIC_SUPABASE_URL: '',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: '',
      NEXT_PUBLIC_CONTENT_SOURCE: '',
      NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: '',
    })
    expect(env.NEXT_PUBLIC_SITE_URL).toBe('http://localhost:3000')
    expect(env.NEXT_PUBLIC_CONTENT_SOURCE).toBe('samples')
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBeUndefined()
    expect(env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION).toBeUndefined()
  })
  it('rejects a site URL that is not a URL', () => {
    expect(() => parsePublicEnv({ NEXT_PUBLIC_SITE_URL: 'learn practicode' })).toThrow()
  })
  it('requires Supabase settings when content comes from Supabase', () => {
    expect(() => parsePublicEnv({ NEXT_PUBLIC_CONTENT_SOURCE: 'supabase' })).toThrow(/SUPABASE/)
  })
})
