'use client'
import { Bug, Database, Fish, KeyRound, Repeat, ShieldCheck, UserX } from 'lucide-react'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

type Way = { icon: typeof KeyRound; name: string; how: string; route: string[]; stops: string }

const WAYS: Way[] = [
  { icon: KeyRound, name: 'Guessing', how: 'Trying common passwords at the sign-in page', route: ['123456?', 'password?', 'chelsea2024?'], stops: 'Sites that lock out after a few wrong tries, and a password nobody would guess' },
  { icon: Repeat, name: 'Credential stuffing', how: 'Taking passwords leaked from one site and trying them on others', route: ['Leaked from a shop', 'Tried on email', 'Tried on banking'], stops: 'A different password for every account' },
  { icon: Fish, name: 'Phishing', how: 'A fake sign-in page that looks real, so you type the password in yourself', route: ['A message with a link', 'A copy of the real page', 'Your password, sent to them'], stops: 'Checking the address, a password manager that won’t fill on the wrong site, and passkeys' },
  { icon: Database, name: 'A breach, then cracking', how: 'A site’s password list is stolen, and computers guess billions of passwords a second against it', route: ['Stolen database', 'Billions of guesses', 'Short passwords fall'], stops: 'Long passphrases, and two-factor sign-in for when they fall anyway' },
  { icon: Bug, name: 'Spying', how: 'Malware that records typing, or someone watching over your shoulder', route: ['A fake app or attachment', 'Every key recorded', 'Sent to the attacker'], stops: 'Updates, apps only from official stores, and two-factor sign-in' },
]

/** The five ways passwords get stolen, and what stops each one (Diagram lab, 5 states). */
export function PasswordTheft({ state }: LabProps) {
  const at = clampState(state, WAYS.length)
  const w = WAYS[at]!
  const Icon = w.icon
  return (
    <figure className="m-0 flex flex-col gap-3">
      <ol aria-label="The five ways" className="m-0 grid list-none grid-cols-3 gap-1.5 p-0 @min-[440px]:grid-cols-5">
        {WAYS.map((x, i) => {
          const I = x.icon
          return (
            <li key={x.name} aria-current={i === at ? 'step' : undefined} className={cn('flex flex-col items-center gap-1 rounded-xl border px-1 py-2 text-center motion-safe:transition-colors', i === at ? 'border-cy bg-cy/15 text-ink' : 'border-line bg-row text-ink-subtle')}>
              <I size={18} aria-hidden="true" />
              <span className="text-[10.5px] leading-[13px] font-semibold">{x.name}</span>
            </li>
          )
        })}
      </ol>
      <div role="img" aria-label={`${w.name}: ${w.how}. ${w.route.join(', then ')}. What stops it: ${w.stops}.`} className="flex flex-col gap-3 rounded-2xl border border-line bg-row p-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-error/15 text-error">
            <UserX size={20} aria-hidden="true" />
          </span>
          <p className="m-0 text-[13px] leading-5 text-ink">
            <span className="font-semibold">{w.name}.</span> {w.how}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {w.route.map((r, i) => (
            <span key={r} className="flex items-center gap-1.5">
              <span className="pop-in flex items-center gap-1.5 rounded-lg border border-error/40 bg-sheet px-2 py-1 text-[12px] text-ink" style={{ animationDelay: `${i * 90}ms` }}>
                {i === 0 && <Icon size={13} aria-hidden="true" className="text-error" />}
                {r}
              </span>
              {i < w.route.length - 1 && <span aria-hidden="true" className="text-ink-subtle">→</span>}
            </span>
          ))}
        </div>
        <p className="m-0 flex items-start gap-2 rounded-xl bg-success/12 px-3 py-2 text-[13px] leading-5 text-ink">
          <ShieldCheck size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-success" />
          <span>
            <span className="font-semibold">What stops it:</span> {w.stops}.
          </span>
        </p>
      </div>
    </figure>
  )
}
