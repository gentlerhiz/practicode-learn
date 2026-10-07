import { describe, expect, it } from 'vitest'
import { trustedOrigin } from './origin'

const SITE = 'https://learn.practicode.tech'

describe('trustedOrigin', () => {
  it('returns the address the learner is on when it is one of ours', () => {
    expect(trustedOrigin('http://localhost:3100', SITE)).toBe('http://localhost:3100')
    expect(trustedOrigin('https://learn.practicode.tech', SITE)).toBe(SITE)
    expect(trustedOrigin('https://practicode-learn-abc123-idrisaloma120-3188s-projects.vercel.app', SITE)).toBe(
      'https://practicode-learn-abc123-idrisaloma120-3188s-projects.vercel.app',
    )
  })

  it('falls back to the site address for anything else', () => {
    expect(trustedOrigin('https://evil.example', SITE)).toBe(SITE)
    expect(trustedOrigin('https://practicode-learn-x-someone-else.vercel.app', SITE)).toBe(SITE)
    expect(trustedOrigin('http://localhost.evil.example', SITE)).toBe(SITE)
    expect(trustedOrigin(null, SITE)).toBe(SITE)
    expect(trustedOrigin('not a url', SITE)).toBe(SITE)
  })
})
