'use client'
import { SHELF, type ShelfBook } from './bookshop'
import type { LabProps } from './shared'
import { COL, ShelfTable, type Column } from './shelf-table'

type Calc = { uses: (keyof typeof COL)[]; name: string; cell: (b: ShelfBook) => string; says: string }

// Each result is shown with the decimal places PostgreSQL gives it: multiplying a 2-place price by a
// 1-place number gives 3 places, for example.
const CALCS: Record<string, Calc> = {
  'price * stock AS stock_value': { uses: ['price', 'stock'], name: 'stock_value', cell: (b) => (b.price * b.stock).toFixed(2), says: 'A new column worked out for every row: what the copies on the shelf are worth. The table itself doesn’t change.' },
  'price * 0.9 AS sale_price': { uses: ['price'], name: 'sale_price', cell: (b) => (b.price * 0.9).toFixed(3), says: 'Ten percent off. Two decimal places times one gives three, so you’d round it for a price tag.' },
  'price + 2.5 AS with_postage': { uses: ['price'], name: 'with_postage', cell: (b) => (b.price + 2.5).toFixed(2), says: 'Add postage to every price. AS gives the new column a name; without it, PostgreSQL calls it ?column?.' },
  '2026 - published AS years_old': { uses: ['published'], name: 'years_old', cell: (b) => String(2026 - b.published), says: 'Maths works on any number column, with numbers you type in too.' },
  "title || ' by ' || author AS label": { uses: ['title', 'author'], name: 'label', cell: (b) => `${b.title} by ${b.author}`, says: '|| joins text, so you can build a sentence from columns.' },
}

const FIRST = 'price * stock AS stock_value'

/** A column worked out from others, on every row (Explore lab: value = an expression with AS). */
export function CalcColumn({ value = FIRST }: LabProps) {
  const c = CALCS[value] ?? CALCS[FIRST]!
  const columns: Column[] = [...new Set(['title', ...c.uses] as (keyof typeof COL)[])].map((k) => COL[k])
  return (
    <figure className="m-0 flex flex-col gap-3">
      <p className="m-0 rounded-xl bg-row px-3 py-2 font-mono text-[12.5px] [overflow-wrap:anywhere] text-ink">
        SELECT {[...new Set(['title', ...c.uses])].join(', ')}, <span className="font-bold text-da-text">{value}</span> FROM books;
      </p>
      <ShelfTable rows={SHELF} columns={[...columns, { key: c.name, label: c.name, strong: true, cell: c.cell }]} label={`Every book with ${c.name}`} />
      <figcaption className="rounded-xl bg-row px-3 py-2.5 text-sm text-ink-soft">{c.says}</figcaption>
    </figure>
  )
}
