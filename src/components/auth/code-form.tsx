'use client'

import { Spinner } from '@/components/ui/spinner'
import { useActionState, useEffect, useState } from 'react'
import { Button } from '@/components/ui'
import { sendPhoneCode, verifyPhoneCode, type AuthFormState } from '@/lib/auth/actions'
import { cn } from '@/lib/cn'
import { FormMessage } from './form-parts'

const LENGTH = 6
const WAIT = 60

/**
 * PrismCode's six boxes. One real input sits over them (so typing, pasting and the phone's
 * one-time-code suggestion all work); the boxes only show what it holds.
 */
export function CodeForm({ phone, next }: { phone: string; next?: string }) {
  const [state, action, pending] = useActionState(verifyPhoneCode, {} as AuthFormState)
  const [code, setCode] = useState('')
  const [focused, setFocused] = useState(false)
  const error = state.fieldErrors?.code ?? state.error

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="phone" value={phone} />
      {next && <input type="hidden" name="next" value={next} />}
      <div className="relative">
        <div aria-hidden="true" className="flex justify-between gap-2">
          {Array.from({ length: LENGTH }, (_, i) => {
            const current = focused && i === Math.min(code.length, LENGTH - 1)
            return (
              <span
                key={i}
                className={cn(
                  'flex h-16 max-w-14 flex-1 items-center justify-center rounded-2xl border-[1.5px] bg-sunken text-[26px] font-semibold text-ink transition-[border-color,box-shadow] duration-150',
                  current
                    ? 'border-focus shadow-[0_0_0_3px_rgba(77,107,255,0.25)]'
                    : code[i]
                      ? 'border-line-strong'
                      : 'border-line',
                  error && 'border-error',
                )}
              >
                {code[i] ?? ''}
              </span>
            )
          })}
        </div>
        <label htmlFor="code" className="sr-only">
          6-digit code
        </label>
        <input
          id="code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={LENGTH}
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, LENGTH))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'code-error' : undefined}
          className="absolute inset-0 h-full w-full cursor-text opacity-0"
        />
      </div>
      {error && (
        <p id="code-error" role="alert" className="-mt-2 text-[13px] text-error">
          {error}
        </p>
      )}
      <Button type="submit" size="form" pending={pending} className="w-full">
        {pending ? 'Checking…' : 'Verify and Continue'}
      </Button>
    </form>
  )
}

/** "Didn't get it? Resend in 0:42", counting down, then a button that sends a new code. */
export function ResendCode({ phone }: { phone: string }) {
  const [left, setLeft] = useState(WAIT)
  const [state, action, pending] = useActionState(sendPhoneCode, {} as AuthFormState)
  useEffect(() => {
    if (left <= 0) return
    const timer = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [left])
  const waiting = left > 0
  return (
    <form action={action} className="flex flex-col items-center gap-2" onSubmit={() => setLeft(WAIT)}>
      <input type="hidden" name="phone" value={phone.replace(/^\+234/, '')} />
      <button
        type="submit"
        disabled={waiting || pending}
        className="press inline-flex h-10 cursor-pointer items-center gap-2 rounded-full px-4 text-sm text-ink-muted enabled:hover:bg-hover enabled:hover:text-ink disabled:cursor-default"
      >
        {pending && <Spinner size={14} />}
        {pending ? 'Sending a new code…' : waiting ? `Didn’t get it? Resend in ${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}` : 'Didn’t get it? Send a new code'}
      </button>
      <FormMessage error={state.error} />
    </form>
  )
}
