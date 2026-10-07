import { buttonClasses } from '@/components/ui'
import { signInWithGoogle } from '@/lib/auth/actions'

/** Text only, as designed: we don't redraw other companies' logos. Works without JavaScript. */
export function GoogleButton({ next }: { next?: string }) {
  return (
    <form action={signInWithGoogle}>
      {next && <input type="hidden" name="next" value={next} />}
      <button
        type="submit"
        className={buttonClasses({ variant: 'secondary', size: 'form' }, 'w-full text-[15px] font-medium')}
      >
        Continue with Google
      </button>
    </form>
  )
}
