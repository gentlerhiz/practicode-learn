import { expect, it } from 'vitest'
import { acceptsAnswer, normaliseAnswer } from './answers'

it('ignores spacing, curly quotes, a final full stop and, by default, case', () => {
  expect(normaliseAnswer('  CD   ..  ')).toBe('cd ..')
  expect(normaliseAnswer('It’s 8.')).toBe("it's 8")
  expect(acceptsAnswer('Eight.', ['eight', '8'])).toBe(true)
})

it('keeps the dots that are part of a command', () => {
  expect(normaliseAnswer('git add .')).toBe('git add .')
  expect(acceptsAnswer('git add', ['git add .'])).toBe(false)
  expect(normaliseAnswer('cd ../')).toBe('cd ../')
})

it('keeps case when asked, as Mac and Linux commands need', () => {
  expect(acceptsAnswer('LS', ['ls'], true)).toBe(false)
  expect(acceptsAnswer('ls', ['ls'], true)).toBe(true)
})

it('never accepts an empty answer', () => {
  expect(acceptsAnswer('   ', [''])).toBe(false)
})
