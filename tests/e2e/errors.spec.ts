import { expect, test } from '@playwright/test'

test('unknown pages return 404 with a way back', async ({ page }) => {
  const res = await page.goto('/no-such-page')
  expect(res?.status()).toBe(404)
  await expect(page.getByRole('link', { name: 'Go to the Home Page' })).toHaveAttribute('href', '/')
  expect(await page.locator('meta[name="robots"]').getAttribute('content')).toContain('noindex')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('legal pages show when they were last updated, and that they are a draft', async ({ page }) => {
  for (const doc of ['privacy', 'terms', 'accessibility']) {
    await page.goto(`/legal/${doc}`)
    await expect(page.getByText(/Last updated/)).toBeVisible()
  }
  await expect(page.getByText(/legal review/i)).toBeVisible()
})

test('unknown legal documents are 404s', async ({ request }) => {
  expect((await request.get('/legal/cookies')).status()).toBe(404)
})
