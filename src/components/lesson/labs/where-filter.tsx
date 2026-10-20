'use client'
import { cn } from '@/lib/cn'
import { BOOKS, money, type Book } from './bookshop'
import type { LabProps } from './shared'

const FILTERS: Record<string, { test: (b: Book) => boolean; says: string }> = {
  'price < 10': { test: (b) => b.price < 10, says: 'Rows whose price is less than 10.' },
  "genre = 'Classic'": {
    test: (b) => b.genre === 'Classic',
    says: 'Text goes in single quotes, and = means exactly equal.',
  },
  'stock = 0': { test: (b) => b.stock === 0, says: 'Books that have sold out.' },
  'price >= 10': { test: (b) => b.price >= 10, says: '>= means greater than or equal to, so 10.00 itself would count.' },
}

/** WHERE picking rows out of the books table (Explore lab: value = a condition). */
export function WhereFilter({ value = 'price < 10' }: LabProps) {
  const f = FILTERS[value] ?? FILTERS['price < 10']!
  const kept = BOOKS.filter(f.test)
  return (
    <figure className="m-0 flex flex-col gap-3">
      <p className="m-0 rounded-xl bg-row px-3 py-2 font-mono text-[13px] text-ink">
        SELECT title, genre, price, stock FROM books WHERE <span className="font-bold text-da-text">{value}</span>;
      </p>
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full border-collapse text-left text-[13px]" aria-label={`Rows where ${value}`}>
          <thead>
            <tr>
              {['title', 'genre', 'price', 'stock', ''].map((c) => (
                <th key={c || 'kept'} className="border-b border-line px-3 py-2 font-mono font-semibold text-ink-soft">
                  {c || <span className="sr-only">Kept</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BOOKS.map((b) => {
              const keep = f.test(b)
              return (
                <tr key={b.id} className={cn(keep ? 'bg-[rgba(47,230,176,0.14)] text-ink' : 'text-ink-subtle line-through')}>
                  <td className="border-b border-line px-3 py-1.5">{b.title}</td>
                  <td className="border-b border-line px-3 py-1.5">{b.genre}</td>
                  <td className="border-b border-line px-3 py-1.5">{money(b.price)}</td>
                  <td className="border-b border-line px-3 py-1.5">{b.stock}</td>
                  <td className="border-b border-line px-3 py-1.5 text-xs no-underline">{keep ? 'Kept' : 'Left out'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <figcaption className="rounded-xl bg-row px-3 py-2.5 text-sm text-ink-soft">
        {f.says} {kept.length === 1 ? '1 row comes back.' : `${kept.length} rows come back.`}
      </figcaption>
    </figure>
  )
}
