'use client'
import { Button } from '@/components/ui'
import type { LessonStep } from '@/lib/lessons/schema'
import { PreviewFrame } from '../preview-frame'
import type { LessonPlayerApi } from '../player/use-lesson-player'
import { CodeFiles } from '../parts/code-files'
import { Feedback, type FeedbackValue } from '../parts/feedback'
import { HintButton, HintList } from '../parts/hints'
import { Options } from '../parts/options'
import { PreviewPanel, Reveal } from '../parts/preview-panel'
import { Prose } from '../parts/prose'

type ChoiceStepData = Extract<LessonStep, { type: 'predict' | 'question' }>

const PLACEHOLDER = '/* tap an answer to try it */'

function verdict(step: ChoiceStepData, checkedId: string, reveal: boolean): FeedbackValue {
  const chosen = step.options.find((o) => o.id === checkedId)
  const right = step.options.find((o) => o.correct)
  if (!chosen || !right) return null
  if (chosen.correct)
    return { ok: true, verdict: reveal ? 'You called it.' : 'Correct.', html: chosen.feedback }
  if (reveal) {
    return {
      ok: false,
      verdict: 'Not this time.',
      html: `${chosen.feedback} <strong>The answer:</strong> ${right.html}. ${right.feedback}`,
    }
  }
  return { ok: false, verdict: 'Not quite.', html: `${chosen.feedback} Try another answer.` }
}

/**
 * Predict and Question steps. A prediction is revealed after one check (being wrong is fine), and with
 * `run` the learner then runs the code. A question must be answered correctly. In a `live` question,
 * each answer is tried in the preview as soon as it is chosen.
 */
export function ChoiceStep({
  step,
  index,
  api,
}: {
  step: ChoiceStepData
  index: number
  api: LessonPlayerApi
}) {
  const s = api.state
  const reveal = step.type === 'predict'
  const locked = Boolean(s.checkedId) && (reveal || Boolean(s.correct))
  // Choosing another answer after a wrong one clears the old verdict, as in the approved preview.
  const showChecked = Boolean(s.checkedId) && (locked || s.selected === s.checkedId)
  const runnable = Boolean(step.run && step.files)
  const chosen = step.options.find((o) => o.id === s.selected)
  const liveValue = chosen?.value ?? PLACEHOLDER
  const liveFile = step.files
    ? Math.max(
        0,
        step.files.findIndex((f) => f.code.includes('{{value}}')),
      )
    : 0

  return (
    <div className="flex flex-col gap-5">
      {step.body && <Prose html={step.body} />}
      {step.files &&
        (step.live ? (
          <div className="grid gap-4 tab:grid-cols-2">
            <CodeFiles files={step.files} value={liveValue} active={liveFile} />
            <PreviewPanel label="Live preview: tap an answer to try it">
              <PreviewFrame files={step.files} value={liveValue} label="Live preview of the code" />
            </PreviewPanel>
          </div>
        ) : (
          <CodeFiles files={step.files} />
        ))}
      <Options
        name={`step-${index}`}
        options={step.options}
        selected={s.selected}
        checkedId={showChecked ? s.checkedId : undefined}
        revealAnswer={reveal}
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
        value={showChecked && s.checkedId ? verdict(step, s.checkedId, reveal) : null}
        focusKey={api.attempts[String(index)]}
      />
      <HintList hints={step.hints} shown={s.hints} />
      {runnable &&
        s.checkedId &&
        (s.ran ? (
          <>
            <PreviewPanel label="Live preview">
              <PreviewFrame files={step.files ?? []} label="What the code really does" />
            </PreviewPanel>
            {step.reveal && <Reveal html={step.reveal} />}
          </>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={api.run}>Run It</Button>
            <span className="text-sm text-ink-muted">See what really happens.</span>
          </div>
        ))}
      {!runnable && s.checkedId && s.correct && step.reveal && <Reveal html={step.reveal} />}
    </div>
  )
}
