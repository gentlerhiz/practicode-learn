import { connection } from 'next/server'
import { Logo } from '@/components/layout/logo'
import { SkipLink } from '@/components/ui/skip-link'

/** Sign-in pages: a calm, centred card with only the logo above it. */
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  // These routes carry the proxy's per-request nonce CSP. Next.js only adds nonces while rendering
  // per request, so a prerendered page here would have every script blocked (ADR 0008).
  await connection()
  return (
    <>
      <SkipLink />
      <div className="mx-auto flex min-h-dvh w-full max-w-[488px] flex-col gap-8 px-4 pt-12 pb-20 ph:pt-16">
        <Logo className="self-center" />
        <main id="main">{children}</main>
      </div>
    </>
  )
}
