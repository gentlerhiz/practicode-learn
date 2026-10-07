import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * A real checkbox drawn as the canvas's rounded tick box, so it submits with its form and works
 * without JavaScript. The label text is the children.
 */
export function Checkbox({
  children,
  className,
  ...props
}: Omit<React.ComponentProps<'input'>, 'type'> & { children: React.ReactNode }) {
  return (
    <label className={cn('flex cursor-pointer items-start gap-3 text-sm leading-[22px] text-ink-soft', className)}>
      <input type="checkbox" className="peer sr-only" {...props} />
      <span
        aria-hidden="true"
        className="flex size-[22px] shrink-0 items-center justify-center rounded-lg border-[1.5px] border-line-strong text-transparent transition-colors duration-150 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-on-primary peer-hover:border-ink-subtle peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-focus"
      >
        <Check size={14} strokeWidth={2.6} />
      </span>
      <span>{children}</span>
    </label>
  )
}
