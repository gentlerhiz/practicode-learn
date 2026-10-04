import { cn } from '@/lib/cn'

const tones = {
  neutral: 'border border-line-control text-ink-soft',
  track: 'border border-fe/50 bg-fe/15 text-fe-text',
  soon: 'border border-line-control bg-row text-ink-muted',
} as const

/** A rounded label, such as a topic chip or "Coming soon". */
export function Pill({
  tone = 'neutral',
  className,
  ...props
}: { tone?: keyof typeof tones } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-medium',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
