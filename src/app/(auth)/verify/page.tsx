import type { Metadata, Route } from 'next'
import { Mail, Smartphone } from 'lucide-react'
import { AuthCard, AuthFrame, AuthHeading, AuthMain, HeaderPrompt } from '@/components/auth/auth-frame'
import { CodeForm, ResendCode, ResendEmailCode } from '@/components/auth/code-form'
import { LinkButton } from '@/components/ui'
import { mailProvider } from '@/lib/auth/mail-provider'
import { safeRedirect } from '@/lib/auth/redirect'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Enter Your Code',
  description: 'Enter the 6-digit code we sent you.',
  path: '/verify',
  noindex: true,
})

const PHONE = /^\+\d{8,15}$/

/** "+2348035550142" → "+234 803 555 0142", as the canvas shows it. */
const pretty = (phone: string) => phone.replace(/^(\+234)(\d{3})(\d{3})(\d+)$/, '$1 $2 $3 $4')

/**
 * PrismCode: enter the 6-digit code. After sign-up it's the code in the confirmation email (?email=);
 * for phone sign-in, the code we texted (?phone=).
 */
export default async function VerifyPage({ searchParams }: PageProps<'/verify'>) {
  const params = await searchParams
  const email =
    typeof params.email === 'string' && params.email.includes('@') && params.email.length <= 254 ? params.email : null
  const phone = !email && typeof params.phone === 'string' && PHONE.test(params.phone) ? params.phone : null
  const next = typeof params.next === 'string' ? safeRedirect(params.next) : undefined
  const back = (email ? '/signup' : '/login?method=phone') as Route
  const provider = mailProvider(email ?? undefined)

  return (
    <AuthFrame aside={<HeaderPrompt text={email ? 'Wrong email?' : 'Wrong number?'} href={back} label="Go back" />}>
      <AuthMain>
        <AuthCard>
          {email ? (
            <>
              <AuthHeading icon={<Mail aria-hidden="true" size={24} strokeWidth={1.85} />} title="Enter the code we sent">
                We emailed a 6-digit code to <span className="break-words text-ink">{email}</span>.
              </AuthHeading>
              <CodeForm email={email} next={next} />
              <div className="flex flex-col items-center gap-3">
                <ResendEmailCode email={email} />
                {provider && (
                  <a
                    href={provider.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink-soft underline underline-offset-2 hover:text-ink"
                  >
                    {provider.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
                <p className="text-center text-sm leading-[22px] text-ink-muted">
                  The code works for 30 minutes. Can’t see the email? Look in Spam or Promotions.
                </p>
              </div>
            </>
          ) : phone ? (
            <>
              <AuthHeading icon={<Smartphone aria-hidden="true" size={24} strokeWidth={1.85} />} title="Enter the code we sent">
                We texted a 6-digit code to <span className="whitespace-nowrap text-ink">{pretty(phone)}</span>.
              </AuthHeading>
              <CodeForm phone={phone} next={next} />
              <div className="flex flex-col items-center gap-3">
                <ResendCode phone={phone} />
                <p className="text-center text-sm leading-[22px] text-ink-muted">
                  The code works for 10 minutes. We will never call you to ask for it.
                </p>
              </div>
            </>
          ) : (
            <>
              <AuthHeading title="Let’s start again">
                This page has lost your email or phone number. Go back and enter it again.
              </AuthHeading>
              <LinkButton href={'/signup' as Route} size="form" className="w-full">
                Back to Sign Up
              </LinkButton>
            </>
          )}
        </AuthCard>
      </AuthMain>
    </AuthFrame>
  )
}
