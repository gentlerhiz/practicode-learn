'use client'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type SqlColumn<T> = { key: string; label: string; cell: (row: T) => ReactNode; strong?: boolean }

/** How a row stands in a drawing: picked out, or crossed through. */
export type SqlTone = 'on' | 'off' | undefined

/** The SQL labs' table for anything that isn't a book, with an optional table name above it. */
export function SqlTable<T>({
  rows,
  columns,
  label,
  name,
  rowKey,
  tone,
}: {
  rows: T[]
  columns: SqlColumn<T>[]
  label: string
  name?: string
  rowKey: (row: T, index: number) => string | number
  tone?: (row: T, index: number) => SqlTone
}) {
  return (
    <div className="min-w-0 overflow-x-auto rounded-2xl border border-line">
      {name && <p className="m-0 border-b border-line bg-row px-3 py-1.5 font-mono text-xs font-semibold text-ink-soft">{name}</p>}
      <table className="w-full border-collapse text-left text-[12.5px] @min-[420px]:text-[13px]" aria-label={label}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className={cn('border-b border-line px-1.5 py-1.5 font-mono font-semibold @min-[400px]:px-3', c.strong ? 'text-da-text' : 'text-ink-soft')}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const t = tone?.(row, i)
            return (
              <tr key={rowKey(row, i)} className={cn(t === 'on' ? 'bg-[rgba(47,230,176,0.14)] text-ink' : t === 'off' ? 'text-ink-subtle' : 'text-ink')}>
                {columns.map((c) => (
                  <td key={c.key} className={cn('border-b border-line px-1.5 py-1 [overflow-wrap:anywhere] @min-[400px]:px-3', t === 'off' && 'line-through', c.strong && t !== 'off' && 'font-semibold')}>
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/** NULL, drawn the way the runner draws it. */
export const Null = () => <span className="text-ink-subtle italic">NULL</span>

/** The query a lab is about, with the part that matters in bold. */
export function SqlLine({ before, mark, after }: { before?: string; mark: string; after?: string }) {
  return (
    <p className="m-0 rounded-xl bg-row px-3 py-2 font-mono text-[12.5px] [overflow-wrap:anywhere] whitespace-pre-wrap text-ink">
      {before}
      <span className="font-bold text-da-text">{mark}</span>
      {after}
    </p>
  )
}

/** What a lab's current state shows, under its drawing. */
export function SqlSays({ children, warn }: { children: ReactNode; warn?: boolean }) {
  return <figcaption className={cn('rounded-xl px-3 py-2.5 text-sm text-ink-soft', warn ? 'bg-error/10' : 'bg-row')}>{children}</figcaption>
}
