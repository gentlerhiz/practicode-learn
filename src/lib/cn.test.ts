import { expect, it } from 'vitest'
import { cn } from './cn'

it('merges conflicting Tailwind classes, last one wins', () => {
  expect(cn('px-2 py-1', false && 'hidden', 'px-4')).toBe('py-1 px-4')
})
