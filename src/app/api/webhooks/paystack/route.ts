import { z } from 'zod'
import { signedByPaystack, verifyTransaction } from '@/lib/billing/paystack'
import { recordPayment } from '@/lib/billing/record'
import { createAdminClient } from '@/lib/supabase/admin'

const Event = z.object({ event: z.string(), data: z.record(z.string(), z.unknown()) })
const Subscription = z.object({
  subscription_code: z.string(),
  next_payment_date: z.string().nullable().optional(),
  customer: z.object({ customer_code: z.string() }).passthrough(),
})

/** Paystack subscription states, as memberships store them. */
const STATUS: Record<string, string> = {
  'subscription.create': 'active',
  'subscription.enable': 'active',
  'subscription.not_renew': 'non_renewing',
  'subscription.disable': 'cancelled',
  'subscription.expiring_cards': 'attention',
  'invoice.payment_failed': 'attention',
}

/** Where academy charges go: practicode.tech checks the same signature with the same secret key. */
const ACADEMY_WEBHOOK = 'https://practicode.tech/api/paystack/webhook'

/** Academy enrolments tag their charges with metadata.source 'academy' (Paystack may send metadata as a JSON string). */
function isAcademyCharge(data: Record<string, unknown>): boolean {
  let meta = data.metadata
  if (typeof meta === 'string') {
    try {
      meta = JSON.parse(meta)
    } catch {
      return false
    }
  }
  return typeof meta === 'object' && meta !== null && (meta as Record<string, unknown>).source === 'academy'
}

/** Passes the event on unchanged and answers with the academy's status, so Paystack retries if it failed. */
async function forwardToAcademy(raw: string, signature: string): Promise<Response> {
  try {
    const res = await fetch(ACADEMY_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-paystack-signature': signature },
      body: raw,
      signal: AbortSignal.timeout(20_000),
    })
    return new Response(res.ok ? 'ok' : 'Academy failed', { status: res.ok ? 200 : 502 })
  } catch (error) {
    console.error('Forwarding an academy charge failed', error)
    return new Response('Try again', { status: 502 })
  }
}

/**
 * Paystack's webhook (set in the Paystack dashboard: Settings, API Keys & Webhooks). Every event is
 * checked against our secret key. Charges are verified with Paystack again before they give Pro.
 * Answers 200 to anything it doesn't need, so Paystack stops retrying.
 */
export async function POST(request: Request) {
  const raw = await request.text()
  if (!signedByPaystack(raw, request.headers.get('x-paystack-signature'))) {
    return new Response('Bad signature', { status: 401 })
  }
  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return new Response('ok')
  }
  const parsed = Event.safeParse(body)
  if (!parsed.success) return new Response('ok')
  const { event, data } = parsed.data

  // PractiCode Academy shares this Paystack account, and Paystack allows one webhook per account.
  if (isAcademyCharge(data)) return forwardToAcademy(raw, request.headers.get('x-paystack-signature')!)

  try {
    if (event === 'charge.success' && typeof data.reference === 'string') {
      await recordPayment(await verifyTransaction(data.reference))
    } else if (event in STATUS) {
      // Subscription events carry the subscription itself; invoice events nest it, with the customer beside it.
      const nested = data.subscription && typeof data.subscription === 'object' ? data.subscription : null
      const sub = Subscription.safeParse(nested ? { customer: data.customer, ...nested } : data)
      if (sub.success) {
        const update: { status: string; provider_subscription?: string; current_period_end?: string; updated_at: string } = {
          status: STATUS[event]!,
          updated_at: new Date().toISOString(),
        }
        if (event === 'subscription.create' || event === 'subscription.enable') {
          update.provider_subscription = sub.data.subscription_code
          if (sub.data.next_payment_date) update.current_period_end = sub.data.next_payment_date
        }
        const { data: rows, error } = await createAdminClient()
          .from('memberships')
          .update(update)
          .eq('provider_customer', sub.data.customer.customer_code)
          .select('learner_id')
        if (error) throw new Error(error.message)
        // The subscription can arrive before its first charge is recorded: ask Paystack to send it again.
        if (event === 'subscription.create' && !rows?.length) throw new Error('No membership for this customer yet')
      }
    }
  } catch (error) {
    // A 500 makes Paystack try again later.
    console.error(`Paystack ${event} failed`, error)
    return new Response('Try again', { status: 500 })
  }
  return new Response('ok')
}
