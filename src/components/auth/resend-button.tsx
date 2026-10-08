'use client'

import { Spinner } from '@/components/ui/spinner'
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
          'press inline-flex cursor-pointer items-center gap-1.5 text-sm underline underline-offset-2',
          state.sent ? 'text-success' : state.error ? 'text-error' : 'text-ink-soft hover:text-ink',
        )}
      >
        {pending && <Spinner size={13} />}
        {state.sent ? state.notice : state.error ? state.error : pending ? 'Sending…' : 'Send the email again'}
      </button>
    </form>
  )
}
