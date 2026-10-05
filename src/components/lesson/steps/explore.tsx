'use client'
import { useId } from 'react'
import { Button } from '@/components/ui'
import type { LessonStep } from '@/lib/lessons/schema'
import { cn } from '@/lib/cn'
import { labs } from '../labs'
import { PreviewFrame } from '../preview-frame'
import type { LessonPlayerApi } from '../player/use-lesson-player'
import { CodeFiles } from '../parts/code-files'
import { Feedback } from '../parts/feedback'
import { HintButton, HintList } from '../parts/hints'
import { Options } from '../parts/options'
import { PreviewPanel, Reveal } from '../parts/preview-panel'
import { Prose } from '../parts/prose'

type ExploreStepData = Extract<LessonStep, { type: 'explore' }>

/** A control with a few values that drives live code or a lab, then a question to answer correctly. */
export function ExploreStep({
  step,
  index,
  api,
}: {
  step: ExploreStepData
  index: number
  api: LessonPlayerApi
}) {
  const s = api.state
  const value = s.value ?? step.values[0]!
  const controlId = useId()
  const Lab = step.lab ? labs[step.lab] : null
  const locked = Boolean(s.checkedId && s.correct)
  const showChecked = Boolean(s.checkedId) && (locked || s.selected === s.checkedId)
  const chosen = step.options.find((o) => o.id === s.checkedId)
  const liveFile = step.files
    ? Math.max(
        0,
        step.files.findIndex((f) => f.code.includes('{{value}}')),
      )
    : 0

  return (
    <div className="flex flex-col gap-5">
      {step.body && <Prose html={step.body} />}
      <div className="flex flex-wrap items-center gap-3">
        <span id={controlId} className="text-sm font-medium text-ink-soft">
          {step.control}
        </span>
        <div
          role="group"
          aria-labelledby={controlId}
          className="inline-flex flex-wrap gap-1 rounded-full border border-line bg-row p-1"
        >
          {step.values.map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={v === value}
              onClick={() => api.setValue(v)}
              className={cn(
                'rounded-full px-3.5 py-1.5 font-mono text-[13px] text-ink-soft',
                v === value && 'bg-fe text-white',
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      {Lab ? (
        <div data-lab className="min-w-0 rounded-2xl border border-line bg-sunken p-4">
          <Lab value={value} />
        </div>
      ) : (
        <div className="grid gap-4 tab:grid-cols-2">
          <CodeFiles files={step.files ?? []} value={value} active={liveFile} />
          <PreviewPanel label="Live preview">
            <PreviewFrame files={step.files ?? []} value={value} label="Live preview of the code" />
          </PreviewPanel>
        </div>
      )}
      <Prose html={step.ask} className="font-semibold text-ink" />
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
          <Button onClick={() => api.check()} disabled={!s.selected}>
            Check My Answer
          </Button>
        )}
        <HintButton shown={s.hints} total={step.hints.length} onMore={api.reveal} />
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
    </div>
  )
}
