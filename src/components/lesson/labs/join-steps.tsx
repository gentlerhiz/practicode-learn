'use client'
import { CUSTOMERS, ORDERS } from './bookshop'
import { clampState, type LabProps } from './shared'
import { SqlTable } from './sql-table'

const LABELS = [
  'Two tables, linked by orders.customer_id and customers.id',
  'Take order 1. Its customer_id is 1, so look for the customer with id 1',
  'They match, so the two rows join into one row of the result',
  'Every order finds its customer: 7 rows. Daniela and Grace have no orders, so they don’t appear',
]

const nameOf = (id: number) => CUSTOMERS.find((c) => c.id === id)!.name

/** An inner join built row by row (Diagram lab, 4 states). */
export function JoinSteps({ state }: LabProps) {
  const at = clampState(state, LABELS.length)
  const rows = at < 2 ? [] : at === 2 ? ORDERS.slice(0, 1) : ORDERS
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={`${LABELS[at]}.`} className="flex flex-col gap-2">
        <div className="grid gap-2 @min-[480px]:grid-cols-2">
          <SqlTable
            name="orders"
            rows={ORDERS}
            rowKey={(o) => o.id}
            label="The orders table"
            tone={(o) => (at >= 1 && at <= 2 && o.id === 1 ? 'on' : undefined)}
            columns={[
              { key: 'id', label: 'id', cell: (o) => o.id },
              { key: 'customer_id', label: 'customer_id', cell: (o) => o.customerId, strong: true },
            ]}
          />
          <SqlTable
            name="customers"
            rows={CUSTOMERS}
            rowKey={(c) => c.id}
            label="The customers table"
            tone={(c) => (at >= 1 && at <= 2 && c.id === 1 ? 'on' : at === 3 && !ORDERS.some((o) => o.customerId === c.id) ? 'off' : undefined)}
            columns={[
              { key: 'id', label: 'id', cell: (c) => c.id, strong: true },
              { key: 'name', label: 'name', cell: (c) => c.name },
            ]}
          />
        </div>
        {rows.length > 0 && (
          <SqlTable
            name="result"
            rows={rows}
            rowKey={(o) => o.id}
            label="The joined rows"
            columns={[
              { key: 'order', label: 'order', cell: (o) => o.id },
              { key: 'name', label: 'name', cell: (o) => nameOf(o.customerId), strong: true },
              { key: 'date', label: 'ordered_on', cell: (o) => o.orderedOn },
            ]}
          />
        )}
      </div>
      <figcaption className="rounded-xl bg-row px-3 py-2.5 text-sm text-ink">{LABELS[at]}.</figcaption>
    </figure>
  )
}
