'use client'
import { SHELF, type ShelfBook } from './bookshop'
import type { LabProps } from './shared'
import { COL, ShelfTable } from './shelf-table'

const SAYS: Record<string, string> = {
  "title LIKE 'The%'": '% stands for any number of characters, even none. So The% means: starts with The.',
  "title LIKE '%Sun'": 'With % at the front: ends with Sun.',
  "title LIKE '%of%'": '% at both ends: of appears anywhere in the title.',
  "title LIKE '_u%'": '_ stands for exactly one character. So _u% means: u is the second letter.',
  "title LIKE 'the%'": 'LIKE is case-sensitive in PostgreSQL: a small t doesn’t match a capital T, so nothing comes back.',
  "title ILIKE 'the%'": 'ILIKE ignores capitals, so the% matches The as well.',
  "author LIKE '%Weir'": 'LIKE works on any text column: every book whose author ends with Weir.',
}

/** A LIKE or ILIKE pattern, turned into the test it really is. */
function matcher(value: string): { column: 'title' | 'author'; test: (b: ShelfBook) => boolean } {
  const m = /^(title|author) (I?LIKE) '(.*)'$/.exec(value)
  if (!m) return matcher("title LIKE 'The%'")
  const source = m[3]!
    .split('')
    .map((c) => (c === '%' ? '.*' : c === '_' ? '.' : c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    .join('')
  const re = new RegExp(`^${source}$`, m[2] === 'ILIKE' ? 'i' : '')
  const column = m[1] as 'title' | 'author'
  return { column, test: (b) => re.test(b[column]) }
}

/** Text search with LIKE and its wildcards, % and _ (Explore lab: value = a pattern on a column). */
export function LikePattern({ value = "title LIKE 'The%'" }: LabProps) {
  const { column, test } = matcher(value)
  const kept = SHELF.filter(test).length
  return (
    <figure className="m-0 flex flex-col gap-3">
      <p className="m-0 rounded-xl bg-row px-3 py-2 font-mono text-[12.5px] [overflow-wrap:anywhere] text-ink">
        SELECT {column} FROM books WHERE <span className="font-bold text-da-text">{value}</span>;
      </p>
      <ShelfTable rows={SHELF} columns={[{ ...COL[column], strong: true }]} kept={test} label={`Rows where ${value}`} />
      <figcaption className="rounded-xl bg-row px-3 py-2.5 text-sm text-ink-soft">
        {SAYS[value] ?? SAYS["title LIKE 'The%'"]} {kept === 1 ? '1 row comes back.' : `${kept} rows come back.`}
      </figcaption>
    </figure>
  )
}
