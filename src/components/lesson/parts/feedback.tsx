'use client'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'
import { Prose } from './prose'

export type FeedbackValue = { ok: boolean; verdict: string; html: string } | null

/**
 * An aria-live slot that announces the verdict (✓ or ✕ and a word) and the explanation. It takes focus
 * when new feedback arrives, so the learner lands on it, as in the approved preview.
 */
export function Feedback({ value, focusKey }: { value: FeedbackValue; focusKey?: string | number }) {
  const slot = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (focusKey !== undefined && value) slot.current?.focus({ preventScroll: true })
  }, [focusKey, value])
  return (
    <div ref={slot} tabIndex={-1} aria-live="polite" className="outline-none">
      {value && (
        <div
          className={cn(
            'rounded-2xl border p-4 text-[15px] leading-6',
            value.ok ? 'border-success bg-success/10' : 'border-error bg-error/10',
          )}
        >
          <span className={cn('mr-1.5 font-semibold', value.ok ? 'text-success' : 'text-error')}>
            {value.ok ? '✓' : '✕'} {value.verdict}
          </span>
          <Prose html={value.html} inline className="text-ink" />
        </div>
      )}
    </div>
  )
}
