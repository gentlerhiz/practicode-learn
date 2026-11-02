'use client'
import { SHELF, money, type ShelfBook } from './bookshop'
import type { LabProps } from './shared'
import { SqlLine, SqlSays } from './sql-table'

type Sum = { show: (b: ShelfBook) => string; fold: (books: ShelfBook[]) => string; says: string }

const prices = (books: ShelfBook[]) => books.map((b) => b.price)

const SUMS: Record<string, Sum> = {
  'COUNT(*)': { show: () => '1', fold: (books) => String(books.length), says: 'Each pile gets its own count.' },
  'SUM(stock)': { show: (b) => String(b.stock), fold: (books) => String(books.reduce((n, b) => n + b.stock, 0)), says: 'SUM now adds up inside each pile, not across the whole table.' },
  'MAX(price)': { show: (b) => money(b.price), fold: (books) => money(Math.max(...prices(books))), says: 'MAX finds the dearest book in each pile.' },
  'MIN(price)': { show: (b) => money(b.price), fold: (books) => money(Math.min(...prices(books))), says: 'MIN finds the cheapest book in each pile.' },
}

const FIRST = 'COUNT(*)'
const GENRES = [...new Set(SHELF.map((b) => b.genre))].sort()

/** Rows sorted into piles by genre, each pile folding into one row (Explore lab: value = an aggregate). */
export function GroupPiles({ value = FIRST }: LabProps) {
  const s = SUMS[value] ?? SUMS[FIRST]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <SqlLine before="SELECT genre, " mark={value} after=" FROM books GROUP BY genre;" />
      <ul className="m-0 grid list-none gap-2 p-0 @min-[480px]:grid-cols-2">
        {GENRES.map((genre) => {
          const books = SHELF.filter((b) => b.genre === genre)
          return (
            <li key={genre} className="flex flex-col rounded-xl border border-line">
              <ul className="m-0 flex list-none flex-col gap-0.5 p-2 text-xs text-ink-soft">
                {books.map((b) => (
                  <li key={b.id} className="flex justify-between gap-3">
                    <span className="[overflow-wrap:anywhere]">{b.title}</span>
                    <span className="font-mono">{s.show(b)}</span>
                  </li>
                ))}
              </ul>
              <p className="m-0 mt-auto flex justify-between gap-3 rounded-b-xl bg-[rgba(47,230,176,0.14)] px-2 py-1.5 font-mono text-[13px] font-bold text-ink">
                <span>{genre}</span>
                <span>{s.fold(books)}</span>
              </p>
            </li>
          )
        })}
      </ul>
      <SqlSays>{s.says} Five genres, so five rows come back, one for each pile.</SqlSays>
    </figure>
  )
}
