import { cn } from '@/lib/cn'

/**
 * A small ring that turns while something is working. It takes the text colour of its button. With
 * reduced motion it stays still, and the button's own "Saving…" text says what is happening.
 */
export function Spinner({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      data-spinner
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={cn('shrink-0 motion-safe:animate-spin', className)}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
