'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const STAGES = ['First try', 'Add the device', 'Add what happened', 'Add what you tried', 'Ready to send'] as const

const NOTES: Record<(typeof STAGES)[number], string> = {
  'First try': 'Support can’t start on this. Which device? What doesn’t work? Since when? Their first reply will be questions.',
  'Add the device': 'Now they know which computer, and can look it up.',
  'Add what happened': 'The exact error, when it started, and what changed. These point straight at causes.',
  'Add what you tried': 'They won’t ask you to restart again, and can skip to the next step.',
  'Ready to send': 'A clear title, how urgent it is, and a screenshot. It can be fixed in one go.',
}

/** A support request improved one detail at a time (Explore lab: value = a stage). */
export function SupportTicket({ value = 'First try' }: LabProps) {
  const at = Math.max(0, STAGES.indexOf(value as (typeof STAGES)[number]))
  const title = at >= 4 ? 'Outlook says “Disconnected” on laptop LT-0142 since this morning' : 'Email not working'
  const lines: { text: string; from: number }[] = [
    { text: 'Device: Dell laptop, asset tag LT-0142, Windows 11', from: 1 },
    { text: 'Since about 9 am today, Outlook shows “Disconnected” at the bottom, and no new email arrives. Other websites work. Nothing changed, except an update last night.', from: 2 },
    { text: 'Tried: restarting the laptop, and signing in to webmail, where email arrives fine.', from: 3 },
    { text: 'Urgency: I can work from webmail for now, so it isn’t urgent. Screenshot attached.', from: 4 },
  ]
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${STAGES[at]}. ${NOTES[STAGES[at]!]}`}>
      <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-row text-[13px]">
        <div className="border-b border-divider px-3 py-2">
          <span className="text-[11px] text-ink-subtle">New support request</span>
          <p className={cn('font-semibold text-ink', at >= 4 && 'pop-in')}>{title}</p>
        </div>
        <div className="flex flex-col gap-1.5 px-3 py-3 leading-5 text-ink-soft">
          {at === 0 && <p>My email isn’t working, please help asap.</p>}
          {lines
            .filter((l) => at >= l.from)
            .map((l) => (
              <p key={l.from} className={cn(at === l.from && 'pop-in rounded-md bg-[rgba(255,170,60,0.14)] px-1 -mx-1')}>
                {l.text}
              </p>
            ))}
        </div>
      </div>
      <p aria-live="polite" className="text-[13px] leading-5 text-ink-soft">
        {NOTES[STAGES[at]!]}
      </p>
    </figure>
  )
}
