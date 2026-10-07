import { describe, expect, it } from 'vitest'
import { config, isSignedInOnly } from '@/proxy'
import { DYNAMIC_PATHS, SIGNED_IN_PATHS } from './headers'

const matchers = config.matcher.map((m) => (typeof m === 'string' ? m : m.source))
// The two matcher forms list the same alternation: '/(a|b)/:path*' and '/(a|b)'.
const alternation = (source: string) => /^\/\(([^)]+)\)/.exec(source)?.[1]?.split('|').sort() ?? []

describe('route lists', () => {
  it('runs the proxy on every page that gets the per-request policy', () => {
    const expected = DYNAMIC_PATHS.map((p) => p.slice(1)).sort()
    for (const source of matchers) expect(alternation(source)).toEqual(expected)
  })

  it('treats every private page as signed-in only, and sign-in pages as open', () => {
    for (const path of SIGNED_IN_PATHS) {
      expect(isSignedInOnly(path), path).toBe(true)
      expect(isSignedInOnly(`${path}/anything`), path).toBe(true)
      expect(DYNAMIC_PATHS, path).toContain(path)
    }
    for (const path of ['/login', '/signup', '/onboarding', '/check-email', '/homework', '/'])
      expect(isSignedInOnly(path), path).toBe(false)
  })
})
