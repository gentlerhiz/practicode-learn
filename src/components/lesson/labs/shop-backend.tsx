'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const PARTS = [
  { id: 'phone', name: 'Your phone', role: 'Front end' },
  { id: 'server', name: 'The shop’s server', role: 'Back end' },
  { id: 'db', name: 'Database', role: 'Back end' },
  { id: 'pay', name: 'Payment provider', role: 'Another company’s back end' },
] as const
type Part = (typeof PARTS)[number]['id']

// Each state lights the parts at work and names the message between them.
const STATES: { lit: Part[]; message: string }[] = [
  { lit: ['phone'], message: 'POST /orders · 2 flat whites' },
  { lit: ['server'], message: 'Is this person signed in?' },
  { lit: ['server', 'db'], message: 'What does a flat white cost? Any left?' },
  { lit: ['server', 'pay'], message: 'Charge 6.40 to this card' },
  { lit: ['server', 'db'], message: 'Save order 1042' },
  { lit: ['phone', 'server'], message: '201 Created · order 1042' },
]

/** One tap on Buy, followed through the server, the database and the payment (Diagram lab, 6 states). */
export function ShopBackend({ state = 0 }: LabProps) {
  const s = STATES[Math.min(Math.max(state, 0), STATES.length - 1)]!
  const names = s.lit.map((id) => PARTS.find((p) => p.id === id)!.name).join(' and ')
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={`${names}: ${s.message}.`} className="grid grid-cols-2 gap-2 min-[560px]:grid-cols-4">
        {PARTS.map((p) => {
          const on = s.lit.includes(p.id)
          return (
            <div
              key={p.id}
              className={cn(
                'flex min-h-[76px] flex-col justify-center gap-0.5 rounded-2xl border-[1.5px] px-3 py-2 text-center motion-safe:transition-colors motion-safe:duration-250',
                on ? 'border-fe bg-[rgba(77,107,255,0.16)]' : 'border-line bg-row',
              )}
            >
              <span className={cn('text-sm font-bold', on ? 'text-ink' : 'text-ink-muted')}>{p.name}</span>
              <span className="text-[12px] leading-4 text-ink-soft">{p.role}</span>
            </div>
          )
        })}
      </div>
      <figcaption className="flex items-center gap-3 rounded-xl bg-row px-3 py-2.5 text-sm text-ink">
        <span
          aria-hidden="true"
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fe text-xs font-bold text-white"
        >
          {Math.min(Math.max(state, 0), STATES.length - 1) + 1}
        </span>
        <span className="font-mono text-[13px]">{s.message}</span>
      </figcaption>
    </figure>
  )
}
