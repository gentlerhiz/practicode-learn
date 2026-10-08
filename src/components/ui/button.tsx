import { cn } from '@/lib/cn'
import { Spinner } from './spinner'

const variants = {
  // Flat by rule: primary buttons never carry a shadow or glow.
  primary: 'bg-primary text-on-primary hover:opacity-90 active:opacity-80',
  // The canvas's outline button (Google, Log In): a faint wash that brightens on hover.
  secondary:
    'border border-line-control bg-wash text-ink hover:border-line-strong hover:bg-hover active:bg-press',
  ghost: 'text-ink-muted hover:bg-hover hover:text-ink active:bg-press',
  // Small filled controls inside fields and cards: Show, Copy, Resend.
  quiet: 'bg-control text-ink-soft hover:bg-hover hover:text-ink active:bg-press',
} as const

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-[42px] px-5 text-[15px]',
  // Buttons that sit with 52 px fields on sign-in, onboarding and settings forms.
  form: 'h-[52px] px-6 text-base',
  lg: 'h-14 px-7 text-base',
} as const

export type ButtonStyle = { variant?: keyof typeof variants; size?: keyof typeof sizes }

export const buttonClasses = ({ variant = 'primary', size = 'md' }: ButtonStyle, extra?: string) =>
  cn(
    'press inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-45 disabled:aria-busy:cursor-progress disabled:aria-busy:opacity-90',
    variants[variant],
    sizes[size],
    extra,
  )

/** A button. With `pending`, it shows a spinner, says it is busy, and can't be pressed again until done. */
export function Button({
  variant,
  size,
  className,
  type = 'button',
  pending = false,
  disabled,
  children,
  ...props
}: ButtonStyle & React.ComponentProps<'button'> & { pending?: boolean }) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size }, className)}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      {...props}
    >
      {pending && <Spinner size={size === 'sm' ? 14 : 16} />}
      {children}
    </button>
  )
}
