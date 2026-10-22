import { expect, it } from 'vitest'
import { judge } from './password-rules'

it('rates leaked passwords and decorated common words as very weak', () => {
  expect(judge('password123').level).toBe(0)
  expect(judge('Sunshine1!').level).toBe(0)
  expect(judge('qwerty').level).toBe(0)
})

it('rates names with years and short passwords as weak, however many symbols', () => {
  expect(judge('Ada2004').level).toBe(1)
  expect(judge('Tq#9z!').level).toBe(1)
})

it('rates long passphrases of random words as very strong', () => {
  expect(judge('river candle orbit mango').level).toBe(4)
  expect(judge('river-sunshine-orbit').level).toBe(3)
})

it('asks for something to judge when empty', () => {
  expect(judge('').reasons[0]).toMatch(/Type a password/)
})
