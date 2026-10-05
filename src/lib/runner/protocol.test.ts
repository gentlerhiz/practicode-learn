import { describe, expect, it } from 'vitest'
import { parseRunnerMessage } from './protocol'

describe('messages from the runner (learner code can send anything)', () => {
  it('accepts ready and test results', () => {
    expect(parseRunnerMessage({ type: 'ready' })).toEqual({ type: 'ready' })
    expect(
      parseRunnerMessage({
        type: 'pcl-tests',
        results: [{ name: 'Orange text', pass: false, message: 'Set the colour.' }],
      }),
    ).toEqual({
      type: 'pcl-tests',
      results: [{ name: 'Orange text', pass: false, message: 'Set the colour.' }],
    })
  })

  it('ignores anything else', () => {
    expect(parseRunnerMessage('ready')).toBeNull()
    expect(parseRunnerMessage({ type: 'pcl-tests', results: 'all passed' })).toBeNull()
    expect(parseRunnerMessage({ type: 'pcl-tests', results: [{ name: 'x', pass: 'yes' }] })).toBeNull()
    expect(parseRunnerMessage({ type: 'navigate', url: 'https://evil.com' })).toBeNull()
  })

  it('refuses floods: at most 50 results, each name and message of sensible length', () => {
    const many = Array.from({ length: 51 }, (_, i) => ({ name: `t${i}`, pass: true }))
    expect(parseRunnerMessage({ type: 'pcl-tests', results: many })).toBeNull()
    expect(
      parseRunnerMessage({ type: 'pcl-tests', results: [{ name: 'x'.repeat(501), pass: true }] }),
    ).toBeNull()
  })
})
