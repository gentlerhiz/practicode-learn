import { cn } from '@/lib/cn'

const widths = {
  marketing: 'max-w-[1240px]',
  app: 'max-w-[1200px]',
  prose: 'max-w-[760px]',
  narrow: 'max-w-[488px]',
} as const

/** Centres content with the page gutters: 24 px, or 16 px on phones. */
export function Container({
  width = 'marketing',
  className,
  ...props
}: { width?: keyof typeof widths } & React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full px-4 ph:px-6', widths[width], className)} {...props} />
}
