import { cn } from '@/lib/cn'

const variants = {
  // Flat by rule: primary buttons never carry a shadow or glow.
  primary: 'bg-primary text-on-primary hover:opacity-90',
  secondary: 'border border-line-control text-ink hover:bg-row',
  ghost: 'text-ink-muted hover:text-ink',
} as const

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-[42px] px-5 text-[15px]',
  lg: 'h-14 px-7 text-base',
} as const

export type ButtonStyle = { variant?: keyof typeof variants; size?: keyof typeof sizes }

export const buttonClasses = ({ variant = 'primary', size = 'md' }: ButtonStyle, extra?: string) =>
  cn(
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-opacity disabled:cursor-not-allowed disabled:opacity-45',
    variants[variant],
    sizes[size],
    extra,
  )

export function Button({
  variant,
  size,
  className,
  type = 'button',
  ...props
}: ButtonStyle & React.ComponentProps<'button'>) {
  return <button type={type} className={buttonClasses({ variant, size }, className)} {...props} />
}
