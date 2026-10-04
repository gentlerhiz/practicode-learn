import { expect, test } from '@playwright/test'

test('first paint follows a light device, with no dark flash', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  const themes: string[] = []
  await page.exposeFunction('reportTheme', (t: string) => themes.push(t))
  await page.addInitScript(() => {
    new MutationObserver(() =>
      (window as unknown as { reportTheme: (t: string) => void }).reportTheme(
        document.documentElement.dataset.theme ?? '',
      ),
    ).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  expect(themes.filter((t) => t === 'dark')).toHaveLength(0)
})

test('an explicit choice survives navigation between static pages', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await page.evaluate(() => localStorage.setItem('pc-theme', 'light'))
  await page.goto('/about')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})
