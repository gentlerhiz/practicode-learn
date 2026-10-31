'use client'
import { SHELF, type ShelfBook } from './bookshop'
import type { LabProps } from './shared'
import { COL, ShelfTable } from './shelf-table'

type Filter = { test: (b: ShelfBook) => boolean; cols: (keyof typeof COL)[]; reads?: string; says: string }

const sci = (b: ShelfBook) => b.genre === 'Sci-fi'
const thriller = (b: ShelfBook) => b.genre === 'Thriller'

const FILTERS: Record<string, Filter> = {
  "genre = 'Sci-fi' AND stock > 0": { test: (b) => sci(b) && b.stock > 0, cols: ['title', 'genre', 'stock'], says: 'AND keeps a row only when both conditions are true: Sci-fi, and in stock. The Martian is Sci-fi but sold out.' },
  "genre = 'Sci-fi' OR price < 9": { test: (b) => sci(b) || b.price < 9, cols: ['title', 'genre', 'price'], says: 'OR keeps a row when either condition is true: every Sci-fi book, plus anything under 9.' },
  "NOT genre = 'Classic'": { test: (b) => b.genre !== 'Classic', cols: ['title', 'genre'], says: "NOT flips a condition: every book that isn’t a Classic. It’s the same as genre <> 'Classic'." },
  "genre = 'Thriller' OR genre = 'Sci-fi' AND stock > 0": {
    test: (b) => thriller(b) || (sci(b) && b.stock > 0),
    cols: ['title', 'genre', 'stock'],
    reads: "genre = 'Thriller' OR (genre = 'Sci-fi' AND stock > 0)",
    says: 'AND is worked out before OR, so the stock rule only applies to Sci-fi. The Silent Patient sneaks in, though it’s sold out.',
  },
  "(genre = 'Thriller' OR genre = 'Sci-fi') AND stock > 0": {
    test: (b) => (thriller(b) || sci(b)) && b.stock > 0,
    cols: ['title', 'genre', 'stock'],
    says: 'Brackets make SQL work out the OR first, so the stock rule applies to both genres. Every sold-out book is left out.',
  },
  'price BETWEEN 9 AND 11': { test: (b) => b.price >= 9 && b.price <= 11, cols: ['title', 'price'], says: 'BETWEEN includes both ends: it means price >= 9 AND price <= 11.' },
  'published BETWEEN 2010 AND 2019': { test: (b) => b.published >= 2010 && b.published <= 2019, cols: ['title', 'published'], says: 'Every book from the 2010s, 2010 and 2019 included.' },
  'price NOT BETWEEN 9 AND 11': { test: (b) => b.price < 9 || b.price > 11, cols: ['title', 'price'], says: 'NOT BETWEEN keeps everything outside the range: under 9 or over 11.' },
}

const FIRST = "genre = 'Sci-fi' AND stock > 0"

/** A WHERE condition picking rows out of the bookshop's twelve books (Explore lab: value = a condition). */
export function SqlFilter({ value = FIRST }: LabProps) {
  const f = FILTERS[value] ?? FILTERS[FIRST]!
  const kept = SHELF.filter(f.test).length
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div className="flex flex-col gap-1 rounded-xl bg-row px-3 py-2 font-mono text-[12.5px] text-ink">
        <span className="[overflow-wrap:anywhere]">
          SELECT {f.cols.join(', ')} FROM books WHERE <span className="font-bold text-da-text">{value}</span>;
        </span>
        {f.reads && (
          <span className="font-sans text-[12px] text-ink-muted">
            SQL reads it as: <span className="font-mono text-ink [overflow-wrap:anywhere]">{f.reads}</span>
          </span>
        )}
      </div>
      <ShelfTable rows={SHELF} columns={f.cols.map((c) => COL[c])} kept={f.test} label={`Rows where ${value}`} />
      <figcaption className="rounded-xl bg-row px-3 py-2.5 text-sm text-ink-soft">
        {f.says} {kept === 1 ? '1 row comes back.' : `${kept} rows come back.`}
      </figcaption>
    </figure>
  )
}
