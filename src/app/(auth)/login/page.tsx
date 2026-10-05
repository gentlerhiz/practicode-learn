import type { Metadata, Route } from 'next'
import Link from 'next/link'
import { EmailForm } from '@/components/auth/email-form'
import { GoogleButton, OrDivider } from '@/components/auth/google-button'
import { Card, Heading } from '@/components/ui'
import { safeRedirect } from '@/lib/auth/redirect'
import { pageMetadata } from '@/lib/seo/metadata'
import { site } from '@/lib/site'

export const metadata: Metadata = pageMetadata({
  title: 'Log In',
  description: 'Log in to PractiCode Learn with a code we email you.',
  path: '/login',
  noindex: true,
})

const notices: Record<string, string> = {
  google: 'Google sign-in isn’t available right now. Use your email instead.',
  link: 'That sign-in link has expired or was already used. Ask for a new code below.',
}

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { next: rawNext, error } = await searchParams
  const next = typeof rawNext === 'string' ? safeRedirect(rawNext) : undefined
  const notice = typeof error === 'string' ? notices[error] : undefined
  const signupHref = (next ? `/signup?next=${encodeURIComponent(next)}` : '/signup') as Route

  return (
    <div className="flex flex-col gap-6">
      <Card padding="lg" className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Heading level={1} size="lg">
            Welcome back
          </Heading>
          <p className="text-base leading-[26px] text-ink-muted">Pick up right where you left off.</p>
        </div>
        {notice && (
          <p role="status" className="rounded-2xl border border-line bg-sunken p-4 text-sm text-ink-soft">
            {notice}
          </p>
        )}
        <GoogleButton next={next} />
        <OrDivider />
        <EmailForm mode="login" next={next} />
        <p className="text-center text-sm text-ink-muted">
          Trouble logging in?{' '}
          <a href={`mailto:${site.email}`} className="font-semibold text-ink underline underline-offset-2">
            Email us
          </a>
        </p>
      </Card>
      <p className="text-center text-sm text-ink-muted">
        New here?{' '}
        <Link href={signupHref} className="font-semibold text-ink underline underline-offset-2">
          Create an account
        </Link>
      </p>
    </div>
  )
}
