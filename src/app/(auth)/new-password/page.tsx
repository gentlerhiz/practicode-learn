import type { Metadata, Route } from 'next'
import { AuthCard, AuthFrame, AuthHeading, AuthMain, HeaderPrompt } from '@/components/auth/auth-frame'
import { NewPasswordForm } from '@/components/auth/new-password-form'
import { LinkButton } from '@/components/ui'
import { pageMetadata } from '@/lib/seo/metadata'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = pageMetadata({
  title: 'Choose a New Password',
  description: 'Choose a new password for your PractiCode Learn account.',
  path: '/new-password',
  noindex: true,
})

/** PrismNewPassword. The reset link signs the learner in, so this page needs a session. */
export default async function NewPasswordPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims
  const email = typeof claims?.email === 'string' ? claims.email : undefined
  const meta = claims?.user_metadata as { full_name?: unknown } | undefined
  const name = typeof meta?.full_name === 'string' ? meta.full_name : undefined

  return (
    <AuthFrame aside={<HeaderPrompt href={'/login' as Route} label="Back to log in" />}>
      <AuthMain>
        <AuthCard>
          {claims?.sub ? (
            <NewPasswordForm email={email} name={name} />
          ) : (
            <>
              <AuthHeading title="This link has expired">
                Reset links work once, for 30 minutes. Ask for a new one and we’ll send it straight away.
              </AuthHeading>
              <LinkButton href={'/reset-password' as Route} size="form" className="w-full">
                Send a New Link
              </LinkButton>
            </>
          )}
        </AuthCard>
      </AuthMain>
    </AuthFrame>
  )
}
