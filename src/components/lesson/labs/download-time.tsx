'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

// Typical real-world speeds. They vary a lot with place, time of day and plan.
const LINKS: Record<string, { mbps: number; note: string }> = {
  '3G mobile': { mbps: 2, note: 'Fine for messages and email, slow for video.' },
  '4G mobile': { mbps: 30, note: 'Streams HD video, and often 4K close to a mast.' },
  '5G mobile': { mbps: 200, note: 'As fast as home broadband, where there’s coverage.' },
  'Home fibre': { mbps: 500, note: 'A whole family streaming at once, with room to spare.' },
}

const FILM_MB = 2000
const time = (seconds: number) => {
  if (seconds < 90) return `${Math.round(seconds)} seconds`
  if (seconds < 3600) return `about ${Math.round(seconds / 60)} minutes`
  const h = Math.floor(seconds / 3600)
  const m = Math.round((seconds % 3600) / 60)
  return `about ${h} hour${h > 1 ? 's' : ''}${m ? ` ${m} minutes` : ''}`
}

/** One 2 GB film over four connections, with the speed in megabits and megabytes (Explore lab). */
export function DownloadTime({ value = '4G mobile' }: LabProps) {
  const name = LINKS[value] ? value : '4G mobile'
  const l = LINKS[name]!
  const mbPerSecond = l.mbps / 8
  const seconds = FILM_MB / mbPerSecond
  const max = Math.log10(FILM_MB / (2 / 8))
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${name}: about ${l.mbps} megabits a second, which is ${mbPerSecond} megabytes a second. A 2 GB film takes ${time(seconds)}.`}>
      <div className="flex flex-col gap-1 rounded-2xl border border-line bg-row px-4 py-3">
        <p className="font-display text-lg font-bold text-ink">{name}</p>
        <p className="text-[13px] text-ink-soft">
          About <span className="font-semibold text-ink">{l.mbps} Mbps</span> (megabits per second) ={' '}
          <span className="font-semibold text-ink">{mbPerSecond % 1 ? mbPerSecond.toFixed(2).replace(/0$/, '') : mbPerSecond} MB/s</span> (megabytes per second)
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-[13px]">
          <span className="font-semibold text-ink">Download a 2 GB film</span>
          <span className={cn('font-semibold', seconds > 1800 ? 'text-error' : 'text-it-text')}>{time(seconds)}</span>
        </div>
        <div aria-hidden="true" className="h-3 overflow-hidden rounded-full bg-sheet">
          <div className="h-3 rounded-full bg-it motion-safe:transition-all motion-safe:duration-500" style={{ width: `${Math.max(3, (Math.log10(seconds) / max) * 100)}%` }} />
        </div>
        <p className="text-[11px] text-ink-subtle">The bar shows time, stretched so each step along it is ten times longer.</p>
      </div>
      <p className="text-[13px] leading-5 text-ink-soft">{l.note}</p>
      <p className="text-[12px] leading-[18px] text-ink-muted">8 bits make a byte, so divide Mbps by 8 to get MB/s. Real speeds vary with place, time of day and how many people share the connection.</p>
    </figure>
  )
}
