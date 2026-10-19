'use client'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const PLACES = [128, 64, 32, 16, 8, 4, 2, 1]

function Switches({ start }: { start: string }) {
  const [bits, setBits] = useState<number[]>(() =>
    PLACES.map((_, i) => (start.padStart(8, '0').slice(-8)[i] === '1' ? 1 : 0)),
  )
  const total = bits.reduce((sum, b, i) => sum + b * PLACES[i]!, 0)
  const sum = PLACES.filter((_, i) => bits[i]).join(' + ')
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="group" aria-label="Eight switches. Tap one to flip it." className="grid grid-cols-8 gap-1.5">
        {PLACES.map((place, i) => (
          <button
            key={place}
            type="button"
            aria-pressed={bits[i] === 1}
            aria-label={`The ${place}s switch, ${bits[i] ? 'on' : 'off'}`}
            onClick={() => setBits((b) => b.map((v, j) => (j === i ? 1 - v : v)))}
            className={cn(
              'flex press cursor-pointer flex-col items-center gap-1 rounded-xl border-[1.5px] py-2 font-mono',
              bits[i] ? 'border-it bg-it text-white' : 'border-line-control bg-row text-ink-muted',
            )}
          >
            <span className="text-lg font-bold">{bits[i]}</span>
            <span className="text-[10px]">{place}</span>
          </button>
        ))}
      </div>
      <figcaption aria-live="polite" className="rounded-xl bg-row px-3 py-2.5 text-sm text-ink">
        <span className="font-mono">{bits.join('')}</span> is <span className="font-bold">{total}</span>
        {sum && total > 0 ? (
          <span className="text-ink-muted"> ({sum})</span>
        ) : (
          <span className="text-ink-muted"> (every switch is off)</span>
        )}
      </figcaption>
    </figure>
  )
}

/**
 * Eight bits as switches, each worth double the one to its right (Explore lab: value = eight 0s and
 * 1s to start from). Tapping a switch flips it, so learners can make any number up to 255.
 */
export function BinaryBits({ value = '00000101' }: LabProps) {
  return <Switches key={value} start={value} />
}
