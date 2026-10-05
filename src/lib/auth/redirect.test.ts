import { describe, expect, it } from 'vitest'
import { safeRedirect } from './redirect'

describe('safeRedirect', () => {
  it.each([
    '//evil.com',
    'https://evil.com',
    '/\\evil.com',
    'javascript:alert(1)',
    '\\\\evil.com',
    '/%2F%2Fevil.com',
    ' //evil.com',
  ])('refuses %s', (bad) => {
    expect(safeRedirect(bad)).toBe('/home')
  })
  it('keeps a normal path with its query', () => {
    expect(safeRedirect('/learn/front-end-web-development/urls-domains-and-dns?step=3')).toBe(
      '/learn/front-end-web-development/urls-domains-and-dns?step=3',
    )
  })
  it('uses the fallback when nothing is given', () => {
    expect(safeRedirect(null, '/')).toBe('/')
  })
})
