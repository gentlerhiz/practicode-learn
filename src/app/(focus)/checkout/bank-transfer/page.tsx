import type { Route } from 'next'
import { redirect } from 'next/navigation'

/** Payment steps exist once payments do. Until then, checkout explains. */
export default function PaymentStepPage() {
  redirect('/checkout' as Route)
}
