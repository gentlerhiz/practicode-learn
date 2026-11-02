'use client'
import { SALES, type Sale } from './bookshop'
import type { LabProps } from './shared'
import { SqlLine, SqlSays, SqlTable } from './sql-table'

type Key = 'city' | 'genre' | 'title'
const CHOICES: Record<string, { columns: Key[]; says: string }> = {
  city: { columns: ['city'], says: 'Sixteen sales, but only four cities.' },
  genre: { columns: ['genre'], says: 'Each genre stays once, wherever it first appeared.' },
  title: { columns: ['title'], says: 'Some titles sold more than once, so they collapse into one row.' },
  'city and genre': { columns: ['city', 'genre'], says: 'DISTINCT looks at the whole row. Lagos stays five times, because it’s a different row with each genre.' },
}

const FIRST = 'city'

/** DISTINCT crossing out repeated rows (Explore lab: value = the columns chosen). */
export function DistinctRows({ value = FIRST }: LabProps) {
  const c = CHOICES[value] ?? CHOICES[FIRST]!
  const seen = new Set<string>()
  const repeat = SALES.map((s) => {
    const key = c.columns.map((k) => s[k]).join('|')
    const again = seen.has(key)
    seen.add(key)
    return again
  })
  return (
    <figure className="m-0 flex flex-col gap-3">
      <SqlLine before="SELECT " mark="DISTINCT" after={` ${c.columns.join(', ')} FROM sales;`} />
      <SqlTable<Sale>
        rows={SALES}
        rowKey={(s) => s.id}
        label={`Sales, with repeats of ${value} crossed out`}
        tone={(_, i) => (repeat[i] ? 'off' : 'on')}
        columns={c.columns.map((k) => ({ key: k, label: k, cell: (s) => s[k], strong: true }))}
      />
      <SqlSays>
        {c.says} 16 rows become {seen.size}.
      </SqlSays>
    </figure>
  )
}
