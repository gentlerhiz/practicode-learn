import { expect, type Page } from '@playwright/test'
import { admin, deleteAfterRun } from '../../db/helpers'
import { waitForHydration } from '../hydration'

export const TEST_PASSWORD = 'jollof-and-flexbox-42'

/** A confirmed test account with a password, deleted after the run. Nothing is emailed. */
export async function newLearner(label: string, name = 'Test Learner') {
  const email = `${label}-${Date.now()}@test.practicode.tech`
  const { data, error } = await admin().auth.admin.createUser({
    email,
    password: TEST_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: name },
  })
  if (error) throw error
  deleteAfterRun(data.user.id)
  return { email, id: data.user.id }
}

/** Logs in through the real form and waits to land on `next`. */
export async function logIn(page: Page, email: string, next: string, password = TEST_PASSWORD) {
  await page.goto(`/login?next=${encodeURIComponent(next)}`)
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password', { exact: true }).fill(password)
  const submit = page.getByRole('button', { name: 'Log In' })
  await waitForHydration(submit)
  await submit.click()
  // Two Supabase round trips (sign in, read the profile) before the page renders.
  await expect(page).toHaveURL(new RegExp(`${next.replace(/[/?]/g, '\\$&')}$`), { timeout: 15_000 })
}

/** The link Supabase would email for a sign-up or a reset, made without sending anything. */
/** The 6-digit code a sign-up confirmation email carries, made the way Supabase makes it for the email. */
export async function emailCode(email: string, password?: string) {
  const { data, error } = await admin().auth.admin.generateLink({ type: 'signup', email, password: password ?? TEST_PASSWORD })
  if (error) throw error
  return data.properties.email_otp
}

export async function emailLink(type: 'signup' | 'recovery', email: string, password?: string) {
  const { data, error } =
    type === 'signup'
      ? await admin().auth.admin.generateLink({ type, email, password: password ?? TEST_PASSWORD })
      : await admin().auth.admin.generateLink({ type, email })
  if (error) throw error
  return `/auth/confirm?token_hash=${data.properties.hashed_token}&type=${type}`
}
