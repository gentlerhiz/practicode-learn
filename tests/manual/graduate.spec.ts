import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { admin } from '../db/helpers'
import { logIn } from '../e2e/helpers/auth'
import { playWholeLesson } from '../e2e/helpers/play'

// One learner takes the whole Front-End track in the browser, lesson by lesson, the way a person would,
// then opens the certificate it earned. The account is kept afterwards, for a person to log in and look.
// Lessons already completed are skipped, so an interrupted run carries on where it stopped.
// Not part of the CI suite. Run (the account's details come from the environment, never from code):
//   GRADUATE_EMAIL=… GRADUATE_PASSWORD=… GRADUATE_NAME=… PW_BASE=https://learn.practicode.tech \
//     npx playwright test tests/manual/graduate.spec.ts --config tests/manual/playwright.config.ts --workers=1
const CONTENT = '../practicode-learn-content/dist'
const TRACK = 'front-end-web-development'
const email = process.env.GRADUATE_EMAIL ?? ''
const password = process.env.GRADUATE_PASSWORD ?? ''
const name = process.env.GRADUATE_NAME ?? ''

const catalogue = (
  JSON.parse(readFileSync(`${CONTENT}/catalogue.json`, 'utf8')) as { id: string; slug: string }[]
).sort((a, b) => a.id.localeCompare(b.id))

/** The account, made the way sign-up and onboarding make one, with Pro granted. Reused if it exists. */
async function graduate() {
  const db = admin()
  for (let page = 1; ; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw error
    const found = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
    if (found) return found.id
    if (data.users.length < 1000) break
  }
  const { data, error } = await db.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name, plan: { goal: 'build', track: 'fe', time: 't30', level: 'l1' } },
  })
  if (error) throw error
  const id = data.user.id
  const profile = await db.from('profiles').update({ display_name: name, country_code: 'NG' }).eq('id', id)
  if (profile.error) throw profile.error
  const pro = await db.from('memberships').insert({ learner_id: id, source: 'granted' })
  if (pro.error) throw pro.error
  return id
}

test('a learner completes every lesson and earns the certificate', async ({ page }) => {
  test.skip(!email || !password || !name, 'Set GRADUATE_EMAIL, GRADUATE_PASSWORD and GRADUATE_NAME.')
  test.setTimeout(6 * 60 * 60_000)
  const id = await graduate()
  await logIn(page, email, '/home', password)

  const { data: done, error } = await admin()
    .from('lesson_progress')
    .select('lesson_id')
    .eq('learner_id', id)
    .eq('status', 'completed')
  if (error) throw error
  const finished = new Set((done ?? []).map((d) => d.lesson_id))

  for (const lesson of catalogue.filter((l) => !finished.has(l.id))) {
    await test.step(lesson.id, async () => {
      await page.goto(`/learn/${TRACK}/${lesson.slug}`)
      await playWholeLesson(page, `${CONTENT}/packs/${lesson.id}.json`)
      await expect(page.getByRole('heading', { name: /done, in/ })).toBeVisible()
      // The finish is saved before moving on, as it would be for a person reading the summary.
      await expect
        .poll(
          async () =>
            (
              await admin()
                .from('lesson_progress')
                .select('status')
                .eq('learner_id', id)
                .eq('lesson_id', lesson.id)
                .maybeSingle()
            ).data?.status,
          { timeout: 30_000 },
        )
        .toBe('completed')
    })
  }

  await page.goto('/certificates')
  await expect(page.getByText(/^Earned on /)).toBeVisible()
  await page.screenshot({ path: 'test-results/graduate/certificates.png', fullPage: true })
  await page.getByRole('link', { name: 'View Certificate' }).click()
  await expect(page.getByRole('heading', { level: 1, name })).toBeVisible()
  await page.screenshot({ path: 'test-results/graduate/certificate.png', fullPage: true })
  console.log('Certificate:', page.url())
})
