'use client'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

const STATES = [
  { status: 'New', note: '09:12 · Ada: Outlook shows “Disconnected” on LT-0142 since 9 am. Webmail works.', line: 'A ticket is opened: a record of one problem, with a number, so nothing is forgotten.' },
  { status: 'Assigned', note: '09:20 · Priority: low (a workaround exists). Assigned to Kofi.', line: 'It’s triaged: how urgent, and who takes it. An outage for everyone would be high priority.' },
  { status: 'In progress', note: '09:41 · Kofi: last night’s Office update reset Outlook’s profile. Repairing the profile.', line: 'Each step is noted as it happens, so anyone can pick it up.' },
  { status: 'Resolved', note: '09:58 · Kofi: profile repaired; Outlook connected; Ada confirms email is arriving.', line: 'Fixed, and checked with the person who reported it.' },
  { status: 'Closed', note: '10:02 · Cause: update reset the profile. Fix: Control Panel, Mail, repair profile. Added to knowledge base.', line: 'Closed with the cause and the fix, written for the next person. Five other people had the same problem that week: each took two minutes.' },
]

/** One support ticket from opened to closed, with its notes (Diagram lab, 5 states). */
export function TicketLife({ state }: LabProps) {
  const at = clampState(state, STATES.length)
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={`${STATES[at]!.status}. ${STATES[at]!.line}`} className="flex flex-col gap-2 rounded-2xl border border-line bg-row p-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-mono text-[13px] font-semibold text-ink">Ticket #4817</span>
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-[12px] font-bold motion-safe:transition-colors',
              at >= 3 ? 'bg-success-fill text-on-success' : at >= 1 ? 'bg-it text-white' : 'bg-fe text-white',
            )}
          >
            {STATES[at]!.status}
          </span>
        </div>
        <ol aria-hidden="true" className="grid grid-cols-5 gap-1">
          {STATES.map((s, i) => (
            <li key={s.status} className={cn('h-1.5 rounded-full', i <= at ? 'bg-it' : 'bg-meter')} />
          ))}
        </ol>
        <ul className="flex flex-col gap-1.5 pt-1">
          {STATES.slice(0, at + 1).map((s, i) => (
            <li key={s.status} className={cn('rounded-lg border-l-[3px] bg-sheet px-2.5 py-1.5 font-mono text-[12px] leading-[18px] [overflow-wrap:anywhere] text-ink-soft', i === at ? 'pop-in border-it' : 'border-line-control')}>
              {s.note}
            </li>
          ))}
        </ul>
      </div>
      <figcaption aria-live="polite" className="rounded-2xl border border-line bg-row px-4 py-3 text-[13px] leading-5 text-ink-soft">
        {STATES[at]!.line}
      </figcaption>
    </figure>
  )
}
