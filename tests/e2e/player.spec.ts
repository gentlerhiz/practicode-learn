import { readFileSync } from 'node:fs'
import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { waitForHydration } from './hydration'

// The sample lesson (content/samples) in the test-only player fixture; see src/app/(dev)/fixtures/player.
const pack = JSON.parse(readFileSync('content/samples/packs/zz-01-01.json', 'utf8')) as {
  steps: { type: string; lab?: string; live?: boolean }[]
}
const find = (match: (s: { type: string; lab?: string; live?: boolean }) => boolean) =>
  pack.steps.findIndex(match)

const open = async (page: Page, step: number) => {
  await page.goto(`/fixtures/player?step=${step}`)
  await expect(page.getByRole('heading', { level: 1, name: 'Every step, once' })).toBeVisible()
  await waitForHydration(page.getByRole('button', { name: /Continue|Finish Lesson/ }))
}

test('every step has no accessibility violations in either theme', async ({ page }) => {
  test.setTimeout(180_000)
  for (const scheme of ['dark', 'light'] as const) {
    await page.emulateMedia({ colorScheme: scheme })
    for (let i = 0; i < pack.steps.length; i++) {
      await open(page, i)
      const results = await new AxeBuilder({ page })
        .exclude('iframe')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
      expect(results.violations, `step ${i + 1} (${pack.steps[i]!.type}) in ${scheme}`).toEqual([])
    }
  }
})

test('a diagram moves with Next and with the arrow keys', async ({ page }) => {
  await open(
    page,
    find((s) => s.lab === 'request-journey'),
  )
  await expect(page.getByText('1 of 6')).toBeVisible()
  await page.getByRole('button', { name: 'Next', exact: true }).click()
  await expect(page.getByText('2 of 6')).toBeVisible()
  await page.getByRole('group', { name: /Diagram/ }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByText('3 of 6')).toBeVisible()
})

test('the URL lab names any part that is tapped', async ({ page }) => {
  await open(
    page,
    find((s) => s.lab === 'url-anatomy'),
  )
  await page.getByRole('button', { name: 'Query: ?ref=whatsapp' }).click()
  await expect(page.getByText(/says the visitor came from a WhatsApp link/)).toBeVisible()
})

test('the request lab shows the status code for each request', async ({ page }) => {
  await open(
    page,
    find((s) => s.lab === 'http-exchange'),
  )
  await page.getByRole('button', { name: 'A missing page' }).click()
  await expect(page.getByText('HTTP/1.1 404 Not Found')).toBeVisible()
  await page.getByRole('button', { name: 'A page that moved' }).click()
  await expect(page.getByText('HTTP/1.1 301 Moved Permanently')).toBeVisible()
})

test('the page-load lab loads the page on a slow connection, photo last', async ({ page }) => {
  await open(
    page,
    find((s) => s.lab === 'page-load'),
  )
  await page.getByRole('button', { name: 'Slow', exact: true }).click()
  await expect(page.getByText('The photo arrived last. It is by far the biggest file.')).toBeVisible({
    timeout: 10_000,
  })
})

test('a code step passes its tests in the real runner and unlocks Continue', async ({ page }) => {
  await open(
    page,
    find((s) => s.type === 'code'),
  )
  const next = page.getByRole('button', { name: 'Continue' })
  await page.getByRole('button', { name: 'Run Tests' }).click()
  await expect(page.getByText('✕ Needs a fix')).toBeVisible({ timeout: 8000 })
  await expect(next).toBeDisabled()
  await page.getByRole('textbox', { name: 'Edit styles.css' }).fill('.lantern { color: #E8792F; }')
  await page.getByRole('button', { name: 'Run Tests' }).click()
  await expect(page.getByText('✓ Passed')).toBeVisible({ timeout: 8000 })
  await expect(next).toBeEnabled()
})

test('the player reports when the lesson starts and when it is finished', async ({ page }) => {
  await open(page, pack.steps.length - 1)
  await expect(page.getByTestId('events')).toHaveText(`lesson_started:${pack.steps.length - 1}`)
  await page.getByRole('button', { name: 'Finish Lesson' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Lesson complete' })).toBeVisible()
  await expect(page.getByTestId('events')).toContainText(`lesson_completed:${pack.steps.length}`)
})
