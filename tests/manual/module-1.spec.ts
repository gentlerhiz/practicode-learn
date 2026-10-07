import { expect, test } from '@playwright/test'
import { playWholeLesson } from '../e2e/helpers/play'

// Plays every published Front-End Module 1 lesson end to end against a server running
// `npm run dev:lessons`. Not part of the CI suite: it needs the private content repo next to this one.
// Run: PW_BASE=http://localhost:3200 npx playwright test tests/manual --config tests/manual/playwright.config.ts
const CONTENT = '../practicode-learn-content/dist/packs'
const LESSONS = [
  ['fe-01-01', 'what-happens-when-you-open-a-website'],
  ['fe-01-02', 'urls-domains-and-dns'],
  ['fe-01-03', 'requests-responses-and-status-codes'],
  ['fe-01-04', 'html-css-and-javascript-who-does-what'],
  ['fe-01-05', 'your-first-web-page'],
  ['fe-01-06', 'reading-mdn-the-developers-dictionary'],
] as const

for (const [id, slug] of LESSONS) {
  test(`${id} plays from start to finish`, async ({ page }) => {
    test.setTimeout(180_000)
    await page.goto(`/learn/front-end-web-development/${slug}`)
    await playWholeLesson(page, `${CONTENT}/${id}.json`)
    await expect(page.getByRole('heading', { name: /done, in/ })).toBeVisible()
  })
}
