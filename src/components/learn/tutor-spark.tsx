import { cn } from '@/lib/cn'

/** The AI tutor's round sparkle avatar, as on the canvas. */
export function TutorSpark({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('flex shrink-0 items-center justify-center rounded-full', className)}
      style={{ width: size, height: size, background: 'linear-gradient(135deg, #3D5AF5, #6E4CF5 55%, #D9306F)' }}
    >
      <svg viewBox="0 0 24 24" width={size / 2} height={size / 2} fill="#FFFFFF">
        <path d="M11 2.5l2.1 5.9 5.9 2.1-5.9 2.1L11 18.5l-2.1-5.9L3 10.5l5.9-2.1z" />
        <path d="M19 14.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9z" />
      </svg>
    </span>
  )
}
