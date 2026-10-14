import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'
import { paymentFor, type Transaction } from './paystack'

/**
 * Gives Pro for a charge Paystack has confirmed. Safe to call twice for the same charge (the checkout
 * callback and the webhook both do): the reference is recorded once, so Pro is extended once.
 * Returns false when the charge isn't one we honour.
 */
export async function recordPayment(tx: Transaction): Promise<boolean> {
  const pays = paymentFor(tx)
  if (!pays) return false
  const { error } = await createAdminClient().rpc('record_payment', {
    p_reference: tx.reference,
    p_learner: pays.learnerId,
    p_billing: pays.billing,
    p_amount: tx.amount,
    p_currency: tx.currency,
    p_channel: tx.channel ?? null,
    p_paid_at: tx.paid_at ?? tx.paidAt ?? new Date().toISOString(),
    p_customer: tx.customer.customer_code ?? null,
  })
  if (error) throw new Error(`Payment ${tx.reference} could not be recorded: ${error.message}`)
  return true
}
