'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useActionState, useState } from 'react'
import { Button, Field, Input } from '@/components/ui'
import { Checkbox } from '@/components/ui/checkbox'
import { PasswordInput } from '@/components/ui/password-input'
import { sendPhoneCode, signUp, type AuthFormState } from '@/lib/auth/actions'
import { PASSWORD_MIN } from '@/lib/auth/password'
import { useSavedPlan } from '@/lib/onboarding/use-saved-plan'
import { inlineLink } from './auth-frame'
import { FormMessage, PhoneField, StrengthMeter } from './form-parts'
import { MethodSwitch, type SignInMethod } from './method-switch'

/** PrismSignup's form. The plan from onboarding rides along in a hidden field. */
export function SignupForm({ next }: { next?: string }) {
  const plan = useSavedPlan()
  const [method, setMethod] = useState<SignInMethod>('email')
  const [password, setPassword] = useState('')
  const [state, emailAction, emailPending] = useActionState(signUp, {} as AuthFormState)
  const [phoneState, phoneAction, phonePending] = useActionState(sendPhoneCode, {} as AuthFormState)
  const errors = state.fieldErrors ?? {}
  const describe = (id: 'name' | 'email' | 'password', hint?: boolean) =>
    errors[id] ? `${id}-error` : hint ? `${id}-hint` : undefined
  const pending = method === 'email' ? emailPending : phonePending

  return (
    <>
      <MethodSwitch label="Sign up with" value={method} onChange={setMethod} tall />
      <form action={method === 'email' ? emailAction : phoneAction} noValidate className="flex flex-col gap-4">
        {next && <input type="hidden" name="next" value={next} />}
        <input type="hidden" name="plan" value={JSON.stringify(plan)} />
        <Field id="name" label="Your name" error={errors.name}>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            maxLength={80}
            defaultValue={state.values?.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describe('name')}
          />
        </Field>
        {method === 'email' ? (
          <>
            <Field id="email" label="Email" error={errors.email}>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                spellCheck={false}
                defaultValue={state.values?.email}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={describe('email')}
              />
            </Field>
            <Field
              id="password"
              label="Password"
              error={errors.password}
              hint={`At least ${PASSWORD_MIN} characters. A short phrase is easier to remember than random symbols.`}
            >
              <PasswordInput
                id="password"
                name="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={describe('password', true)}
              />
              <StrengthMeter password={password} />
            </Field>
          </>
        ) : (
          <PhoneField
            hint="We’ll text you a 6-digit code. No password to remember."
            error={phoneState.fieldErrors?.phone}
            defaultValue={phoneState.values?.phone}
            withChevron
          />
        )}
        <Checkbox name="weekly">Send me a short progress email on Sundays. You can turn it off any time.</Checkbox>
        <FormMessage error={method === 'email' ? state.error : phoneState.error} />
        <Button type="submit" size="form" disabled={pending} className="h-[54px] w-full gap-3">
          {pending ? 'Creating Your Account…' : method === 'email' ? 'Create My Account' : 'Send My Code'}
          {!pending && <ArrowRight aria-hidden="true" size={18} strokeWidth={1.85} />}
        </Button>
        <p className="text-[13px] leading-[21px] text-ink-subtle">
          By creating an account you agree to our{' '}
          <Link href={'/legal/terms' as Route} className={inlineLink}>
            Terms
          </Link>{' '}
          and{' '}
          <Link href={'/legal/privacy' as Route} className={inlineLink}>
            Privacy Policy
          </Link>
          . We never sell your data.
        </p>
      </form>
    </>
  )
}
