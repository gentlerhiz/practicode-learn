'use client'
import { CUSTOMERS, ORDERS } from './bookshop'
import type { LabProps } from './shared'
import { SqlSays, SqlTable } from './sql-table'

/** An order's foreign key leading to its customer's row (Explore lab: value = Order 1 to Order 7). */
export function KeyLinks({ value = 'Order 1' }: LabProps) {
  const order = ORDERS.find((o) => `Order ${o.id}` === value) ?? ORDERS[0]!
  const customer = CUSTOMERS.find((c) => c.id === order.customerId)!
  const theirs = ORDERS.filter((o) => o.customerId === customer.id).length
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div className="grid gap-2 @min-[480px]:grid-cols-2">
        <SqlTable
          name="orders"
          rows={ORDERS}
          rowKey={(o) => o.id}
          label="The orders table"
          tone={(o) => (o.id === order.id ? 'on' : undefined)}
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
          tone={(c) => (c.id === customer.id ? 'on' : undefined)}
          columns={[
            { key: 'id', label: 'id', cell: (c) => c.id, strong: true },
            { key: 'name', label: 'name', cell: (c) => c.name },
          ]}
        />
      </div>
      <SqlSays>
        Order {order.id} has customer_id {customer.id}, so it’s the row in customers with id {customer.id}: {customer.name}.{' '}
        {theirs === 1 ? 'That’s their only order.' : `${theirs} orders point at this one customer.`}
      </SqlSays>
    </figure>
  )
}
