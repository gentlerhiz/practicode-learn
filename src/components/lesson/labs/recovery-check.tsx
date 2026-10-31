'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Method = { level: 0 | 1 | 2; label: string; risk: string; better: string }

const METHODS: Record<string, Method> = {
  'Security question: your first pet': {
    level: 0,
    label: 'Weak',
    risk: 'The answer is often on social media, or one friendly chat away. Anyone who knows it can reset your account.',
    better: 'If you must have one, give a made-up answer and keep it in your password manager.',
  },
  'Security question: a made-up answer': {
    level: 1,
    label: 'Better',
    risk: 'Nobody can look it up, because it isn’t true. It only works if you can find it again.',
    better: 'Store the made-up answer in your password manager, like a password.',
  },
  'Recovery email address': {
    level: 1,
    label: 'Good, if that email is secure',
    risk: 'A reset link goes to that inbox, so whoever controls it controls this account too.',
    better: 'Use an email you still check, with its own strong passphrase and two-factor sign-in.',
  },
  'Recovery phone number': {
    level: 1,
    label: 'Good, with a warning',
    risk: 'Codes follow the number, so a SIM swap or an old number someone else now has could let a stranger in.',
    better: 'Keep the number up to date, and add a SIM PIN with your mobile network.',
  },
  'Printed backup codes': {
    level: 2,
    label: 'Strong',
    risk: 'One-time codes that work even if you lose your phone. The risk is someone finding the paper.',
    better: 'Keep them somewhere safe at home, or in your password manager, and never in your email.',
  },
}

const TONE = ['border-error bg-error/10 text-error', 'border-badge bg-badge/10 text-badge-text', 'border-success-fill bg-success/10 text-success']

/** Ways back into an account, and how each could let someone else in (Explore lab: value = a recovery method). */
export function RecoveryCheck({ value = 'Security question: your first pet' }: LabProps) {
  const m = METHODS[value] ?? METHODS['Security question: your first pet']!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${value}: ${m.label}. ${m.risk} ${m.better}`}>
      <div className={cn('flex flex-col gap-1.5 rounded-2xl border-[1.5px] p-4', TONE[m.level])}>
        <span className="text-[12px] font-semibold">{m.label}</span>
        <span className="font-display text-[17px] leading-6 font-bold text-ink">{value}</span>
        <div aria-hidden="true" className="mt-1 grid grid-cols-3 gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className={cn('h-2 rounded-full', i <= m.level ? (m.level === 0 ? 'bg-error' : m.level === 1 ? 'bg-badge' : 'bg-success-fill') : 'bg-meter')} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 @min-[460px]:grid-cols-2">
        <p className="m-0 flex flex-col gap-1 rounded-xl border border-line bg-row px-3 py-2.5 text-[13px] leading-5 text-ink-soft">
          <span className="font-semibold text-ink">How it could let someone in</span>
          {m.risk}
        </p>
        <p className="m-0 flex flex-col gap-1 rounded-xl border border-line bg-row px-3 py-2.5 text-[13px] leading-5 text-ink-soft">
          <span className="font-semibold text-ink">Make it safer</span>
          {m.better}
        </p>
      </div>
    </figure>
  )
}
