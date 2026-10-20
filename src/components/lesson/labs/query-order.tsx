'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

// The order a database runs a query's clauses in, which isn't the order they're written in.
const STEPS = [
  { clause: 'FROM books', does: 'Start with every row of the books table: 6 rows' },
  { clause: 'WHERE price < 12', does: 'Keep only the rows that match: 4 rows' },
  { clause: 'SELECT title, price', does: 'Keep only the columns asked for' },
  { clause: 'ORDER BY price DESC', does: 'Sort what’s left, highest price first' },
  { clause: 'LIMIT 2', does: 'Return just the first 2 rows' },
]

/** A query run clause by clause, in the order the database runs them (Diagram lab, 5 states). */
export function QueryOrder({ state = 0 }: LabProps) {
  const at = Math.min(Math.max(state, 0), STEPS.length - 1)
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={`Step ${at + 1}: ${STEPS[at]!.clause}. ${STEPS[at]!.does}.`} className="flex flex-col gap-1.5">
        {STEPS.map((s, i) => (
          <div
            key={s.clause}
            className={cn(
              'flex items-center gap-3 rounded-xl border-[1.5px] px-3 py-2 motion-safe:transition-colors',
              i === at ? 'border-da bg-[rgba(47,230,176,0.14)]' : i < at ? 'border-line bg-row' : 'border-line',
            )}
          >
            <span
              className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                i <= at ? 'bg-da text-white' : 'bg-row text-ink-muted',
              )}
            >
              {i + 1}
            </span>
            <span className={cn('font-mono text-[13px] font-semibold', i <= at ? 'text-ink' : 'text-ink-muted')}>
              {s.clause}
            </span>
            <span className="ml-auto hidden text-right text-xs text-ink-soft min-[560px]:block">{i === at ? s.does : ''}</span>
          </div>
        ))}
      </div>
      <figcaption className="rounded-xl bg-row px-3 py-2.5 text-sm text-ink">{STEPS[at]!.does}.</figcaption>
    </figure>
  )
}
