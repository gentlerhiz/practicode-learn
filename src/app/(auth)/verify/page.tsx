import type { Metadata, Route } from 'next'
import { Smartphone } from 'lucide-react'
import { AuthCard, AuthFrame, AuthHeading, AuthMain, HeaderPrompt } from '@/components/auth/auth-frame'
import { CodeForm, ResendCode } from '@/components/auth/code-form'
import { LinkButton } from '@/components/ui'
import { safeRedirect } from '@/lib/auth/redirect'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Enter Your Code',
  description: 'Enter the 6-digit code we texted you.',
  path: '/verify',
  noindex: true,
})

const PHONE = /^\+\d{8,15}$/

/** "+2348035550142" → "+234 803 555 0142", as the canvas shows it. */
const pretty = (phone: string) => phone.replace(/^(\+234)(\d{3})(\d{3})(\d+)$/, '$1 $2 $3 $4')

/** PrismCode: the 6-digit code texted for phone sign-in. */
export default async function VerifyPage({ searchParams }: PageProps<'/verify'>) {
  const params = await searchParams
  const phone = typeof params.phone === 'string' && PHONE.test(params.phone) ? params.phone : null
  const next = typeof params.next === 'string' ? safeRedirect(params.next) : undefined
  const back = '/login?method=phone' as Route

  return (
    <AuthFrame aside={<HeaderPrompt text="Wrong number?" href={back} label="Go back" />}>
      <AuthMain>
        <AuthCard>
          {phone ? (
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
              <AuthHeading title="Let’s start again">This page has lost your phone number. Go back and enter it again.</AuthHeading>
              <LinkButton href={back} size="form" className="w-full">
                Back to Log In
              </LinkButton>
            </>
          )}
        </AuthCard>
      </AuthMain>
    </AuthFrame>
  )
}
