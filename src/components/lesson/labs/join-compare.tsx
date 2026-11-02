'use client'
import { CUSTOMERS, ORDERS } from './bookshop'
import type { LabProps } from './shared'
import { Null, SqlLine, SqlSays, SqlTable } from './sql-table'

type Row = { name: string; order: number | null }

// Every customer with each of their orders, or one row with no order: the LEFT JOIN's result.
const LEFT: Row[] = CUSTOMERS.flatMap((c): Row[] => {
  const theirs = ORDERS.filter((o) => o.customerId === c.id)
  return theirs.length ? theirs.map((o) => ({ name: c.name, order: o.id })) : [{ name: c.name, order: null }]
})

const MODES: Record<string, { join: string; tail?: string; rows: Row[]; says: string }> = {
  'INNER JOIN': { join: 'JOIN', rows: LEFT.filter((r) => r.order !== null), says: 'Only rows with a match on both sides: 7 orders. Daniela and Grace have disappeared.' },
  'LEFT JOIN': { join: 'LEFT JOIN', rows: LEFT, says: 'Every customer stays. Daniela and Grace have no matching order, so the order columns are NULL. 9 rows.' },
  'Only the unmatched': { join: 'LEFT JOIN', tail: 'WHERE o.id IS NULL', rows: LEFT.filter((r) => r.order === null), says: 'After a LEFT JOIN, NULL in a column that can’t otherwise be NULL means there was no match: the customers who have never ordered.' },
}

const FIRST = 'INNER JOIN'

/** The same two tables with INNER JOIN and LEFT JOIN (Explore lab: value = INNER JOIN, LEFT JOIN or Only the unmatched). */
export function JoinCompare({ value = FIRST }: LabProps) {
  const m = MODES[value] ?? MODES[FIRST]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <SqlLine before={'SELECT c.name, o.id AS order_id\nFROM customers AS c\n'} mark={m.join} after={` orders AS o ON o.customer_id = c.id${m.tail ? `\n${m.tail}` : ''};`} />
      <SqlTable<Row>
        rows={m.rows}
        rowKey={(r) => `${r.name}-${r.order}`}
        label={`The result of ${value}`}
        tone={(r) => (r.order === null ? 'on' : undefined)}
        columns={[
          { key: 'name', label: 'name', cell: (r) => r.name },
          { key: 'order_id', label: 'order_id', cell: (r) => r.order ?? <Null />, strong: true },
        ]}
      />
      <SqlSays>{m.says}</SqlSays>
    </figure>
  )
}
