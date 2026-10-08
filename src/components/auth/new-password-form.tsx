'use client'

import type { Route } from 'next'
import { Check, X } from 'lucide-react'
import { useActionState, useState } from 'react'
import { Button, Field, LinkButton } from '@/components/ui'
import { PasswordInput } from '@/components/ui/password-input'
import { setNewPassword, type AuthFormState } from '@/lib/auth/actions'
import { passwordProblems } from '@/lib/auth/password'
import { cn } from '@/lib/cn'
import { AuthHeading } from './auth-frame'
import { FormMessage, StrengthMeter } from './form-parts'

/** PrismNewPassword: choose it, type it again, watch the three rules tick, then "Password updated". */
export function NewPasswordForm({ email, name }: { email?: string; name?: string }) {
  const [state, action, pending] = useActionState(setNewPassword, {} as AuthFormState)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const errors = state.fieldErrors ?? {}

  if (state.done) {
    return (
      <>
        <AuthHeading icon={<Check aria-hidden="true" size={24} strokeWidth={1.85} />} iconTone="success" title="Password updated">
          You’re logged in on this device. We logged you out everywhere else, just to be safe.
        </AuthHeading>
        <LinkButton href={'/home' as Route} size="form" className="w-full">
          Go to My Dashboard
        </LinkButton>
      </>
    )
  }

  const problems = passwordProblems(password, { email, name })
  const rules = [
    { label: 'At least 8 characters', ok: password.length > 0 && !problems.includes('short') },
    { label: 'Both passwords match', ok: confirm.length > 0 && confirm === password },
    { label: 'Not your name or email', ok: password.length > 0 && !problems.includes('personal') },
  ]

  return (
    <>
      <AuthHeading title="Choose a new password">Make it something you haven’t used here before.</AuthHeading>
      <form action={action} noValidate className="flex flex-col gap-5">
        <Field id="password" label="New password" error={errors.password}>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
        </Field>
        <StrengthMeter password={password} />
        <Field id="confirm" label="Type it again" error={errors.confirm}>
          <PasswordInput
            id="confirm"
            name="confirm"
            autoComplete="new-password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            aria-invalid={Boolean(errors.confirm)}
            aria-describedby={errors.confirm ? 'confirm-error' : undefined}
          />
        </Field>
        <ul className="flex flex-col gap-2 text-[13px] text-ink-muted">
          {rules.map((rule) => (
            <li key={rule.label} className="flex gap-2">
              {rule.ok ? (
                <Check aria-hidden="true" size={16} strokeWidth={2.2} className="shrink-0 text-success" />
              ) : (
                <X aria-hidden="true" size={16} strokeWidth={2.2} className="shrink-0 text-ink-subtle" />
              )}
              <span className={cn(rule.ok && 'text-ink-soft')}>
                {rule.label}
                <span className="sr-only">{rule.ok ? ': done' : ': not yet'}</span>
              </span>
            </li>
          ))}
        </ul>
        <FormMessage error={state.error} />
        <Button type="submit" size="form" pending={pending} className="w-full">
          {pending ? 'Saving…' : 'Save New Password'}
        </Button>
      </form>
    </>
  )
}
