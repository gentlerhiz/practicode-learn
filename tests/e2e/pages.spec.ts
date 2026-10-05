import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

for (const path of ['/about', '/legal/privacy', '/legal/terms', '/legal/accessibility', '/no-such-page']) {
  test(`${path} has no accessibility violations in either theme`, async ({ page }) => {
    for (const scheme of ['dark', 'light'] as const) {
      await page.emulateMedia({ colorScheme: scheme })
      await page.goto(path)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
      expect(results.violations, `${path} ${scheme}`).toEqual([])
    }
  })
}

test('the About page shows the founder with a described photo and profile links', async ({ page }) => {
  await page.goto('/about')
  await expect(page.getByRole('img', { name: 'Portrait of Idris Akande Rasaq' })).toBeVisible()
  await expect(page.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('href', /linkedin\.com\/in\//)
  await expect(page.getByRole('link', { name: /GitHub/ })).toHaveAttribute(
    'href',
    'https://github.com/gentlerhiz',
  )
})

test('public pages load every resource they ask for, with no script errors', async ({ page, baseURL }) => {
  const problems: string[] = []
  // Failed loads don't surface as console events in Playwright, so watch the responses themselves.
  page.on('response', (r) => {
    if (r.status() >= 400 && new URL(r.url()).host === new URL(baseURL!).host) {
      problems.push(`${r.status()} ${new URL(r.url()).pathname}`)
    }
  })
  page.on('pageerror', (e) => problems.push(e.message))
  for (const path of ['/', '/tracks/front-end-web-development', '/about']) {
    await page.goto(path)
    await page.waitForLoadState('load')
    await page.waitForTimeout(500)
  }
  expect(problems).toEqual([])
})
