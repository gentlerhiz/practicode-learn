'use client'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import type { ShelfBook } from './bookshop'

export type Column = { key: string; label: string; cell: (b: ShelfBook) => ReactNode; strong?: boolean }

/**
 * The books table as the SQL labs draw it: the chosen columns, rows a query keeps in green and rows it
 * leaves out struck through. A column marked strong is the one the lab is about.
 */
export function ShelfTable({
  rows,
  columns,
  kept,
  label,
}: {
  rows: ShelfBook[]
  columns: Column[]
  /** Which rows the query keeps; leave it out when every row comes back. */
  kept?: (b: ShelfBook) => boolean
  label: string
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full border-collapse text-left text-[12.5px] @min-[420px]:text-[13px]" aria-label={label}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className={cn('border-b border-line px-1.5 py-2 font-mono font-semibold @min-[400px]:px-3', c.strong ? 'text-da-text' : 'text-ink-soft')}>
                {c.label}
              </th>
            ))}
            {kept && (
              <th scope="col" className="border-b border-line py-2 @min-[400px]:px-3">
                <span className="sr-only">Kept</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => {
            const keep = kept ? kept(b) : true
            return (
              <tr key={b.id} className={cn(keep ? (kept ? 'bg-[rgba(47,230,176,0.14)] text-ink' : 'text-ink') : 'text-ink-subtle')}>
                {columns.map((c) => (
                  <td key={c.key} className={cn('border-b border-line px-1.5 py-1.5 [overflow-wrap:anywhere] @min-[400px]:px-3', !keep && 'line-through', c.strong && keep && 'font-semibold')}>
                    {c.cell(b)}
                  </td>
                ))}
                {kept && (
                  // On a phone the strike-through says it; screen readers always hear it.
                  <td className="border-b border-line py-1.5 text-xs whitespace-nowrap @min-[400px]:px-3">
                    <span className="sr-only @min-[400px]:not-sr-only">{keep ? 'Kept' : 'Left out'}</span>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const money = (n: number) => n.toFixed(2)

/** The books table's columns, ready to pick from. */
export const COL: Record<'title' | 'author' | 'genre' | 'price' | 'stock' | 'rating' | 'published', Column> = {
  title: { key: 'title', label: 'title', cell: (b) => b.title },
  author: { key: 'author', label: 'author', cell: (b) => b.author },
  genre: { key: 'genre', label: 'genre', cell: (b) => b.genre },
  price: { key: 'price', label: 'price', cell: (b) => money(b.price) },
  stock: { key: 'stock', label: 'stock', cell: (b) => b.stock },
  rating: {
    key: 'rating',
    label: 'rating',
    cell: (b) => (b.rating === null ? <span className="text-ink-subtle italic">NULL</span> : b.rating.toFixed(1)),
  },
  published: { key: 'published', label: 'published', cell: (b) => b.published },
}
