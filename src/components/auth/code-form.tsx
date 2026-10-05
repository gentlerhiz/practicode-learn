'use client'
import { useActionState } from 'react'
import { Button, Field, Input } from '@/components/ui'
import { sendSignInCode, verifySignInCode, type AuthFormState } from '@/lib/auth/actions'

/** The 6-digit code. Phones offer it from the email or SMS bar thanks to one-time-code. */
export function CodeForm({ email, next }: { email: string; next: string }) {
  const [state, action, pending] = useActionState(verifySignInCode, {} as AuthFormState)
  const error = state.fieldErrors?.code

  return (
    <form action={action} noValidate className="flex flex-col gap-5">
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="next" value={next} />
      <Field
        id="code"
        label="6-digit code"
        hint="The code works for 15 minutes. We’ll never ask you for it."
        error={error}
      >
        <Input
          id="code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={10}
          className="h-14 text-center font-mono text-2xl tracking-[0.4em]"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'code-error' : 'code-hint'}
        />
      </Field>
      {state.error && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? 'Checking…' : 'Verify and Continue'}
      </Button>
    </form>
  )
}

/** Asks for a fresh code for the same address. */
export function ResendForm({ email, next }: { email: string; next: string }) {
  const [state, action, pending] = useActionState(sendSignInCode, {} as AuthFormState)
  return (
    <form action={action} className="flex flex-col items-center gap-2">
      <input type="hidden" name="mode" value="login" />
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="next" value={next} />
      <input type="hidden" name="resend" value="1" />
      <Button type="submit" variant="ghost" disabled={pending}>
        {pending ? 'Sending…' : 'Send a New Code'}
      </Button>
      {state.error && (
        <p role="alert" className="text-center text-sm text-error">
          {state.error}
        </p>
      )}
    </form>
  )
}
