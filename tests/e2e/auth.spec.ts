import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { deleteAfterRun, deleteTestUsers, testEnvReady, admin } from '../db/helpers'
import { TEST_PASSWORD, emailLink, logIn, newLearner } from './helpers/auth'
import { waitForHydration } from './hydration'

test.afterAll(deleteTestUsers)

const pages = [
  '/login',
  '/signup',
  '/onboarding',
  '/check-email?email=learner%40gmail.com',
  '/verify?phone=%2B2348035550142',
  '/reset-password',
  '/new-password',
]

for (const path of pages) {
  test(`${path} has no accessibility violations in either theme`, async ({ page }) => {
    for (const scheme of ['dark', 'light'] as const) {
      await page.emulateMedia({ colorScheme: scheme })
      await page.goto(path)
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
      expect(results.violations, `${path} ${scheme}`).toEqual([])
    }
  })
}

test('private pages send visitors to log in, then back', async ({ page }) => {
  await page.goto('/settings')
  await expect(page).toHaveURL(/\/login\?next=%2Fsettings/)
})

test('a bad email is caught before anything is sent', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('not-an-email')
  await page.getByLabel('Password', { exact: true }).fill('anything')
  const submit = page.getByRole('button', { name: 'Log In' })
  await waitForHydration(submit)
  await submit.click()
  await expect(page.getByText('Enter a valid email address')).toBeVisible()
})

test('the password field shows and hides what was typed', async ({ page }) => {
  await page.goto('/login')
  const field = page.getByLabel('Password', { exact: true })
  await field.fill('flexbox-is-fun')
  const show = page.getByRole('button', { name: 'Show password' })
  await waitForHydration(show)
  await show.click()
  await expect(field).toHaveAttribute('type', 'text')
  await page.getByRole('button', { name: 'Hide password' }).click()
  await expect(field).toHaveAttribute('type', 'password')
})

test('phone sign-in says it is coming soon instead of failing quietly', async ({ page }) => {
  await page.goto('/login')
  const phone = page.getByRole('button', { name: 'Phone number' })
  await waitForHydration(phone)
  await phone.click()
  await page.getByLabel('Phone number').fill('803 555 0142')
  await page.getByRole('button', { name: 'Send My Code' }).click()
  await expect(page.getByText('Phone sign-in is coming soon')).toBeVisible()
})

test('onboarding saves the plan that sign-up shows', async ({ page }) => {
  await page.goto('/onboarding')
  const ux = page.getByRole('button', { name: /UI\/UX Product Design/ })
  await waitForHydration(ux)
  await ux.click()
  await page.getByRole('button', { name: '30 min a day' }).click()
  await expect(page.getByText(/UI\/UX Product Design, about 3 hours a week\. Its lessons open soon/)).toBeVisible()
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page).toHaveURL(/\/signup$/)
  const plan = page.getByRole('complementary', { name: 'Your plan' })
  await expect(plan.getByText('UI/UX Product Design')).toBeVisible()
  await expect(plan.getByText('30 min a day')).toBeVisible()
})

test('a wrong password gets a clear message', async ({ page }, testInfo) => {
  test.skip(!testEnvReady, 'needs the dev Supabase project')
  const { email } = await newLearner(`wrong-${testInfo.project.name}`)
  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password', { exact: true }).fill('not-the-password')
  const submit = page.getByRole('button', { name: 'Log In' })
  await waitForHydration(submit)
  await submit.click()
  await expect(page.getByText('That email and password don’t match')).toBeVisible({ timeout: 15_000 })
})

test('log in with a password and land where you were going', async ({ page }, testInfo) => {
  test.skip(!testEnvReady, 'needs the dev Supabase project')
  const { email } = await newLearner(`login-${testInfo.project.name}`)
  await logIn(page, email, '/settings')
})

test('sign up, then confirm from the email link', async ({ page }, testInfo) => {
  test.skip(!testEnvReady, 'needs the dev Supabase project')
  // Resend's test inbox accepts any +label and never bounces, so real sends don't hurt our sender reputation.
  const email = `delivered+e2e-${testInfo.project.name}-${Date.now()}@resend.dev`
  await page.goto('/signup')
  await page.getByLabel('Your name').fill('Test Learner')
  await page.getByLabel('Email', { exact: true }).fill(email)
  await page.getByLabel('Password', { exact: true }).fill(TEST_PASSWORD)
  await expect(page.getByText('Strong', { exact: true })).toBeVisible()
  const create = page.getByRole('button', { name: 'Create My Account' })
  await waitForHydration(create)
  await create.click()
  await expect(page).toHaveURL(/\/check-email\?email=/, { timeout: 15_000 })
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible()

  const { data } = await admin().auth.admin.listUsers({ perPage: 200 })
  const user = data.users.find((u) => u.email === email)
  expect(user?.user_metadata.plan).toEqual({ track: 'fe', time: 't20', level: 'l0' })
  if (user) deleteAfterRun(user.id)

  await page.goto(await emailLink('signup', email))
  await expect(page).toHaveURL(/\/home$/, { timeout: 15_000 })
})

test('reset a forgotten password from the email link', async ({ page }, testInfo) => {
  test.skip(!testEnvReady, 'needs the dev Supabase project')
  const { email } = await newLearner(`reset-${testInfo.project.name}`)
  await page.goto('/reset-password')
  await page.getByLabel('Email').fill(email)
  const send = page.getByRole('button', { name: 'Send Reset Link' })
  await waitForHydration(send)
  await send.click()
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible({ timeout: 15_000 })

  await page.goto(await emailLink('recovery', email))
  await expect(page).toHaveURL(/\/new-password$/, { timeout: 15_000 })
  const fresh = 'a-brand-new-phrase-77'
  await page.getByLabel('New password', { exact: true }).fill(fresh)
  await page.getByLabel('Type it again', { exact: true }).fill(fresh)
  const save = page.getByRole('button', { name: 'Save New Password' })
  await waitForHydration(save)
  await save.click()
  await expect(page.getByRole('heading', { name: 'Password updated' })).toBeVisible({ timeout: 15_000 })

  await page.context().clearCookies()
  await logIn(page, email, '/settings', fresh)
})
