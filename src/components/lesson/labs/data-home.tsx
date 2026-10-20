'use client'
import type { LabProps } from './shared'

const HOMES: Record<string, { looks: string; good: string; bad: string }> = {
  'A notebook': {
    looks: 'Lines of handwriting: “Dune, 7 left, 10.99”',
    good: 'Quick to start, and needs nothing but a pen.',
    bad: 'One copy, one person at a time, no search, and nothing stops a mistake.',
  },
  'A spreadsheet': {
    looks: 'A grid of cells, with a column for each detail',
    good: 'Easy to read, sort and add up, for one person or a small team.',
    bad: 'Anyone can type anything in any cell, and it slows down and breaks with many people and many rows.',
  },
  'A database': {
    looks: 'Tables with fixed columns, each with a type, and rules the data must follow',
    good: 'Thousands of people and apps at once, millions of rows, fast questions in SQL, and rules that stop bad data.',
    bad: 'Takes a little more set-up, and you ask it questions in SQL instead of clicking.',
  },
}

/** The same stock list kept three ways (Explore lab: value = where it's kept). */
export function DataHome({ value = 'A notebook' }: LabProps) {
  const h = HOMES[value] ?? HOMES['A notebook']!
  const rows = [
    ['What it looks like', h.looks],
    ['Good at', h.good],
    ['Struggles with', h.bad],
  ] as const
  return (
    <figure className="m-0 flex flex-col gap-2 rounded-2xl border border-line bg-row p-4" aria-label={`${value}: ${h.good}`}>
      <p className="m-0 font-display text-lg font-bold text-ink">{value}</p>
      <dl className="m-0 flex flex-col divide-y divide-divider">
        {rows.map(([label, text]) => (
          <div key={label} className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 py-2 text-sm">
            <dt className="text-ink-subtle">{label}</dt>
            <dd className="m-0 text-ink">{text}</dd>
          </div>
        ))}
      </dl>
    </figure>
  )
}
