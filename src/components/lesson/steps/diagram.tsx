'use client'
import { useRef, type KeyboardEvent } from 'react'
import { Button } from '@/components/ui'
import type { LessonStep } from '@/lib/lessons/schema'
import { cn } from '@/lib/cn'
import { labs } from '../labs'
import type { LessonPlayerApi } from '../player/use-lesson-player'
import { Prose } from '../parts/prose'
import { StepGrid, StepHeading, VisualCard } from '../parts/step-layout'

type DiagramStepData = Extract<LessonStep, { type: 'diagram' }>

/**
 * A lab drawing that advances one state at a time, with a title and text for every state. Previous and
 * Next, or the arrow keys on the drawing. Focus stays where it was, so keyboard users don't lose their place.
 */
export function DiagramStep({ step, api }: { step: DiagramStepData; api: LessonPlayerApi }) {
  const n = step.states.length
  const at = Math.min(api.state.at ?? 0, n - 1)
  const current = step.states[at]!
  const Lab = labs[step.lab]
  const drawing = useRef<HTMLDivElement>(null)
  const prev = useRef<HTMLButtonElement>(null)
  const next = useRef<HTMLButtonElement>(null)

  const go = (delta: number, from: 'key' | 'prev' | 'next') => {
    const target = at + delta
    if (target < 0 || target >= n) return
    api.setAt(target)
    requestAnimationFrame(() => {
      if (from === 'key') return drawing.current?.focus()
      const pressed = from === 'prev' ? prev.current : next.current
      const other = from === 'prev' ? next.current : prev.current
      ;(pressed && !pressed.disabled ? pressed : other)?.focus()
    })
  }
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1, 'key')
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1, 'key')
    }
  }

  return (
    <StepGrid
      top={
        <>
          <StepHeading stage={step.stage} body={step.body} />
          <div aria-live="polite" className="surface rounded-3xl border border-line p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-lg font-bold text-ink">{current.title}</h3>
              <span className="shrink-0 text-sm text-ink-muted">
                {at + 1} of {n}
              </span>
            </div>
            <Prose html={current.html} className="mt-2" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Button ref={prev} variant="secondary" size="sm" disabled={at === 0} onClick={() => go(-1, 'prev')}>
              Previous
            </Button>
            <div aria-hidden="true" className="flex gap-1.5">
              {step.states.map((_, i) => (
                <span key={i} className={cn('size-2 rounded-full bg-line-control', i === at && 'bg-fe')} />
              ))}
            </div>
            <Button
              ref={next}
              variant={at < n - 1 ? 'primary' : 'secondary'}
              size="sm"
              disabled={at === n - 1}
              onClick={() => go(1, 'next')}
            >
              Next
            </Button>
          </div>
        </>
      }
      aside={
        <VisualCard label="Diagram" className="p-4 ph:p-6">
          <div
            ref={drawing}
            data-lab
            tabIndex={0}
            role="group"
            aria-label="Diagram. Use the left and right arrow keys to move between steps."
            onKeyDown={onKeyDown}
            className="min-w-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fe"
          >
            <Lab state={at} />
          </div>
        </VisualCard>
      }
    />
  )
}
