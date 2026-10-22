'use client'
import { KeyRound, Laptop, Lock, ShieldCheck, Smartphone, UserX } from 'lucide-react'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

const STATES = [
  { you: 'password', thief: false, name: 'Something you know', line: 'You sign in with your password: something you know. On its own, anyone who learns it can get in.' },
  { you: 'code', thief: false, name: 'Something you have', line: 'Two-factor sign-in asks for a second thing: a code from an app on your phone, a text, or a tap on a security key. Something you have.' },
  { you: 'in', thief: false, name: 'You’re in', line: 'Password and code together: you’re in. On a device you trust, you may only be asked for the code now and then.' },
  { you: 'idle', thief: true, name: 'A stolen password', line: 'Your password leaks in a data breach, and a criminal tries it from their own computer.' },
  { you: 'idle', thief: true, blocked: true, name: 'Blocked', line: 'They don’t have your phone, so they can’t give the code. The password alone isn’t enough, and you get a warning.' },
  { you: 'passkey', thief: false, name: 'Passkeys', line: 'Passkeys go further: your phone or laptop proves it’s you with your fingerprint, face or PIN, and there’s no password to steal at all.' },
]

/** Why two-factor sign-in stops a stolen password, and what passkeys add (Diagram lab, 6 states). */
export function TwoFactor({ state }: LabProps) {
  const at = clampState(state, STATES.length)
  const s = STATES[at]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={`${s.name}. ${s.line}`} className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        <div className={cn('flex min-w-0 flex-col items-center gap-1.5 rounded-2xl border-[1.5px] p-3 motion-safe:transition-all', s.thief ? 'border-error bg-error/10' : 'border-it bg-[rgba(255,170,60,0.12)]')}>
          {s.thief ? <UserX size={26} aria-hidden="true" className="text-error" /> : <Laptop size={26} aria-hidden="true" className="text-it-text" />}
          <span className="text-[12px] font-semibold text-ink">{s.thief ? 'A criminal' : 'You'}</span>
          <span className="flex flex-wrap justify-center gap-1">
            {(s.you === 'password' || s.you === 'code' || s.you === 'in' || s.thief) && (
              <span className="pop-in flex items-center gap-1 rounded-md bg-sheet px-1.5 py-0.5 font-mono text-[11px] text-ink">
                <KeyRound size={11} aria-hidden="true" />
                ••••••
              </span>
            )}
            {(s.you === 'code' || s.you === 'in') && (
              <span className="pop-in flex items-center gap-1 rounded-md bg-sheet px-1.5 py-0.5 font-mono text-[11px] text-ink">
                <Smartphone size={11} aria-hidden="true" />
                482 913
              </span>
            )}
            {s.you === 'passkey' && (
              <span className="pop-in flex items-center gap-1 rounded-md bg-sheet px-1.5 py-0.5 text-[11px] text-ink">
                <ShieldCheck size={11} aria-hidden="true" />
                Face or fingerprint
              </span>
            )}
          </span>
        </div>
        <span aria-hidden="true" className={cn('text-lg', s.blocked ? 'text-error' : 'text-ink-subtle')}>
          {s.blocked ? '✕' : '→'}
        </span>
        <div
          className={cn(
            'flex min-w-0 flex-col items-center gap-1.5 rounded-2xl border-[1.5px] p-3 motion-safe:transition-all',
            s.you === 'in' || s.you === 'passkey' ? 'border-success-fill bg-row' : s.blocked ? 'border-error bg-row' : 'border-line bg-row',
          )}
        >
          <Lock size={26} aria-hidden="true" className={s.you === 'in' || s.you === 'passkey' ? 'text-success' : s.blocked ? 'text-error' : 'text-ink-muted'} />
          <span className="text-[12px] font-semibold text-ink">Your account</span>
          <span className="text-[11px] text-ink-muted">
            {s.you === 'in' || s.you === 'passkey' ? 'Signed in' : s.blocked ? 'Code needed: blocked' : s.you === 'code' ? 'Enter the code' : 'Password?'}
          </span>
        </div>
      </div>
      <figcaption aria-live="polite" className="flex flex-col gap-1 rounded-2xl border border-line bg-row px-4 py-3">
        <span className="font-display text-[15px] font-bold text-ink">{s.name}</span>
        <span className="text-[13px] leading-5 text-ink-soft">{s.line}</span>
      </figcaption>
    </figure>
  )
}
