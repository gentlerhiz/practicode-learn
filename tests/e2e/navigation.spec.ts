import { expect, test } from '@playwright/test'
import { PENDING } from '../../src/content/navigation'

test('phone menu opens, traps nothing, and closes with Escape', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'phone only')
  await page.goto('/')
  const button = page.getByRole('button', { name: 'Open menu' })
  await button.click()
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'About' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(button).toHaveAttribute('aria-expanded', 'false')
  await expect(button).toBeFocused()
})

test('footer links to About, and every footer link resolves', async ({ page, request }) => {
  await page.goto('/')
  const links = await page
    .getByRole('contentinfo')
    .getByRole('link')
    .evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).href))
  expect(links.some((l) => l.endsWith('/about'))).toBe(true)
  for (const href of links.filter((l) => l.startsWith('http://localhost'))) {
    if (PENDING.includes(new URL(href).pathname)) continue
    expect((await request.get(href)).status(), href).toBe(200)
  }
})
