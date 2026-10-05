import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { playWholeLesson } from './helpers/play'

const LESSON = '/learn/samples/every-step'

test('a guest can play a whole lesson and is offered to save progress', async ({ page }) => {
  test.setTimeout(120_000)
  await page.goto(LESSON)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await playWholeLesson(page)
  await expect(page.getByRole('heading', { name: /done/ })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Save My Progress' })).toHaveAttribute(
    'href',
    /\/signup\?next=%2Flearn%2Fsamples%2Fevery-step/,
  )
  const queued = await page.evaluate(
    () => JSON.parse(localStorage.getItem('pc-progress-v1') ?? '[]') as { verb: string }[],
  )
  expect(queued.map((e) => e.verb)).toEqual(['lesson_started', 'lesson_completed'])
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations, 'completion screen').toEqual([])
})

test('lesson pages are readable by search engines before any JavaScript runs', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(LESSON)
  await expect(page.getByRole('heading', { level: 1, name: 'Every step, once' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'What’s in this lesson' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'What’s in this lesson' })).toContainText(
    'A page arrives as a request and a response',
  )
  await context.close()
})

test('the lesson page has no accessibility violations in either theme', async ({ page }) => {
  for (const scheme of ['dark', 'light'] as const) {
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto(LESSON)
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible()
    const results = await new AxeBuilder({ page })
      .exclude('iframe')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(results.violations, scheme).toEqual([])
  }
})

test('sample lessons are kept out of search results', async ({ page, request }) => {
  await page.goto(LESSON)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  expect(await (await request.get('/sitemap.xml')).text()).not.toContain('/learn/samples/')
})

test('an unknown lesson is a 404', async ({ request }) => {
  expect((await request.get('/learn/samples/no-such-lesson')).status()).toBe(404)
})

// A loose net only (founder, 5 October 2026): catches a big accidental jump, such as Zod or the Supabase
// client landing in the page again. Measured about 200 KB with gzip.
test('a lesson page loads no more than 350 KB of compressed JavaScript', async ({ page }) => {
  const scripts: { url: string; bytes: number }[] = []
  page.on('requestfinished', async (req) => {
    if (req.resourceType() !== 'script') return
    scripts.push({ url: new URL(req.url()).pathname, bytes: (await req.sizes()).responseBodySize })
  })
  await page.goto(LESSON)
  await page.waitForLoadState('load')
  // Long enough for idle-time prefetches to show up too: they cost learners data as well.
  await page.waitForTimeout(3000)
  const total = scripts.reduce((sum, s) => sum + s.bytes, 0)
  const biggest = [...scripts]
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 6)
    .map((s) => `${(s.bytes / 1024).toFixed(1)} KB ${s.url}`)
  expect(
    total,
    `${(total / 1024).toFixed(1)} KB in ${scripts.length} scripts; biggest:\n${biggest.join('\n')}`,
  ).toBeLessThanOrEqual(350 * 1024)
})
