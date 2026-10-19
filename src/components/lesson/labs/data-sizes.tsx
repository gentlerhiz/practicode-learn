'use client'
import type { LabProps } from './shared'

// Typical sizes, in bytes, and how many would fit in 64 GB if the whole phone were empty.
const ITEMS: Record<string, { size: string; bytes: number; fits: string; note: string }> = {
  'A text message': {
    size: 'about 200 bytes',
    bytes: 200,
    fits: 'about 320 million',
    note: 'Plain text is tiny: each letter is about one byte.',
  },
  'A photo': {
    size: 'about 3 MB',
    bytes: 3e6,
    fits: 'about 21,000',
    note: 'A photo stores the colour of millions of tiny dots, called pixels.',
  },
  'A song': {
    size: 'about 4 MB',
    bytes: 4e6,
    fits: 'about 16,000',
    note: 'A 4-minute song, squeezed (compressed) to a fraction of its raw size.',
  },
  'A film': {
    size: 'about 4 GB',
    bytes: 4e9,
    fits: 'about 16',
    note: 'A 2-hour HD film is thousands of photos a minute, plus sound.',
  },
}

/** A text, a photo, a song and a film, against a 64 GB phone (Explore lab: value = an item). */
export function DataSizes({ value = 'A photo' }: LabProps) {
  const item = ITEMS[value] ?? ITEMS['A photo']!
  // A log scale from 100 bytes to 64 GB, so a text message is still visible.
  const width = Math.max(3, (Math.log10(item.bytes / 100) / Math.log10(64e9 / 100)) * 100)
  return (
    <figure
      className="m-0 flex flex-col gap-3 rounded-2xl border border-line bg-row p-4"
      aria-label={`${value} is ${item.size}. ${item.fits} would fit in 64 GB.`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-display text-lg font-bold text-ink">{value}</p>
        <p className="font-mono text-sm font-bold text-it-text">{item.size}</p>
      </div>
      <div aria-hidden="true" className="flex flex-col gap-1.5">
        <div className="h-4 overflow-hidden rounded-full bg-sheet">
          <div
            className="h-4 rounded-full bg-it motion-safe:transition-all motion-safe:duration-300"
            style={{ width: `${width}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-ink-subtle">
          <span>100 bytes</span>
          <span>64 GB, a whole phone</span>
        </div>
      </div>
      <p className="text-sm text-ink">
        How many fit in 64 GB: <span className="font-bold">{item.fits}</span>
      </p>
      <p className="text-[13px] leading-5 text-ink-muted">
        {item.note} The bar stretches so that every equal step along it is ten times bigger, or a text message
        wouldn’t show at all.
      </p>
    </figure>
  )
}
