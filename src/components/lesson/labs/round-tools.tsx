'use client'
import type { LabProps } from './shared'
import { SqlLine, SqlSays, SqlTable } from './sql-table'

const VALUES = ['8.75', '10.99', '9.25', '1234.5', '4.6666666666666667']

// Each result as PostgreSQL gives it, in the order of VALUES.
const TOOLS: Record<string, { sql: string; results: string[]; says: string }> = {
  'Nearest whole number': { sql: 'ROUND(x)', results: ['9', '11', '9', '1235', '5'], says: 'ROUND goes to the nearest value, and a half goes up.' },
  'One decimal place': { sql: 'ROUND(x, 1)', results: ['8.8', '11.0', '9.3', '1234.5', '4.7'], says: 'The second number says how many decimal places to keep.' },
  'Always up': { sql: 'CEIL(x)', results: ['9', '11', '10', '1235', '5'], says: 'CEIL goes up to the next whole number, even from 9.25. Use it for things that only come whole, such as boxes.' },
  'Always down': { sql: 'FLOOR(x)', results: ['8', '10', '9', '1234', '4'], says: 'FLOOR goes down to the whole number below, even from 10.99.' },
  'Written as money': { sql: "TO_CHAR(x, 'FM999,990.00')", results: ['8.75', '10.99', '9.25', '1,234.50', '4.67'], says: 'TO_CHAR writes a number the way you want to read it, with a comma and two places. The result is text, not a number.' },
}

const FIRST = 'Nearest whole number'

/** Five values through the tools that tidy numbers (Explore lab: value = a tool). */
export function RoundTools({ value = FIRST }: LabProps) {
  const t = TOOLS[value] ?? TOOLS[FIRST]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <SqlLine before="SELECT x, " mark={t.sql} after=";" />
      <SqlTable<string>
        rows={VALUES}
        rowKey={(v) => v}
        label={`Five values with ${value}`}
        columns={[
          { key: 'x', label: 'x', cell: (v) => <span className="font-mono">{v}</span> },
          { key: 'result', label: 'result', cell: (v) => <span className="font-mono">{t.results[VALUES.indexOf(v)]}</span>, strong: true },
        ]}
      />
      <SqlSays>{t.says}</SqlSays>
    </figure>
  )
}
