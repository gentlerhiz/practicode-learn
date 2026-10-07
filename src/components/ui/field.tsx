import { cn } from '@/lib/cn'

/** Label, control, hint and error, wired together with ids so screen readers announce them. */
export function Field({
  id,
  label,
  aside,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  /** Shown at the end of the label row, such as a "Forgot password?" link. */
  aside?: React.ReactNode
  hint?: React.ReactNode
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      {aside ? (
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor={id} className="text-sm font-medium text-ink">
            {label}
          </label>
          {aside}
        </div>
      ) : (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-[13px] leading-5 text-ink-subtle">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-[13px] leading-5 text-error">
          {error}
        </p>
      )}
    </div>
  )
}

/** The canvas field: 52 px, 14 px corners, and a blue ring on focus. */
export const inputClasses =
  'h-[52px] w-full rounded-[14px] border border-line bg-sunken px-4 text-[15px] text-ink transition-[border-color,box-shadow] duration-150 placeholder:text-ink-subtle hover:border-line-control focus:border-focus focus:shadow-[0_0_0_3px_rgba(77,107,255,0.25)] focus:outline-none aria-invalid:border-error'

export function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return <input className={cn(inputClasses, className)} {...props} />
}
