'use client'
import { cn } from '@/lib/cn'
import { SHELF } from './bookshop'
import { clampState, type LabProps } from './shared'

// The order a database runs a grouped query in: WHERE filters rows, then HAVING filters groups.
const STEPS = [
  { clause: 'FROM books', does: 'Start with every row: 12 books' },
  { clause: 'WHERE stock > 0', does: 'Filter rows, one at a time: 3 sold-out books go, leaving 9' },
  { clause: 'GROUP BY genre', does: 'Sort those 9 rows into piles: 5 groups' },
  { clause: 'HAVING COUNT(*) >= 2', does: 'Filter groups by their totals: Fiction has only 1 book left, so it goes' },
  { clause: 'SELECT genre, COUNT(*)', does: 'Work out the columns for the groups that are left' },
  { clause: 'ORDER BY genre', does: 'Sort the answer: 4 rows' },
]

const inStock = SHELF.filter((b) => b.stock > 0)
const GROUPS = [...new Set(inStock.map((b) => b.genre))].sort().map((genre) => ({ genre, books: inStock.filter((b) => b.genre === genre).length }))

const Chip = ({ text, out }: { text: string; out?: boolean }) => (
  <li className={cn('rounded-lg border px-2 py-1 text-xs', out ? 'border-dashed border-line text-ink-subtle line-through' : 'border-line text-ink')}>{text}</li>
)

/** A grouped query run clause by clause, with the rows or groups left at each one (Diagram lab, 6 states). */
export function GroupPipeline({ state }: LabProps) {
  const at = clampState(state, STEPS.length)
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={`Step ${at + 1}: ${STEPS[at]!.clause}. ${STEPS[at]!.does}.`} className="flex flex-col gap-1.5">
        {STEPS.map((s, i) => (
          <div key={s.clause} className={cn('flex items-center gap-3 rounded-xl border-[1.5px] px-3 py-1.5 motion-safe:transition-colors', i === at ? 'border-da bg-[rgba(47,230,176,0.14)]' : i < at ? 'border-line bg-row' : 'border-line')}>
            <span className={cn('flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold', i <= at ? 'bg-da text-white' : 'bg-row text-ink-muted')}>{i + 1}</span>
            <span className={cn('font-mono text-[12.5px] font-semibold [overflow-wrap:anywhere]', i <= at ? 'text-ink' : 'text-ink-muted')}>{s.clause}</span>
          </div>
        ))}
      </div>
      <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0" aria-hidden="true">
        {at < 2
          ? SHELF.map((b) => <Chip key={b.id} text={b.title} out={at === 1 && b.stock === 0} />)
          : GROUPS.map((g) => <Chip key={g.genre} text={`${g.genre}: ${g.books}`} out={at >= 3 && g.books < 2} />)}
      </ul>
      <figcaption className="rounded-xl bg-row px-3 py-2.5 text-sm text-ink">{STEPS[at]!.does}.</figcaption>
    </figure>
  )
}
