'use client'
import { cn } from '@/lib/cn'
import { SHELF, type ShelfBook } from './bookshop'
import type { LabProps } from './shared'
import { COL, ShelfTable } from './shelf-table'

// SQL's three answers: a condition about a missing value is neither true nor false but unknown (NULL).
type Answer = true | false | null

const CASES: Record<string, { test: (b: ShelfBook) => Answer; says: string }> = {
  'rating = NULL': {
    test: () => null,
    says: 'Anything compared with NULL using = is unknown, even NULL itself, and WHERE only keeps true. So no rows come back, not even the unrated ones.',
  },
  'rating IS NULL': { test: (b) => b.rating === null, says: 'IS NULL is the way to ask whether a value is missing: the two books nobody has rated yet.' },
  'rating IS NOT NULL': { test: (b) => b.rating !== null, says: 'IS NOT NULL keeps every row that has a value.' },
  'rating >= 4.6': {
    test: (b) => (b.rating === null ? null : b.rating >= 4.6),
    says: 'For the unrated books, the answer is unknown, not false. WHERE leaves them out either way.',
  },
  'NOT rating >= 4.6': {
    test: (b) => (b.rating === null ? null : !(b.rating >= 4.6)),
    says: 'NOT of unknown is still unknown, so the unrated books are left out again. They’re in neither answer.',
  },
}

const word = (a: Answer) => (a === null ? 'NULL' : a ? 'true' : 'false')

/** How SQL treats missing values: true, false and unknown (Explore lab: value = a condition on rating). */
export function NullLogic({ value = 'rating = NULL' }: LabProps) {
  const c = CASES[value] ?? CASES['rating = NULL']!
  const kept = SHELF.filter((b) => c.test(b) === true).length
  return (
    <figure className="m-0 flex flex-col gap-3">
      <p className="m-0 rounded-xl bg-row px-3 py-2 font-mono text-[12.5px] [overflow-wrap:anywhere] text-ink">
        SELECT title, rating FROM books WHERE <span className="font-bold text-da-text">{value}</span>;
      </p>
      <ShelfTable
        rows={SHELF}
        columns={[
          COL.title,
          COL.rating,
          {
            key: 'answer',
            label: 'condition',
            strong: true,
            cell: (b) => {
              const a = c.test(b)
              return <span className={cn('font-mono', a === true ? 'text-success' : a === false ? 'text-error' : 'text-ink-muted italic')}>{word(a)}</span>
            },
          },
        ]}
        kept={(b) => c.test(b) === true}
        label={`Rows where ${value}`}
      />
      <figcaption className="rounded-xl bg-row px-3 py-2.5 text-sm text-ink-soft">
        {c.says} {kept === 1 ? '1 row comes back.' : `${kept} rows come back.`}
      </figcaption>
    </figure>
  )
}
