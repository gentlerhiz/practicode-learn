import { Card } from '@/components/ui'

/** One impact figure with its definition underneath, so nobody reads a number without knowing what it counts. */
export function MetricCard({
  label,
  value,
  definition,
  href,
}: {
  label: string
  value: string
  definition: string
  href: string
}) {
  return (
    <Card as="li" className="flex flex-col gap-2">
      <p className="text-sm font-medium text-ink-muted">{label}</p>
      <p className="font-display text-[30px] leading-9 font-bold text-ink">{value}</p>
      <p className="text-[13px] leading-5 text-ink-subtle">
        {definition}{' '}
        <a href={href} className="underline underline-offset-2 hover:text-ink">
          How it’s measured
        </a>
      </p>
    </Card>
  )
}
