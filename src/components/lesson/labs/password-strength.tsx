'use client'
import { useId, useState } from 'react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'
import { judge } from './password-rules'

const TONES = ['bg-error', 'bg-error', 'bg-badge', 'bg-success-fill', 'bg-success-fill']
const TEXT = ['text-error', 'text-error', 'text-badge-text', 'text-success', 'text-success']

function Meter({ password }: { password: string }) {
  const v = judge(password)
  return (
    <div className="flex flex-col gap-2">
      <div aria-hidden="true" className="grid grid-cols-5 gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={cn('h-2.5 rounded-full motion-safe:transition-colors motion-safe:duration-300', password && i <= v.level ? TONES[v.level] : 'bg-meter')} />
        ))}
      </div>
      <p aria-live="polite" className="text-[13px] leading-5 text-ink-soft">
        {password && <span className={cn('font-semibold', TEXT[v.level])}>{v.label}. </span>}
        {v.reasons.join(' ')}
      </p>
    </div>
  )
}

/**
 * How guessable a password is (Explore lab: value = an example password). The learner can also type
 * their own; it's judged on their device and never stored or sent.
 */
export function PasswordStrength({ value = 'password123' }: LabProps) {
  const [own, setOwn] = useState('')
  const id = useId()
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${value}: ${judge(value).label}.`}>
      <div className="flex flex-col gap-2.5 rounded-2xl border border-line bg-row px-4 py-3">
        <p className="font-mono text-lg font-bold [overflow-wrap:anywhere] text-ink">{value}</p>
        <Meter password={value} />
      </div>
      <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-line-strong px-4 py-3">
        <label htmlFor={id} className="text-[13px] font-semibold text-ink">
          Try your own idea
        </label>
        <input
          id={id}
          type="text"
          value={own}
          onChange={(e) => setOwn(e.target.value)}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="Not a password you really use"
          className="h-11 rounded-xl border border-line bg-sunken px-3 font-mono text-[14px] text-ink placeholder:text-ink-subtle focus:border-focus focus:outline-none"
        />
        {own && <Meter password={own} />}
        <p className="text-[12px] leading-[18px] text-ink-muted">Checked on your device only: nothing is saved or sent. Still, never type a password you really use into any website except the one it’s for.</p>
      </div>
    </figure>
  )
}
