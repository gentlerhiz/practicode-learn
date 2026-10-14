import { readFileSync } from 'node:fs'
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { admin, deleteTestUsers } from '../db/helpers'
import { logIn, newLearner } from '../e2e/helpers/auth'
import { playWholeLesson } from '../e2e/helpers/play'

// Plays every published Front-End Module 2 and 3 lesson end to end as a Pro member, and checks every lab
// step with axe. Not part of the CI suite: it needs the private content repo next to this one and a server
// built against published lessons.
// Run: PW_BASE=http://localhost:3200 npx playwright test tests/manual/modules-2-3.spec.ts --config tests/manual/playwright.config.ts
const CONTENT = '../practicode-learn-content/dist'
const catalogue = JSON.parse(readFileSync(`${CONTENT}/catalogue.json`, 'utf8')) as {
  id: string
  slug: string
  module: number
}[]
// MODULES=4 plays another module instead.
const MODULES = (process.env.MODULES ?? '2,3').split(',').map(Number)
const LESSONS = catalogue.filter((l) => MODULES.includes(l.module))

test.afterAll(deleteTestUsers)

for (const lesson of LESSONS) {
  test(`${lesson.id} plays from start to finish for a Pro member`, async ({ page }) => {
    test.setTimeout(240_000)
    const learner = await newLearner(`pro-${lesson.id}`)
    const grant = await admin().from('memberships').insert({ learner_id: learner.id, source: 'granted' })
    if (grant.error) throw grant.error
    await logIn(page, learner.email, '/home')
    await page.goto(`/learn/front-end-web-development/${lesson.slug}`)

    // Every step with a lab gets an accessibility check before it's played.
    const pack = JSON.parse(readFileSync(`${CONTENT}/packs/${lesson.id}.json`, 'utf8')) as {
      steps: { type: string; lab?: string }[]
    }
    const labSteps = pack.steps.flatMap((s, i) => (s.lab ? [i] : []))
    await playWholeLesson(page, `${CONTENT}/packs/${lesson.id}.json`, async (i) => {
      if (!labSteps.includes(i)) return
      await page.screenshot({ path: `test-results/labs/${lesson.id}-step-${i + 1}.png` })
      const results = await new AxeBuilder({ page })
        .exclude('iframe')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
      expect(
        results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
      ).toEqual([])
    })
    await expect(page.getByRole('heading', { name: /done, in/ })).toBeVisible()
  })
}
