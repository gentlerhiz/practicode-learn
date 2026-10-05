import { expect, it } from 'vitest'
import { createActiveTimer } from './tracker'

it('counts only active, visible time', () => {
  let t = 0
  const timer = createActiveTimer({ now: () => t, idleAfterMs: 120_000 })
  timer.touch()
  t += 30_000
  timer.touch() // 30 s active
  t += 600_000 // 10 min idle, counts only up to the idle limit
  timer.visible(false)
  t += 60_000
  timer.visible(true) // the hidden minute doesn't count
  expect(timer.take()).toBe(150)
  expect(timer.take()).toBe(0)
})
