import { connection } from 'next/server'
import { SkipLink } from '@/components/ui/skip-link'

/** Sign-in and onboarding pages. Each page draws its own focused frame (components/auth/auth-frame). */
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  // These routes carry the proxy's per-request nonce CSP. Next.js only adds nonces while rendering
  // per request, so a prerendered page here would have every script blocked (ADR 0008).
  await connection()
  return (
    <>
      <SkipLink />
      {children}
    </>
  )
}
