'use client'
import type { LabProps } from './shared'

// Example prices in US dollars. Real ones vary by country and over time.
const DRIVE = 80
const DRIVE_LIFE = 5
const CLOUD_MONTH = 10

/** Owning a 2 TB drive against renting 2 TB of cloud storage, over time (Explore lab: value = "3 years"). */
export function CloudCost({ value = '1 year' }: LabProps) {
  const years = Math.max(1, Math.min(10, Number.parseInt(value, 10) || 1))
  const drive = DRIVE * Math.ceil(years / DRIVE_LIFE)
  const cloud = CLOUD_MONTH * 12 * years
  const max = CLOUD_MONTH * 12 * 10
  const bars = [
    { name: 'Your own 2 TB drive', cost: drive, note: `$${DRIVE} once, and a new one every ${DRIVE_LIFE} years or so` },
    { name: '2 TB of cloud storage', cost: cloud, note: `$${CLOUD_MONTH} a month` },
  ]
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`Over ${years} ${years === 1 ? 'year' : 'years'}: the drive costs $${drive}, cloud storage $${cloud}.`}>
      <ul className="flex flex-col gap-3">
        {bars.map((b) => (
          <li key={b.name} className="flex flex-col gap-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-[13px]">
              <span className="font-semibold text-ink">{b.name}</span>
              <span className="font-mono font-bold text-it-text">${b.cost.toLocaleString('en-US')}</span>
            </div>
            <div aria-hidden="true" className="h-4 overflow-hidden rounded-full bg-sheet">
              <div className="h-4 rounded-full bg-it motion-safe:transition-all motion-safe:duration-500" style={{ width: `${Math.max(2, (b.cost / max) * 100)}%` }} />
            </div>
            <span className="text-[12px] text-ink-muted">{b.note}</span>
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-1 gap-2 text-[12px] leading-[18px] @min-[460px]:grid-cols-2">
        <div className="rounded-xl border border-line bg-row p-3">
          <p className="font-semibold text-ink">The drive also means</p>
          <p className="text-ink-soft">Works offline. Nobody else holds your files. But if the house floods or the drive fails, it’s gone, and you must remember to copy to it.</p>
        </div>
        <div className="rounded-xl border border-line bg-row p-3">
          <p className="font-semibold text-ink">The cloud also means</p>
          <p className="text-ink-soft">Kept safe off-site, reached from any device, backed up automatically. But it needs the internet, the price can rise, and a company holds your files.</p>
        </div>
      </div>
      <p className="text-[11px] text-ink-subtle">Example prices in US dollars. Real prices vary by country and change over time.</p>
    </figure>
  )
}
