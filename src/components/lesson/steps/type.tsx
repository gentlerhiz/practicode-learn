'use client'
import { useId, useState } from 'react'
import { Button } from '@/components/ui'
import { inputClasses } from '@/components/ui/field'
import { acceptsAnswer } from '@/lib/lessons/answers'
import type { LessonStep } from '@/lib/lessons/schema'
import { cn } from '@/lib/cn'
import type { LessonPlayerApi } from '../player/use-lesson-player'
import { Feedback } from '../parts/feedback'
import { HintList } from '../parts/hints'
import { StepGrid, StepHeading } from '../parts/step-layout'

type TypeStepData = Extract<LessonStep, { type: 'type' }>

/**
 * Type the answer: a command, a number or a word. Enter checks it. A known wrong answer gets its own
 * feedback; anything else gets the step's general advice. Commands (`mono`) sit behind a prompt sign.
 */
export function TypeStep({ step, index, api }: { step: TypeStepData; index: number; api: LessonPlayerApi }) {
  const s = api.state
  const [draft, setDraft] = useState(s.typed ?? '')
  const id = useId()
  const solved = Boolean(s.solved)
  const checkedNow = s.typed !== undefined && s.typed === draft
  const miss = s.typed ? step.misses?.find((m) => acceptsAnswer(s.typed!, m.answers, step.caseSensitive)) : undefined

  return (
    <StepGrid
      top={
        <>
          <StepHeading stage={step.stage} body={step.body} />
          <form
            className="flex flex-col gap-3 ph:flex-row"
            onSubmit={(e) => {
              e.preventDefault()
              api.checkTyped(draft)
            }}
          >
            <label htmlFor={id} className="sr-only">
              Your answer
            </label>
            <div className="relative min-w-0 flex-1">
              {step.mono && (
                <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 font-mono text-[15px] text-it-text">
                  &gt;
                </span>
              )}
              <input
                id={id}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                readOnly={solved}
                placeholder={step.placeholder ?? 'Type your answer'}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                aria-invalid={checkedNow && !solved ? true : undefined}
                className={cn(
                  inputClasses,
                  step.mono && 'pl-9 font-mono',
                  solved && 'border-success-fill focus:border-success-fill',
                )}
              />
            </div>
            {!solved && (
              <Button type="submit" disabled={!draft.trim()} className="shrink-0">
                Check My Answer
              </Button>
            )}
          </form>
          <Feedback
            focusKey={api.attempts[String(index)]}
            value={
              s.typed !== undefined && (solved || checkedNow)
                ? solved
                  ? { ok: true, verdict: 'Correct.', html: step.correct }
                  : { ok: false, verdict: 'Not quite.', html: `${miss?.feedback ?? step.wrong} Try again.` }
                : null
            }
          />
          <HintList hints={step.hints} shown={s.hints} />
        </>
      }
    />
  )
}
