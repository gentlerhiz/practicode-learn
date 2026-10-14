import { createHmac } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PRICE_KOBO, paymentFor, signedByPaystack, type Transaction } from './paystack'

vi.mock('server-only', () => ({}))

const KEY = `sk_test_${'x'.repeat(40)}`
const learner = '7b0c6a1e-2f53-4c39-9d3b-5f1f0c8a2b11'
const tx = (over: Partial<Transaction> = {}): Transaction => ({
  reference: 'ref-1',
  status: 'success',
  amount: PRICE_KOBO.monthly,
  currency: 'NGN',
  channel: 'card',
  paid_at: '2026-10-14T10:00:00.000Z',
  customer: { customer_code: 'CUS_1' },
  metadata: { learner_id: learner, billing: 'monthly' },
  ...over,
})

describe('paymentFor', () => {
  it('honours a full payment in naira for a learner', () => {
    expect(paymentFor(tx())).toEqual({ learnerId: learner, billing: 'monthly' })
    expect(paymentFor(tx({ metadata: JSON.stringify({ learner_id: learner, billing: 'monthly' }) }))).not.toBeNull()
  })

  it('refuses a payment below the price of the period it claims', () => {
    expect(paymentFor(tx({ metadata: { learner_id: learner, billing: 'yearly' } }))).toBeNull()
    expect(paymentFor(tx({ amount: 100 }))).toBeNull()
  })

  it('refuses failed payments, other currencies and missing learners', () => {
    expect(paymentFor(tx({ status: 'failed' }))).toBeNull()
    expect(paymentFor(tx({ currency: 'USD' }))).toBeNull()
    expect(paymentFor(tx({ metadata: { billing: 'monthly' } }))).toBeNull()
    expect(paymentFor(tx({ metadata: 'not json' }))).toBeNull()
  })
})

describe('signedByPaystack', () => {
  beforeEach(() => vi.stubEnv('PAYSTACK_SECRET_KEY', KEY))
  afterEach(() => vi.unstubAllEnvs())

  it('accepts the HMAC-SHA512 of the body with our secret key, and nothing else', () => {
    const body = '{"event":"charge.success"}'
    const good = createHmac('sha512', KEY).update(body).digest('hex')
    expect(signedByPaystack(body, good)).toBe(true)
    expect(signedByPaystack(`${body} `, good)).toBe(false)
    expect(signedByPaystack(body, 'abc')).toBe(false)
    expect(signedByPaystack(body, null)).toBe(false)
  })
})
