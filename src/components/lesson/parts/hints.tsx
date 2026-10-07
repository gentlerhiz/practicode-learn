'use client'
import { Glyph } from '@/components/ui/glyph'
import { Prose } from './prose'

/** "Show a Hint", then "Another Hint", until all three are out. */
export function HintButton({ shown, total, onMore }: { shown: number; total: number; onMore: () => void }) {
  if (shown >= total) return null
  return (
    <button
      type="button"
      onClick={onMore}
      className="press inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-line-control px-4 text-sm font-medium text-ink hover:border-line-strong hover:bg-hover"
    >
      <Glyph name="bulb" size={16} className="text-badge-text" />
      {shown ? 'Another Hint' : 'Show a Hint'}
    </button>
  )
}

/** The hints shown so far: a nudge, then the concept, then a worked example that isn't the answer. */
export function HintList({ hints, shown }: { hints: string[]; shown: number }) {
  return (
    <div aria-live="polite" className="flex flex-col gap-2.5">
      {hints.slice(0, shown).map((hint, i) => (
        <div key={i} className="flex gap-3 rounded-2xl border border-[rgba(255,138,61,0.35)] bg-[rgba(255,138,61,0.08)] p-4 text-[15px] leading-6 text-ink-soft">
          <Glyph name="bulb" size={18} className="mt-0.5 shrink-0 text-badge-text" />
          <span>
            <span className="font-semibold text-ink">
              Hint {i + 1} of {hints.length}:
            </span>{' '}
            <Prose html={hint} inline />
          </span>
        </div>
      ))}
    </div>
  )
}
