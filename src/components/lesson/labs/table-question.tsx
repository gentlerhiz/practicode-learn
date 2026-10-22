'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Member = { id: number; name: string; city: string; joined: number; course: string }

const MEMBERS: Member[] = [
  { id: 1, name: 'Ada', city: 'Lagos', joined: 2023, course: 'IT Fundamentals' },
  { id: 2, name: 'Tunde', city: 'Ibadan', joined: 2025, course: 'Front-End' },
  { id: 3, name: 'Grace', city: 'Accra', joined: 2024, course: 'IT Fundamentals' },
  { id: 4, name: 'Musa', city: 'Kano', joined: 2026, course: 'Python' },
  { id: 5, name: 'Chiamaka', city: 'Lagos', joined: 2025, course: 'SQL' },
  { id: 6, name: 'Kofi', city: 'Accra', joined: 2026, course: 'IT Fundamentals' },
  { id: 7, name: 'Zainab', city: 'Lagos', joined: 2024, course: 'Python' },
]

type Q = { sql: string; rows: Member[] | null; groups?: { city: string; n: number }[]; says: string }

const QUESTIONS: Record<string, Q> = {
  'Every member': { sql: 'SELECT * FROM members;', rows: MEMBERS, says: 'SELECT * means every column. With no WHERE, every row comes back.' },
  'Members in Lagos': {
    sql: "SELECT * FROM members\nWHERE city = 'Lagos';",
    rows: MEMBERS.filter((m) => m.city === 'Lagos'),
    says: 'WHERE keeps only the rows that match. Text goes in single quotes.',
  },
  'Joined after 2024': {
    sql: 'SELECT name, joined FROM members\nWHERE joined > 2024;',
    rows: MEMBERS.filter((m) => m.joined > 2024),
    says: 'Numbers can be compared with >, <, = and the rest. Naming columns instead of * shows only those columns.',
  },
  'Sorted by name': {
    sql: 'SELECT * FROM members\nORDER BY name;',
    rows: [...MEMBERS].sort((a, b) => a.name.localeCompare(b.name)),
    says: 'ORDER BY sorts the answer: A to Z for text, smallest first for numbers.',
  },
  'How many in each city': {
    sql: 'SELECT city, COUNT(*) FROM members\nGROUP BY city;',
    rows: null,
    groups: [...new Set(MEMBERS.map((m) => m.city))].map((city) => ({ city, n: MEMBERS.filter((m) => m.city === city).length })),
    says: 'GROUP BY puts the rows into piles, one per city, and COUNT(*) counts each pile.',
  },
}

/** Questions asked of a members table, each with the SQL that asks it and the answer (Explore lab). */
export function TableQuestion({ value = 'Every member' }: LabProps) {
  const name = QUESTIONS[value] ? value : 'Every member'
  const q = QUESTIONS[name]!
  const narrow = name === 'Joined after 2024'
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${name}. ${q.rows ? q.rows.length : q.groups!.length} rows come back. ${q.says}`}>
      <pre className="m-0 rounded-xl border border-line bg-[#0d0b16] p-3 font-mono text-[12.5px] leading-5 whitespace-pre-wrap text-[#e8e6f0] [overflow-wrap:anywhere]">{q.sql}</pre>
      <div className="overflow-hidden rounded-xl border border-line">
        <table className="w-full table-fixed text-[12px]">
          <thead>
            <tr className="bg-sunken text-left">
              {(q.groups ? ['city', 'count'] : narrow ? ['name', 'joined'] : ['id', 'name', 'city', 'joined']).map((h) => (
                <th key={h} scope="col" className={cn('px-2 py-1.5 font-mono font-semibold text-ink', h === 'id' && 'w-9')}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {q.groups
              ? q.groups.map((g) => (
                  <tr key={g.city} className="pop-in border-t border-divider">
                    <td className="px-2 py-1 text-ink">{g.city}</td>
                    <td className="px-2 py-1 font-mono text-ink">{g.n}</td>
                  </tr>
                ))
              : q.rows!.map((m) => (
                  <tr key={m.id} className="pop-in border-t border-divider">
                    {!narrow && <td className="px-2 py-1 font-mono text-ink-muted">{m.id}</td>}
                    <td className="px-2 py-1 text-ink">{m.name}</td>
                    {!narrow && <td className={cn('px-2 py-1', name === 'Members in Lagos' ? 'font-semibold text-it-text' : 'text-ink')}>{m.city}</td>}
                    <td className={cn('px-2 py-1 font-mono', narrow ? 'font-semibold text-it-text' : 'text-ink')}>{m.joined}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <p aria-live="polite" className="text-[13px] leading-5 text-ink-soft">
        <span className="font-semibold text-ink">
          {q.rows ? q.rows.length : q.groups!.length} {(q.rows ? q.rows.length : q.groups!.length) === 1 ? 'row' : 'rows'} of 7.{' '}
        </span>
        {q.says}
      </p>
    </figure>
  )
}
