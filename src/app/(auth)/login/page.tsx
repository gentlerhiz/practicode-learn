import type { Metadata, Route } from 'next'
import { AuthCard, AuthFrame, AuthHeading, AuthMain, HeaderPrompt, OrDivider, inlineLink } from '@/components/auth/auth-frame'
import { GoogleButton } from '@/components/auth/google-button'
import { LoginForm } from '@/components/auth/login-form'
import { safeRedirect } from '@/lib/auth/redirect'
import { pageMetadata } from '@/lib/seo/metadata'
import { site } from '@/lib/site'

export const metadata: Metadata = pageMetadata({
  title: 'Log In',
  description: 'Log in to PractiCode Learn.',
  path: '/login',
  noindex: true,
})

const notices: Record<string, string> = {
  google: 'Google sign-in isn’t available right now. Use your email instead.',
  link: 'That link has expired or was already used. Log in below, or ask for a new link.',
}

/** PrismLogin. */
export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { next: rawNext, error, method } = await searchParams
  const next = typeof rawNext === 'string' ? safeRedirect(rawNext) : undefined
  const notice = typeof error === 'string' ? notices[error] : undefined
  const signupHref = (next ? `/signup?next=${encodeURIComponent(next)}` : '/signup') as Route

  return (
    <AuthFrame aside={<HeaderPrompt text="New here?" href={signupHref} label="Create an account" />}>
      <AuthMain>
        <AuthCard>
          <AuthHeading title="Welcome back">Pick up right where you left off.</AuthHeading>
          {notice && (
            <p role="status" className="rounded-2xl border border-line bg-sunken p-4 text-sm leading-[22px] text-ink-soft">
              {notice}
            </p>
          )}
          <GoogleButton next={next} />
          <OrDivider label="or log in with" />
          <LoginForm next={next} initialMethod={method === 'phone' ? 'phone' : 'email'} />
          <p className="text-center text-sm leading-[22px] text-ink-muted">
            Trouble logging in?{' '}
            <a href={`mailto:${site.email}`} className={inlineLink}>
              Email us
            </a>{' '}
            and a person will help.
          </p>
        </AuthCard>
      </AuthMain>
    </AuthFrame>
  )
}
