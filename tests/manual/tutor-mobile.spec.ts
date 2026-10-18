import { expect, test } from '@playwright/test'
import { deleteTestUsers } from '../db/helpers'
import { logIn, newLearner } from '../e2e/helpers/auth'

// The AI tutor's conversation at phone widths: it fits the screen, nothing scrolls sideways, and the
// question box and Ask button stay reachable after a long answer. Spends one real AI request per width.
// Run: PW_BASE=https://learn.practicode.tech npx playwright test tests/manual/tutor-mobile.spec.ts --config tests/manual/playwright.config.ts
test.afterAll(deleteTestUsers)
test.setTimeout(180_000)

for (const viewport of [
  { width: 320, height: 640 },
  { width: 390, height: 844 },
]) {
  test(`the tutor conversation fits a ${viewport.width}px phone`, async ({ page }) => {
    await page.setViewportSize(viewport)
    const learner = await newLearner(`tutor-phone-${viewport.width}`)
    await logIn(page, learner.email, '/home')
    await page.goto('/learn/front-end-web-development/what-happens-when-you-open-a-website')
    await page.getByRole('button', { name: 'Ask AI' }).click()
    const panel = page.getByRole('region', { name: 'AI tutor' })
    await expect(panel).toBeVisible()
    await page.screenshot({ path: `test-results/tutor/phone-${viewport.width}-open.png` })

    const box = panel.getByRole('textbox', { name: 'Your question about this step' })
    await box.fill('Explain what a browser does, step by step, with an example of opening a website.')
    await panel.getByRole('button', { name: 'Ask' }).click()
    await expect(panel.getByText(/Based on: Step/)).toBeVisible({ timeout: 40_000 })
    await page.screenshot({ path: `test-results/tutor/phone-${viewport.width}-answer.png` })

    const area = await panel.boundingBox()
    expect(area!.x).toBeGreaterThanOrEqual(0)
    expect(area!.x + area!.width).toBeLessThanOrEqual(viewport.width)
    expect(area!.y).toBeGreaterThanOrEqual(0)
    expect(area!.y + area!.height).toBeLessThanOrEqual(viewport.height)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      viewport.width,
    )
    await expect(box).toBeInViewport()
    await expect(panel.getByRole('button', { name: 'Ask' })).toBeInViewport()
    await expect(panel.getByRole('button', { name: 'Close' })).toBeInViewport()
  })
}
