import type { Metadata, Route } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { PaidView, PayFailedView, PayFrame } from '@/components/app/checkout/payment-states'
import { buttonClasses } from '@/components/ui/button'
import { requireUser } from '@/lib/auth/require-user'
import { paymentFor, verifyTransaction, type Transaction } from '@/lib/billing/paystack'
import { recordPayment } from '@/lib/billing/record'
import { createClient } from '@/lib/supabase/server'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Payment',
  description: 'Your PractiCode Learn Pro payment.',
  path: '/checkout/confirmed',
  noindex: true,
})

const STILL_GOING = new Set(['ongoing', 'pending', 'processing', 'queued'])
const CHANNEL: Record<string, string> = { card: 'Card', bank_transfer: 'Bank transfer', ussd: 'USSD', bank: 'Bank' }
const day = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Lagos' })
const naira = (kobo: number) => `₦${(kobo / 100).toLocaleString('en-US')}`

/**
 * Paystack sends the learner back here with the payment's reference. We ask Paystack what happened, give
 * Pro if it was paid (the webhook does too; whichever is first counts), and show the receipt.
 */
export default async function PaymentResultPage({ searchParams }: PageProps<'/checkout/confirmed'>) {
  const user = await requireUser()
  const params = await searchParams
  const reference = [params.reference, params.trxref].flat().find((v): v is string => typeof v === 'string' && v.length > 0)
  if (!reference || reference.length > 100) redirect('/checkout' as Route)

  let tx: Transaction | null = null
  try {
    tx = await verifyTransaction(reference)
  } catch (error) {
    console.error(`Payment ${reference} could not be verified`, error)
  }
  const pays = tx && paymentFor(tx)
  if (tx && pays && pays.learnerId !== user.id) redirect('/checkout' as Route)

  if (!tx || STILL_GOING.has(tx.status)) {
    return (
      <PayFrame glow="rgba(123,92,255,0.26)" aside={null}>
        <div className="flex flex-col items-center gap-6 pt-8 text-center">
          <span aria-hidden="true" className="block size-14 rounded-full border-4 border-line border-t-[#7b5cff] motion-safe:animate-spin" />
          <div className="flex flex-col gap-3">
            <h1 className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.035em] text-ink">Checking for your payment</h1>
            <p className="text-[15px] leading-6 text-ink-muted">
              Transfers usually confirm within a few minutes. You can close this page: Pro switches on by itself once the payment lands.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={`/checkout/confirmed?reference=${encodeURIComponent(reference)}` as Route} className={buttonClasses({}, 'h-12 px-6')}>
              Check Again
            </Link>
            <Link href={'/home' as Route} className={buttonClasses({ variant: 'secondary' }, 'h-12 bg-transparent px-6 font-medium')}>
              Back to My Dashboard
            </Link>
          </div>
          <p className="text-xs text-ink-subtle">Reference: {reference}</p>
        </div>
      </PayFrame>
    )
  }

  if (!pays) {
    return (
      <PayFailedView
        reference={reference}
        title={tx.status === 'abandoned' ? 'The payment wasn’t finished' : 'The payment didn’t go through'}
        retryHref={'/checkout' as Route}
        otherHref={'/checkout' as Route}
      />
    )
  }

  await recordPayment(tx)
  const supabase = await createClient()
  const { data: membership } = await supabase
    .from('memberships')
    .select('current_period_end')
    .eq('learner_id', user.id)
    .maybeSingle()
  const until = membership?.current_period_end ? day(membership.current_period_end) : null
  const renews = tx.channel === 'card'
  const firstName = user.name?.split(' ')[0] ?? 'there'

  return (
    <PaidView
      data={{
        firstName,
        intro: renews
          ? `Your payment went through. Pro renews by itself ${pays.billing === 'yearly' ? 'each year' : 'each month'}, and you can cancel any time in Settings.`
          : `Your payment went through. Pro is on${until ? ` until ${until}` : ''}. Bank transfer and USSD don’t renew by themselves, so pay again before then to keep it.`,
        receipt: [
          ['Plan', `Pro, ${pays.billing}`],
          ['Amount', naira(tx.amount)],
          ['Paid with', CHANNEL[tx.channel ?? ''] ?? 'Paystack'],
          ['Date', day(tx.paid_at ?? tx.paidAt ?? new Date().toISOString())],
          [renews ? 'Next payment' : 'Pro until', until ?? 'Updating…'],
          ['Reference', tx.reference],
        ],
        continueHref: '/my-courses' as Route,
        homeHref: '/home' as Route,
      }}
    />
  )
}
