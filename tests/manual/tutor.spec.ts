import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { admin, deleteTestUsers } from '../db/helpers'
import { logIn, newLearner } from '../e2e/helpers/auth'

// Asks the real AI tutor (Groq) from a lesson, as a Free and as a Pro learner. Not part of the CI suite:
// it spends real AI requests. Run: PW_BASE=http://localhost:3300 npx playwright test tests/manual/tutor.spec.ts --config tests/manual/playwright.config.ts
test.afterAll(deleteTestUsers)
test.setTimeout(180_000)

async function ask(page: import('@playwright/test').Page, question: string) {
  await page.getByRole('button', { name: 'Ask AI' }).click()
  const panel = page.getByRole('region', { name: 'AI tutor' })
  await expect(panel).toBeVisible()
  await panel.getByRole('textbox', { name: 'Your question about this step' }).fill(question)
  await panel.getByRole('button', { name: 'Ask' }).click()
  await expect(panel.getByText(/questions left today/)).toBeVisible()
  await expect(panel.getByText(/Based on: Step/)).toBeVisible({ timeout: 40_000 })
  return panel
}

test('a Free learner asks about a free lesson and sees 5 a day', async ({ page }) => {
  const learner = await newLearner('tutor-free')
  await logIn(page, learner.email, '/home')
  await page.goto('/learn/front-end-web-development/what-happens-when-you-open-a-website')
  const panel = await ask(page, 'What is a browser, in simple words?')
  await expect(panel.getByText('4 of 5 questions left today')).toBeVisible()
  const results = await new AxeBuilder({ page }).include('[aria-label="AI tutor"]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(results.violations.map((v) => v.id)).toEqual([])
  await page.screenshot({ path: 'test-results/tutor/free.png' })
  console.log('Free answer:', await panel.locator('.whitespace-pre-wrap').last().innerText())
})

test('a Pro learner asks about a Pro code step and sees 20 a day', async ({ page }) => {
  const learner = await newLearner('tutor-pro')
  const grant = await admin().from('memberships').insert({ learner_id: learner.id, source: 'granted' })
  if (grant.error) throw grant.error
  await logIn(page, learner.email, '/home')
  await page.goto('/learn/front-end-web-development/elements-tags-and-attributes')
  await expect(page.getByText(/Step 1 of/)).toBeVisible({ timeout: 30_000 })
  const panel = await ask(page, 'What is an attribute?')
  await expect(panel.getByText('19 of 20 questions left today')).toBeVisible()
  await page.screenshot({ path: 'test-results/tutor/pro.png' })
  console.log('Pro answer:', await panel.locator('.whitespace-pre-wrap').last().innerText())
})

test('the cap stops the sixth question for a Free learner', async ({ page }) => {
  const learner = await newLearner('tutor-cap')
  const rows = Array.from({ length: 5 }, () => ({ learner_id: learner.id, lesson_id: 'fe-01-01', step: 0, question: 'q', answer: 'a' }))
  const seeded = await admin().from('tutor_questions' as never).insert(rows as never)
  if (seeded.error) throw seeded.error
  await logIn(page, learner.email, '/home')
  await page.goto('/learn/front-end-web-development/what-happens-when-you-open-a-website')
  await page.getByRole('button', { name: 'Ask AI' }).click()
  const panel = page.getByRole('region', { name: 'AI tutor' })
  await expect(panel.getByText('0 of 5 questions left today')).toBeVisible()
  await expect(panel.getByRole('button', { name: 'Ask' })).toBeDisabled()
})
