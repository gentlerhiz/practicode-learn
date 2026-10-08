'use client'

import { Spinner } from '@/components/ui/spinner'
import type { Route } from 'next'
import Link from 'next/link'
import { useActionState, useState } from 'react'
import { Button, Field, Input } from '@/components/ui'
import { Checkbox } from '@/components/ui/checkbox'
import { PasswordInput } from '@/components/ui/password-input'
import { logIn, resendConfirmation, sendPhoneCode, type AuthFormState } from '@/lib/auth/actions'
import { FormMessage, PhoneField } from './form-parts'
import { MethodSwitch, type SignInMethod } from './method-switch'

/** PrismLogin's form: email and password, or a phone number, then "Keep me logged in". */
export function LoginForm({ next, initialMethod = 'email' }: { next?: string; initialMethod?: SignInMethod }) {
  const [method, setMethod] = useState<SignInMethod>(initialMethod)
  const [state, emailAction, emailPending] = useActionState(logIn, {} as AuthFormState)
  const [phoneState, phoneAction, phonePending] = useActionState(sendPhoneCode, {} as AuthFormState)
  const [resent, resendAction, resending] = useActionState(resendConfirmation, {} as AuthFormState)
  const errors = state.fieldErrors ?? {}
  const describe = (id: 'email' | 'password') => (errors[id] ? `${id}-error` : undefined)

  return (
    <>
      <MethodSwitch label="Log in with" value={method} onChange={setMethod} />
      {method === 'email' ? (
        <form action={emailAction} noValidate className="flex flex-col gap-5">
          {next && <input type="hidden" name="next" value={next} />}
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
            aside={
              <Link
                href={'/reset-password' as Route}
                className="text-[13px] text-fe-text underline underline-offset-2 hover:text-ink"
              >
                Forgot password?
              </Link>
            }
          >
            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={describe('password')}
            />
          </Field>
          <Checkbox name="keep" defaultChecked>
            Keep me logged in on this device
          </Checkbox>
          <FormMessage error={state.error} />
          {state.unconfirmed && (
            <div className="flex flex-col gap-2">
              <input type="hidden" name="then" value="verify" />
              <button
                type="submit"
                formAction={resendAction}
                disabled={resending}
                className="press inline-flex cursor-pointer items-center gap-1.5 self-start text-sm text-ink-soft underline underline-offset-2 hover:text-ink"
              >
                {resending && <Spinner size={13} />}
                {resending ? 'Sending…' : 'Send me a new code to confirm it'}
              </button>
              <FormMessage error={resent.error} notice={resent.notice} />
            </div>
          )}
          <Button type="submit" size="form" pending={emailPending} className="w-full">
            {emailPending ? 'Logging In…' : 'Log In'}
          </Button>
        </form>
      ) : (
        <form action={phoneAction} noValidate className="flex flex-col gap-5">
          <PhoneField
            hint="We will text you a 6-digit code."
            error={phoneState.fieldErrors?.phone}
            defaultValue={phoneState.values?.phone}
          />
          <Checkbox name="keep" defaultChecked>
            Keep me logged in on this device
          </Checkbox>
          <FormMessage error={phoneState.error} />
          <Button type="submit" size="form" pending={phonePending} className="w-full">
            {phonePending ? 'Sending…' : 'Send My Code'}
          </Button>
        </form>
      )}
    </>
  )
}
