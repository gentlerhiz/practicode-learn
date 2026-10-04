import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { SegmentedControl } from './segmented-control'

it('moves the selection with arrow keys, like a radio group', async () => {
  const onChange = vi.fn()
  render(
    <SegmentedControl
      label="Appearance"
      value="dark"
      onChange={onChange}
      options={[
        { value: 'dark', label: 'Dark' },
        { value: 'light', label: 'Light' },
        { value: 'system', label: 'Match device' },
      ]}
    />,
  )
  const dark = screen.getByRole('radio', { name: 'Dark' })
  expect(dark).toHaveAttribute('aria-checked', 'true')
  dark.focus()
  await userEvent.keyboard('{ArrowRight}')
  expect(onChange).toHaveBeenCalledWith('light')
})
