'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Licence = { cost: string; use: boolean; share: boolean; change: boolean; examples: string; note: string }

const LICENCES: Record<string, Licence> = {
  'Open source': {
    cost: 'Free',
    use: true,
    share: true,
    change: true,
    examples: 'Firefox, LibreOffice, VLC, Linux',
    note: 'Anyone can read the code, change it and share it, under the rules of its licence. Many people check it, and anyone can fix it.',
  },
  Freeware: {
    cost: 'Free',
    use: true,
    share: false,
    change: false,
    examples: 'Many free apps, such as WhatsApp or Google Chrome',
    note: 'Free to use, but the code is private, and the licence usually says you get it from the maker, not copy it to others.',
  },
  'Free trial': {
    cost: 'Free for a while, then you pay',
    use: true,
    share: false,
    change: false,
    examples: 'Many antivirus, video editing and design apps',
    note: 'The full app, for a limited time, or with some features locked. Note when the trial ends, and whether it starts charging you on its own.',
  },
  Subscription: {
    cost: 'Every month or year',
    use: true,
    share: false,
    change: false,
    examples: 'Microsoft 365, Adobe Creative Cloud',
    note: 'You pay for as long as you use it, and get every update. Stop paying, and you lose access, though your files stay yours.',
  },
  'One-off purchase': {
    cost: 'Once',
    use: true,
    share: false,
    change: false,
    examples: 'Many games, and some photo and music apps',
    note: 'Pay once and keep that version. Big new versions may cost extra.',
  },
}

const COLS = [
  ['use', 'Use it'],
  ['share', 'Give copies to others'],
  ['change', 'Read and change the code'],
] as const

/** Five kinds of software licence, and what each lets you do (Explore lab: value = a kind). */
export function LicenceTypes({ value = 'Open source' }: LabProps) {
  const name = LICENCES[value] ? value : 'Open source'
  const l = LICENCES[name]!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${name}. Costs: ${l.cost}. ${COLS.map(([k, t]) => `${t}: ${l[k] ? 'yes' : 'no'}`).join('. ')}.`}>
      <div className="flex flex-col gap-1 rounded-2xl border border-line bg-row px-4 py-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <p className="font-display text-lg font-bold text-ink">{name}</p>
          <p className="text-[13px] font-semibold text-it-text">{l.cost}</p>
        </div>
        <p className="text-[13px] leading-5 text-ink-soft">{l.note}</p>
      </div>
      <ul className="grid grid-cols-1 gap-2 @min-[460px]:grid-cols-3">
        {COLS.map(([key, label]) => (
          <li
            key={key}
            className={cn(
              'flex items-center gap-2.5 rounded-xl border-[1.5px] px-3 py-2.5 text-[13px] leading-5 motion-safe:transition-colors motion-safe:duration-300',
              l[key] ? 'border-success-fill bg-row text-ink' : 'border-line bg-sunken text-ink-muted',
            )}
          >
            <span aria-hidden="true" className={cn('grid size-6 shrink-0 place-items-center rounded-full text-[12px] font-bold', l[key] ? 'bg-success-fill text-on-success' : 'bg-meter text-ink-muted')}>
              {l[key] ? '✓' : '✕'}
            </span>
            <span>
              {label}
              <span className="sr-only">{l[key] ? ': yes' : ': no'}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="text-[13px] leading-5 text-ink-muted">
        <span className="font-semibold text-ink-soft">For example: </span>
        {l.examples}
      </p>
    </figure>
  )
}
