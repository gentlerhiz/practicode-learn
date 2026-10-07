'use client'
import { useEffect, useRef } from 'react'
import { Glyph } from '@/components/ui/glyph'
import { cn } from '@/lib/cn'
import { Prose } from './prose'

export type FeedbackValue = { ok: boolean; verdict: string; html: string } | null

/**
 * An aria-live slot that announces the verdict and the explanation, drawn as the canvas's coloured line
 * with a tick or a cross. It takes focus when new feedback arrives, so the learner lands on it.
 */
export function Feedback({ value, focusKey }: { value: FeedbackValue; focusKey?: string | number }) {
  const slot = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (focusKey !== undefined && value) slot.current?.focus({ preventScroll: true })
  }, [focusKey, value])
  return (
    <div ref={slot} tabIndex={-1} aria-live="polite" className="outline-none">
      {value && (
        <p className={cn('flex gap-3 text-[15px] leading-6', value.ok ? 'text-success' : 'text-error')}>
          <Glyph name={value.ok ? 'check' : 'x'} size={20} strokeWidth={2.2} className="mt-0.5 shrink-0" />
          <span>
            <span className="mr-1.5 font-semibold">{value.verdict}</span>
            <Prose html={value.html} inline className="[&_code]:rounded [&_code]:bg-control [&_code]:px-1 [&_code]:font-mono [&_strong]:font-semibold" />
          </span>
        </p>
      )}
    </div>
  )
}
