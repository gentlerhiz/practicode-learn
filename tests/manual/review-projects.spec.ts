import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { admin, deleteTestUsers } from '../db/helpers'
import { logIn, newLearner } from '../e2e/helpers/auth'

// Daily review, the Module 1 project and the dashboard, against the hosted database, as a learner whose
// lessons are written directly. Not part of the CI suite: it needs the published cards and projects.
// Run: PW_BASE=http://localhost:3300 npx playwright test tests/manual/review-projects.spec.ts --config tests/manual/playwright.config.ts
const TRACK = 'front-end-web-development'

const SOLUTION = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Ada Okafor: about me</title>
  </head>
  <body>
    <h1>Ada Okafor</h1>
    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Ccircle cx='60' cy='60' r='60' fill='%233D5AF5'/%3E%3C/svg%3E" width="120" height="120" alt="A blue circle, my avatar until I take a photo">
    <p>I'm a nurse in Enugu who loves solving puzzles, and I'm learning to build websites so I can make a booking page for the clinic where I work.</p>
    <h2>Things I enjoy</h2>
    <ul>
      <li>Crossword puzzles</li>
      <li>Highlife music</li>
      <li>Cooking egusi soup on Sundays</li>
    </ul>
    <p>The site I use most while learning is <a href="https://developer.mozilla.org">MDN Web Docs</a>.</p>
  </body>
</html>
`

test.afterAll(async () => {
  await deleteTestUsers()
})

const axe = async (page: Page) =>
  (
    await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  ).violations.map((v) => v.id)

test('a learner reviews their cards, passes the Module 1 project, and sees what the certificate needs', async ({
  page,
}) => {
  test.setTimeout(240_000)
  const learner = await newLearner('review-projects', 'Ada Okafor')
  const db = admin()
  const { data: lessons, error } = await db
    .from('lessons')
    .select('id, version, module')
    .eq('track_slug', TRACK)
  if (error) throw error
  const rows = (lesson: { id: string; version: number }) => ({
    learner_id: learner.id,
    lesson_id: lesson.id,
    lesson_version: lesson.version,
    status: 'completed',
    completed_at: new Date().toISOString(),
  })
  const moduleOne = lessons!.filter((l) => l.module === 1)
  const first = await db.from('lesson_progress').insert(moduleOne.map(rows))
  if (first.error) throw first.error

  // Starting lessons joined the course.
  const { data: joined } = await db.from('enrollments').select('track_slug').eq('learner_id', learner.id)
  expect(joined).toEqual([{ track_slug: TRACK }])

  // The dashboard: cards due, and the Module 1 project ready to start.
  await logIn(page, learner.email, '/home')
  const { count: cards } = await db
    .from('lesson_cards')
    .select('id', { count: 'exact', head: true })
    .in(
      'lesson_id',
      moduleOne.map((l) => l.id),
    )
  const due = Math.min(cards!, 20)
  await expect(page.getByText(new RegExp(`^${due} cards · \\d+ min$`))).toBeVisible()
  await expect(page.getByText('An “About me” page')).toBeVisible()
  await page.screenshot({ path: 'test-results/review-projects/home-before-1440.png', fullPage: true })

  // A review session: think, show, rate. Again offers the lesson; the rest are Good.
  await page.getByRole('link', { name: 'Start Review' }).click()
  await expect(page).toHaveURL(/\/review$/)
  await expect(page.getByText(`Card 1 of ${due}`)).toBeVisible()
  expect(await axe(page)).toEqual([])
  await page.screenshot({ path: 'test-results/review-projects/review-front-1440.png', fullPage: true })
  await page.getByRole('button', { name: 'Show the Answer' }).click()
  const rate = page.getByRole('group', { name: 'Rate your answer' })
  await expect(rate.getByRole('button')).toHaveCount(4)
  await page.screenshot({ path: 'test-results/review-projects/review-back-1440.png', fullPage: true })
  await rate.getByRole('button', { name: /^Again/ }).click()
  await expect(page.getByText('That one comes back in a minute.')).toBeVisible()
  await expect(page.getByRole('link', { name: /^See it in / })).toHaveAttribute(
    'href',
    new RegExp(`^/learn/${TRACK}/`),
  )
  for (let k = 2; k <= due; k++) {
    await expect(page.getByText(`Card ${k} of ${due}`)).toBeVisible()
    await page.getByRole('button', { name: 'Show the Answer' }).click()
    await rate.getByRole('button', { name: /^Good/ }).click()
  }
  await expect(page.getByRole('heading', { name: 'Done for today' })).toBeVisible()
  await expect(page.getByText(`${due} cards reviewed.`, { exact: false })).toBeVisible()
  expect(await axe(page)).toEqual([])
  await page.screenshot({ path: 'test-results/review-projects/review-done-1440.png', fullPage: true })

  // Every rating was saved, and FSRS scheduled each card.
  const doneAt = Date.now()
  await expect
    .poll(
      async () => {
        const { count } = await db
          .from('review_log')
          .select('id', { count: 'exact', head: true })
          .eq('learner_id', learner.id)
        console.log(`${Date.now() - doneAt} ms: ${count} of ${due} saved`)
        return count
      },
      { timeout: 60_000, intervals: [2000] },
    )
    .toBe(due)
  const { data: scheduled } = await db
    .from('review_cards')
    .select('reps, lapses, due')
    .eq('learner_id', learner.id)
  expect(scheduled).toHaveLength(due)
  expect(scheduled!.every((c) => c.reps === 1)).toBe(true)
  // New cards get FSRS's short re-checks: Again in about a minute, Good in about ten.
  const gaps = scheduled!.map((c) => new Date(c.due).getTime() - doneAt).sort((a, b) => a - b)
  expect(gaps[0]).toBeLessThan(2 * 60_000)
  expect(gaps[1]).toBeGreaterThan(5 * 60_000)
  expect(gaps.at(-1)).toBeLessThan(15 * 60_000)

  // Coming back straight away: nothing is due yet.
  await page.goto('/review')
  await expect(page.getByRole('heading', { name: 'Nothing due today' })).toBeVisible()

  // The project: the starter fails the brief's checks.
  await page.goto(`/projects/${TRACK}/about-me-page`)
  await expect(page.getByRole('heading', { level: 1, name: 'An “About me” page' })).toBeVisible()
  await expect(page.getByText('Not run yet', { exact: true }).first()).toBeVisible()
  expect(await axe(page)).toEqual([])
  await page.getByRole('button', { name: 'Run Checks' }).click()
  await expect(page.getByText(/^\d+ of 10 passing$/)).toBeVisible({ timeout: 30_000 })
  await expect(page.getByText('Needs a fix').first()).toBeVisible()
  // The first failing check opens with the brief's own advice, not the helper's "Couldn't find".
  await expect(page.getByText('Give the page a title in the head.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Submit Project' })).toBeDisabled()
  await page.screenshot({ path: 'test-results/review-projects/project-failing-1440.png', fullPage: true })

  // The solution passes every check, the built-in ones included.
  await page.getByRole('textbox', { name: 'index.html' }).fill(SOLUTION)
  await expect(page.getByText('Saved just now')).toBeVisible({ timeout: 10_000 })
  await page.getByRole('button', { name: 'Run Checks' }).click()
  await expect(page.getByText('10 of 10 passing')).toBeVisible({ timeout: 30_000 })
  for (const name of [
    'No serious accessibility problems (axe)',
    'Fits a phone (320px wide)',
    'Fits a tablet (768px wide)',
    'Fits a laptop (1280px wide)',
  ]) {
    await expect(
      page.getByRole('button', { name: new RegExp(`^${name.replace(/[()]/g, '\\$&')}`) }),
    ).toContainText('Passed')
  }

  // A reload keeps the draft and the results.
  await page.reload()
  await expect(page.getByRole('textbox', { name: 'index.html' })).toHaveValue(SOLUTION)
  await expect(page.getByText('10 of 10 passing')).toBeVisible()

  // Submitting asks for the self-review first.
  await page.getByRole('button', { name: 'Submit Project' }).click()
  await expect(page.getByRole('heading', { name: 'Before you submit' })).toBeVisible()
  const send = page.getByRole('button', { name: 'Submit Project' }).last()
  await expect(send).toBeDisabled()
  const boxes = page.getByRole('checkbox')
  for (let k = 0; k < (await boxes.count()); k++) await boxes.nth(k).check()
  await expect(send).toBeEnabled()
  await page.screenshot({ path: 'test-results/review-projects/project-review-1440.png', fullPage: true })
  await send.click()
  await expect(page.getByText('Project passed. It counts toward your certificate.')).toBeVisible()
  const { data: work } = await db
    .from('project_work')
    .select('status, passed_at, review')
    .eq('learner_id', learner.id)
    .eq('project_id', 'fe-p01')
    .single()
  expect(work).toMatchObject({ status: 'passed', review: [true, true, true] })
  expect(work!.passed_at).not.toBeNull()
  await page.screenshot({ path: 'test-results/review-projects/project-passed-1440.png', fullPage: true })

  // The workspace on a phone: no sideways scrolling.
  await page.setViewportSize({ width: 390, height: 844 })
  await page.reload()
  await expect(page.getByText('Project passed. It counts toward your certificate.')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
  await page.screenshot({ path: 'test-results/review-projects/project-390.png', fullPage: true })
  await page.setViewportSize({ width: 1440, height: 900 })

  // The projects list shows it passed.
  await page.goto('/projects')
  await expect(page.getByText('An “About me” page')).toBeVisible()
  expect(await axe(page)).toEqual([])
  await page.screenshot({ path: 'test-results/review-projects/projects-1440.png', fullPage: true })

  // Every lesson done, one project of three: the certificate waits for the projects.
  const rest = await db.from('lesson_progress').insert(lessons!.filter((l) => l.module !== 1).map(rows))
  if (rest.error) throw rest.error
  await page.goto('/certificates')
  await expect(
    page.getByText(`${lessons!.length} of ${lessons!.length} lessons · 1 of 3 projects`),
  ).toBeVisible()
  await expect(
    page.getByText('Complete 2 more projects, and your certificate appears here straight away.'),
  ).toBeVisible()
  expect(await axe(page)).toEqual([])
  await page.screenshot({ path: 'test-results/review-projects/certificates-1440.png', fullPage: true })

  await page.goto('/home')
  await page.screenshot({ path: 'test-results/review-projects/home-after-1440.png', fullPage: true })
})
