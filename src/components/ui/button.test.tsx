import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { Button } from './button'

it('renders a real button that defaults to type="button"', () => {
  render(<Button>Start Free</Button>)
  expect(screen.getByRole('button', { name: 'Start Free' })).toHaveAttribute('type', 'button')
})
it('primary buttons never get a shadow class', () => {
  render(<Button variant="primary">Go</Button>)
  expect(screen.getByRole('button').className).not.toMatch(/shadow/)
})
it.each(['primary', 'secondary', 'ghost', 'quiet'] as const)('%s buttons react to hover and press', (variant) => {
  render(<Button variant={variant}>Go</Button>)
  const { className } = screen.getByRole('button')
  expect(className).toMatch(/\bhover:/)
  expect(className).toMatch(/\bpress\b/)
})
it('the form size matches the canvas field height', () => {
  render(<Button size="form">Log In</Button>)
  expect(screen.getByRole('button').className).toMatch(/h-\[52px\]/)
})
