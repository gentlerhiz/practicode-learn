'use client'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'
import { SqlTable, type SqlColumn } from './sql-table'

type Row = { name: string; order?: number; book?: number; quantity?: number; title?: string }

const OF_CHEN: Row[] = [
  { name: 'Chen Wei', order: 5, book: 2, quantity: 1, title: 'Atomic Habits' },
  { name: 'Chen Wei', order: 5, book: 4, quantity: 1, title: 'Gone Girl' },
  { name: 'Chen Wei', order: 5, book: 5, quantity: 1, title: 'Homegoing' },
]

const NAME: SqlColumn<Row> = { key: 'name', label: 'name', cell: (r) => r.name }
const ORDER: SqlColumn<Row> = { key: 'order', label: 'order', cell: (r) => r.order }
const BOOK: SqlColumn<Row> = { key: 'book', label: 'book_id', cell: (r) => r.book }
const QTY: SqlColumn<Row> = { key: 'quantity', label: 'quantity', cell: (r) => r.quantity }
const TITLE: SqlColumn<Row> = { key: 'title', label: 'title', cell: (r) => r.title }

const STEPS = [
  { clause: 'FROM customers AS c', total: 6, rows: OF_CHEN.slice(0, 1), columns: [NAME], does: 'Start with the customers: 6 rows' },
  { clause: 'JOIN orders AS o', total: 7, rows: OF_CHEN.slice(0, 1), columns: [NAME, ORDER], does: 'Add their orders: 7 rows, and the 2 customers with no orders drop out' },
  { clause: 'JOIN order_items AS oi', total: 11, rows: OF_CHEN, columns: [NAME, ORDER, BOOK, QTY], does: 'Add what was in each order: 11 rows, because an order can hold several books' },
  { clause: 'JOIN books AS b', total: 11, rows: OF_CHEN, columns: [NAME, ORDER, QTY, TITLE], does: 'Add each book’s details: still 11 rows, because each item is exactly one book' },
]

/** Four tables joined one at a time, following one order through (Diagram lab, 4 states). */
export function JoinChain({ state }: LabProps) {
  const at = clampState(state, STEPS.length)
  const s = STEPS[at]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={`Step ${at + 1}: ${s.clause}. ${s.does}.`} className="flex flex-col gap-2">
        <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
          {STEPS.map((x, i) => (
            <li key={x.clause} className={cn('flex items-center gap-3 rounded-xl border-[1.5px] px-3 py-1.5', i === at ? 'border-da bg-[rgba(47,230,176,0.14)]' : i < at ? 'border-line bg-row' : 'border-line')}>
              <span className={cn('font-mono text-[12.5px] font-semibold', i <= at ? 'text-ink' : 'text-ink-muted')}>{x.clause}</span>
              <span className="ml-auto shrink-0 text-xs text-ink-soft">{i <= at ? `${x.total} rows` : ''}</span>
            </li>
          ))}
        </ol>
        <SqlTable name="following Chen’s order 5" rows={s.rows} rowKey={(r, i) => `${r.name}-${i}`} label="The rows for order 5 so far" columns={s.columns} />
      </div>
      <figcaption className="rounded-xl bg-row px-3 py-2.5 text-sm text-ink">{s.does}.</figcaption>
    </figure>
  )
}
