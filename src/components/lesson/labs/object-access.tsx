'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const OBJECT: { key: string; text: string; depth: number }[] = [
  { key: '', text: 'const order = {', depth: 0 },
  { key: 'id', text: 'id: 1042,', depth: 1 },
  { key: 'item', text: "item: 'Flat white',", depth: 1 },
  { key: 'price', text: 'price: 3.2,', depth: 1 },
  { key: 'customer', text: 'customer: {', depth: 1 },
  { key: 'customer.name', text: "name: 'Amara',", depth: 2 },
  { key: 'customer.loyalty', text: 'loyalty: true,', depth: 2 },
  { key: 'customer', text: '},', depth: 1 },
  { key: 'extras', text: "extras: ['Oat milk', 'Extra shot'],", depth: 1 },
  { key: '', text: '}', depth: 0 },
]

const READS: Record<string, { lit: string[]; result: string; error?: boolean; says: string }> = {
  'order.item': { lit: ['item'], result: "'Flat white'", says: 'A dot and the key name reads one value from the object.' },
  "order['price']": { lit: ['price'], result: '3.2', says: 'Square brackets with the key as a string do the same. Use them when the key is in a variable: order[field].' },
  'order.customer.name': { lit: ['customer', 'customer.name'], result: "'Amara'", says: 'Objects can hold objects. Each dot goes one level deeper.' },
  'order.extras[1]': { lit: ['extras'], result: "'Extra shot'", says: 'extras is an array, so [1] reads its second item. Arrays count from 0.' },
  'order.tip': { lit: [], result: 'undefined', says: 'There’s no tip key. Reading a key that isn’t there gives undefined, with no error, which makes typos easy to miss.' },
  'order.tip.amount': { lit: [], result: "TypeError: Cannot read properties of undefined (reading 'amount')", error: true, says: 'order.tip is undefined, and you can’t read anything from undefined. This is the most common error in JavaScript. order.tip?.amount would give undefined instead.' },
}

/** Reading values out of an order object (Explore lab: value = an expression). */
export function ObjectAccess({ value = 'order.item' }: LabProps) {
  const r = READS[value] ?? READS['order.item']!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${value} gives ${r.result}. ${r.says}`}>
      <div className="overflow-x-auto rounded-2xl border border-line bg-row py-2 font-mono text-[12.5px] leading-6 @min-[420px]:text-[13px]">
        {OBJECT.map((l, i) => (
          <div
            key={i}
            style={{ paddingLeft: `${12 + l.depth * 16}px` }}
            className={cn('pr-3 whitespace-pre', l.key && r.lit.includes(l.key) ? 'bg-fe/15 font-bold text-ink shadow-[inset_3px_0_0_#3d5af5]' : 'text-ink-soft')}
          >
            {l.text}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1 rounded-2xl bg-[#15122a] px-4 py-3 font-mono text-[#f4f1ff]">
        <span className="text-[13px] text-[#9fb0ff]">{value}</span>
        <span className={cn('text-base font-bold [overflow-wrap:anywhere]', r.error && 'text-[#ff8f8f]')}>{r.result}</span>
      </div>
      <figcaption className="rounded-xl bg-row px-3 py-2.5 text-sm text-ink-soft">{r.says}</figcaption>
    </figure>
  )
}
