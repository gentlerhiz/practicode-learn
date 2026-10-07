import type { Metadata, Route } from 'next'
import { AuthCard, AuthFrame, AuthMain, HeaderPrompt } from '@/components/auth/auth-frame'
import { ResetForm } from '@/components/auth/reset-form'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Reset Your Password',
  description: 'Get a link to choose a new PractiCode Learn password.',
  path: '/reset-password',
  noindex: true,
})

/** PrismReset. */
export default async function ResetPasswordPage({ searchParams }: PageProps<'/reset-password'>) {
  const { error } = await searchParams
  return (
    <AuthFrame aside={<HeaderPrompt href={'/login' as Route} label="Back to log in" />}>
      <AuthMain>
        <AuthCard>
          {error === 'link' && (
            <p role="status" className="rounded-2xl border border-line bg-sunken p-4 text-sm leading-[22px] text-ink-soft">
              That reset link has expired or was already used. Ask for a new one below.
            </p>
          )}
          <ResetForm />
        </AuthCard>
      </AuthMain>
    </AuthFrame>
  )
}
