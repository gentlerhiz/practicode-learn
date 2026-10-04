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
