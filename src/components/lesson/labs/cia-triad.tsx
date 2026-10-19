'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const CORNERS = [
  { id: 'c', name: 'Confidentiality', line: 'Only the right people can see it' },
  { id: 'i', name: 'Integrity', line: 'Nobody can change it without you knowing' },
  { id: 'a', name: 'Availability', line: 'It’s there when you need it' },
] as const

// Which corners each state lights: one at a time, then all three for the incident.
const LIT: string[][] = [['c'], ['i'], ['a'], ['c', 'i', 'a']]

/**
 * Confidentiality, integrity and availability as a triangle (Diagram lab, 4 states): one corner at a
 * time, then one incident that breaks all three.
 */
export function CiaTriad({ state = 0 }: LabProps) {
  const lit = LIT[Math.min(Math.max(state, 0), LIT.length - 1)]!
  const all = lit.length === 3
  const corner = (id: (typeof CORNERS)[number]['id'], className: string) => {
    const c = CORNERS.find((x) => x.id === id)!
    const on = lit.includes(id)
    return (
      <div
        className={cn(
          'absolute flex w-[44%] flex-col gap-0.5 rounded-2xl border-[1.5px] p-2.5 text-center motion-safe:transition-colors motion-safe:duration-250 ph:p-3',
          on ? 'border-cy bg-[rgba(34,190,230,0.16)]' : 'border-line bg-row',
          className,
        )}
      >
        <span className={cn('text-sm font-bold', on ? 'text-ink' : 'text-ink-muted')}>{c.name}</span>
        <span className="text-[12px] leading-4 text-ink-soft">{c.line}</span>
      </div>
    )
  }
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div
        role="img"
        aria-label={
          all
            ? 'All three corners lit: ransomware copies your files, can change them, and locks you out.'
            : `Lit: ${CORNERS.find((c) => c.id === lit[0])!.name}.`
        }
        className="relative mx-auto aspect-[1.15] w-full max-w-[420px]"
      >
        <svg viewBox="0 0 100 87" aria-hidden="true" className="absolute inset-[14%] h-[72%] w-[72%]">
          <polygon
            points="50,4 96,83 4,83"
            fill={all ? 'rgba(34,190,230,0.14)' : 'none'}
            stroke={all ? '#0E7490' : 'var(--pc-line-control)'}
            strokeWidth="2"
          />
        </svg>
        {corner('c', 'top-0 left-1/2 -translate-x-1/2')}
        {corner('i', 'bottom-0 left-0')}
        {corner('a', 'right-0 bottom-0')}
      </div>
      {all && (
        <figcaption className="rounded-xl bg-row px-3 py-2.5 text-sm text-ink">
          Ransomware: criminals copy your files (confidentiality), scramble them (integrity) and lock you out
          until you pay (availability).
        </figcaption>
      )}
    </figure>
  )
}
