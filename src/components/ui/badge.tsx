import { cn } from '@/lib/cn'

const tones = {
  success: 'bg-success-fill text-on-success',
  error: 'border border-error text-error',
  badge: 'bg-badge text-on-badge',
  track: 'bg-fe text-white',
} as const

/** A small solid status label, such as "Passed" or "New". Only tone="track" uses a track colour. */
export function Badge({
  tone,
  className,
  ...props
}: { tone: keyof typeof tones } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
