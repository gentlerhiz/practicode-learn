import type { Metadata, Route } from 'next'
import { AuthFrame, HeaderPrompt, OrDivider } from '@/components/auth/auth-frame'
import { GoogleButton } from '@/components/auth/google-button'
import { PlanCard } from '@/components/auth/plan-card'
import { SignupForm } from '@/components/auth/signup-form'
import { safeRedirect } from '@/lib/auth/redirect'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Create Your Free Account',
  description: 'Create a free PractiCode Learn account and save your progress on every device.',
  path: '/signup',
  noindex: true,
})

/** PrismSignup: the form on the left, the learner's plan on the right. */
export default async function SignupPage({ searchParams }: PageProps<'/signup'>) {
  const { next: rawNext } = await searchParams
  const next = typeof rawNext === 'string' ? safeRedirect(rawNext) : undefined
  const loginHref = (next ? `/login?next=${encodeURIComponent(next)}` : '/login') as Route

  return (
    <AuthFrame glow="right" aside={<HeaderPrompt text="Already have an account?" href={loginHref} label="Log in" />}>
      <main
        id="main"
        className="relative mx-auto box-border grid max-w-[1200px] grid-cols-1 items-start gap-8 px-4 pt-8 pb-12 ph:px-6 ph:pt-14 ph:pb-20 tab:grid-cols-[minmax(0,1fr)_minmax(0,480px)] tab:gap-20"
      >
        <section aria-labelledby="signup-title" className="flex max-w-[520px] flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-fe-text">Last step · save your plan</p>
            <h1
              id="signup-title"
              className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.035em] text-ink ph:text-[46px] ph:leading-[50px]"
            >
              Create your free account
            </h1>
            <p className="text-[17px] leading-7 text-ink-muted">
              It takes about a minute. Your plan is saved, and your first lesson is ready when you are.
            </p>
          </div>
          <GoogleButton next={next} />
          <OrDivider label="or sign up with" />
          <SignupForm next={next} />
        </section>
        <PlanCard />
      </main>
    </AuthFrame>
  )
}
