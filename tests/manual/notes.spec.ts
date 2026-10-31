import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { admin, deleteTestUsers } from '../db/helpers'
import { logIn, newLearner } from '../e2e/helpers/auth'

// Module notes against a server with published lessons: Module 1's notes are free to anyone, a Pro
// module's send a signed-out visitor to sign in, and a Pro member downloads them from My Courses.
// Not part of the CI suite: it needs published lessons.
// Run: PW_BASE=http://localhost:3200 npx playwright test tests/manual/notes.spec.ts --config tests/manual/playwright.config.ts
const TRACK = process.env.TRACK ?? 'back-end-web-development'

test.afterAll(deleteTestUsers)

test('Module 1 notes are a PDF for anyone', async ({ request }) => {
  const res = await request.get(`/learn/${TRACK}/notes/1`)
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toBe('application/pdf')
  expect((await res.body()).subarray(0, 5).toString()).toBe('%PDF-')
})

test('a Pro module’s notes send a signed-out visitor to sign in', async ({ request }) => {
  const res = await request.get(`/learn/${TRACK}/notes/2`, { maxRedirects: 0 })
  expect(res.status()).toBe(303)
  expect(res.headers().location).toContain(`/login?next=${encodeURIComponent(`/learn/${TRACK}/notes/2`)}`)
})

test('notes for a module that isn’t open are not found', async ({ request }) => {
  expect((await request.get(`/learn/${TRACK}/notes/99`)).status()).toBe(404)
  expect((await request.get(`/learn/no-such-course/notes/1`)).status()).toBe(404)
})

test('a Pro member downloads a module’s notes from My Courses', async ({ page }) => {
  test.setTimeout(120_000)
  const learner = await newLearner('notes-pro')
  const grant = await admin().from('memberships').insert({ learner_id: learner.id, source: 'granted' })
  if (grant.error) throw grant.error
  await logIn(page, learner.email, `/my-courses?course=${TRACK}`)
  const row = page.locator('#module-2')
  await row.locator('summary').click()
  await row.screenshot({ path: 'test-results/notes/module-2.png' })
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    row.getByRole('link', { name: 'Module Notes (PDF)' }).click(),
  ])
  expect(download.suggestedFilename()).toBe(`PractiCode-Learn-${TRACK}-module-2-notes.pdf`)
  expect(
    readFileSync(await download.path())
      .subarray(0, 5)
      .toString(),
  ).toBe('%PDF-')
})
