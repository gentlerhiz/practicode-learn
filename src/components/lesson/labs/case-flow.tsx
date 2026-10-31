'use client'
import { cn } from '@/lib/cn'
import { SHELF, type ShelfBook } from './bookshop'
import type { LabProps } from './shared'
import { COL, ShelfTable } from './shelf-table'

type When = { test: string; check: (b: ShelfBook) => boolean; then: string }
type Case = { column: 'price' | 'stock'; name: string; whens: When[]; otherwise: string; says: string }

const CASES: Record<string, Case> = {
  'Price bands': {
    column: 'price',
    name: 'band',
    whens: [
      { test: 'price < 9', check: (b) => b.price < 9, then: 'Budget' },
      { test: 'price < 12', check: (b) => b.price < 12, then: 'Standard' },
    ],
    otherwise: 'Premium',
    says: 'CASE checks each WHEN from the top and uses the first that’s true. A price of 8.75 is under 12 as well, but it’s already Budget.',
  },
  'Stock levels': {
    column: 'stock',
    name: 'shelf',
    whens: [
      { test: 'stock = 0', check: (b) => b.stock === 0, then: 'Sold out' },
      { test: 'stock < 5', check: (b) => b.stock < 5, then: 'Running low' },
    ],
    otherwise: 'In stock',
    says: 'Every row gets a label, worked out on the spot. ELSE catches whatever no WHEN matched.',
  },
  'Stock levels (wrong order)': {
    column: 'stock',
    name: 'shelf',
    whens: [
      { test: 'stock < 5', check: (b) => b.stock < 5, then: 'Running low' },
      { test: 'stock = 0', check: (b) => b.stock === 0, then: 'Sold out' },
    ],
    otherwise: 'In stock',
    says: 'stock < 5 comes first, and 0 is less than 5, so sold-out books are labelled Running low. The second WHEN can never win. Put the narrowest test first.',
  },
}

/** CASE labelling every row, WHEN by WHEN (Explore lab: value = Price bands, Stock levels, or Stock levels (wrong order)). */
export function CaseFlow({ value = 'Price bands' }: LabProps) {
  const c = CASES[value] ?? CASES['Price bands']!
  const pick = (b: ShelfBook) => c.whens.findIndex((w) => w.check(b))
  const wrong = value.includes('wrong')
  return (
    <figure className="m-0 flex flex-col gap-3">
      <pre className="m-0 rounded-xl bg-row px-3 py-2 font-mono text-[12px] leading-5 whitespace-pre-wrap [overflow-wrap:anywhere] text-ink @min-[420px]:text-[12.5px]">
        {`SELECT title, ${c.column},\n  CASE\n`}
        {c.whens.map((w, i) => (
          <span key={w.test} className={cn(wrong && i === 1 && 'text-error line-through')}>
            {`    WHEN ${w.test} THEN '${w.then}'\n`}
          </span>
        ))}
        {`    ELSE '${c.otherwise}'\n  END AS ${c.name}\nFROM books;`}
      </pre>
      <ShelfTable
        rows={SHELF}
        label={`Every book with its ${c.name} label`}
        columns={[
          COL.title,
          COL[c.column],
          {
            key: c.name,
            label: c.name,
            strong: true,
            cell: (b) => {
              const i = pick(b)
              return (
                <span className="flex flex-wrap items-center gap-x-1.5">
                  {i >= 0 ? c.whens[i]!.then : c.otherwise}
                  <span className="font-mono text-[11px] font-normal text-ink-muted">{i >= 0 ? `WHEN ${i + 1}` : 'ELSE'}</span>
                </span>
              )
            },
          },
        ]}
      />
      <figcaption className={cn('rounded-xl px-3 py-2.5 text-sm text-ink-soft', wrong ? 'bg-error/10' : 'bg-row')}>{c.says}</figcaption>
    </figure>
  )
}
