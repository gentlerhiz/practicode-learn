'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

// The ways in, in the order the diagram's states visit them.
const PATHS = [
  { name: 'A message', line: 'A text, email or DM with a link that steals your password' },
  { name: 'A reused password', line: 'A password leaked from one site, tried on all the others' },
  { name: 'A fake app', line: 'A download that looks useful but spies on you' },
  { name: 'A phone call', line: 'Someone pretending to be your bank, asking for a code' },
  { name: 'Old software', line: 'A known weakness that an update would have fixed' },
  { name: 'A lost phone', line: 'A phone with no screen lock, in the wrong hands' },
] as const

/** You in the middle, and six ways an attack reaches you (Diagram lab, 6 states). */
export function AttackPaths({ state = 0 }: LabProps) {
  const at = Math.min(Math.max(state, 0), PATHS.length - 1)
  const p = PATHS[at]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div
        role="img"
        aria-label={`${p.name}: ${p.line}.`}
        className="grid grid-cols-2 gap-2 min-[480px]:grid-cols-3"
      >
        {PATHS.map((x, i) => (
          <div
            key={x.name}
            className={cn(
              'flex min-h-[64px] flex-col justify-center rounded-2xl border-[1.5px] px-3 py-2 text-center motion-safe:transition-colors motion-safe:duration-250',
              i === at ? 'border-cy bg-[rgba(34,190,230,0.16)]' : 'border-line bg-row',
            )}
          >
            <span className={cn('text-sm font-bold', i === at ? 'text-ink' : 'text-ink-muted')}>
              {x.name}
            </span>
          </div>
        ))}
      </div>
      <figcaption className="flex items-start gap-3 rounded-xl bg-row px-3 py-2.5 text-sm text-ink">
        <span
          aria-hidden="true"
          className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-cy text-xs font-bold text-white"
        >
          {at + 1}
        </span>
        {p.line}.
      </figcaption>
    </figure>
  )
}
