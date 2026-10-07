'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { useActionState } from 'react'
import { Button, Field, Input, LinkButton } from '@/components/ui'
import { sendPasswordReset, type AuthFormState } from '@/lib/auth/actions'
import { mailProvider } from '@/lib/auth/mail-provider'
import { buttonClasses } from '@/components/ui/button'
import { AuthHeading, inlineLink } from './auth-frame'
import { FormMessage } from './form-parts'

/** PrismReset: ask for a link, then "Check your email". */
export function ResetForm() {
  const [state, action, pending] = useActionState(sendPasswordReset, {} as AuthFormState)
  const email = state.values?.email

  if (state.sent && email) {
    const provider = mailProvider(email)
    return (
      <>
        <AuthHeading icon={<Mail aria-hidden="true" size={24} strokeWidth={1.85} />} title="Check your email">
          If <span className="text-ink">{email}</span> has an account, a reset link is on its way. It works for 30 minutes.
        </AuthHeading>
        {provider && (
          <a href={provider.href} target="_blank" rel="noopener noreferrer" className={buttonClasses({ size: 'form' }, 'w-full')}>
            {provider.label}
          </a>
        )}
        <LinkButton
          href={'/login' as Route}
          variant={provider ? 'secondary' : 'primary'}
          size="form"
          className={provider ? 'w-full text-[15px] font-medium' : 'w-full'}
        >
          Back to Log In
        </LinkButton>
        <form action={action} className="text-center text-sm leading-[22px] text-ink-muted">
          <input type="hidden" name="email" value={email} />
          Nothing yet? Check Spam, or{' '}
          <button type="submit" disabled={pending} className={`press cursor-pointer ${inlineLink}`}>
            send it again
          </button>
          .
        </form>
      </>
    )
  }

  return (
    <>
      <AuthHeading title="Reset your password">
        Enter the email you signed up with and we’ll send you a link to choose a new one.
      </AuthHeading>
      <form action={action} noValidate className="flex flex-col gap-6">
        <Field id="email" label="Email" error={state.fieldErrors?.email}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            spellCheck={false}
            defaultValue={email}
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={state.fieldErrors?.email ? 'email-error' : undefined}
          />
        </Field>
        <FormMessage error={state.error} />
        <Button type="submit" size="form" disabled={pending} className="w-full">
          {pending ? 'Sending…' : 'Send Reset Link'}
        </Button>
      </form>
      <p className="text-center text-sm leading-[22px] text-ink-muted">
        Signed up with your phone?{' '}
        <Link href={'/login?method=phone' as Route} className={inlineLink}>
          Log in with a code instead
        </Link>
      </p>
    </>
  )
}
