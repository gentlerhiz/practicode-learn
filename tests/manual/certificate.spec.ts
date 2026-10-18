import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { PDFDocument } from 'pdf-lib'
import { admin, deleteTestUsers } from '../db/helpers'
import { logIn, newLearner } from '../e2e/helpers/auth'

// A learner who has completed every published lesson gets a certificate on the Certificates page, and its
// public page checks out. The progress is written directly, so this takes seconds instead of hours; the
// certificate files are removed afterwards. Not part of the CI suite: it needs the hosted database.
// Run: PW_BASE=http://localhost:3300 npx playwright test tests/manual/certificate.spec.ts --config tests/manual/playwright.config.ts
const issued: string[] = []

test.afterAll(async () => {
  const bucket = admin().storage.from('certificates')
  for (const [id, code] of issued.map((x) => x.split(' '))) {
    await bucket.remove([`records/${code}.json`, `learners/${id}/front-end-web-development.json`])
  }
  await deleteTestUsers()
})

test('completing every lesson earns a certificate anyone can check', async ({ page }) => {
  test.setTimeout(120_000)
  const learner = await newLearner('certificate', 'Chiamaka Obi')
  const db = admin()
  const { error: named } = await db
    .from('profiles')
    .update({ display_name: 'Chiamaka Obi' })
    .eq('id', learner.id)
  if (named) throw named
  const { data: lessons, error } = await db
    .from('lessons')
    .select('id, version, module')
    .eq('track_slug', 'front-end-web-development')
  if (error) throw error
  const modules = new Set(lessons!.map((l) => l.module)).size
  const rows = (lesson: { id: string; version: number }) => ({
    learner_id: learner.id,
    lesson_id: lesson.id,
    lesson_version: lesson.version,
    status: 'completed',
    completed_at: new Date().toISOString(),
  })

  // One lesson short: progress, and no certificate.
  const [last, ...rest] = lessons!
  const first = await db.from('lesson_progress').insert(rest.map(rows))
  if (first.error) throw first.error
  await logIn(page, learner.email, '/home')
  await page.goto('/certificates')
  await expect(page.getByText(`${rest.length} of ${lessons!.length} lessons`)).toBeVisible()
  await expect(page.getByRole('heading', { name: 'In progress' })).toBeVisible()

  // The last lesson: the certificate still waits for the projects.
  const second = await db.from('lesson_progress').insert(rows(last!))
  if (second.error) throw second.error
  const { data: projects, error: noProjects } = await db
    .from('projects')
    .select('id, version')
    .eq('track_slug', 'front-end-web-development')
  if (noProjects) throw noProjects
  await page.reload()
  await expect(page.getByText(`0 of ${projects!.length} projects`)).toBeVisible()

  // Every project passed: the certificate is issued.
  const passed = await db.from('project_work').insert(
    projects!.map((p) => ({
      learner_id: learner.id,
      project_id: p.id,
      project_version: p.version,
      status: 'passed',
      passed_at: new Date().toISOString(),
    })),
  )
  if (passed.error) throw passed.error
  await page.reload()
  await expect(page.getByText(/^Earned on /)).toBeVisible()
  const code = (await page.locator('.font-mono').first().innerText()).trim()
  expect(code).toMatch(/^PCL-FE-[0-9A-Z]{4}-[0-9A-Z]{4}$/)
  issued.push(`${learner.id} ${code}`)
  const inApp = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(inApp.violations.map((v) => v.id)).toEqual([])
  await page.screenshot({ path: 'test-results/certificate/certificates-1440.png', fullPage: true })

  // Opening it again keeps the same certificate.
  await page.reload()
  await expect(page.locator('span.font-mono', { hasText: code })).toBeVisible()

  // The public page, signed out, at laptop and phone widths.
  await page.context().clearCookies()
  await page.goto(`/certificate/${code}`)
  await expect(page.getByRole('heading', { level: 1, name: /^Chiamaka Obi/ })).toBeVisible()
  await expect(page.getByText('Verified: this certificate is real and active')).toBeVisible()
  await expect(
    page.getByText(
      `Every lesson and exercise in ${modules} modules: ${lessons!.length} lessons in all, and ${projects!.length} projects, each passing every check.`,
    ),
  ).toBeVisible()

  // The PDF: one A4 landscape page, downloaded as a file.
  const pdf = await page.request.get(`/certificate/${code}/pdf`)
  expect(pdf.status()).toBe(200)
  expect(pdf.headers()['content-type']).toBe('application/pdf')
  expect(pdf.headers()['content-disposition']).toContain(
    `attachment; filename="PractiCode-Learn-Certificate-${code}.pdf"`,
  )
  const doc = await PDFDocument.load(await pdf.body())
  expect(doc.getPageCount()).toBe(1)
  expect(doc.getPage(0).getSize()).toEqual({ width: 842, height: 595 })
  expect(doc.getTitle()).toContain('Chiamaka Obi')
  expect((await page.request.get('/certificate/PCL-FE-0000-0000/pdf')).status()).toBe(404)
  const open = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(open.violations.map((v) => v.id)).toEqual([])
  await page.screenshot({ path: 'test-results/certificate/public-1440.png', fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({ path: 'test-results/certificate/public-390.png', fullPage: true })
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)

  // Codes are case-insensitive in the address, and unknown ones are a 404.
  await page.goto(`/certificate/${code.toLowerCase()}`)
  await expect(page.getByRole('heading', { level: 1, name: /^Chiamaka Obi/ })).toBeVisible()
  const missing = await page.goto('/certificate/PCL-FE-0000-0000')
  expect(missing?.status()).toBe(404)
})
