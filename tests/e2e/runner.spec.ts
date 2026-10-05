import { expect, test } from '@playwright/test'
import { waitForHydration } from './hydration'

// The fixture page exists only when the test server sets PCL_FIXTURES=1 (playwright.config.ts).

test('passing tests report back', async ({ page }) => {
  await page.goto('/fixtures/runner')
  await expect(page.getByTestId('passing-results')).toContainText('2 of 2 passed')
})

test('code that breaks the page ends in a friendly message, and the page still works', async ({ page }) => {
  await page.goto('/fixtures/runner')
  await expect(page.getByTestId('throwing-results')).toContainText('Your code didn’t finish', {
    timeout: 8000,
  })
  const again = page.getByRole('button', { name: 'Run Again' }).first()
  await waitForHydration(again)
  await again.click()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByTestId('passing-results')).toContainText('2 of 2 passed')
})

test('learner code cannot read our cookies or storage', async ({ page }) => {
  await page.goto('/fixtures/runner')
  await expect(page.getByTestId('isolation-results')).toContainText('3 of 3 passed')
  await expect(page.getByTestId('isolation-results')).toContainText('origin: null')
})

test('the runner page is sandboxed even when opened directly', async ({ request }) => {
  const response = await request.get('/runner.html')
  expect(response.headers()['content-security-policy']).toMatch(/^sandbox allow-scripts;/)
})
