import { describe, expect, it } from 'vitest'
import { applyPersistence } from './persistence'

describe('applyPersistence', () => {
  const persistent = { path: '/', sameSite: 'lax' as const, maxAge: 34_560_000 }

  it('keeps the long-lived cookie when the learner wants to stay logged in', () => {
    expect(applyPersistence(persistent, false)).toEqual(persistent)
  })

  it('turns it into a browser-session cookie when they do not', () => {
    expect(applyPersistence({ ...persistent, expires: new Date(2030, 0, 1) }, true)).toEqual({
      path: '/',
      sameSite: 'lax',
    })
  })

  it('never turns a removal into a session cookie', () => {
    const removal = { path: '/', maxAge: 0 }
    expect(applyPersistence(removal, true)).toEqual(removal)
  })

  it('passes missing options through', () => {
    expect(applyPersistence(undefined, true)).toBeUndefined()
  })
})
