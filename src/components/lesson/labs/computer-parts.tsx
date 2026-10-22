'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

// The parts, in the order the diagram's states visit them.
const PARTS = [
  { id: 'input', name: 'Input', example: 'You tap the shutter button', icon: 'In' },
  { id: 'process', name: 'Processing', example: 'The processor turns light into a picture', icon: 'CPU' },
  { id: 'memory', name: 'Memory (RAM)', example: 'The picture sits here while it’s worked on', icon: 'RAM' },
  {
    id: 'storage',
    name: 'Storage',
    example: 'The photo is saved, and stays when the phone is off',
    icon: 'SSD',
  },
  { id: 'output', name: 'Output', example: 'The photo appears on the screen', icon: 'Out' },
] as const

const AT = (state: number) => PARTS[Math.min(Math.max(state, 0), PARTS.length - 1)]!.id

function Part({ id, active }: { id: (typeof PARTS)[number]['id']; active: string }) {
  const p = PARTS.find((x) => x.id === id)!
  const on = id === active
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-1.5 rounded-2xl border-[1.5px] p-3 motion-safe:transition-colors motion-safe:duration-250',
        on ? 'border-it bg-[rgba(255,170,60,0.16)]' : 'border-line bg-row',
      )}
    >
      {/* The badge and the name wrap as whole pieces, so a narrow card never cuts a word. */}
      <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-bold text-ink">
        <span
          aria-hidden="true"
          className={cn(
            'flex h-7 min-w-7 shrink-0 items-center justify-center rounded-lg px-1.5 font-mono text-[10px] font-bold',
            on ? 'bg-it text-white' : 'bg-sheet text-ink-muted',
          )}
        >
          {p.icon}
        </span>
        {p.name}
      </span>
      <span className="text-[13px] leading-5 text-ink-soft">{p.example}</span>
    </div>
  )
}

const Arrow = ({ down }: { down?: boolean }) => (
  <span aria-hidden="true" className={cn('text-center text-ink-subtle', down ? '@min-[640px]:hidden' : 'hidden @min-[640px]:block')}>
    {down ? '↓' : '→'}
  </span>
)

/**
 * Taking a photo, through input, processing, memory, storage and output (Diagram lab, 5 states). A
 * column on narrow cards; a row from 640px of card, with memory and storage side by side under processing.
 */
export function ComputerParts({ state = 0 }: LabProps) {
  const active = AT(state)
  const label = PARTS.find((p) => p.id === active)!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div
        role="img"
        aria-label={`Taking a photo. Now: ${label.name}. ${label.example}.`}
        className="grid grid-cols-1 gap-2 @min-[640px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.8fr)_auto_minmax(0,1fr)] @min-[640px]:items-center"
      >
        <Part id="input" active={active} />
        <Arrow />
        <Arrow down />
        <div className="flex min-w-0 flex-col gap-2">
          <Part id="process" active={active} />
          <div className="grid grid-cols-2 gap-2">
            <Part id="memory" active={active} />
            <Part id="storage" active={active} />
          </div>
        </div>
        <Arrow />
        <Arrow down />
        <Part id="output" active={active} />
      </div>
    </figure>
  )
}
