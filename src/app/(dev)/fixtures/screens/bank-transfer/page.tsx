import type { Metadata } from 'next'
import { BankTransferView } from '@/components/app/checkout/payment-states'
import { requirePreviews } from '@/lib/fixtures/gate'

export const metadata: Metadata = { title: 'Bank transfer preview', robots: { index: false, follow: false } }

/** PrismBankTransfer with the canvas's sample (not a real account). */
export default function BankTransferPreview() {
  requirePreviews()
  return (
    <BankTransferView
      data={{
        amount: '₦59,000',
        account: '9921 4408 17',
        bank: 'Wema Bank',
        name: 'PractiCode Learn / Tolu Adebayo',
        expires: '29:41',
        ussd: '*000*59000*4417#',
        startsNote: 'Your year starts when your free trial ends on 8 October, so paying early doesn’t cost you any days.',
      }}
    />
  )
}
