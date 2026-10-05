'use client'
import { Button } from '@/components/ui'
import { Prose } from './prose'

/** "Show a Hint", then "Another Hint", until all three are out. */
export function HintButton({ shown, total, onMore }: { shown: number; total: number; onMore: () => void }) {
  if (shown >= total) return null
  return (
    <Button variant="ghost" size="sm" onClick={onMore}>
      {shown ? 'Another Hint' : 'Show a Hint'}
    </Button>
  )
}

/** The hints shown so far: a nudge, then the concept, then a worked example that isn't the answer. */
export function HintList({ hints, shown }: { hints: string[]; shown: number }) {
  return (
    <div aria-live="polite" className="flex flex-col gap-2.5">
      {hints.slice(0, shown).map((hint, i) => (
        <div
          key={i}
          className="rounded-2xl border border-line-subtle bg-sunken p-4 text-[15px] leading-6 text-ink-soft"
        >
          <span className="font-semibold text-ink">
            Hint {i + 1} of {hints.length}:
          </span>{' '}
          <Prose html={hint} inline />
        </div>
      ))}
    </div>
  )
}
