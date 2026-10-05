import { buttonClasses } from '@/components/ui'
import { signInWithGoogle } from '@/lib/auth/actions'

/** Text only, as designed: we don't redraw other companies' logos. Works without JavaScript. */
export function GoogleButton({ next }: { next?: string }) {
  return (
    <form action={signInWithGoogle}>
      {next && <input type="hidden" name="next" value={next} />}
      <button
        type="submit"
        className={buttonClasses({ variant: 'secondary', size: 'lg' }, 'w-full font-medium')}
      >
        Continue with Google
      </button>
    </form>
  )
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-3 text-[13px] text-ink-subtle" aria-hidden="true">
      <span className="h-px flex-1 bg-line" />
      or
      <span className="h-px flex-1 bg-line" />
    </div>
  )
}
