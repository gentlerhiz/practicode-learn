'use client'
import { Bug, ClipboardList, Code2, Eye, Lightbulb, Rocket, Wrench } from 'lucide-react'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

const STAGES = [
  { icon: Lightbulb, name: 'Understand', line: 'Find out what people need. A clinic wants patients to book appointments online, without phoning.' },
  { icon: ClipboardList, name: 'Plan', line: 'Break it into small pieces: a calendar, a booking form, a confirmation email. Decide what to build first.' },
  { icon: Code2, name: 'Write code', line: 'Write the instructions, in a programming language, one small piece at a time.' },
  { icon: Bug, name: 'Test', line: 'Check it does what it should, by hand and with automatic tests. What if two people book the same slot?' },
  { icon: Wrench, name: 'Fix', line: 'Tests find bugs: mistakes in the code. Fixing them is a normal, everyday part of the job.' },
  { icon: Eye, name: 'Review', line: 'Another developer reads the changes before they go live, to catch what the author missed.' },
  { icon: Rocket, name: 'Release', line: 'The new version goes live. Then feedback arrives, and the cycle starts again with the next improvement.' },
]

/** How software gets made, as a cycle that repeats (Diagram lab, 7 states). */
export function DevCycle({ state }: LabProps) {
  const at = clampState(state, STAGES.length)
  const s = STAGES[at]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={`${s.name}. ${s.line}`} className="relative mx-auto aspect-square w-full max-w-[300px]">
        <svg viewBox="0 0 200 200" aria-hidden="true" className="absolute inset-0 h-full w-full">
          <circle cx="100" cy="100" r="74" fill="none" stroke="var(--pc-line-control)" strokeWidth="2" strokeDasharray="4 5" />
          <path d="M100 26 a74 74 0 0 1 8 0.4" fill="none" stroke="var(--pc-it-text)" strokeWidth="2.5" markerEnd="url(#cycle-arrow)" />
          <defs>
            <marker id="cycle-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0 L10 5 L0 10 Z" fill="var(--pc-it-text)" />
            </marker>
          </defs>
        </svg>
        {STAGES.map((st, i) => {
          const angle = (i / STAGES.length) * 2 * Math.PI - Math.PI / 2
          const x = 50 + 37 * Math.cos(angle)
          const y = 50 + 37 * Math.sin(angle)
          const Icon = st.icon
          return (
            <span
              key={st.name}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <span
                className={cn(
                  'grid size-10 place-items-center rounded-full border-[1.5px] motion-safe:transition-all motion-safe:duration-300',
                  i === at ? 'border-it bg-it text-white outline-2 outline-offset-2 outline-it/50' : i < at ? 'border-it bg-row text-it-text' : 'border-line bg-row text-ink-subtle',
                )}
              >
                <Icon size={17} aria-hidden="true" />
              </span>
              <span className={cn('text-[10.5px] font-semibold whitespace-nowrap', i === at ? 'text-ink' : 'text-ink-muted')}>{st.name}</span>
            </span>
          )
        })}
        <span className="absolute inset-0 grid place-items-center">
          <span className="text-center text-[11px] leading-4 text-ink-subtle">
            and round
            <br />
            again
          </span>
        </span>
      </div>
      <figcaption aria-live="polite" className="flex flex-col gap-1 rounded-2xl border border-line bg-row px-4 py-3">
        <span className="font-display text-[15px] font-bold text-ink">{s.name}</span>
        <span className="text-[13px] leading-5 text-ink-soft">{s.line}</span>
      </figcaption>
    </figure>
  )
}
