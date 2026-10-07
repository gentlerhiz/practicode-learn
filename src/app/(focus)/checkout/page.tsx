import type { Metadata } from 'next'
import { CheckoutView } from '@/components/app/checkout/checkout-view'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Checkout',
  description: 'Choose your PractiCode Learn Pro plan.',
  path: '/checkout',
  noindex: true,
})

/** PrismCheckout. Payments aren't open, so this shows how it will work and takes nothing. */
export default function CheckoutPage() {
  return <CheckoutView live={false} />
}
