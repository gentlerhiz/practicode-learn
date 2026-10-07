'use client'
import { useId } from 'react'
import { Button } from '@/components/ui'
import type { LessonStep } from '@/lib/lessons/schema'
import { cn } from '@/lib/cn'
import { labs } from '../labs'
import { PreviewFrame } from '../preview-frame'
import type { LessonPlayerApi } from '../player/use-lesson-player'
import { CodeFiles, LiveDot } from '../parts/code-files'
import { Feedback } from '../parts/feedback'
import { HintList } from '../parts/hints'
import { Options } from '../parts/options'
import { PreviewPanel, Reveal } from '../parts/preview-panel'
import { Prose } from '../parts/prose'
import { StepGrid, StepHeading, VisualCard } from '../parts/step-layout'

type ExploreStepData = Extract<LessonStep, { type: 'explore' }>

/**
 * Investigate (PrismLesson): value buttons that drive live code or a lab, then "Check yourself". On
 * phones the code and preview sit straight under the value buttons, as the canvas puts them.
 */
export function ExploreStep({ step, index, api }: { step: ExploreStepData; index: number; api: LessonPlayerApi }) {
  const s = api.state
  const value = s.value ?? step.values[0]!
  const controlId = useId()
  const Lab = step.lab ? labs[step.lab] : null
  const locked = Boolean(s.checkedId && s.correct)
  const showChecked = Boolean(s.checkedId) && (locked || s.selected === s.checkedId)
  const chosen = step.options.find((o) => o.id === s.checkedId)
  const liveFile = step.files ? Math.max(0, step.files.findIndex((f) => f.code.includes('{{value}}'))) : 0

  return (
    <StepGrid
      top={
        <>
          <StepHeading stage={step.stage} body={step.body} />
          <div className="flex flex-col gap-3">
            <span id={controlId} className="text-sm font-medium text-ink-soft">
              {step.control}
            </span>
            <div role="group" aria-labelledby={controlId} className="flex flex-wrap gap-2">
              {step.values.map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={v === value}
                  onClick={() => api.setValue(v)}
                  className={cn(
                    'press h-10 cursor-pointer rounded-xl border px-3.5 font-mono text-[13px]',
                    v === value ? 'border-fe bg-fe text-white' : 'border-line bg-row text-ink-soft hover:border-line-strong hover:text-ink',
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </>
      }
      aside={
        Lab ? (
          <VisualCard label="Interactive diagram" className="p-4 ph:p-6">
            <div data-lab className="min-w-0">
              <Lab value={value} />
            </div>
          </VisualCard>
        ) : (
          <VisualCard label="Code and live preview">
            <CodeFiles files={step.files ?? []} value={value} active={liveFile} status={<LiveDot label="Live preview" />} />
            <PreviewPanel label="Preview">
              <PreviewFrame files={step.files ?? []} value={value} label="Live preview of the code" />
            </PreviewPanel>
          </VisualCard>
        )
      }
      bottom={
        <section aria-label="Check yourself" className="surface flex flex-col gap-4 rounded-3xl border border-line p-5 ph:p-6">
          <Prose html={step.ask} className="font-display text-lg leading-6 font-bold text-ink" />
          <Options
            name={`step-${index}`}
            options={step.options}
            selected={s.selected}
            checkedId={showChecked ? s.checkedId : undefined}
            locked={locked}
            onSelect={api.select}
          />
          <div className="flex flex-wrap items-center gap-3">
            {!locked && (
              <Button variant="secondary" onClick={() => api.check()} disabled={!s.selected} className="bg-transparent font-medium">
                Check My Answer
              </Button>
            )}
          </div>
          <Feedback
            value={
              showChecked && chosen
                ? chosen.correct
                  ? { ok: true, verdict: 'Correct.', html: chosen.feedback }
                  : { ok: false, verdict: 'Not quite.', html: `${chosen.feedback} Try another answer.` }
                : null
            }
            focusKey={api.attempts[String(index)]}
          />
          <HintList hints={step.hints} shown={s.hints} />
          {locked && step.reveal && <Reveal html={step.reveal} />}
        </section>
      }
    />
  )
}
