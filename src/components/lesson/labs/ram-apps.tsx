'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

// A busy afternoon on a laptop, in gigabytes of memory.
const APPS = [
  { name: 'Operating system', gb: 2.5, colour: '#8b88a0' },
  { name: 'Browser, 12 tabs', gb: 2.5, colour: '#3d5af5' },
  { name: 'Video call', gb: 1, colour: '#d9306f' },
  { name: 'Spreadsheet', gb: 0.5, colour: '#0a7d5c' },
  { name: 'Music', gb: 0.5, colour: '#6e4cf5' },
]
const USED = APPS.reduce((n, a) => n + a.gb, 0)
// Where each app starts along the bar, in gigabytes.
const STARTS = APPS.map((_, i) => APPS.slice(0, i).reduce((n, a) => n + a.gb, 0))
const SCALE = 16

const VERDICT: Record<number, { ok: boolean; says: string }> = {
  4: {
    ok: false,
    says: 'Too little: 3 GB has to wait in storage, which is far slower. Every switch between apps stalls while things are swapped back in.',
  },
  8: { ok: true, says: 'Enough for this: everything fits, with 1 GB to spare. Open a photo editor as well, though, and it would start swapping.' },
  16: { ok: true, says: 'Plenty: 9 GB to spare, so heavier work like photo editing or many more tabs still fits.' },
}

const gbText = (n: number) => `${n % 1 ? n.toFixed(1) : n} GB`

/** Open apps against 4, 8 or 16 GB of memory, with what doesn't fit spilling into storage (Explore lab). */
export function RamApps({ value = '8 GB' }: LabProps) {
  const ram = [4, 8, 16].includes(Number.parseInt(value, 10)) ? Number.parseInt(value, 10) : 8
  const v = VERDICT[ram]!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${ram} GB of memory, with ${gbText(USED)} of apps open. ${v.says}`}>
      <div aria-hidden="true" className="flex flex-col gap-1.5">
        <div className="relative h-14 overflow-hidden rounded-xl border border-line bg-sheet">
          {APPS.map((a, i) => {
            const left = STARTS[i]!
            const inRam = Math.max(0, Math.min(a.gb, ram - left))
            return (
              <span key={a.name} className="absolute inset-y-0" style={{ left: `${(left / SCALE) * 100}%`, width: `${(a.gb / SCALE) * 100}%` }}>
                <span className="absolute inset-y-1.5 left-0 rounded-md" style={{ width: `${(inRam / a.gb) * 100}%`, background: a.colour }} />
                {inRam < a.gb && (
                  <span
                    className="absolute inset-y-1.5 right-0 rounded-md border-2 border-dashed border-error"
                    style={{
                      width: `${((a.gb - inRam) / a.gb) * 100}%`,
                      background: `repeating-linear-gradient(45deg, ${a.colour}55 0 4px, transparent 4px 8px)`,
                    }}
                  />
                )}
              </span>
            )
          })}
          {/* The edge of memory */}
          <span
            className="absolute inset-y-0 w-[3px] bg-it-text motion-safe:transition-all motion-safe:duration-300"
            style={{ left: `calc(${(ram / SCALE) * 100}% - 1.5px)` }}
          />
        </div>
        <div className="relative h-4 text-[11px] text-ink-subtle">
          <span className="absolute left-0">0</span>
          <span
            className={cn(
              'absolute font-semibold whitespace-nowrap text-it-text motion-safe:transition-all motion-safe:duration-300',
              ram === SCALE ? '-translate-x-full' : '-translate-x-1/2',
            )}
            style={{ left: `${(ram / SCALE) * 100}%` }}
          >
            {ram} GB of memory
          </span>
        </div>
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-ink-soft">
        {APPS.map((a) => (
          <li key={a.name} className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-2.5 shrink-0 rounded-sm" style={{ background: a.colour }} />
            {a.name}, {gbText(a.gb)}
          </li>
        ))}
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2.5 shrink-0 rounded-sm border border-dashed border-error" />
          Doesn’t fit: waits in storage
        </li>
      </ul>
      <p
        aria-live="polite"
        className={cn('rounded-2xl border px-4 py-3 text-sm leading-6', v.ok ? 'border-success-fill bg-row text-ink' : 'border-error bg-row text-ink')}
      >
        <span className={cn('font-bold', v.ok ? 'text-success' : 'text-error')}>{v.ok ? 'Fits. ' : 'Too slow. '}</span>
        {v.says}
      </p>
    </figure>
  )
}
