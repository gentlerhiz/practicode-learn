'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Verdict = 'stops' | 'fails' | 'depends'
type Method = { how: string; against: Verdict[]; says: string }

const ATTACKS = [
  { name: 'A stolen password', line: 'Leaked in a breach and tried by someone far away' },
  { name: 'A SIM swap', line: 'A criminal talks your mobile network into moving your number to their SIM' },
  { name: 'A fake sign-in page', line: 'You type the password and the code into a copy of the real page' },
  { name: 'Prompt bombing', line: 'Sign-in requests over and over, until you tap Approve to make them stop' },
]

const METHODS: Record<string, Method> = {
  'Text message code': {
    how: 'A six-digit code sent by text',
    against: ['stops', 'fails', 'fails', 'stops'],
    says: 'Far better than a password alone, and fine for most accounts. But codes follow your phone number, and a fake page can pass your code straight on.',
  },
  'Authenticator app': {
    how: 'A code that changes every 30 seconds, made by an app on your phone',
    against: ['stops', 'stops', 'fails', 'stops'],
    says: 'The codes are made on your phone, so a SIM swap doesn’t get them. A fake page can still ask you to type one in.',
  },
  'Push approval': {
    how: 'A pop-up on your phone: was this you? Approve or deny',
    against: ['stops', 'stops', 'fails', 'depends'],
    says: 'Easy to use, but people approve requests they didn’t make. Better apps ask you to type a number shown on the sign-in screen, which defeats prompt bombing.',
  },
  'Security key or passkey': {
    how: 'A key or your device proves it’s you, and only to the real site',
    against: ['stops', 'stops', 'stops', 'stops'],
    says: 'Nothing to type, so nothing to hand to a fake page: the key checks the site’s address itself. The strongest option where it’s offered.',
  },
}

const LABEL: Record<Verdict, string> = { stops: 'Stops it', fails: 'Doesn’t stop it', depends: 'Only with number matching' }

/** What each kind of two-factor sign-in stops (Explore lab: value = a second factor). */
export function MfaLadder({ value = 'Text message code' }: LabProps) {
  const m = METHODS[value] ?? METHODS['Text message code']!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${value}: ${m.how}. ${ATTACKS.map((a, i) => `${a.name}: ${LABEL[m.against[i]!]}`).join('. ')}. ${m.says}`}>
      <p className="m-0 rounded-xl bg-row px-3 py-2 text-[13px] text-ink">
        <span className="font-semibold">{value}:</span> {m.how}.
      </p>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {ATTACKS.map((a, i) => {
          const v = m.against[i]!
          return (
            <li key={a.name} className={cn('flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-xl border-[1.5px] px-3 py-2', v === 'stops' ? 'border-success-fill bg-success/10' : v === 'fails' ? 'border-error bg-error/10' : 'border-badge bg-badge/10')}>
              <span className="flex min-w-0 flex-col">
                <span className="text-[13px] font-semibold text-ink">{a.name}</span>
                <span className="text-[12px] leading-[17px] text-ink-muted">{a.line}</span>
              </span>
              <span className={cn('shrink-0 text-[12px] font-semibold', v === 'stops' ? 'text-success' : v === 'fails' ? 'text-error' : 'text-badge-text')}>{LABEL[v]}</span>
            </li>
          )
        })}
      </ul>
      <figcaption className="rounded-xl bg-row px-3 py-2.5 text-[13px] leading-5 text-ink-soft">{m.says}</figcaption>
    </figure>
  )
}
