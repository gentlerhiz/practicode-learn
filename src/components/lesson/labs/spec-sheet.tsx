'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

// A typical mid-range laptop's spec sheet. The model name is made up; the parts are real.
const ROWS = [
  {
    key: 'Processor',
    spec: 'AMD Ryzen 5 7530U, 6 cores, up to 4.5 GHz',
    means: 'A mid-range processor with 6 cores. Up to 4.5 GHz means each core can take up to 4.5 billion small steps a second when it’s busy.',
    look: 'For everyday work, a recent Ryzen 5 or Intel Core i5 (or an Apple M chip) is plenty. A 3 is the budget tier; a 7 or 9 is for heavy work.',
  },
  {
    key: 'Memory',
    spec: '8 GB DDR4',
    means: '8 GB of working space. DDR4 is the type of memory chip.',
    look: '8 GB copes with everyday use. 16 GB keeps things smooth with lots of tabs and apps open, or with photo editing.',
  },
  {
    key: 'Storage',
    spec: '512 GB NVMe SSD',
    means: '512 GB to keep your files and apps, on a fast SSD.',
    look: '256 GB fills up quickly; 512 GB suits most people. In a laptop, always choose an SSD over a hard drive.',
  },
  {
    key: 'Screen',
    spec: '14-inch, Full HD (1920 × 1080), IPS, 60 Hz',
    means: '14 inches corner to corner, 1920 by 1080 pixels. IPS keeps colours true when you look from the side. 60 Hz redraws the picture 60 times a second.',
    look: 'Full HD looks sharp at this size. 90 Hz or more feels smoother, which matters most for games.',
  },
  {
    key: 'Graphics',
    spec: 'AMD Radeon Graphics (integrated)',
    means: 'A graphics processor built into the main processor, sharing its memory.',
    look: 'Fine for video, office work and light games. Video editing, 3D work or serious gaming needs a separate (dedicated) graphics card.',
  },
  {
    key: 'Battery',
    spec: '50 Wh, up to 10 hours',
    means: 'Wh (watt-hours) is the size of the battery. “Up to 10 hours” is the maker’s figure, measured in light use.',
    look: 'Expect less in real use, often a third less with a bright screen. Compare Wh between laptops for a fairer picture.',
  },
  {
    key: 'Ports',
    spec: '2 × USB-C, 1 × USB-A, HDMI, audio jack',
    means: 'Two USB-C ports, one USB-A, HDMI for a screen or TV, and a headphone socket.',
    look: 'Check you can plug in what you already own without adapters, and that a USB-C port charges the laptop.',
  },
]

/** A laptop spec sheet, one line explained at a time (Explore lab: value = a line, such as Memory). */
export function SpecSheet({ value = 'Processor' }: LabProps) {
  const pick = ROWS.find((r) => r.key === value) ?? ROWS[0]!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`Spec sheet. ${pick.key}: ${pick.spec}. ${pick.means}`}>
      <div className="flex flex-col rounded-2xl border border-line bg-row">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 border-b border-divider px-4 py-3">
          <span className="font-display text-[15px] font-bold text-ink">Kestrel 14 laptop</span>
          <span className="text-[12px] text-ink-subtle">Technical specifications</span>
        </div>
        <dl className="flex flex-col">
          {ROWS.map((r) => {
            const on = r.key === pick.key
            return (
              <div
                key={r.key}
                className={cn(
                  'grid grid-cols-[82px_minmax(0,1fr)] gap-3 border-l-[3px] px-3.5 py-2 text-[13px] leading-5 motion-safe:transition-colors motion-safe:duration-200',
                  on ? 'border-it bg-[rgba(255,170,60,0.14)]' : 'border-transparent',
                )}
              >
                <dt className={cn(on ? 'font-semibold text-ink' : 'text-ink-subtle')}>{r.key}</dt>
                <dd className="font-mono text-[12px] text-ink">{r.spec}</dd>
              </div>
            )
          })}
        </dl>
      </div>
      <div aria-live="polite" className="flex flex-col gap-2 rounded-2xl border border-it bg-row px-4 py-3">
        <p className="text-[13px] leading-5 text-ink">
          <span className="font-semibold text-it-text">What it means. </span>
          {pick.means}
        </p>
        <p className="text-[13px] leading-5 text-ink-soft">
          <span className="font-semibold text-ink">What to look for. </span>
          {pick.look}
        </p>
      </div>
    </figure>
  )
}
