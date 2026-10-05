import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { generateOtp, testEnvReady } from '../db/helpers'
import { waitForHydration } from './hydration'

for (const path of ['/login', '/signup', '/verify?email=learner%40example.com&next=%2Fhome']) {
  test(`${path} has no accessibility violations in either theme`, async ({ page }) => {
    for (const scheme of ['dark', 'light'] as const) {
      await page.emulateMedia({ colorScheme: scheme })
      await page.goto(path)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
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
  await page.getByRole('button', { name: 'Send Me a Code' }).click()
  await expect(page.getByText('Enter a valid email address')).toBeVisible()
})

test('sign in with a code and land where you were going', async ({ page }, testInfo) => {
  test.skip(!testEnvReady, 'needs the dev Supabase project')
  // Resend's test inbox accepts any +label and never bounces, so real sends don't hurt our sender reputation.
  const email = `delivered+e2e-${testInfo.project.name}-${Date.now()}@resend.dev`
  await page.goto('/signup?next=%2Fsettings')
  await page.getByLabel('Your name').fill('Test Learner')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel(/I agree/).check()
  const send = page.getByRole('button', { name: 'Send Me a Code' })
  await waitForHydration(send)
  await send.click()
  await expect(page).toHaveURL(/\/verify/, { timeout: 15_000 })
  await page.getByLabel('6-digit code').fill(await generateOtp(email))
  const verify = page.getByRole('button', { name: 'Continue' })
  await waitForHydration(verify)
  await verify.click()
  // Two Supabase round trips (check the code, read the profile) before Settings renders.
  await expect(page).toHaveURL(/\/settings$/, { timeout: 15_000 })
})
