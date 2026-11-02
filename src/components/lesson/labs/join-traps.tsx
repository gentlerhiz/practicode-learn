'use client'
import type { LabProps } from './shared'
import { SqlLine, SqlSays } from './sql-table'

const TRAPS: Record<string, { bad: string; got: string; want: string; fix: string; says: string }> = {
  'Forgot the link': {
    bad: 'SELECT COUNT(*) FROM customers, orders;',
    got: '42 rows',
    want: '7 rows',
    fix: 'FROM orders JOIN customers ON customers.id = orders.customer_id',
    says: 'With no condition, every customer pairs with every order: 6 × 7 = 42.',
  },
  'Wrong columns': {
    bad: 'FROM customers AS c JOIN orders AS o ON c.id = o.id',
    got: '6 rows, Grace with order 6',
    want: '7 rows, Emeka with order 6',
    fix: 'ON o.customer_id = c.id',
    says: 'Both are numbers, so it runs. But it matches a customer’s id with an order’s id, which has nothing to do with who ordered.',
  },
  'WHERE undoes a LEFT JOIN': {
    bad: "LEFT JOIN orders AS o ON o.customer_id = c.id\nWHERE o.ordered_on >= '2026-10-01'",
    got: '3 customers',
    want: '6 customers',
    fix: "LEFT JOIN orders AS o ON o.customer_id = c.id AND o.ordered_on >= '2026-10-01'",
    says: 'Unmatched customers have NULL in ordered_on, and WHERE throws NULL away. Put the rule in ON to keep them.',
  },
  'COUNT(*) on a LEFT JOIN': {
    bad: 'SELECT c.name, COUNT(*) ... LEFT JOIN ... GROUP BY c.name',
    got: 'Grace: 1 order',
    want: 'Grace: 0 orders',
    fix: 'COUNT(o.id)',
    says: 'COUNT(*) counts rows, and Grace has one row, full of NULLs. COUNT(o.id) skips the NULL.',
  },
  'Counting after a fan-out': {
    bad: 'COUNT(o.id) ... JOIN order_items ...',
    got: 'Amara: 5 orders',
    want: 'Amara: 3 orders',
    fix: 'COUNT(DISTINCT o.id)',
    says: 'Joining order_items gives an order one row for each book in it, so the same order is counted several times.',
  },
}

const FIRST = 'Forgot the link'

/** Five joins that run without an error and give the wrong answer (Explore lab: value = a trap's name). */
export function JoinTraps({ value = FIRST }: LabProps) {
  const t = TRAPS[value] ?? TRAPS[FIRST]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <SqlLine mark={t.bad} />
      <dl className="m-0 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-dashed border-line px-3 py-2">
          <dt className="text-xs font-semibold text-ink-soft">It gives</dt>
          <dd className="m-0 text-sm font-semibold text-ink line-through">{t.got}</dd>
        </div>
        <div className="rounded-xl border-[1.5px] border-da px-3 py-2">
          <dt className="text-xs font-semibold text-ink-soft">It should give</dt>
          <dd className="m-0 text-sm font-semibold text-ink">{t.want}</dd>
        </div>
      </dl>
      <p className="m-0 rounded-xl bg-row px-3 py-2 text-sm text-ink-soft">
        <span className="font-semibold text-ink">The fix: </span>
        <code className="font-mono text-[12.5px] [overflow-wrap:anywhere] text-ink">{t.fix}</code>
      </p>
      <SqlSays warn>No error appears. {t.says}</SqlSays>
    </figure>
  )
}
