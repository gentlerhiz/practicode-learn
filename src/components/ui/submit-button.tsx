'use client'
import { useFormStatus } from 'react-dom'
import { Button } from './button'
import { Spinner } from './spinner'

/**
 * A form's submit button that shows the spinner by itself while the form is sending, for forms that
 * don't track their own state (Google sign-in, Log Out). `pendingLabel` replaces the text meanwhile.
 */
export function SubmitButton({
  pendingLabel,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'type' | 'pending'> & { pendingLabel?: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" pending={pending} {...props}>
      {pending && pendingLabel ? pendingLabel : children}
    </Button>
  )
}

/** Just the spinner, for a custom-styled submit button inside a form: it turns while the form sends. */
export function FormSpinner({ size = 14 }: { size?: number }) {
  const { pending } = useFormStatus()
  return pending ? <Spinner size={size} /> : null
}
