import type { Metadata } from 'next'
import { CheckoutView } from '@/components/app/checkout/checkout-view'
import { requireUser } from '@/lib/auth/require-user'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Checkout',
  description: 'Choose your PractiCode Learn Pro plan.',
  path: '/checkout',
  noindex: true,
})

/** PrismCheckout. Pays through Paystack once its secret key is set; until then it explains and takes nothing. */
export default async function CheckoutPage({ searchParams }: PageProps<'/checkout'>) {
  const user = await requireUser()
  const { error } = await searchParams
  if (!process.env.PAYSTACK_SECRET_KEY) return <CheckoutView live={false} />
  return (
    <CheckoutView
      live
      action="/api/billing/checkout"
      error={typeof error === 'string' ? error : undefined}
      isPro={user.isPro}
    />
  )
}
