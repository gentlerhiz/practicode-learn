'use client'
import { SALES, type Sale } from './bookshop'
import type { LabProps } from './shared'
import { SqlLine, SqlSays, SqlTable } from './sql-table'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const day = (s: string) => new Date(`${s}T00:00:00Z`)
const iso = (d: Date) => d.toISOString().slice(0, 10)
const DAY = 86_400_000

type Tool = { sql: string; name: string; cell: (s: string) => string; says: string }

const TOOLS: Record<string, Tool> = {
  'The month': { sql: 'EXTRACT(MONTH FROM sold_on)', name: 'month', cell: (s) => String(day(s).getUTCMonth() + 1), says: 'EXTRACT pulls one part out of a date as a number.' },
  'The year': { sql: 'EXTRACT(YEAR FROM sold_on)', name: 'year', cell: (s) => String(day(s).getUTCFullYear()), says: 'The same tool, asking for a different part.' },
  'Year and month': { sql: "TO_CHAR(sold_on, 'YYYY-MM')", name: 'month', cell: (s) => s.slice(0, 7), says: 'TO_CHAR writes a date as text in the pattern you give it. Year first means this text sorts in date order, and it keeps each year’s months apart.' },
  'A month name': { sql: "TO_CHAR(sold_on, 'Mon YYYY')", name: 'month', cell: (s) => `${MONTHS[day(s).getUTCMonth()]} ${day(s).getUTCFullYear()}`, says: 'Lovely to read, but it’s text: Oct sorts before Sep, because O comes before S.' },
  '30 days later': { sql: 'sold_on + 30', name: 'due', cell: (s) => iso(new Date(day(s).getTime() + 30 * DAY)), says: 'Add a whole number to a date to move that many days. Months of different lengths are handled for you.' },
  'Days until 25 December': { sql: "DATE '2026-12-25' - sold_on", name: 'days_left', cell: (s) => String((day('2026-12-25').getTime() - day(s).getTime()) / DAY), says: 'One date minus another gives the number of days between them.' },
}

const FIRST = 'The month'
const ROWS = [SALES[0]!, SALES[6]!, SALES[9]!, SALES[15]!]

/** Pulling dates apart and moving them (Explore lab: value = a date tool, shown on four sales). */
export function DateTools({ value = FIRST }: LabProps) {
  const t = TOOLS[value] ?? TOOLS[FIRST]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <SqlLine before="SELECT sold_on, " mark={t.sql} after={` AS ${t.name} FROM sales;`} />
      <SqlTable<Sale>
        rows={ROWS}
        rowKey={(s) => s.id}
        label={`Four sales with ${value}`}
        columns={[
          { key: 'sold_on', label: 'sold_on', cell: (s) => s.soldOn },
          { key: t.name, label: t.name, cell: (s) => t.cell(s.soldOn), strong: true },
        ]}
      />
      <SqlSays>{t.says}</SqlSays>
    </figure>
  )
}
