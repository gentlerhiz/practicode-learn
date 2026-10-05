import { describe, expect, it } from 'vitest'
import { outcome } from './outcome'

describe('what to do with a progress event after sending it', () => {
  it('is done when the server accepts it', () => {
    expect(outcome({ status: 204, error: null })).toBe('ok')
  })
  it('waits for sign-in when the learner is signed out or the session expired', () => {
    expect(outcome({ status: 400, error: { code: '28000' } })).toBe('auth')
    expect(outcome({ status: 401, error: { code: 'PGRST303' } })).toBe('auth')
  })
  it('drops an event the server will always refuse, so it cannot block the ones behind it', () => {
    expect(outcome({ status: 400, error: { code: '22023' } })).toBe('drop')
  })
  it('retries later when the network or server fails', () => {
    expect(outcome({ status: 0, error: { code: '' } })).toBe('retry')
    expect(outcome({ status: 503, error: { code: 'PGRST000' } })).toBe('retry')
  })
})
