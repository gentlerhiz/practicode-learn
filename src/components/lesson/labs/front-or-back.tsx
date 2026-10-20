'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Side = 'front' | 'back' | 'both'

const JOBS: Record<string, { side: Side; why: string }> = {
  'Show the Buy button': {
    side: 'front',
    why: 'Drawing buttons, colours and layout on your screen is the front end’s job.',
  },
  'Check the password': {
    side: 'back',
    why: 'Only the server can see the stored password, so only it can check one. Code on your phone can be read and changed by anyone.',
  },
  'Work out the price': {
    side: 'both',
    why: 'The app can show a running total, but the server works out the real price before it charges you, from its own database.',
  },
  'Animate the basket': {
    side: 'front',
    why: 'A little bounce when you add an item happens on your screen, so it’s front-end work.',
  },
  'Store the order': {
    side: 'back',
    why: 'Orders go in the shop’s database, on its servers, so they’re still there tomorrow and on every device.',
  },
  'Send the receipt email': {
    side: 'back',
    why: 'The server sends email, because it holds the order, the address and the email account.',
  },
}

/** Where a job happens: front end, back end or both (Explore lab: value = a job). */
export function FrontOrBack({ value = 'Show the Buy button' }: LabProps) {
  const job = JOBS[value] ?? JOBS['Show the Buy button']!
  const verdict = job.side === 'front' ? 'Front end' : job.side === 'back' ? 'Back end' : 'Both'
  const lane = (side: 'front' | 'back', name: string, where: string) => {
    const on = job.side === side || job.side === 'both'
    return (
      <div
        className={cn(
          'flex flex-1 flex-col gap-1 rounded-2xl border-[1.5px] p-3 motion-safe:transition-colors motion-safe:duration-250',
          on ? 'border-fe bg-[rgba(77,107,255,0.16)]' : 'border-line bg-row',
        )}
      >
        <span className={cn('text-sm font-bold', on ? 'text-ink' : 'text-ink-muted')}>{name}</span>
        <span className="text-[12px] leading-4 text-ink-soft">{where}</span>
        {on && <span className="mt-1 text-[13px] font-semibold text-fe-text">{value}</span>}
      </div>
    )
  }
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${value}: ${verdict}.`}>
      <div className="flex gap-2">
        {lane('front', 'Front end', 'On your phone or in your browser')}
        {lane('back', 'Back end', 'On the shop’s servers')}
      </div>
      <figcaption className="flex flex-col gap-1 rounded-xl bg-row px-3 py-2.5 text-sm text-ink">
        <span className="font-semibold">{verdict}</span>
        <span className="text-ink-soft">{job.why}</span>
      </figcaption>
    </figure>
  )
}
