'use client'
import type { LabProps } from './shared'

const WHO: Record<string, { want: string; how: string; target: string }> = {
  Cybercriminals: {
    want: 'Money, run like a business',
    how: 'Phishing, stolen passwords, ransomware, selling stolen data',
    target: 'Anyone who can pay or be tricked: people, shops, hospitals',
  },
  Scammers: {
    want: 'Money, through trust and pressure',
    how: 'Fake alerts, fake shops, romance and job scams, pretend support calls',
    target: 'Ordinary people, often by text, phone or social media',
  },
  Hacktivists: {
    want: 'Attention for a cause',
    how: 'Taking websites down, leaking documents, defacing pages',
    target: 'Governments and companies they disagree with',
  },
  'Nation states': {
    want: 'Secrets and influence for a government',
    how: 'Long, patient, well-funded attacks',
    target: 'Governments, defence, energy and big companies',
  },
  Insiders: {
    want: 'Money, revenge, or nothing at all: many are honest mistakes',
    how: 'Using access they already have, or clicking something they shouldn’t',
    target: 'The organisation they work for',
  },
}

/** Who attacks, what they want and who they go after (Explore lab: value = a kind of attacker). */
export function Attackers({ value = 'Cybercriminals' }: LabProps) {
  const w = WHO[value] ?? WHO.Cybercriminals!
  const rows = [
    ['What they want', w.want],
    ['How they work', w.how],
    ['Who they go after', w.target],
  ] as const
  return (
    <figure
      className="m-0 flex flex-col gap-2 rounded-2xl border border-line bg-row p-4"
      aria-label={`${value}: ${w.want}.`}
    >
      <p className="font-display text-lg font-bold text-ink">{value}</p>
      <dl className="flex flex-col divide-y divide-divider">
        {rows.map(([label, text]) => (
          <div key={label} className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 py-2 text-sm">
            <dt className="text-ink-subtle">{label}</dt>
            <dd className="text-ink">{text}</dd>
          </div>
        ))}
      </dl>
    </figure>
  )
}
