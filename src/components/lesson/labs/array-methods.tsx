'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const ORDERS = [
  { id: 1, item: 'Flat white', price: 3.2, paid: true },
  { id: 2, item: 'Croissant', price: 2.8, paid: false },
  { id: 3, item: 'Espresso', price: 2.5, paid: true },
  { id: 4, item: 'Flat white', price: 3.2, paid: false },
]
type Order = (typeof ORDERS)[number]
const show = (o: Order) => `{ id: ${o.id}, item: '${o.item}', … }`

type Method = {
  code: string
  /** What the callback gives for each order; null once find has stopped. */
  each: (o: Order, i: number) => string | null
  result: string
  kept: (o: Order, i: number) => boolean
  says: string
}

const firstEspresso = ORDERS.findIndex((o) => o.item === 'Espresso')

const METHODS: Record<string, Method> = {
  map: {
    code: 'orders.map((order) => order.item)',
    each: (o) => `'${o.item}'`,
    kept: () => true,
    result: "['Flat white', 'Croissant', 'Espresso', 'Flat white']",
    says: 'map runs the function on every item and collects what it returns: a new array, the same length. 4 in, 4 out.',
  },
  filter: {
    code: 'orders.filter((order) => order.paid)',
    each: (o) => String(o.paid),
    kept: (o) => o.paid,
    result: `[${ORDERS.filter((o) => o.paid).map(show).join(', ')}]`,
    says: 'filter keeps the items whose function returns true. A new array, often shorter: 4 in, 2 out.',
  },
  find: {
    code: "orders.find((order) => order.item === 'Espresso')",
    each: (o, i) => (i > firstEspresso ? null : String(o.item === 'Espresso')),
    kept: (o) => o.item === 'Espresso',
    result: show(ORDERS[firstEspresso]!),
    says: 'find returns the first item whose function returns true, and stops looking. Not an array: one item.',
  },
  'find (no match)': {
    code: "orders.find((order) => order.item === 'Tea')",
    each: () => 'false',
    kept: () => false,
    result: 'undefined',
    says: 'Nothing matched, so find returns undefined. Check for that before you use the result.',
  },
}

/** map, filter and find on a list of orders (Explore lab: value = a method). */
export function ArrayMethods({ value = 'map' }: LabProps) {
  const m = METHODS[value] ?? METHODS.map!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${m.code} gives ${m.result}. ${m.says}`}>
      <code className="block rounded-2xl bg-[#15122a] px-4 py-3 font-mono text-[13px] text-[#f4f1ff] [overflow-wrap:anywhere]">{m.code}</code>
      <table className="w-full border-collapse text-left text-[12.5px]">
        <thead>
          <tr className="text-[12px] text-ink-muted">
            <th className="px-2 py-1 font-medium">order</th>
            <th className="px-2 py-1 font-medium">function returns</th>
          </tr>
        </thead>
        <tbody>
          {ORDERS.map((o, i) => {
            const r = m.each(o, i)
            const kept = r !== null && m.kept(o, i)
            return (
              <tr key={o.id} className={cn('border-t border-line-subtle', kept && 'bg-success/12', r === null && 'text-ink-subtle')}>
                <td className="px-2 py-1.5 font-mono">
                  {o.id} · {o.item} · {o.paid ? 'paid' : 'not paid'}
                </td>
                <td className="px-2 py-1.5 font-mono">{r ?? 'not checked'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="flex flex-col gap-1 rounded-xl border border-line bg-row px-3 py-2.5">
        <span className="text-[12px] text-ink-muted">Result</span>
        <code className="font-mono text-[13px] font-bold text-ink [overflow-wrap:anywhere]">{m.result}</code>
        <span className="text-sm text-ink-soft">{m.says}</span>
      </div>
    </figure>
  )
}
