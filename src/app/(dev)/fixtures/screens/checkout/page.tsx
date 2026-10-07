import type { Metadata } from 'next'
import { CheckoutView } from '@/components/app/checkout/checkout-view'
import { requirePreviews } from '@/lib/fixtures/gate'

export const metadata: Metadata = { title: 'Checkout preview', robots: { index: false, follow: false } }

/** PrismCheckout as it will be once payments open (preview only: nothing here can be paid). */
export default function CheckoutPreview() {
  requirePreviews()
  return <CheckoutView live trial={{ ends: '8 October', daysLeft: 5 }} />
}
