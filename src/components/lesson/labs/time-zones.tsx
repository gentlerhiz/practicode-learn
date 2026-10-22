'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

// Hours from UTC in January. Some of these places move their clocks in summer.
const CITIES = [
  { name: 'São Paulo', offset: -3 },
  { name: 'New York', offset: -5 },
  { name: 'London', offset: 0 },
  { name: 'Lagos', offset: 1 },
  { name: 'Nairobi', offset: 3 },
  { name: 'Mumbai', offset: 5.5 },
  { name: 'Tokyo', offset: 9 },
]
const HOME = 1

const fmt = (h: number) => {
  const hh = Math.floor(h)
  const mm = Math.round((h - hh) * 60)
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

/** One meeting time in Lagos, as it falls in seven cities (Explore lab: value = a Lagos time, such as 15:00). */
export function TimeZones({ value = '15:00' }: LabProps) {
  const [h = 15, m = 0] = value.split(':').map(Number)
  const lagos = h + m / 60
  const rows = CITIES.map((c) => {
    let local = lagos - HOME + c.offset
    let day = ''
    if (local < 0) {
      local += 24
      day = 'the day before'
    } else if (local >= 24) {
      local -= 24
      day = 'the next day'
    }
    const kind = local >= 8 && local < 18 ? 'work' : local >= 18 && local < 22 ? 'evening' : 'night'
    return { ...c, local, day, kind }
  })
  const fits = rows.filter((r) => r.kind === 'work').length
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`A meeting at ${value} in Lagos falls in working hours in ${fits} of ${rows.length} cities.`}>
      <ul className="flex flex-col gap-1.5">
        {rows.map((r) => (
          <li
            key={r.name}
            className={cn(
              'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 rounded-xl border-[1.5px] px-3 py-1.5 motion-safe:transition-colors motion-safe:duration-300',
              r.kind === 'work' ? 'border-success-fill bg-row' : r.kind === 'evening' ? 'border-badge bg-row' : 'border-error/70 bg-sunken',
              r.name === 'Lagos' && 'outline-2 outline-offset-1 outline-it',
            )}
          >
            <span className="flex min-w-0 flex-col">
              <span className="text-[13px] font-semibold text-ink">
                {r.name}
                {r.name === 'Lagos' && <span className="ml-1.5 text-[11px] font-normal text-it-text">you</span>}
              </span>
              <span className="text-[11px] text-ink-muted">
                UTC{r.offset >= 0 ? '+' : '−'}
                {fmt(Math.abs(r.offset)).replace(/^0/, '').replace(':00', '')}
                {r.day && ` · ${r.day}`}
              </span>
            </span>
            <span className="flex items-center gap-2">
              <span className="font-mono text-[15px] font-bold text-ink">{fmt(r.local)}</span>
              <span className={cn('w-16 text-right text-[11px] font-semibold', r.kind === 'work' ? 'text-success' : r.kind === 'evening' ? 'text-badge-text' : 'text-error')}>
                {r.kind === 'work' ? 'Working day' : r.kind === 'evening' ? 'Evening' : 'Night'}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="text-[13px] leading-5 text-ink-soft">
        <span className="font-semibold text-ink">
          Working hours in {fits} of {rows.length} cities.
        </span>{' '}
        Times are for January: some places move their clocks forward in summer. Calendar apps work this out for you, if each person’s time zone is set.
      </p>
    </figure>
  )
}
