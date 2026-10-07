import type { Metadata, Route } from 'next'
import Link from 'next/link'
import { Mail, PenLine, RefreshCw, Search } from 'lucide-react'
import { AuthCard, AuthFrame, AuthHeading, AuthMain, HeaderPrompt, inlineLink } from '@/components/auth/auth-frame'
import { ResendConfirmation } from '@/components/auth/resend-button'
import { LinkButton, buttonClasses } from '@/components/ui'
import { FIRST_LESSON } from '@/content/navigation'
import { mailProvider } from '@/lib/auth/mail-provider'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Check Your Email',
  description: 'Confirm your email to finish creating your PractiCode Learn account.',
  path: '/check-email',
  noindex: true,
})

const icon = { 'aria-hidden': true, size: 18, strokeWidth: 1.85, className: 'mt-0.5 shrink-0 text-ink-subtle' } as const

/** PrismCheckEmail: after sign-up, while the confirmation link is on its way. */
export default async function CheckEmailPage({ searchParams }: PageProps<'/check-email'>) {
  const { email: raw } = await searchParams
  const email = typeof raw === 'string' && raw.includes('@') && raw.length <= 254 ? raw : undefined
  const provider = mailProvider(email)

  return (
    <AuthFrame aside={<HeaderPrompt href={FIRST_LESSON as Route} label="Skip for now" />}>
      <AuthMain>
        <AuthCard>
          <AuthHeading icon={<Mail aria-hidden="true" size={24} strokeWidth={1.85} />} title="Check your email">
            We sent a link to {email ? <span className="text-ink">{email}</span> : 'your email'}. Tap it to confirm it’s
            really you.
          </AuthHeading>
          <div className="flex flex-col gap-3">
            {provider && (
              <a href={provider.href} target="_blank" rel="noopener noreferrer" className={buttonClasses({ size: 'form' }, 'w-full')}>
                {provider.label}
              </a>
            )}
            <LinkButton
              href={FIRST_LESSON as Route}
              variant={provider ? 'secondary' : 'primary'}
              size="form"
              className={provider ? 'w-full text-[15px] font-medium' : 'w-full'}
            >
              Start Learning Now
            </LinkButton>
          </div>
          <p className="text-[13px] leading-5 text-ink-subtle">
            You can start the first lesson straight away. Open the link within 30 minutes to save your progress to your account.
          </p>
          <ul className="flex flex-col gap-3 border-t border-divider pt-4 text-sm leading-[22px] text-ink-soft">
            <li className="flex gap-3">
              <Search {...icon} />
              <span>Can’t see it? Look in Spam or Promotions.</span>
            </li>
            {email && (
              <li className="flex gap-3">
                <RefreshCw {...icon} />
                <ResendConfirmation email={email} />
              </li>
            )}
            <li className="flex gap-3">
              <PenLine {...icon} />
              <span>
                Wrong address?{' '}
                <Link href="/signup" className={inlineLink}>
                  Change it
                </Link>
              </span>
            </li>
          </ul>
        </AuthCard>
      </AuthMain>
    </AuthFrame>
  )
}
