import { ChevronDown } from 'lucide-react'
import { Field, Input } from '@/components/ui'
import { passwordStrength } from '@/lib/auth/password'
import { cn } from '@/lib/cn'

/** Nigeria first: the canvas's "NG +234" prefix beside the number. */
export function PhoneField({
  hint,
  error,
  defaultValue,
  withChevron = false,
}: {
  hint: string
  error?: string
  defaultValue?: string
  withChevron?: boolean
}) {
  return (
    <Field id="phone" label="Phone number" hint={hint} error={error}>
      <div className="flex gap-2">
        <span className="flex h-[52px] shrink-0 items-center gap-2 rounded-[14px] border border-line bg-sunken px-4 text-[15px] text-ink">
          NG +234
          {withChevron && <ChevronDown aria-hidden="true" size={16} strokeWidth={1.85} className="text-ink-subtle" />}
        </span>
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          defaultValue={defaultValue}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'phone-error' : 'phone-hint'}
        />
      </div>
    </Field>
  )
}

const toneText = { none: '', bad: 'text-error', fair: 'text-badge-text', good: 'text-success' } as const
const toneFill = { none: '', bad: 'bg-error', fair: 'bg-badge', good: 'bg-success-fill' } as const

/** Four bars and a word, under a new password. */
export function StrengthMeter({ password }: { password: string }) {
  const strength = passwordStrength(password)
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="flex flex-1 gap-1">
        {[1, 2, 3, 4].map((bar) => (
          <span key={bar} className={cn('h-1 flex-1 rounded-sm', bar <= strength.bars ? toneFill[strength.tone] : 'bg-meter')} />
        ))}
      </span>
      <span aria-live="polite" className={cn('min-w-[6.5rem] text-right text-[13px]', toneText[strength.tone])}>
        {strength.label}
      </span>
    </div>
  )
}

export function FormMessage({ error, notice }: { error?: string; notice?: string }) {
  if (error) {
    return (
      <p role="alert" className="text-sm leading-[22px] text-error">
        {error}
      </p>
    )
  }
  if (notice) {
    return (
      <p role="status" className="text-sm leading-[22px] text-success">
        {notice}
      </p>
    )
  }
  return null
}
