import type { Metadata, Route } from 'next'
import { PaidView } from '@/components/app/checkout/payment-states'
import { requirePreviews } from '@/lib/fixtures/gate'

export const metadata: Metadata = { title: 'Payment confirmed preview', robots: { index: false, follow: false } }

/** PrismPaid with the canvas's sample receipt. */
export default function PaidPreview() {
  requirePreviews()
  return (
    <PaidView
      data={{
        firstName: 'Tolu',
        intro: 'Your free trial carries on until 8 October. After that, Pro continues at ₦59,000 a year. We’ll remind you two days before we charge.',
        receipt: [
          ['Plan', 'Pro, yearly'],
          ['First payment', '₦59,000 on 8 October 2026'],
          ['Renews', '8 October 2027'],
          ['Paid with', 'Card ending 2216'],
          ['Receipt', 'Sent to tolu.adebayo@gmail.com'],
        ],
        continueHref: '/fixtures/screens/lesson' as Route,
      }}
    />
  )
}
