'use client'
import { useSearchParams } from 'next/navigation'

/** After an account is deleted, the landing page says so (/?account=deleted). Keeps the page static. */
export function AccountDeletedNotice() {
  const params = useSearchParams()
  if (params.get('account') !== 'deleted') return null
  return (
    <p
      role="status"
      className="mx-auto mt-4 max-w-3xl rounded-2xl border border-line bg-row px-4 py-3 text-[15px] text-ink"
    >
      Your account and data have been deleted.
    </p>
  )
}
