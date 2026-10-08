import { SubmitButton } from '@/components/ui/submit-button'
import { signInWithGoogle } from '@/lib/auth/actions'

/** Text only, as designed: we don't redraw other companies' logos. Works without JavaScript. */
export function GoogleButton({ next }: { next?: string }) {
  return (
    <form action={signInWithGoogle}>
      {next && <input type="hidden" name="next" value={next} />}
      <SubmitButton variant="secondary" size="form" pendingLabel="Opening Google…" className="w-full text-[15px] font-medium">
        Continue with Google
      </SubmitButton>
    </form>
  )
}
