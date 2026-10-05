import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import { OrderStep } from './order'

const step = {
  type: 'order' as const,
  stage: 'investigate' as const,
  body: '<p>Order</p>',
  items: ['<p>First</p>', '<p>Second</p>', '<p>Third</p>'],
  wrong: 'Not yet',
  hints: ['a', 'b', 'c'],
}

it('reorders with the move buttons and reports when solved', async () => {
  let solved = false
  render(<OrderStep step={step} initialOrder={[2, 1, 0]} onSolved={() => (solved = true)} />)
  await userEvent.click(screen.getAllByRole('button', { name: 'Move down' })[0]!) // Third ↓ → 1,2,0
  await userEvent.click(screen.getAllByRole('button', { name: 'Move down' })[1]!) // → 1,0,2
  await userEvent.click(screen.getAllByRole('button', { name: 'Move up' })[1]!) // → 0,1,2
  await userEvent.click(screen.getByRole('button', { name: 'Check the Order' }))
  expect(solved).toBe(true)
})

it('says what is wrong with a wrong order, and lets the learner keep going', async () => {
  let solved = false
  render(<OrderStep step={step} initialOrder={[2, 1, 0]} onSolved={() => (solved = true)} />)
  await userEvent.click(screen.getByRole('button', { name: 'Check the Order' }))
  expect(solved).toBe(false)
  expect(screen.getByText('Not yet')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Check the Order' })).toBeEnabled()
})
