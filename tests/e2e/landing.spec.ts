import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { LESSONS_OPEN } from '../../src/content/navigation'

test('landing leads with the promise and one primary action', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('by actually doing it')
  const hero = page.getByRole('region', { name: /by actually doing it/ })
  await expect(hero.getByRole('link', { name: 'Start Learning Free' })).toHaveAttribute('href', '/onboarding')
  await expect(hero.getByRole('link', { name: 'Explore Courses' })).toHaveAttribute('href', '/courses')
})

test('the open courses link to their pages; the rest say Coming soon', async ({ page }) => {
  await page.goto('/')
  const courses = page.getByRole('region', { name: 'Courses', exact: true })
  await expect(courses.getByRole('article')).toHaveCount(4)
  await expect(courses.getByText('Coming soon')).toHaveCount(1)
  await expect(courses.getByRole('article').getByRole('link')).toHaveCount(3)
  await expect(courses.getByRole('link', { name: 'Browse All Courses' })).toHaveAttribute('href', '/courses')
})

test('no promises the beta cannot keep', async ({ page }) => {
  await page.goto('/')
  const text = (await page.locator('main').innerText()).toLowerCase()
  for (const banned of [
    'job placement',
    'career support',
    'cv review',
    'guaranteed job',
    'pro from',
    '7-day free trial',
    'every track is free',
    'module 1 of every track',
    'every module in every track',
  ])
    expect(text, banned).not.toContain(banned)
})

test('the lesson demo works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/')
  const demo = page.getByRole('region', { name: 'A lesson that talks back' })
  const preview = demo.locator('.demo-row')
  const option = demo.locator('.demo-option', { hasText: 'center' })
  // Before a choice the links sit at the top, as the question says.
  await expect(preview).toHaveCSS('align-items', 'flex-start')
  const unselectedBorder = await option.evaluate((el) => getComputedStyle(el).borderColor)
  await demo.getByText('center', { exact: true }).click()
  await expect(demo.getByText(/Right\./)).toBeVisible()
  await expect(preview).toHaveCSS('align-items', 'center')
  expect(await option.evaluate((el) => getComputedStyle(el).borderColor)).not.toBe(unselectedBorder)
  await context.close()
})

test('landing has no accessibility violations in either theme', async ({ page }) => {
  for (const scheme of ['dark', 'light'] as const) {
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto('/')
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(results.violations, scheme).toEqual([])
  }
})

test('nothing on the landing page moves forever (WCAG 2.2.2)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const endless = await page.evaluate(() =>
    [...document.querySelectorAll('*')]
      .filter((el) => {
        const s = getComputedStyle(el)
        return s.animationName !== 'none' && s.animationIterationCount === 'infinite'
      })
      .map((el) => el.className.toString().slice(0, 60)),
  )
  expect(endless).toEqual([])
})

test('while lessons are closed, public pages say so and claim nothing that opens later', async ({ page }) => {
  test.skip(LESSONS_OPEN, 'only while lessons are closed')
  for (const path of ['/', '/courses/front-end-web-development', '/about']) {
    await page.goto(path)
    await expect(page.getByRole('main').getByText('Module 1 opens soon').first(), path).toBeVisible()
    const text = (await page.getByRole('main').innerText()).toLowerCase()
    for (const claim of [
      'is open first',
      'lessons save for offline',
      'saved for offline',
      'self-service in settings',
    ])
      expect(text, `${path}: ${claim}`).not.toContain(claim)
  }
  await page.goto('/legal/privacy')
  expect((await page.getByRole('main').innerText()).toLowerCase()).not.toContain(
    'are self-service in settings',
  )
})
