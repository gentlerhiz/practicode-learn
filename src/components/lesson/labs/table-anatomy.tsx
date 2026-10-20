'use client'
import { cn } from '@/lib/cn'
import { BOOKS, money } from './bookshop'
import type { LabProps } from './shared'

const COLUMNS = ['id', 'title', 'genre', 'price'] as const
const LABELS = [
  'The table: books, one table for one kind of thing',
  'A column: price, one detail, with the same type in every row',
  'A row: one book, with a value in every column',
  'The primary key: id, a value no two rows share',
]

/** A table, a column, a row and a primary key, one at a time (Diagram lab, 4 states). */
export function TableAnatomy({ state = 0 }: LabProps) {
  const at = Math.min(Math.max(state, 0), LABELS.length - 1)
  const lit = (row: number, col: (typeof COLUMNS)[number]) =>
    at === 0 || (at === 1 && col === 'price') || (at === 2 && row === 1) || (at === 3 && col === 'id')
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={`${LABELS[at]}.`} className="overflow-x-auto rounded-2xl border border-line">
        <p className="m-0 border-b border-line bg-row px-3 py-2 font-mono text-xs font-semibold text-ink-soft">books</p>
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr>
              {COLUMNS.map((c) => (
                <th
                  key={c}
                  className={cn(
                    'border-b border-line px-3 py-2 font-mono font-semibold motion-safe:transition-colors',
                    lit(-1, c) && at !== 0 ? 'bg-[rgba(47,230,176,0.18)] text-ink' : 'text-ink-soft',
                  )}
                >
                  {c}
                  {c === 'id' && at === 3 && <span className="ml-1.5 font-sans text-[11px] text-da-text">key</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BOOKS.slice(0, 4).map((b, row) => (
              <tr key={b.id}>
                {COLUMNS.map((c) => (
                  <td
                    key={c}
                    className={cn(
                      'border-b border-line px-3 py-1.5 motion-safe:transition-colors',
                      lit(row, c) && at !== 0 ? 'bg-[rgba(47,230,176,0.18)] text-ink' : 'text-ink-soft',
                    )}
                  >
                    {c === 'price' ? money(b.price) : b[c]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="flex items-start gap-3 rounded-xl bg-row px-3 py-2.5 text-sm text-ink">
        <span
          aria-hidden="true"
          className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-da text-xs font-bold text-white"
        >
          {at + 1}
        </span>
        {LABELS[at]}.
      </figcaption>
    </figure>
  )
}
