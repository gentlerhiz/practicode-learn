import { expect, it } from 'vitest'
import { acceptsAnswer, normaliseAnswer } from './answers'

it('ignores spacing, curly quotes, a final full stop and, by default, case', () => {
  expect(normaliseAnswer('  CD   ..  ')).toBe('cd ..')
  expect(normaliseAnswer('It’s 8.')).toBe("it's 8")
  expect(acceptsAnswer('Eight.', ['eight', '8'])).toBe(true)
})

it('keeps case when asked, as Mac and Linux commands need', () => {
  expect(acceptsAnswer('LS', ['ls'], true)).toBe(false)
  expect(acceptsAnswer('ls', ['ls'], true)).toBe(true)
})

it('never accepts an empty answer', () => {
  expect(acceptsAnswer('   ', [''])).toBe(false)
})
