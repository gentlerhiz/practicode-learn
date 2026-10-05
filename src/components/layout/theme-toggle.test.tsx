import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { ThemeToggle } from './theme-toggle'

beforeEach(() => {
  // jsdom has no matchMedia; this device prefers dark.
  vi.stubGlobal('matchMedia', (media: string) => ({
    matches: false,
    media,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
  document.documentElement.dataset.theme = 'dark'
  document.documentElement.dataset.themePref = 'system'
})

afterEach(() => {
  vi.unstubAllGlobals()
  delete document.documentElement.dataset.theme
  delete document.documentElement.dataset.themePref
})

it('every switch on the page flips what the page shows, even after another switch was used', async () => {
  const user = userEvent.setup()
  render(
    <>
      <ThemeToggle />
      <ThemeToggle variant="row" />
    </>,
  )
  const [header] = screen.getAllByRole('button')
  await user.click(header!)
  expect(document.documentElement.dataset.theme).toBe('light')

  // The phone-menu switch must now offer dark mode, and clicking it must go back to dark.
  const row = await screen.findByRole('button', { name: 'Dark mode' })
  await user.click(row)
  expect(document.documentElement.dataset.theme).toBe('dark')
})

it('a click straight after loading flips the theme the page is really showing', async () => {
  const user = userEvent.setup()
  render(<ThemeToggle />)
  // Another tab or the boot script changed the theme after this switch read it.
  document.documentElement.dataset.theme = 'light'
  document.documentElement.dataset.themePref = 'light'
  await user.click(screen.getByRole('button'))
  expect(document.documentElement.dataset.theme).toBe('dark')
})
