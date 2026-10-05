'use client'
import type { Route } from 'next'
import Link from 'next/link'
import { useActionState } from 'react'
import { Button, Field, Input } from '@/components/ui'
import { sendSignInCode, type AuthFormState } from '@/lib/auth/actions'

const linkClass = 'font-semibold text-ink underline underline-offset-2'

/** Email (and, for sign-up, name and terms). The server checks everything; the browser doesn't block. */
export function EmailForm({ mode, next }: { mode: 'login' | 'signup'; next?: string }) {
  const [state, action, pending] = useActionState(sendSignInCode, {} as AuthFormState)
  const errors = state.fieldErrors ?? {}
  const describe = (id: 'name' | 'email' | 'terms') => (errors[id] ? `${id}-error` : undefined)

  return (
    <form action={action} noValidate className="flex flex-col gap-5">
      <input type="hidden" name="mode" value={mode} />
      {next && <input type="hidden" name="next" value={next} />}
      {mode === 'signup' && (
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
      )}
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
      {mode === 'signup' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-3">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              defaultChecked={state.values?.terms}
              className="mt-0.5 size-5 shrink-0 accent-primary"
              aria-invalid={Boolean(errors.terms)}
              aria-describedby={describe('terms')}
            />
            <label htmlFor="terms" className="text-sm leading-6 text-ink-soft">
              I agree to the{' '}
              <Link href={'/legal/terms' as Route} className={linkClass}>
                Terms
              </Link>{' '}
              and{' '}
              <Link href={'/legal/privacy' as Route} className={linkClass}>
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.terms && (
            <p id="terms-error" role="alert" className="text-[13px] text-error">
              {errors.terms}
            </p>
          )}
        </div>
      )}
      {state.error && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? 'Sending…' : 'Send Me a Code'}
      </Button>
    </form>
  )
}
