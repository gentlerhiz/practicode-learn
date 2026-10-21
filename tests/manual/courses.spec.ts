import { readFileSync } from 'node:fs'
import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { admin, deleteTestUsers } from '../db/helpers'
import { logIn, newLearner } from '../e2e/helpers/auth'
import { playWholeLesson } from '../e2e/helpers/play'

// The course catalogue, the IT Fundamentals, Back-End and Introduction to Cybersecurity pages, and every
// lesson in their Module 1, played end to end with axe on each lab step. Not part of the CI suite: it needs the
// private content repo next to this one and a server built against published lessons
// (NEXT_PUBLIC_CONTENT_SOURCE=supabase).
// Run: PW_BASE=http://localhost:3300 npx playwright test tests/manual/courses.spec.ts --config tests/manual/playwright.config.ts
const CONTENT = '../practicode-learn-content/dist'
const catalogue = JSON.parse(readFileSync(`${CONTENT}/catalogue.json`, 'utf8')) as {
  id: string
  slug: string
  track: string
  version: number
}[]
const NEW = catalogue.filter((l) => /^(it|cy|be|py|sq)-/.test(l.id))
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']

test.afterAll(deleteTestUsers)

const axe = async (page: Page) =>
  (await new AxeBuilder({ page }).exclude('iframe').withTags(TAGS).analyze()).violations.map(
    (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
  )

const noSideways = async (page: Page, width: number) =>
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)

test('every new Module 1 lesson is published', () => {
  expect(NEW.filter((l) => l.track === 'it-fundamentals')).toHaveLength(6)
  expect(NEW.filter((l) => l.track === 'introduction-to-cybersecurity')).toHaveLength(6)
  expect(NEW.filter((l) => l.track === 'back-end-web-development')).toHaveLength(6)
  expect(NEW.filter((l) => l.track === 'python-programming')).toHaveLength(6)
  expect(NEW.filter((l) => l.track === 'sql-and-databases')).toHaveLength(6)
})

for (const lesson of NEW) {
  test(`${lesson.id} plays from start to finish, signed out`, async ({ page }) => {
    test.setTimeout(180_000)
    await page.goto(`/learn/${lesson.track}/${lesson.slug}`)
    const pack = JSON.parse(readFileSync(`${CONTENT}/packs/${lesson.id}.json`, 'utf8')) as {
      steps: { lab?: string }[]
    }
    const labSteps = pack.steps.flatMap((s, i) => (s.lab ? [i] : []))
    await playWholeLesson(page, `${CONTENT}/packs/${lesson.id}.json`, async (i) => {
      if (!labSteps.includes(i)) return
      await page.screenshot({ path: `test-results/courses/${lesson.id}-step-${i + 1}.png` })
      expect(await axe(page)).toEqual([])
    })
    await expect(page.getByRole('heading', { name: /done, in/ })).toBeVisible()
  })
}

test('the Courses page lists the catalogue, and its filters work', async ({ page }) => {
  await page.goto('/courses')
  await expect(page.getByRole('heading', { level: 1, name: 'Courses', exact: true })).toBeVisible()
  const cards = page.locator('section[aria-labelledby="courses-title"] li:not([hidden]) h3')
  await expect(cards.filter({ hasText: 'IT Fundamentals: Computers and Digital Skills' })).toBeVisible()
  await expect(cards.filter({ hasText: 'SQL and Databases' })).toBeVisible()
  expect(await axe(page)).toEqual([])
  await page.screenshot({ path: 'test-results/courses/courses-1440.png', fullPage: true })

  // Only open courses show, and only subjects that have one.
  await expect(page.getByText('Coming soon')).toHaveCount(0)
  await expect(cards.filter({ hasText: 'Data Analysis' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Design', exact: true })).toHaveCount(0)
  // A subject: only security courses.
  await page.getByRole('button', { name: 'Security', exact: true }).click()
  await expect(cards).toHaveCount(1)
  await expect(cards.filter({ hasText: 'Introduction to Cybersecurity' })).toBeVisible()
  // A search with no match, then clearing it all.
  await page.getByRole('button', { name: 'All subjects' }).click()
  await page.getByLabel('Search courses').fill('underwater basket weaving')
  await expect(page.getByText('No course matches that yet.')).toBeVisible()
  await page.getByRole('button', { name: 'Clear the filters' }).click()
  await expect(cards.filter({ hasText: 'Python Programming' })).toBeVisible()

  // A live card opens its course page; the paths link the open courses.
  await page.getByRole('link', { name: /Introduction to Cybersecurity/ }).first().click()
  await expect(page).toHaveURL(/\/courses\/introduction-to-cybersecurity$/)

  await page.goto('/courses')
  await page.setViewportSize({ width: 390, height: 844 })
  await noSideways(page, 390)
  await page.screenshot({ path: 'test-results/courses/courses-390.png', fullPage: true })
})

for (const course of [
  { slug: 'it-fundamentals', first: 'what-is-a-computer', title: /^IT Fundamentals/ },
  { slug: 'introduction-to-cybersecurity', first: 'what-cybersecurity-protects', title: /^Introduction to Cybersecurity/ },
  { slug: 'front-end-web-development', first: 'what-happens-when-you-open-a-website', title: /^Front-End Web Development/ },
  { slug: 'back-end-web-development', first: 'what-the-back-end-does', title: /^Back-End Web Development/ },
  { slug: 'python-programming', first: 'what-a-program-is', title: /^Python Programming/ },
  { slug: 'sql-and-databases', first: 'what-a-database-is', title: /^SQL and Databases/ },
]) {
  test(`the ${course.slug} page shows its syllabus and starts Module 1`, async ({ page }) => {
    await page.goto(`/courses/${course.slug}`)
    await expect(page.getByRole('heading', { level: 1, name: course.title })).toBeVisible()
    if (!course.slug.startsWith('front-end'))
      expect(await page.locator('#syllabus').getByText('Coming soon').count()).toBeGreaterThan(5)
    expect(await axe(page)).toEqual([])
    await page.screenshot({ path: `test-results/courses/${course.slug}-1440.png`, fullPage: true })
    await page.setViewportSize({ width: 390, height: 844 })
    await noSideways(page, 390)
    await page.screenshot({ path: `test-results/courses/${course.slug}-390.png`, fullPage: true })
    await page.getByRole('link', { name: 'Start Module 1 Free' }).first().click()
    await expect(page).toHaveURL(new RegExp(`/learn/${course.slug}/${course.first}$`))
  })
}

test('the landing page links to every course, and old track links redirect', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#courses').getByRole('heading', { name: 'IT Fundamentals: Computers and Digital Skills' })).toBeVisible()
  await page.locator('#courses').getByRole('link', { name: 'Browse All Courses' }).click()
  await expect(page).toHaveURL(/\/courses$/)
  await page.goto('/tracks/front-end-web-development')
  await expect(page).toHaveURL(/\/courses\/front-end-web-development$/)
})

test('a learner moves between courses, and Module 1 alone earns no certificate', async ({ page }) => {
  test.setTimeout(120_000)
  const learner = await newLearner('courses', 'Ada Okafor')
  const db = admin()
  const done = (ids: string[]) =>
    db.from('lesson_progress').insert(
      ids.map((id) => ({
        learner_id: learner.id,
        lesson_id: id,
        lesson_version: NEW.find((l) => l.id === id)?.version ?? 1,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })),
    )
  const it = NEW.filter((l) => l.track === 'it-fundamentals').map((l) => l.id)
  const first = await done(it)
  if (first.error) throw first.error

  // Home and My Courses follow the course the learner last worked on.
  await logIn(page, learner.email, '/home')
  await expect(page.getByText(/^IT Fundamentals: Computers and Digital Skills$/).first()).toBeVisible()
  await page.screenshot({ path: 'test-results/courses/home-it-1440.png', fullPage: true })
  await page.goto('/my-tracks')
  await expect(page).toHaveURL(/\/my-courses$/)
  await expect(page.getByRole('heading', { level: 2, name: 'IT Fundamentals: Computers and Digital Skills' })).toBeVisible()
  await expect(page.getByText('6 of 85 lessons done')).toBeVisible()
  expect(await axe(page)).toEqual([])
  await page.screenshot({ path: 'test-results/courses/my-courses-1440.png', fullPage: true })

  // Starting another course adds it to the switcher.
  const cy = await done(['cy-01-01'])
  if (cy.error) throw cy.error
  await page.reload()
  const switcher = page.getByRole('navigation', { name: 'Your courses' })
  await switcher.getByRole('link', { name: 'IT Fundamentals' }).click()
  await expect(page).toHaveURL(/course=it-fundamentals/)
  await expect(page.getByRole('heading', { level: 2, name: 'IT Fundamentals: Computers and Digital Skills' })).toBeVisible()

  // All of IT Fundamentals' open lessons done: no certificate until the course is complete.
  await page.goto('/certificates')
  await expect(page.getByText(/You’ve done every lesson that’s open/)).toBeVisible()
  await expect(page.getByText(/^Earned on /)).toHaveCount(0)
  expect(await axe(page)).toEqual([])
  await page.screenshot({ path: 'test-results/courses/certificates-1440.png', fullPage: true })
})
