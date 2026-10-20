'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

// Each state: the line just run, and the names with the values they label afterwards.
const STATES: { line: string; vars: [string, string][]; changed?: string }[] = [
  { line: 'score = 10', vars: [['score', '10']], changed: 'score' },
  { line: 'name = "Amara"', vars: [['score', '10'], ['name', '"Amara"']], changed: 'name' },
  { line: 'score = score + 5', vars: [['score', '15'], ['name', '"Amara"']], changed: 'score' },
  { line: 'best = score', vars: [['score', '15'], ['name', '"Amara"'], ['best', '15']], changed: 'best' },
]

/** Variables as name labels on values, changing one line at a time (Diagram lab, 4 states). */
export function VariableLabels({ state = 0 }: LabProps) {
  const s = STATES[Math.min(Math.max(state, 0), STATES.length - 1)]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div
        role="img"
        aria-label={`After ${s.line}: ${s.vars.map(([n, v]) => `${n} is ${v}`).join(', ')}.`}
        className="flex flex-col gap-3"
      >
        <div className="rounded-xl border border-line bg-row px-3 py-2 font-mono text-sm text-ink">{s.line}</div>
        <div className="flex flex-wrap gap-2.5">
          {s.vars.map(([name, value]) => (
            <div
              key={name}
              className={cn(
                'flex items-center overflow-hidden rounded-xl border-[1.5px] font-mono text-sm motion-safe:transition-colors',
                name === s.changed ? 'border-fe' : 'border-line',
              )}
            >
              <span
                className={cn(
                  'px-3 py-2 font-semibold',
                  name === s.changed ? 'bg-fe text-white' : 'bg-row text-ink-soft',
                )}
              >
                {name}
              </span>
              <span className="px-3 py-2 text-ink">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </figure>
  )
}
