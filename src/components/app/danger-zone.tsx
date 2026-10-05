'use client'
import { useActionState } from 'react'
import { deleteAccount } from '@/app/(app)/settings/actions'
import { Button, Field, Input } from '@/components/ui'

/** Deleting an account is immediate and final, so it asks the learner to type "delete" first. */
export function DangerZone() {
  const [state, action, pending] = useActionState(deleteAccount, undefined)
  return (
    <section
      aria-labelledby="delete-account"
      className="flex flex-col gap-4 rounded-3xl border border-error/50 p-6"
    >
      <h2 id="delete-account" className="font-display text-lg font-bold text-ink">
        Delete your account
      </h2>
      <p className="text-[15px] leading-6 text-ink-soft">
        This deletes your account, your progress and your learning history straight away. It can’t be undone,
        so download your data first if you want a copy.
      </p>
      <form action={action} className="flex flex-col gap-4">
        <Field id="confirm" label="Type delete to confirm" error={state?.error}>
          <Input
            id="confirm"
            name="confirm"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={Boolean(state?.error)}
            aria-describedby={state?.error ? 'confirm-error' : undefined}
          />
        </Field>
        <div>
          <Button type="submit" variant="secondary" disabled={pending} className="border-error text-error">
            {pending ? 'Deleting…' : 'Delete My Account'}
          </Button>
        </div>
      </form>
    </section>
  )
}
