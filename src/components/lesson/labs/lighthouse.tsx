'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Report = {
  scores: [string, number][]
  metrics: [string, string, 'good' | 'work' | 'poor'][]
  advice: string[]
  say: string
}

// Mama Nkechi's landing page on a mid-range phone, before and after two fixes.
const SCORES = (performance: number): [string, number][] => [
  ['Performance', performance],
  ['Accessibility', 96],
  ['Best practices', 100],
  ['SEO', 92],
]

const REPORTS: Record<'before' | 'sized' | 'compressed' | 'both', Report> = {
  before: {
    scores: SCORES(48),
    metrics: [
      ['Largest Contentful Paint', '6.8 s', 'poor'],
      ['Cumulative Layout Shift', '0.31', 'poor'],
      ['Total Blocking Time', '170 ms', 'good'],
    ],
    advice: ['Properly size images: save 2.1 MB', 'Image elements do not have explicit width and height'],
    say: 'Before: a 2.4 MB hero photo takes 6.8 seconds to appear, and the page jumps as images load.',
  },
  sized: {
    scores: SCORES(63),
    metrics: [
      ['Largest Contentful Paint', '6.8 s', 'poor'],
      ['Cumulative Layout Shift', '0.02', 'good'],
      ['Total Blocking Time', '170 ms', 'good'],
    ],
    advice: ['Properly size images: save 2.1 MB'],
    say: 'width and height on every image let the browser save their space before they load, so nothing jumps: layout shift falls from 0.31 to 0.02.',
  },
  compressed: {
    scores: SCORES(72),
    metrics: [
      ['Largest Contentful Paint', '2.1 s', 'good'],
      ['Cumulative Layout Shift', '0.31', 'poor'],
      ['Total Blocking Time', '170 ms', 'good'],
    ],
    advice: ['Image elements do not have explicit width and height'],
    say: 'The hero is now a 120 KB WebP, sized for phones with srcset, so the largest thing on screen appears in 2.1 seconds. The page still jumps.',
  },
  both: {
    scores: SCORES(94),
    metrics: [
      ['Largest Contentful Paint', '2.1 s', 'good'],
      ['Cumulative Layout Shift', '0.02', 'good'],
      ['Total Blocking Time', '170 ms', 'good'],
    ],
    advice: [],
    say: 'Both fixes: the hero appears fast and nothing moves. Performance is 94.',
  },
}

const pick = (value = ''): Report => {
  const v = value.toLowerCase()
  if (/both|all/.test(v)) return REPORTS.both
  if (/compress|webp|small/.test(v)) return REPORTS.compressed
  if (/size|width|height|dimension/.test(v)) return REPORTS.sized
  return REPORTS.before
}

const band = (n: number) => (n >= 90 ? 'good' : n >= 50 ? 'work' : 'poor')
const COLOUR = { good: '#0cce6b', work: '#ffa400', poor: '#ff4e42' }
const WORD = { good: 'Good', work: 'Needs work', poor: 'Poor' }

/** Lighthouse's shapes, so colour is never the only signal: circle, square, triangle. */
function Mark({ kind }: { kind: 'good' | 'work' | 'poor' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 10 10" className="size-2.5 shrink-0">
      {kind === 'good' && <circle cx="5" cy="5" r="5" fill={COLOUR.good} />}
      {kind === 'work' && <rect width="10" height="10" fill={COLOUR.work} />}
      {kind === 'poor' && <polygon points="5,0 10,10 0,10" fill={COLOUR.poor} />}
    </svg>
  )
}

/**
 * Explore lab: a Lighthouse report for one page, before and after fixes. The value names the fix:
 * "Before", "Sized images" (width and height), "Compressed images", or "Both fixes".
 */
export function Lighthouse({ value }: LabProps) {
  const r = pick(value)
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div className="rounded-xl border border-line-subtle bg-row p-3">
        <ul aria-label="Scores" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {r.scores.map(([name, n]) => {
            const b = band(n)
            return (
              <li key={name} className="flex flex-col items-center gap-1 text-center">
                <svg
                  viewBox="0 0 56 56"
                  className="size-14"
                  role="img"
                  aria-label={`${name} ${n}, ${WORD[b]}`}
                >
                  <circle cx="28" cy="28" r="24" fill="none" stroke="var(--pc-line)" strokeWidth="5" />
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    fill="none"
                    stroke={COLOUR[b]}
                    strokeWidth="5"
                    strokeDasharray={`${(n / 100) * 150.8} 150.8`}
                    transform="rotate(-90 28 28)"
                    strokeLinecap="round"
                  />
                  <text
                    x="28"
                    y="33"
                    textAnchor="middle"
                    fontSize="15"
                    fontWeight="700"
                    fill="var(--pc-text)"
                  >
                    {n}
                  </text>
                </svg>
                <span className="text-[12px] text-ink">{name}</span>
              </li>
            )
          })}
        </ul>
        <dl className="mt-3 flex flex-col gap-1.5 border-t border-line pt-3 text-[13px]">
          {r.metrics.map(([name, val, kind]) => (
            <div key={name} className="flex items-center justify-between gap-3">
              <dt className="flex items-center gap-2 text-ink">
                <Mark kind={kind} />
                {name}
              </dt>
              <dd className="font-mono text-ink">
                {val} <span className="sr-only">{WORD[kind]}</span>
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 border-t border-line pt-3 text-[13px]">
          <p className="font-semibold text-ink">Diagnostics</p>
          {r.advice.length ? (
            <ul className="mt-1 flex flex-col gap-1">
              {r.advice.map((a) => (
                <li key={a} className="flex items-center gap-2 text-ink">
                  <Mark kind="poor" />
                  {a}
                </li>
              ))}
            </ul>
          ) : (
            <p className={cn('mt-1 text-ink-muted')}>No image problems left.</p>
          )}
        </div>
      </div>
      <figcaption aria-live="polite" className="text-[13px] text-ink-muted">
        {r.say}
      </figcaption>
    </figure>
  )
}
