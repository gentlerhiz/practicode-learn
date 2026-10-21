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
        'flex flex-col gap-1 rounded-2xl border-[1.5px] p-3 motion-safe:transition-colors motion-safe:duration-250',
        on ? 'border-it bg-[rgba(255,170,60,0.16)]' : 'border-line bg-row',
      )}
    >
      <span className="flex items-center gap-2 text-sm font-bold text-ink">
        <span
          aria-hidden="true"
          className={cn(
            'flex h-7 min-w-7 items-center justify-center rounded-lg px-1.5 font-mono text-[10px] font-bold',
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

/**
 * Taking a photo, through input, processing, memory, storage and output (Diagram lab, 5 states).
 */
export function ComputerParts({ state = 0 }: LabProps) {
  const active = AT(state)
  const label = PARTS.find((p) => p.id === active)!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div
        role="img"
        aria-label={`Taking a photo. Now: ${label.name}. ${label.example}.`}
        className="grid grid-cols-1 gap-2 @min-[520px]:grid-cols-[1fr_auto_1.2fr_auto_1fr] @min-[520px]:items-center"
      >
        <Part id="input" active={active} />
        <span aria-hidden="true" className="hidden text-center text-ink-subtle @min-[520px]:block">
          →
        </span>
        <div className="flex flex-col gap-2">
          <Part id="process" active={active} />
          <div className="grid grid-cols-2 gap-2">
            <Part id="memory" active={active} />
            <Part id="storage" active={active} />
          </div>
        </div>
        <span aria-hidden="true" className="hidden text-center text-ink-subtle @min-[520px]:block">
          →
        </span>
        <Part id="output" active={active} />
      </div>
    </figure>
  )
}
