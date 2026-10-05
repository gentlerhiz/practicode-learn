'use client'
import { useActionState } from 'react'
import { Button, Field, Input } from '@/components/ui'
import { renameLearner } from './actions'

export function NameForm({ name }: { name: string | null }) {
  const [state, action, pending] = useActionState(renameLearner, undefined)
  return (
    <form action={action} className="flex flex-col gap-3">
      <Field id="name" label="Name" hint="This is how we greet you." error={state?.error}>
        <Input
          id="name"
          name="name"
          defaultValue={name ?? ''}
          maxLength={80}
          autoComplete="name"
          aria-invalid={Boolean(state?.error)}
          aria-describedby={state?.error ? 'name-error' : 'name-hint'}
        />
      </Field>
      <div className="flex items-center gap-3">
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? 'Saving…' : 'Save Name'}
        </Button>
        {state?.saved && (
          <p role="status" className="text-sm text-success">
            Saved.
          </p>
        )}
      </div>
    </form>
  )
}
