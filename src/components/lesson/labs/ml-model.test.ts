import { expect, it } from 'vitest'
import { accuracy, TEST, train, TRAINING } from './ml-model'

const score = (name: string) => accuracy(train(TRAINING[name]!))

it('has both ripe and unripe bananas to test on', () => {
  expect(TEST.some((p) => p.ripe)).toBe(true)
  expect(TEST.some((p) => !p.ripe)).toBe(true)
})

it('gets better with more examples, and worse with biased ones', () => {
  const four = score('4 examples')
  const twenty = score('20 examples')
  const many = score('200 examples')
  const biased = score('Biased examples')
  expect(four).toBeLessThan(many)
  expect(twenty).toBeLessThanOrEqual(many)
  expect(biased).toBeLessThan(twenty)
  expect(many).toBeGreaterThanOrEqual(85)
})
