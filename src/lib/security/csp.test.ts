import { describe, expect, it } from 'vitest'
import { STATIC_INLINE, buildCsp, themeScriptHash } from './csp'

const base = { dev: false, supabaseUrl: 'https://abc.supabase.co', themeScriptHash: "'sha256-AAA'" }
const directive = (csp: string, name: string) => csp.split('; ').find((d) => d.startsWith(`${name} `)) ?? ''

describe('buildCsp', () => {
  it('dynamic pages use a nonce with strict-dynamic and no unsafe-inline scripts', () => {
    const csp = buildCsp({ ...base, mode: 'nonce', nonce: 'n0nce' })
    expect(csp).toContain("script-src 'self' 'nonce-n0nce' 'strict-dynamic'")
    expect(csp).not.toMatch(/script-src[^;]*'unsafe-inline'/)
  })
  it('dynamic pages still allow the no-flash theme script by its hash', () => {
    expect(directive(buildCsp({ ...base, mode: 'nonce', nonce: 'x' }), 'script-src')).toContain(
      "'sha256-AAA'",
    )
  })
  it('never lists a hash beside unsafe-inline, because browsers then ignore unsafe-inline', () => {
    const script = directive(buildCsp({ ...base, mode: 'static' }), 'script-src')
    expect(script.includes("'unsafe-inline'") && script.includes("'sha256-")).toBe(false)
  })
  it('never allows eval in production', () => {
    expect(buildCsp({ ...base, mode: 'static' })).not.toContain('unsafe-eval')
    expect(buildCsp({ ...base, mode: 'nonce', nonce: 'x' })).not.toContain('unsafe-eval')
  })
  it('locks down framing, plugins, base URI and forms', () => {
    const csp = buildCsp({ ...base, mode: 'static' })
    for (const d of [
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://abc.supabase.co https://accounts.google.com",
    ])
      expect(csp).toContain(d)
  })
  it('only connects to our own origin, Supabase and Vercel analytics', () => {
    expect(buildCsp({ ...base, mode: 'static' })).toContain(
      "connect-src 'self' https://abc.supabase.co https://vitals.vercel-insights.com",
    )
  })
  it('allows the runner frame from our own origin only', () => {
    expect(buildCsp({ ...base, mode: 'static' })).toContain("frame-src 'self'")
  })
})

it('hashes the theme boot script in CSP source format', () => {
  expect(themeScriptHash()).toMatch(/^'sha256-[A-Za-z0-9+/]+=*'$/)
})

it('records the measured static inline-script decision', () => {
  expect(["''", "'unsafe-inline'"]).toContain(STATIC_INLINE === '' ? "''" : STATIC_INLINE)
})
