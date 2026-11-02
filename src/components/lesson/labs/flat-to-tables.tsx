'use client'
import { clampState, type LabProps } from './shared'
import { SqlTable } from './sql-table'

const SHEET = [
  { order: 1, customer: 'Amara Okafor', email: 'amara@example.com', title: 'Dune' },
  { order: 2, customer: 'Chen Wei', email: 'chen@example.com', title: 'Atomic Habits' },
  { order: 3, customer: 'Amara Okafor', email: 'amara@example.com', title: 'Homegoing' },
  { order: 6, customer: 'Amara Okafor', email: 'amara.o@example.com', title: 'Gone Girl' },
]

const CUSTOMERS = [
  { id: 1, customer: 'Amara Okafor', email: 'amara.o@example.com' },
  { id: 2, customer: 'Chen Wei', email: 'chen@example.com' },
]

const ORDERS = [
  { id: 1, customerId: 1, title: 'Dune' },
  { id: 2, customerId: 2, title: 'Atomic Habits' },
  { id: 3, customerId: 1, title: 'Homegoing' },
  { id: 6, customerId: 1, title: 'Gone Girl' },
]

const LABELS = [
  'One big table: every order, with the customer’s details typed into each row',
  'The same details repeat in every order Amara places',
  'Amara changed email, but only one row was updated: which one is right?',
  'Two tables: each customer is stored once, and each order points at them by id',
]

/** One flat table of orders turning into two linked tables (Diagram lab, 4 states). */
export function FlatToTables({ state }: LabProps) {
  const at = clampState(state, LABELS.length)
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={`${LABELS[at]}.`}>
        {at < 3 ? (
          <SqlTable
            name="order_sheet"
            rows={SHEET}
            rowKey={(r) => r.order}
            label="Orders with customer details in every row"
            tone={(r) => (at === 1 && r.customer.startsWith('Amara') ? 'on' : at === 2 && r.email.startsWith('amara.o') ? 'on' : undefined)}
            columns={[
              { key: 'order', label: 'order', cell: (r) => r.order },
              { key: 'customer', label: 'customer', cell: (r) => r.customer, strong: at === 1 },
              { key: 'email', label: 'email', cell: (r) => r.email, strong: at >= 1 },
              { key: 'title', label: 'title', cell: (r) => r.title },
            ]}
          />
        ) : (
          <div className="grid gap-2 @min-[520px]:grid-cols-2">
            <SqlTable
              name="customers"
              rows={CUSTOMERS}
              rowKey={(r) => r.id}
              label="Customers, one row each"
              columns={[
                { key: 'id', label: 'id', cell: (r) => r.id, strong: true },
                { key: 'customer', label: 'name', cell: (r) => r.customer },
                { key: 'email', label: 'email', cell: (r) => r.email },
              ]}
            />
            <SqlTable
              name="orders"
              rows={ORDERS}
              rowKey={(r) => r.id}
              label="Orders, pointing at their customer"
              columns={[
                { key: 'id', label: 'id', cell: (r) => r.id },
                { key: 'customerId', label: 'customer_id', cell: (r) => r.customerId, strong: true },
                { key: 'title', label: 'title', cell: (r) => r.title },
              ]}
            />
          </div>
        )}
      </div>
      <figcaption className="rounded-xl bg-row px-3 py-2.5 text-sm text-ink">{LABELS[at]}.</figcaption>
    </figure>
  )
}
