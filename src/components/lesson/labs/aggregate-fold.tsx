'use client'
import { cn } from '@/lib/cn'
import { SHELF } from './bookshop'
import type { LabProps } from './shared'
import { SqlLine, SqlSays } from './sql-table'

type Column = 'price' | 'stock' | 'rating'
type Fold = { column: Column; skipsNull?: boolean; pick?: 'min' | 'max'; result: string; says: string }

// Results exactly as PostgreSQL prints them, so AVG shows its long decimals until the rounding lesson.
const FOLDS: Record<string, Fold> = {
  'COUNT(*)': { column: 'rating', result: '12', says: 'COUNT(*) counts rows, so it doesn’t care what’s in them. The two NULL ratings still count.' },
  'COUNT(rating)': { column: 'rating', skipsNull: true, result: '10', says: 'COUNT of a column counts the values that aren’t NULL, so the two unrated books are skipped.' },
  'SUM(stock)': { column: 'stock', result: '56', says: 'SUM adds up every value: 56 copies on the shelves.' },
  'AVG(rating)': { column: 'rating', skipsNull: true, result: '4.5000000000000000', says: 'AVG adds up the values and divides by how many there are: 45 ÷ 10. The NULLs aren’t treated as 0, they’re left out.' },
  'MIN(price)': { column: 'price', pick: 'min', result: '6.50', says: 'MIN finds the smallest value.' },
  'MAX(price)': { column: 'price', pick: 'max', result: '14.20', says: 'MAX finds the largest value.' },
}

const FIRST = 'COUNT(*)'
const show = (v: number | null, column: Column) => (v === null ? 'NULL' : column === 'price' ? v.toFixed(2) : column === 'rating' ? v.toFixed(1) : String(v))

/** A column of twelve values folding into one answer (Explore lab: value = an aggregate function). */
export function AggregateFold({ value = FIRST }: LabProps) {
  const f = FOLDS[value] ?? FOLDS[FIRST]!
  const values = SHELF.map((b) => b[f.column])
  const numbers = values.filter((v): v is number => v !== null)
  const target = f.pick === 'min' ? Math.min(...numbers) : f.pick === 'max' ? Math.max(...numbers) : null
  return (
    <figure className="m-0 flex flex-col gap-3">
      <SqlLine before="SELECT " mark={value} after=" FROM books;" />
      <ul className="m-0 grid list-none grid-cols-3 gap-1.5 p-0 @min-[420px]:grid-cols-4" aria-label={`The ${f.column} of each of the 12 books`}>
        {values.map((v, i) => {
          const skipped = v === null && f.skipsNull
          return (
            <li
              key={SHELF[i]!.id}
              className={cn(
                'rounded-lg border px-2 py-1.5 text-center font-mono text-[12.5px]',
                skipped ? 'border-dashed border-line text-ink-subtle line-through' : v === target ? 'border-da bg-[rgba(47,230,176,0.14)] font-bold text-ink' : 'border-line text-ink',
              )}
            >
              {show(v, f.column)}
            </li>
          )
        })}
      </ul>
      <div className="flex items-center gap-3 rounded-xl border-[1.5px] border-da px-3 py-2">
        <span className="shrink-0 text-xs font-semibold text-ink-soft">1 row back</span>
        <span className="ml-auto font-mono text-base font-bold [overflow-wrap:anywhere] text-ink">{f.result}</span>
      </div>
      <SqlSays>{f.says}</SqlSays>
    </figure>
  )
}
