'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

// A week of sales at a juice stall, as they were written down.
const SALES = [
  { day: 'Mon', item: 'Orange', n: 14 },
  { day: 'Mon', item: 'Mango', n: 9 },
  { day: 'Tue', item: 'Orange', n: 11 },
  { day: 'Tue', item: 'Mango', n: 12 },
  { day: 'Wed', item: 'Orange', n: 10 },
  { day: 'Wed', item: 'Mango', n: 15 },
  { day: 'Thu', item: 'Orange', n: 12 },
  { day: 'Thu', item: 'Mango', n: 18 },
  { day: 'Fri', item: 'Orange', n: 16 },
  { day: 'Fri', item: 'Mango', n: 24 },
  { day: 'Sat', item: 'Orange', n: 30 },
  { day: 'Sat', item: 'Mango', n: 41 },
]
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const byDay = DAYS.map((d) => ({ day: d, n: SALES.filter((s) => s.day === d).reduce((a, s) => a + s.n, 0) }))
const byItem = ['Orange', 'Mango'].map((i) => ({ item: i, n: SALES.filter((s) => s.item === i).reduce((a, s) => a + s.n, 0) }))
const MAX = Math.max(...byDay.map((d) => d.n))

const STAGES = ['Raw data', 'Sorted', 'Totalled', 'As a chart'] as const
const SAYS: Record<(typeof STAGES)[number], string> = {
  'Raw data': 'Data: twelve facts, in the order they happened. True, but they don’t tell you anything yet.',
  Sorted: 'Sorted from most to fewest sales, the big numbers rise to the top.',
  Totalled: 'Totals by day and by juice turn facts into answers: mango outsells orange, and Saturday is the busiest day.',
  'As a chart': 'As a chart, the pattern is obvious in a second. That’s information: data that helps you decide, such as making more mango juice on Saturdays.',
}

/** A week of juice sales, from raw data to information (Explore lab: value = a stage). */
export function DataToInfo({ value = 'Raw data' }: LabProps) {
  const stage = (STAGES as readonly string[]).includes(value) ? (value as (typeof STAGES)[number]) : 'Raw data'
  const rows = stage === 'Sorted' ? [...SALES].sort((a, b) => b.n - a.n) : SALES
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${stage}. ${SAYS[stage]}`}>
      {(stage === 'Raw data' || stage === 'Sorted') && (
        <ul className="grid grid-cols-2 gap-x-3 gap-y-1 rounded-xl border border-line bg-row p-3 font-mono text-[12px] text-ink @min-[420px]:grid-cols-3">
          {rows.map((s) => (
            <li key={`${s.day}${s.item}`} className="pop-in flex justify-between gap-2">
              <span className="text-ink-muted">
                {s.day} {s.item}
              </span>
              <span>{s.n}</span>
            </li>
          ))}
        </ul>
      )}
      {stage === 'Totalled' && (
        <div className="grid grid-cols-1 gap-2 @min-[420px]:grid-cols-2">
          <table className="pop-in rounded-xl border border-line bg-row text-[12.5px]">
            <tbody>
              {byDay.map((d) => (
                <tr key={d.day} className={cn('border-b border-divider last:border-0', d.n === MAX && 'font-semibold text-it-text')}>
                  <th scope="row" className="px-3 py-1 text-left font-normal">
                    {d.day}
                  </th>
                  <td className="px-3 py-1 text-right font-mono">{d.n}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="pop-in self-start rounded-xl border border-line bg-row text-[12.5px]">
            <tbody>
              {byItem.map((d) => (
                <tr key={d.item} className={cn('border-b border-divider last:border-0', d.item === 'Mango' && 'font-semibold text-it-text')}>
                  <th scope="row" className="px-3 py-1 text-left font-normal">
                    {d.item}
                  </th>
                  <td className="px-3 py-1 text-right font-mono">{d.n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {stage === 'As a chart' && (
        <div aria-hidden="true" className="pop-in flex h-40 items-end gap-2 rounded-xl border border-line bg-row p-3">
          {byDay.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
              <span className="font-mono text-[11px] text-ink-muted">{d.n}</span>
              <span className={cn('w-full rounded-t-md', d.n === MAX ? 'bg-it' : 'bg-line-strong')} style={{ height: `${(d.n / MAX) * 96}px` }} />
              <span className="text-[11px] text-ink-soft">{d.day}</span>
            </div>
          ))}
        </div>
      )}
      <p aria-live="polite" className="text-[13px] leading-5 text-ink-soft">
        {SAYS[stage]}
      </p>
    </figure>
  )
}
