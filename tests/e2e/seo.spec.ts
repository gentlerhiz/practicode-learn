import { expect, test } from '@playwright/test'
import { PENDING } from '../../src/content/navigation'
import { publicPages } from '../../src/lib/seo/pages'

for (const p of publicPages) {
  const run = PENDING.includes(p.path) ? test.fixme : test
  run(`${p.path} has complete search and share metadata`, async ({ page }) => {
    await page.goto(p.path)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB')
    await expect(page.locator('h1')).toHaveCount(1)
    const meta = (sel: string) => page.locator(sel).first().getAttribute('content')
    expect(await meta('meta[name="description"]')).toBe(p.description)
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toMatch(
      new RegExp(`${p.path === '/' ? '/?$' : p.path}$`),
    )
    for (const prop of ['og:title', 'og:description', 'og:image', 'og:url', 'og:site_name', 'og:locale']) {
      expect(await meta(`meta[property="${prop}"]`), prop).toBeTruthy()
    }
    expect(await meta('meta[property="og:image"]')).toMatch(/^https?:\/\//)
    expect(await meta('meta[name="twitter:card"]')).toBe('summary_large_image')
    expect(await meta('meta[name="twitter:image"]')).toBeTruthy()
    expect(await meta('meta[name="robots"]')).toContain('index')
    for (const block of await page.locator('script[type="application/ld+json"]').allTextContents()) {
      expect(() => JSON.parse(block)).not.toThrow()
    }
  })
}

test('robots.txt points at the sitemap and hides private pages', async ({ request }) => {
  const body = await (await request.get('/robots.txt')).text()
  expect(body).toContain('Sitemap:')
  expect(body).toContain('Disallow: /home')
})

test('sitemap lists every public page', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  for (const p of publicPages) expect(xml).toContain(`${p.path === '/' ? '' : p.path}</loc>`)
})

test('every icon and share image the page links to loads', async ({ page, request }) => {
  await page.goto('/')
  const hrefs = await page
    .locator('link[rel="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]')
    .evaluateAll((els) => els.map((e) => (e as HTMLLinkElement).href))
  const images = await page
    .locator('meta[property="og:image"], meta[name="twitter:image"]')
    .evaluateAll((els) => els.map((e) => e.getAttribute('content')!))
  expect(hrefs.length).toBeGreaterThanOrEqual(3)
  for (const url of [...hrefs, ...images]) {
    const path = new URL(url).pathname + new URL(url).search
    const res = await request.get(path)
    expect(res.status(), url).toBe(200)
  }
})

test('the share image is small enough for WhatsApp previews', async ({ request }) => {
  const res = await request.get('/opengraph-image')
  expect(res.headers()['content-type']).toContain('image/png')
  expect((await res.body()).length).toBeLessThan(300 * 1024)
})

test('llms.txt describes the site in plain text', async ({ request }) => {
  const res = await request.get('/llms.txt')
  expect(res.headers()['content-type']).toContain('text/plain')
  expect(await res.text()).toContain('# PractiCode Learn')
})
