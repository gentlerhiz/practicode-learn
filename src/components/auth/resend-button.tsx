'use client'

import { useActionState } from 'react'
import { resendConfirmation, type AuthFormState } from '@/lib/auth/actions'
import { cn } from '@/lib/cn'

/** "Send the email again", which turns green once it's sent. */
export function ResendConfirmation({ email }: { email: string }) {
  const [state, action, pending] = useActionState(resendConfirmation, {} as AuthFormState)
  return (
    <form action={action} className="inline">
      <input type="hidden" name="email" value={email} />
      <button
        type="submit"
        disabled={pending}
        className={cn(
          'press cursor-pointer text-sm underline underline-offset-2',
          state.sent ? 'text-success' : state.error ? 'text-error' : 'text-ink-soft hover:text-ink',
        )}
      >
        {state.sent ? state.notice : state.error ? state.error : pending ? 'Sending…' : 'Send the email again'}
      </button>
    </form>
  )
}
