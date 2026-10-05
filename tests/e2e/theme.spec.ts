import { expect, test } from '@playwright/test'

test('first paint follows a light device, with no dark flash', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  // documentElement doesn't exist yet when init scripts run, so watch the document and record the
  // theme at the moment <body> is inserted: that is the theme of the first paint.
  await page.addInitScript(() => {
    const w = window as unknown as { themeAtBody?: string }
    new MutationObserver((_, observer) => {
      if (!document.body) return
      w.themeAtBody = document.documentElement.dataset.theme ?? ''
      observer.disconnect()
    }).observe(document, { childList: true, subtree: true })
  })
  await page.goto('/')
  expect(await page.evaluate(() => (window as unknown as { themeAtBody?: string }).themeAtBody)).toBe('light')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('a theme chosen with the switch survives navigation between static pages', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Switch to light mode' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.goto('/about')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})
