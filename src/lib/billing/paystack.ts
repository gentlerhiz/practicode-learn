import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { request as httpsRequest } from 'node:https'
import { z } from 'zod'
import { CURRENCIES } from '@/content/pricing'
import { serverEnv } from '@/lib/server-env'

export type Billing = 'monthly' | 'yearly'
export type Method = 'card' | 'bank' | 'ussd'

/** What Pro costs, in kobo. Paystack charges in naira for now. */
export const PRICE_KOBO: Record<Billing, number> = {
  monthly: CURRENCIES.NGN.monthly * 100,
  yearly: CURRENCIES.NGN.yearly * 100,
}

const PLAN_NAME: Record<Billing, string> = {
  monthly: 'PractiCode Learn Pro (monthly)',
  yearly: 'PractiCode Learn Pro (yearly)',
}

const CHANNELS: Record<Method, string[]> = { card: ['card'], bank: ['bank_transfer'], ussd: ['ussd'] }

export class PaystackError extends Error {
  override name = 'PaystackError'
}

/**
 * One HTTPS/1.1 request on its own connection. Payments are rare, and a fresh connection can't inherit a
 * broken one: fetch shares HTTP/2 sessions, and one dropped session made every later call fail.
 */
function request(method: 'GET' | 'POST', path: string, body?: unknown): Promise<{ status: number; text: string }> {
  return new Promise((resolve, reject) => {
    const payload = body === undefined ? undefined : JSON.stringify(body)
    const req = httpsRequest(
      {
        host: 'api.paystack.co',
        path,
        method,
        agent: false,
        timeout: 20_000,
        headers: {
          Authorization: `Bearer ${serverEnv().PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        },
      },
      (res) => {
        let text = ''
        res.setEncoding('utf8')
        res.on('data', (chunk: string) => (text += chunk))
        res.on('end', () => resolve({ status: res.statusCode ?? 0, text }))
        res.on('error', reject)
      },
    )
    req.on('timeout', () => req.destroy(new Error('timed out')))
    req.on('error', reject)
    req.end(payload)
  })
}

async function paystack<T>(path: string, init: { method?: 'GET' | 'POST'; body?: unknown } = {}): Promise<T> {
  const method = init.method ?? 'GET'
  let response: { status: number; text: string }
  try {
    response = await request(method, path, init.body)
  } catch (error) {
    // A dropped connection: reading is safe to repeat once. Creating something isn't, so that fails.
    if (method !== 'GET') throw new PaystackError(`Paystack ${path}: ${(error as Error).message}`)
    try {
      response = await request(method, path, init.body)
    } catch (again) {
      throw new PaystackError(`Paystack ${path}: ${(again as Error).message}`)
    }
  }
  let json: { status?: boolean; message?: string; data?: T } = {}
  try {
    json = JSON.parse(response.text)
  } catch {
    // Reported below with the status code.
  }
  if (response.status >= 400 || !json.status) throw new PaystackError(`Paystack ${path}: ${response.status} ${json.message ?? ''}`)
  return json.data as T
}

const planCodes = new Map<Billing, string>()

/** The Paystack plan for a billing period, found by name, or created the first time it's needed. */
async function planCode(billing: Billing): Promise<string> {
  const known = planCodes.get(billing)
  if (known) return known
  const plans = await paystack<{ name: string; plan_code: string; amount: number; is_deleted?: boolean }[]>('/plan?perPage=100')
  let plan = plans.find((p) => p.name === PLAN_NAME[billing] && p.amount === PRICE_KOBO[billing] && !p.is_deleted)
  plan ??= await paystack<{ name: string; plan_code: string; amount: number }>('/plan', {
    method: 'POST',
    body: {
      name: PLAN_NAME[billing],
      interval: billing === 'yearly' ? 'annually' : 'monthly',
      amount: PRICE_KOBO[billing],
      currency: 'NGN',
      description: 'Every module in every course, the AI tutor with 20 questions a day, and verified certificates.',
    },
  })
  planCodes.set(billing, plan.plan_code)
  return plan.plan_code
}

/**
 * Starts a payment on Paystack's own checkout page and returns its address. A card payment starts a
 * subscription that renews itself; bank transfer and USSD pay for one period, because they can't renew.
 */
export async function startCheckout(o: { email: string; learnerId: string; billing: Billing; method: Method; callbackUrl: string }) {
  const data = await paystack<{ authorization_url: string; reference: string }>('/transaction/initialize', {
    method: 'POST',
    body: {
      email: o.email,
      amount: PRICE_KOBO[o.billing],
      currency: 'NGN',
      channels: CHANNELS[o.method],
      callback_url: o.callbackUrl,
      ...(o.method === 'card' ? { plan: await planCode(o.billing) } : {}),
      metadata: { learner_id: o.learnerId, billing: o.billing, method: o.method },
    },
  })
  return data.authorization_url
}

const Transaction = z.object({
  reference: z.string().min(1),
  status: z.string(),
  amount: z.number(),
  currency: z.string(),
  channel: z.string().nullable().optional(),
  paid_at: z.string().nullable().optional(),
  paidAt: z.string().nullable().optional(),
  gateway_response: z.string().nullable().optional(),
  customer: z.object({ customer_code: z.string().nullable().optional(), email: z.string().nullable().optional() }).passthrough(),
  metadata: z.unknown(),
})
export type Transaction = z.infer<typeof Transaction>

const Meta = z.object({ learner_id: z.string().uuid(), billing: z.enum(['monthly', 'yearly']) })

/** Asks Paystack what really happened to a payment. Never trust the browser's word for it. */
export async function verifyTransaction(reference: string): Promise<Transaction> {
  return Transaction.parse(await paystack(`/transaction/verify/${encodeURIComponent(reference)}`))
}

/**
 * What a successful charge pays for, or null if it isn't ours to honour: the wrong currency, less than
 * the price (anyone with the public key can start a payment with their own metadata), or no learner.
 */
export function paymentFor(tx: Transaction): { learnerId: string; billing: Billing } | null {
  if (tx.status !== 'success' || tx.currency !== 'NGN') return null
  let raw = tx.metadata
  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw)
    } catch {
      return null
    }
  }
  const meta = Meta.safeParse(raw)
  if (!meta.success || tx.amount < PRICE_KOBO[meta.data.billing]) return null
  return { learnerId: meta.data.learner_id, billing: meta.data.billing }
}

/** True when a webhook really came from Paystack: an HMAC-SHA512 of the raw body with our secret key. */
export function signedByPaystack(rawBody: string, signature: string | null): boolean {
  if (!signature) return false
  const expected = Buffer.from(createHmac('sha512', serverEnv().PAYSTACK_SECRET_KEY).update(rawBody).digest('hex'))
  const got = Buffer.from(signature)
  return got.length === expected.length && timingSafeEqual(got, expected)
}

/** A one-time link to Paystack's page where a subscriber updates their card or cancels. */
export async function manageLink(subscriptionCode: string): Promise<string> {
  const data = await paystack<{ link: string }>(`/subscription/${encodeURIComponent(subscriptionCode)}/manage/link`)
  return data.link
}
