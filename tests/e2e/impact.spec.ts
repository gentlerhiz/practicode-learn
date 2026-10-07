import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { admin, deleteTestUsers, testEnvReady } from '../db/helpers'
import { logIn, newLearner } from './helpers/auth'

test.afterAll(deleteTestUsers)

test('the impact page is for admins only, and shows every figure with its definition', async ({
  page,
}, testInfo) => {
  test.skip(!testEnvReady, 'needs the dev Supabase project')
  const { email, id } = await newLearner(`impact-${testInfo.project.name}`)
  await logIn(page, email, '/admin/impact')
  await expect(page.getByRole('heading', { name: 'We couldn’t find that page' })).toBeVisible()

  await admin().from('profiles').update({ role: 'admin' }).eq('id', id)
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Impact', level: 1 })).toBeVisible()
  await expect(page.getByText('Accounts with a confirmed email address.')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Download CSV' })).toHaveAttribute(
    'href',
    '/admin/impact/export',
  )
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations).toEqual([])

  const csv = await page.request.get('/admin/impact/export')
  expect(csv.headers()['content-disposition']).toMatch(/attachment; filename="practicode-learn-impact-/)
  expect(await csv.text()).toContain('Registered learners')
})
