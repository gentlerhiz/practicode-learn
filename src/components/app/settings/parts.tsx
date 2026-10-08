'use client'

import { Glyph, type GlyphName } from '@/components/ui/glyph'
import { TutorSpark } from '@/components/learn/tutor-spark'
import { useState } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/cn'

/** PrismSettings' small pill buttons: Edit, Change, Update, View. */
export const smallButton =
  'press inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-line-control px-4 text-[13px] text-ink hover:border-line-strong hover:bg-hover disabled:cursor-not-allowed disabled:opacity-50'
export const smallPrimary =
  'press inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-4 text-[13px] font-semibold text-on-primary hover:opacity-90 disabled:opacity-50'

/** Log Out posts to the sign-out route, a full page load, so it shows its own spinner meanwhile. */
export function LogOutButton() {
  const [pending, setPending] = useState(false)
  return (
    <form method="post" action="/auth/signout" onSubmit={() => setPending(true)}>
      <button type="submit" disabled={pending} aria-busy={pending || undefined} className={smallButton}>
        {pending ? <Spinner size={14} /> : <Glyph name="logout" size={15} />}
        {pending ? 'Logging Out…' : 'Log Out'}
      </button>
    </form>
  )
}

/** A feature that has its controls but not its backend yet. */
export function Soon() {
  return (
    <span className="ml-2 inline-flex items-center rounded-full bg-control px-2 py-0.5 align-middle text-[11px] font-semibold text-ink-muted">
      Soon
    </span>
  )
}

export function SettingsCard({
  id,
  icon,
  title,
  intro,
  children,
}: {
  id: string
  icon: GlyphName | 'tutor'
  title: string
  intro: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="surface flex scroll-mt-6 flex-col gap-1.5 rounded-[26px] border border-line px-5 py-6 ph:px-8"
    >
      <div className="flex items-center gap-4 pb-3">
        {icon === 'tutor' ? (
          <TutorSpark size={40} />
        ) : (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-control text-ink-soft">
            <Glyph name={icon} size={20} />
          </span>
        )}
        <div>
          <h2 id={`${id}-title`} className="font-display text-[21px] font-bold text-ink">
            {title}
          </h2>
          <p className="mt-0.5 text-[13px] text-ink-muted">{intro}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

/** One line in a settings card: label and value (or a title and note), with an action at the end. */
export function Row({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between gap-4 border-t border-line-subtle py-4', className)}>{children}</div>
  )
}

export function Value({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[13px] text-ink-muted">{label}</p>
      <p className="mt-0.5 text-[15px] [overflow-wrap:anywhere] text-ink">{value}</p>
    </div>
  )
}

export function Titled({ id, title, note, soon }: { id?: string; title: string; note: string; soon?: boolean }) {
  return (
    <div className="min-w-0">
      <p id={id} className="text-[15px] font-medium text-ink">
        {title}
        {soon && <Soon />}
      </p>
      <p className="mt-1 text-[13px] leading-5 text-ink-muted">{note}</p>
    </div>
  )
}

/** The canvas's on/off switch: white track and dark knob when on. */
export function Switch({
  on,
  labelledBy,
  onChange,
  disabled,
}: {
  on: boolean
  labelledBy: string
  onChange?: (on: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-labelledby={labelledBy}
      disabled={disabled}
      onClick={() => onChange?.(!on)}
      className={cn(
        'relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        on ? 'bg-primary' : 'bg-meter',
      )}
    >
      <span
        className={cn(
          'absolute top-1 block size-5 rounded-full transition-[left] duration-150',
          on ? 'left-6 bg-on-primary' : 'left-1 bg-ink-subtle',
        )}
      />
    </button>
  )
}

/** A row of pill choices (daily goal, who can see your profile). */
export function Pills<T extends string>({
  label,
  labelledBy,
  options,
  value,
  onChange,
  disabled,
  role = 'group',
}: {
  label?: string
  labelledBy?: string
  options: { id: T; label: string }[]
  value: T
  onChange?: (id: T) => void
  disabled?: boolean
  role?: 'group' | 'radiogroup'
}) {
  return (
    <div role={role} aria-label={label} aria-labelledby={labelledBy} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = o.id === value
        return (
          <button
            key={o.id}
            type="button"
            role={role === 'radiogroup' ? 'radio' : undefined}
            aria-checked={role === 'radiogroup' ? on : undefined}
            aria-pressed={role === 'group' ? on : undefined}
            disabled={disabled}
            onClick={() => onChange?.(o.id)}
            className={cn(
              'press h-10 cursor-pointer rounded-full border px-4 text-sm font-medium disabled:cursor-not-allowed',
              on ? 'border-primary bg-primary text-on-primary' : 'border-line-control text-ink-soft enabled:hover:border-line-strong enabled:hover:bg-hover',
              disabled && !on && 'opacity-60',
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
