'use client'
import type { LessonStep } from '@/lib/lessons/schema'
import { cn } from '@/lib/cn'
import type { LessonPlayerApi } from '../player/use-lesson-player'
import { Prose } from '../parts/prose'

/** Two to four key points, and cards to check yourself. */
export function RecapStep({
  step,
  api,
}: {
  step: Extract<LessonStep, { type: 'recap' }>
  api: LessonPlayerApi
}) {
  const flipped = api.state.flipped ?? []
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-xl font-bold text-ink">What you can do now</h2>
      <ol className="flex flex-col gap-2.5">
        {step.points.map((point, i) => (
          <li
            key={i}
            className="flex gap-3 rounded-2xl border border-line bg-row p-4 text-[15px] leading-6 text-ink"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-success/15 text-sm font-semibold text-success">
              {i + 1}
            </span>
            <Prose html={point} inline />
          </li>
        ))}
      </ol>
      <p className="text-sm text-ink-muted">Tap a card to check yourself.</p>
      <div className="grid gap-3 ph:grid-cols-2">
        {step.cards.map((card, i) => {
          const shown = flipped.includes(i)
          return (
            <button
              key={i}
              type="button"
              aria-pressed={shown}
              onClick={() => api.flipCard(i)}
              className={cn(
                'flex min-h-28 flex-col items-start gap-2 rounded-2xl border border-line bg-row p-4 text-left text-[15px] leading-6 text-ink',
                shown && 'border-fe bg-fe/10',
              )}
            >
              <span className="text-[12px] font-medium text-ink-subtle">
                {shown ? 'Answer' : `Review card ${i + 1}`}
              </span>
              <Prose html={shown ? card.back : card.front} inline />
            </button>
          )
        })}
      </div>
    </div>
  )
}
