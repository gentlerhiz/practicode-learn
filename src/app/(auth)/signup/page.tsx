import type { Metadata, Route } from 'next'
import Link from 'next/link'
import { EmailForm } from '@/components/auth/email-form'
import { GoogleButton, OrDivider } from '@/components/auth/google-button'
import { Card, Heading } from '@/components/ui'
import { safeRedirect } from '@/lib/auth/redirect'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Create Your Account',
  description: 'Create a free PractiCode Learn account. We email you a code, so there’s no password.',
  path: '/signup',
  noindex: true,
})

const linkClass = 'font-semibold text-ink underline underline-offset-2'

export default async function SignupPage({ searchParams }: PageProps<'/signup'>) {
  const { next: rawNext } = await searchParams
  const next = typeof rawNext === 'string' ? safeRedirect(rawNext) : undefined
  const loginHref = (next ? `/login?next=${encodeURIComponent(next)}` : '/login') as Route

  return (
    <div className="flex flex-col gap-6">
      <Card padding="lg" className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Heading level={1} size="lg">
            Create your free account
          </Heading>
          <p className="text-base leading-[26px] text-ink-muted">
            It takes about a minute. We’ll email you a code, so there’s no password to remember.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <GoogleButton next={next} />
          <p className="text-center text-[13px] text-ink-subtle">
            Continuing with Google means you agree to our{' '}
            <Link href={'/legal/terms' as Route} className={linkClass}>
              Terms
            </Link>{' '}
            and{' '}
            <Link href={'/legal/privacy' as Route} className={linkClass}>
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <OrDivider />
        <EmailForm mode="signup" next={next} />
      </Card>
      <p className="text-center text-sm text-ink-muted">
        Already have an account?{' '}
        <Link href={loginHref} className={linkClass}>
          Log in
        </Link>
      </p>
    </div>
  )
}
