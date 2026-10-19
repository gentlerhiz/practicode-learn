'use client'
import type { LabProps } from './shared'

const THINGS: Record<string, { inside: string; misuse: string; protect: string }> = {
  'Your phone': {
    inside: 'Your messages, photos, contacts, banking apps and the codes that sign you in',
    misuse: 'Read your messages, use your banking apps, and receive the sign-in codes meant for you',
    protect: 'A screen lock, updates, and apps only from the official store',
  },
  'Your email': {
    inside: 'Years of messages, and the password-reset links for almost every other account',
    misuse: 'Press "forgot password" on your other accounts and take them over, one by one',
    protect: 'A unique password and two-factor sign-in',
  },
  'Your bank app': {
    inside: 'Your money, your card details and your transaction history',
    misuse: 'Move your money, or apply for loans in your name',
    protect: 'A unique PIN, the bank’s own alerts, and never sharing a one-time code',
  },
  'Your social media': {
    inside: 'Your friends, your photos, and the trust people place in your name',
    misuse: 'Message your friends pretending to be you, asking for money or codes',
    protect: 'Two-factor sign-in, and checking which apps can post for you',
  },
}

/** What's at stake in each part of your digital life (Explore lab: value = a thing to protect). */
export function WhatYouProtect({ value = 'Your phone' }: LabProps) {
  const t = THINGS[value] ?? THINGS['Your phone']!
  const rows = [
    ['What’s inside', t.inside, 'text-ink'],
    ['What an attacker could do', t.misuse, 'text-ink'],
    ['One protection', t.protect, 'text-cy-text'],
  ] as const
  return (
    <figure
      className="m-0 flex flex-col gap-2 rounded-2xl border border-line bg-row p-4"
      aria-label={`${value}. ${t.inside}.`}
    >
      <p className="font-display text-lg font-bold text-ink">{value}</p>
      <dl className="flex flex-col gap-2">
        {rows.map(([label, text, tone]) => (
          <div key={label} className="flex flex-col gap-0.5 rounded-xl border border-line bg-sheet px-3 py-2">
            <dt className="text-xs font-semibold text-ink-subtle">{label}</dt>
            <dd className={`text-sm leading-[21px] ${tone}`}>{text}</dd>
          </div>
        ))}
      </dl>
    </figure>
  )
}
