'use client'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

type Block = { name: string; kind: 'ok' | 'stuck' | 'leak' }

const STATES: { blocks: Block[]; name: string; line: string; fresh?: boolean }[] = [
  {
    name: 'A fresh start',
    blocks: [
      { name: 'System', kind: 'ok' },
      { name: 'Browser', kind: 'ok' },
    ],
    line: 'Just after starting, memory holds only what’s needed. Everything is quick.',
  },
  {
    name: 'Days later',
    blocks: [
      { name: 'System', kind: 'ok' },
      { name: 'Browser, 40 tabs', kind: 'ok' },
      { name: 'Old app, still open', kind: 'ok' },
      { name: 'Video call', kind: 'ok' },
    ],
    line: 'After days without a restart, memory fills with apps and tabs you’ve forgotten about.',
  },
  {
    name: 'Leaks and stuck tasks',
    blocks: [
      { name: 'System', kind: 'ok' },
      { name: 'Browser, 40 tabs', kind: 'ok' },
      { name: 'Memory leak', kind: 'leak' },
      { name: 'Frozen print job', kind: 'stuck' },
      { name: 'Update half-done', kind: 'stuck' },
    ],
    line: 'Some programs leak: they take memory and never give it back. Some tasks get stuck. Things slow down, or stop working.',
  },
  {
    name: 'Restart',
    blocks: [],
    line: 'A restart shuts everything down. Memory empties completely, taking every leak and stuck task with it.',
  },
  {
    name: 'Back to fresh',
    fresh: true,
    blocks: [
      { name: 'System', kind: 'ok' },
      { name: 'Browser', kind: 'ok' },
    ],
    line: 'Everything loads again from scratch: waiting updates finish, the network reconnects, and drivers start afresh. That’s why “turn it off and on again” fixes so much.',
  },
]

/** Why restarting fixes so many problems: memory fills, leaks and sticks, then empties (Diagram lab, 5 states). */
export function WhyRestart({ state }: LabProps) {
  const at = clampState(state, STATES.length)
  const s = STATES[at]!
  const used = s.blocks.length
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={`${s.name}. ${s.line}`} className="flex flex-col gap-2 rounded-2xl border border-line bg-sunken p-3">
        <div className="flex items-baseline justify-between text-[12px]">
          <span className="font-semibold text-ink">Memory (RAM)</span>
          <span className={cn('font-semibold', used >= 5 ? 'text-error' : 'text-ink-muted')}>{at === 3 ? 'Emptied' : `${Math.min(100, used * 20)}% used`}</span>
        </div>
        <ul className="grid min-h-[132px] grid-cols-1 content-start gap-1.5 @min-[400px]:grid-cols-2">
          {s.blocks.map((b) => (
            <li
              key={b.name}
              className={cn(
                'pop-in rounded-lg border px-2.5 py-1.5 text-[12.5px] font-semibold',
                b.kind === 'ok' ? 'border-line bg-row text-ink' : b.kind === 'leak' ? 'border-badge bg-badge/15 text-badge-text' : 'border-error bg-error/15 text-error',
              )}
            >
              {b.name}
            </li>
          ))}
          {at === 3 && <li className="pop-in col-span-full grid h-24 place-items-center rounded-lg border border-dashed border-line-strong text-[13px] text-ink-muted">Power off: memory is empty</li>}
        </ul>
      </div>
      <figcaption aria-live="polite" className={cn('flex flex-col gap-1 rounded-2xl border px-4 py-3', s.fresh ? 'border-success-fill bg-row' : 'border-line bg-row')}>
        <span className="font-display text-[15px] font-bold text-ink">{s.name}</span>
        <span className="text-[13px] leading-5 text-ink-soft">{s.line}</span>
      </figcaption>
    </figure>
  )
}
