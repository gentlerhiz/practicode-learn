import { expect, test } from '@playwright/test'

test('track page lists all 15 modules and opens Module 1', async ({ page }) => {
  await page.goto('/tracks/front-end-web-development')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Front-End')
  await expect(page.locator('details')).toHaveCount(15)
  await expect(page.locator('details').first()).toHaveAttribute('open', '')
  await expect(page.locator('details').first()).toContainText('What happens when you open a website')
})

test('coming-soon tracks have no page yet', async ({ request }) => {
  expect((await request.get('/tracks/data-analysis')).status()).toBe(404)
  expect((await request.get('/tracks/not-a-track')).status()).toBe(404)
})

test('the track has its own share image, and it loads', async ({ page, request }) => {
  await page.goto('/tracks/front-end-web-development')
  const og = await page.locator('meta[property="og:image"]').getAttribute('content')
  // The route's file-based image; Next.js adds a build hash to its name.
  expect(og).toContain('/tracks/front-end-web-development/opengraph-image')
  const res = await request.get(new URL(og!).pathname + new URL(og!).search)
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('image/png')
})

test('course structured data is present', async ({ page }) => {
  await page.goto('/tracks/front-end-web-development')
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
  const types = blocks.flatMap((b) => [JSON.parse(b)].flat().map((d: { '@type': string }) => d['@type']))
  expect(types).toEqual(expect.arrayContaining(['Course', 'BreadcrumbList']))
})

test('the landing page link to projects lands on the projects section', async ({ page }) => {
  await page.goto('/tracks/front-end-web-development#projects')
  await expect(page.locator('#projects')).toBeVisible()
})

test('track page has no accessibility violations in either theme', async ({ page }) => {
  const { default: AxeBuilder } = await import('@axe-core/playwright')
  for (const scheme of ['dark', 'light'] as const) {
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto('/tracks/front-end-web-development')
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(results.violations, scheme).toEqual([])
  }
})
