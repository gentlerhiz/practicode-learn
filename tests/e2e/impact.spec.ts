import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { admin, deleteAfterRun, deleteTestUsers, generateOtp, testEnvReady } from '../db/helpers'
import { waitForHydration } from './hydration'

test.afterAll(deleteTestUsers)

test('the impact page is for admins only, and shows every figure with its definition', async ({
  page,
}, testInfo) => {
  test.skip(!testEnvReady, 'needs the dev Supabase project')
  // A confirmed account and a generated code: nothing is emailed.
  const email = `impact-${testInfo.project.name}-${Date.now()}@test.practicode.tech`
  const { data, error } = await admin().auth.admin.createUser({ email, email_confirm: true })
  if (error) throw error
  deleteAfterRun(data.user.id)

  await page.goto(`/verify?email=${encodeURIComponent(email)}&next=%2Fadmin%2Fimpact`)
  await page.getByLabel('6-digit code').fill(await generateOtp(email))
  const verify = page.getByRole('button', { name: 'Continue' })
  await waitForHydration(verify)
  await verify.click()
  await expect(page).toHaveURL(/\/admin\/impact$/, { timeout: 15_000 })
  await expect(page.getByRole('heading', { name: 'We couldn’t find that page' })).toBeVisible()

  await admin().from('profiles').update({ role: 'admin' }).eq('id', data.user.id)
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
