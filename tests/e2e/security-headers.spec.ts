import { expect, test } from '@playwright/test'

test('public pages send the security headers', async ({ request }) => {
  const h = (await request.get('/')).headers()
  expect(h['strict-transport-security']).toContain('max-age=63072000')
  expect(h['x-content-type-options']).toBe('nosniff')
  expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin')
  expect(h['content-security-policy']).toContain("frame-ancestors 'none'")
  expect(h['x-powered-by']).toBeUndefined()
})

test('signed-in pages use a fresh nonce per request', async ({ request }) => {
  const a = (await request.get('/login')).headers()['content-security-policy']
  const b = (await request.get('/login')).headers()['content-security-policy']
  expect(a).toMatch(/'nonce-[A-Za-z0-9+/=]+'/)
  expect(a).not.toBe(b)
})

test('the runner is sandboxed even when opened directly', async ({ request }) => {
  expect((await request.get('/runner.html')).headers()['content-security-policy']).toMatch(
    /^sandbox allow-scripts/,
  )
})

test('no CSP violations on the landing page, and it hydrates', async ({ page }) => {
  const violations: string[] = []
  await page.exposeFunction('cspViolation', (v: string) => violations.push(v))
  await page.addInitScript(() =>
    document.addEventListener('securitypolicyviolation', (e) =>
      (window as unknown as { cspViolation: (v: string) => void }).cspViolation(
        `${e.violatedDirective} ${e.blockedURI} ${e.sample}`,
      ),
    ),
  )
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  // Hydration proof: the theme switch only works once React has hydrated, so every script has run.
  // (Not 'networkidle': Next.js link prefetches never report as finished, so it never arrives.)
  const toggle = page.getByRole('button', { name: /Switch to (light|dark) mode/ })
  const before = await page.locator('html').getAttribute('data-theme')
  await toggle.click()
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', before ?? '')
  expect(violations).toEqual([])
})

test('pages under the nonce policy still run their scripts (here, the 404 for /login)', async ({ page }) => {
  const violations: string[] = []
  await page.exposeFunction('cspViolation', (v: string) => violations.push(v))
  await page.addInitScript(() =>
    document.addEventListener('securitypolicyviolation', (e) =>
      (window as unknown as { cspViolation: (v: string) => void }).cspViolation(
        `${e.violatedDirective} ${e.blockedURI}`,
      ),
    ),
  )
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/login')
  const toggle = page.getByRole('button', { name: /Switch to (light|dark) mode/ })
  const before = await page.locator('html').getAttribute('data-theme')
  await toggle.click()
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', before ?? '')
  expect(violations).toEqual([])
})

test('paths that only start like a signed-in route still get the static policy', async ({ request }) => {
  for (const path of ['/homework', '/authors', '/settingsx']) {
    expect((await request.get(path)).headers()['content-security-policy'], path).toContain(
      "frame-ancestors 'none'",
    )
  }
})
