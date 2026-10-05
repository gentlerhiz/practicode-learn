import type { Metadata, Route } from 'next'
import Link from 'next/link'
import { z } from 'zod'
import { CodeForm, ResendForm } from '@/components/auth/code-form'
import { Card, Heading } from '@/components/ui'
import { safeRedirect } from '@/lib/auth/redirect'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Enter Your Code',
  description: 'Enter the 6-digit code we emailed you.',
  path: '/verify',
  noindex: true,
})

const linkClass = 'font-semibold text-ink underline underline-offset-2'

export default async function VerifyPage({ searchParams }: PageProps<'/verify'>) {
  const params = await searchParams
  const email = z.email().safeParse(params.email)
  const next = safeRedirect(typeof params.next === 'string' ? params.next : null)
  const backHref = `/login?next=${encodeURIComponent(next)}` as Route

  if (!email.success) {
    return (
      <Card padding="lg" className="flex flex-col gap-4">
        <Heading level={1} size="lg">
          Let’s start again
        </Heading>
        <p className="text-base leading-[26px] text-ink-muted">
          This page doesn’t know which address to check.{' '}
          <Link href={backHref} className={linkClass}>
            Ask for a new code
          </Link>
          .
        </p>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card padding="lg" className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Heading level={1} size="lg">
            Enter the code we sent
          </Heading>
          <p className="text-base leading-[26px] text-ink-muted">
            We emailed a 6-digit code to <strong className="font-semibold text-ink">{email.data}</strong>. It
            can take a minute to arrive, so check your spam folder too.
          </p>
        </div>
        {params.resent === '1' && (
          <p role="status" className="rounded-2xl border border-line bg-sunken p-4 text-sm text-ink-soft">
            We’ve sent a new code. Use the newest one.
          </p>
        )}
        <CodeForm email={email.data} next={next} />
        <ResendForm email={email.data} next={next} />
      </Card>
      <p className="text-center text-sm text-ink-muted">
        Wrong address?{' '}
        <Link href={backHref} className={linkClass}>
          Go back
        </Link>
      </p>
    </div>
  )
}
