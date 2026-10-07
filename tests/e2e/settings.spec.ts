import { readFileSync } from 'node:fs'
import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { admin, deleteTestUsers, seedLesson, testEnvReady } from '../db/helpers'
import { logIn, newLearner } from './helpers/auth'

test.afterAll(deleteTestUsers)

async function expectNoViolations(page: Page, where: string) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations, where).toEqual([])
}

test('home greets the learner and shows Module 1, with Module 2 on its way', async ({ page }, testInfo) => {
  test.skip(!testEnvReady, 'needs the dev Supabase project')
  const { email } = await newLearner(`home-${testInfo.project.name}`)
  await logIn(page, email, '/home')
  await expect(page.getByRole('heading', { level: 1, name: /Welcome/ })).toBeVisible()
  await expect(page.getByRole('heading', { name: /Module 1/ })).toBeVisible()
  await expect(page.getByText('Module 2 is on its way')).toBeVisible()
  await expectNoViolations(page, 'home')
  await page.goto('/settings')
  await expectNoViolations(page, 'settings')
})

test('a learner can rename themselves, download their data and delete their account', async ({
  page,
}, testInfo) => {
  test.skip(!testEnvReady, 'needs the dev Supabase project')
  await seedLesson({ id: 'zz-01-01', minutes: 10, steps: 9, version: 1 })
  const { email, id } = await newLearner(`settings-${testInfo.project.name}`)
  await admin()
    .from('lesson_progress')
    .insert({ learner_id: id, lesson_id: 'zz-01-01', lesson_version: 1, status: 'started', steps_done: 2 })
  await logIn(page, email, '/settings')

  const name = page.getByRole('textbox', { name: 'Name' })
  await name.fill('Ada Lantern')
  await page.getByRole('button', { name: 'Save Name' }).click()
  await expect(page.getByText('Saved.')).toBeVisible()

  const download = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Download My Data' }).click()
  const file = await (await download).path()
  const exported = JSON.parse(readFileSync(file, 'utf8'))
  expect(exported.profile.display_name).toBe('Ada Lantern')
  expect(exported.lesson_progress).toHaveLength(1)
  expect((await download).suggestedFilename()).toMatch(/^practicode-learn-data-\d{4}-\d{2}-\d{2}\.json$/)

  await page.getByRole('textbox', { name: 'Type delete to confirm' }).fill('delete')
  await page.getByRole('button', { name: 'Delete My Account' }).click()
  await expect(page).toHaveURL(/\/\?account=deleted$/, { timeout: 15_000 })
  await expect(page.getByText('Your account and data have been deleted.')).toBeVisible()

  const { data: gone } = await admin().auth.admin.getUserById(id)
  expect(gone.user).toBeNull()
  expect((await admin().from('lesson_progress').select('lesson_id').eq('learner_id', id)).data).toEqual([])
})
