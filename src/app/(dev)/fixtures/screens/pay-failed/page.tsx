import type { Metadata } from 'next'
import { PayFailedView } from '@/components/app/checkout/payment-states'
import { requirePreviews } from '@/lib/fixtures/gate'

export const metadata: Metadata = { title: 'Payment failed preview', robots: { index: false, follow: false } }

/** PrismPayFailed with the canvas's sample. */
export default function PayFailedPreview() {
  requirePreviews()
  return <PayFailedView trialEnds="8 October" reference="PCL-7Q2K-91" />
}
