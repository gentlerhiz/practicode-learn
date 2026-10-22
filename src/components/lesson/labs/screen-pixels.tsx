'use client'
import { useSyncExternalStore } from 'react'
import type { LabProps } from './shared'

const SCREENS: Record<string, { w: number; h: number; dots: number }> = {
  HD: { w: 1280, h: 720, dots: 8 },
  'Full HD': { w: 1920, h: 1080, dots: 12 },
  QHD: { w: 2560, h: 1440, dots: 16 },
  '4K': { w: 3840, h: 2160, dots: 24 },
}

/** Draws "a" on a tiny hidden canvas, the way a screen would, and reads back how dark each pixel is. */
function rasterise(n: number): number[] | null {
  const canvas = document.createElement('canvas')
  canvas.width = n
  canvas.height = n
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.fillStyle = '#000'
  ctx.font = `600 ${n * 0.95}px system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('a', n / 2, n * 0.8)
  const data = ctx.getImageData(0, 0, n, n).data
  return Array.from({ length: n * n }, (_, i) => data[i * 4 + 3]! / 255)
}

// Each resolution is drawn once and kept, so the snapshot stays the same object between renders.
const drawn = new Map<number, number[] | null>()
const noUpdates = () => () => {}
function usePixels(n: number) {
  return useSyncExternalStore(
    noUpdates,
    () => {
      if (!drawn.has(n)) drawn.set(n, rasterise(n))
      return drawn.get(n) ?? null
    },
    () => null,
  )
}

const million = (n: number) => `${(n / 1e6).toFixed(1)} million`

/**
 * The same letter on the same size of screen at four resolutions, each pixel drawn as a square (Explore
 * lab: value = HD, Full HD, QHD or 4K). More pixels in the same space make edges smoother.
 */
export function ScreenPixels({ value = 'Full HD' }: LabProps) {
  const name = SCREENS[value] ? value : 'Full HD'
  const s = SCREENS[name]!
  const cells = usePixels(s.dots)
  const size = 192 / s.dots
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${name}: ${s.w} by ${s.h} pixels. A letter on a 14-inch laptop screen is about ${s.dots} pixels tall.`}>
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-row p-3">
        <svg viewBox="0 0 192 192" aria-hidden="true" className="size-[150px] shrink-0 rounded-lg bg-white">
          {cells?.map((a, i) =>
            a > 0.04 ? (
              <rect key={i} x={(i % s.dots) * size} y={Math.floor(i / s.dots) * size} width={size} height={size} fill="#15122a" opacity={a} />
            ) : null,
          )}
          {/* The grid of pixels */}
          {Array.from({ length: s.dots + 1 }, (_, i) => (
            <g key={i} stroke="#dfdce9" strokeWidth="0.6">
              <line x1={i * size} y1="0" x2={i * size} y2="192" />
              <line x1="0" y1={i * size} x2="192" y2={i * size} />
            </g>
          ))}
        </svg>
        <div className="flex min-w-0 flex-1 basis-40 flex-col gap-1">
          <p className="font-display text-lg font-bold text-ink">{name}</p>
          <p className="font-mono text-sm text-it-text">
            {s.w.toLocaleString('en-GB')} × {s.h.toLocaleString('en-GB')}
          </p>
          <p className="text-[13px] leading-5 text-ink-soft">{million(s.w * s.h)} pixels in all</p>
        </div>
      </div>
      <p className="text-[13px] leading-5 text-ink-muted">
        On a 14-inch laptop, a letter is drawn about {s.dots} pixels tall at this resolution. Each pixel is three tiny lights,
        red, green and blue, mixed to make its colour.
      </p>
    </figure>
  )
}
