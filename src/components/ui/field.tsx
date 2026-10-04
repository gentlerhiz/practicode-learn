import { cn } from '@/lib/cn'

/** Label, control, hint and error, wired together with ids so screen readers announce them. */
export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink-soft">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-[13px] text-ink-subtle">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-[13px] text-error">
          {error}
        </p>
      )}
    </div>
  )
}

export function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'h-12 w-full rounded-[14px] border border-line bg-sunken px-4 text-[15px] text-ink placeholder:text-ink-subtle aria-invalid:border-error',
        className,
      )}
      {...props}
    />
  )
}
