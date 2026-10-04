import { cn } from '@/lib/cn'

// Plain sections carry half the 112 px rhythm on each side (64 px on phones), so neighbours add up.
const spacings = { md: 'py-8 ph:py-14', lg: 'py-16 ph:py-28', none: '' } as const

export function Section({
  id,
  labelledBy,
  spacing = 'md',
  className,
  ...props
}: {
  id?: string
  labelledBy?: string
  spacing?: keyof typeof spacings
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn('relative scroll-mt-20', spacings[spacing], className)}
      {...props}
    />
  )
}
