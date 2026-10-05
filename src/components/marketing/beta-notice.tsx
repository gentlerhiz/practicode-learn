import { LESSONS_OPEN } from '@/content/navigation'
import { cn } from '@/lib/cn'

/** Says plainly that lessons haven't opened yet. Disappears when LESSONS_OPEN flips. */
export function BetaNotice({ className }: { className?: string }) {
  if (LESSONS_OPEN) return null
  return (
    <p
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-line-control bg-row/60 px-3.5 py-1.5 text-[13px] font-medium text-ink-soft',
        className,
      )}
    >
      <span aria-hidden="true" className="size-2 rounded-full bg-success-fill" />
      Beta · Module 1 opens soon
    </p>
  )
}
