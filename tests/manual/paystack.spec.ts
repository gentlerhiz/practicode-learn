import { createHmac } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { admin, deleteTestUsers } from '../db/helpers'
import { logIn, newLearner } from '../e2e/helpers/auth'

// Paystack checkout against Paystack's test mode. Not part of the CI suite: it needs the Paystack test
// secret key in .env.local and talks to Paystack.
// Run: PW_BASE=http://localhost:3300 npx playwright test tests/manual/paystack.spec.ts --config tests/manual/playwright.config.ts
const SECRET = readFileSync('.env.local', 'utf8').match(/^PAYSTACK_SECRET_KEY=(.*)$/m)![1]!.trim()
if (!SECRET.startsWith('sk_test_')) throw new Error('These tests only run against a Paystack test key.')
const base = process.env.PW_BASE ?? 'http://localhost:3300'

test.afterAll(deleteTestUsers)
test.setTimeout(180_000)

async function paystack(path: string, body?: unknown) {
  const r = await fetch(`https://api.paystack.co${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${SECRET}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  return (await r.json()) as { status: boolean; message: string; data: Record<string, unknown> }
}

const membership = async (id: string) =>
  (await admin().from('memberships').select('*').eq('learner_id', id).maybeSingle()).data

test('checkout sends a learner to Paystack for the plan they chose', async ({ page }) => {
  const learner = await newLearner('pay-redirect')
  await logIn(page, learner.email, '/home')
  await page.goto('/checkout')
  await page.getByRole('radio', { name: /Monthly/ }).click()
  await expect(page.getByText('Due today')).toBeVisible()
  await page.getByRole('button', { name: 'Pay ₦6,500 by Card' }).click()
  await page.waitForURL(/checkout\.paystack\.com/, { timeout: 30_000 })
  await page.screenshot({ path: 'test-results/paystack/hosted.png' })
})

test('a paid charge gives Pro once, from the callback and the webhook alike', async ({ page }) => {
  const learner = await newLearner('pay-charge')
  // A real test-mode charge with Paystack's test card, carrying the metadata our checkout sets.
  const charge = await paystack('/charge', {
    email: learner.email,
    amount: 650000,
    card: { number: '4084084084084081', cvv: '408', expiry_month: '12', expiry_year: '2030' },
    metadata: { learner_id: learner.id, billing: 'monthly', method: 'card' },
  })
  test.skip(!charge.status || charge.data.status !== 'success', `Paystack test charge: ${charge.message} ${String(charge.data?.status)}`)
  const reference = String(charge.data.reference)

  await logIn(page, learner.email, '/home')
  await page.goto(`/checkout/confirmed?reference=${reference}`)
  await expect(page.getByRole('heading', { name: /Pro is yours/ })).toBeVisible({ timeout: 30_000 })
  await page.screenshot({ path: 'test-results/paystack/paid.png' })
  const first = await membership(learner.id)
  expect(first).toMatchObject({ source: 'paystack', billing: 'monthly', status: 'active' })
  const end = new Date(first!.current_period_end!).getTime()
  expect(end).toBeGreaterThan(Date.now() + 27 * 86_400_000)

  // The same charge again, as a signed webhook: Pro isn't extended twice.
  const body = JSON.stringify({ event: 'charge.success', data: { reference } })
  const sign = (b: string) => createHmac('sha512', SECRET).update(b).digest('hex')
  const hook = await fetch(`${base}/api/webhooks/paystack`, { method: 'POST', body, headers: { 'x-paystack-signature': sign(body) } })
  expect(hook.status).toBe(200)
  expect((await membership(learner.id))!.current_period_end).toBe(first!.current_period_end)

  // A forged webhook is refused.
  const forged = await fetch(`${base}/api/webhooks/paystack`, { method: 'POST', body, headers: { 'x-paystack-signature': 'nope' } })
  expect(forged.status).toBe(401)

  // The subscription's code arrives by webhook, and Settings then offers to manage it.
  const sub = JSON.stringify({
    event: 'subscription.create',
    data: { subscription_code: 'SUB_test123', next_payment_date: new Date(end).toISOString(), customer: { customer_code: first!.provider_customer } },
  })
  expect((await fetch(`${base}/api/webhooks/paystack`, { method: 'POST', body: sub, headers: { 'x-paystack-signature': sign(sub) } })).status).toBe(200)
  expect((await membership(learner.id))!.provider_subscription).toBe('SUB_test123')
  await page.goto('/settings#set-plan')
  await expect(page.getByText(/Every module, billed monthly\. Renews on/)).toBeVisible()
  await expect(page.getByRole('link', { name: 'Manage or Cancel' })).toBeVisible()

  // Pro lessons now open.
  await page.goto('/learn/front-end-web-development/elements-tags-and-attributes')
  await expect(page.getByText(/Step 1 of/)).toBeVisible({ timeout: 30_000 })
})

test('an unpaid reference shows that the payment did not go through', async ({ page }) => {
  const learner = await newLearner('pay-abandoned')
  const init = await paystack('/transaction/initialize', {
    email: learner.email,
    amount: 650000,
    metadata: { learner_id: learner.id, billing: 'monthly' },
  })
  await logIn(page, learner.email, '/home')
  await page.goto(`/checkout/confirmed?reference=${String(init.data.reference)}`)
  await expect(page.getByRole('heading', { name: /wasn’t finished|didn’t go through|Checking for your payment/ })).toBeVisible({ timeout: 30_000 })
  expect(await membership(learner.id)).toBeNull()
})
