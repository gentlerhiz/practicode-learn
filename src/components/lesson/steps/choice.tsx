'use client'
import { Button } from '@/components/ui'
import { Glyph } from '@/components/ui/glyph'
import type { LessonStep } from '@/lib/lessons/schema'
import { PreviewFrame } from '../preview-frame'
import type { LessonPlayerApi } from '../player/use-lesson-player'
import { CodeFiles, LiveDot } from '../parts/code-files'
import { Feedback, type FeedbackValue } from '../parts/feedback'
import { HintList } from '../parts/hints'
import { Options } from '../parts/options'
import { PreviewPanel, Reveal } from '../parts/preview-panel'
import { StepGrid, StepHeading, VisualCard } from '../parts/step-layout'

type ChoiceStepData = Extract<LessonStep, { type: 'predict' | 'question' }>

const PLACEHOLDER = '/* tap an answer to try it */'

function verdict(step: ChoiceStepData, checkedId: string, reveal: boolean): FeedbackValue {
  const chosen = step.options.find((o) => o.id === checkedId)
  const right = step.options.find((o) => o.correct)
  if (!chosen || !right) return null
  if (chosen.correct) return { ok: true, verdict: reveal ? 'You called it.' : 'Correct.', html: chosen.feedback }
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
 * Predict and Question steps (PrismStepPredict, PrismTryLesson). A prediction is revealed after one
 * check (being wrong is fine), and with `run` the learner then runs the code. A question must be
 * answered correctly. In a `live` question, each answer is tried in the preview as soon as it is chosen.
 */
export function ChoiceStep({ step, index, api }: { step: ChoiceStepData; index: number; api: LessonPlayerApi }) {
  const s = api.state
  const reveal = step.type === 'predict'
  const locked = Boolean(s.checkedId) && (reveal || Boolean(s.correct))
  // Choosing another answer after a wrong one clears the old verdict, as in the approved preview.
  const showChecked = Boolean(s.checkedId) && (locked || s.selected === s.checkedId)
  const runnable = Boolean(step.run && step.files)
  const chosen = step.options.find((o) => o.id === s.selected)
  const liveValue = chosen?.value ?? PLACEHOLDER
  const liveFile = step.files ? Math.max(0, step.files.findIndex((f) => f.code.includes('{{value}}'))) : 0
  const mono = step.options.every((o) => /^<code>[^<]*<\/code>$/.test(o.html.trim()))

  const aside = step.files ? (
    <VisualCard label="Code and live preview">
      {step.live ? (
        <>
          <CodeFiles files={step.files} value={liveValue} active={liveFile} status={<LiveDot label="Live preview" />} />
          <PreviewPanel label="Preview · tap an answer to try it">
            <PreviewFrame files={step.files} value={liveValue} label="Live preview of the code" />
          </PreviewPanel>
        </>
      ) : (
        <>
          <CodeFiles files={step.files} active={Math.max(0, step.files.findIndex((f) => f.lang !== 'html'))} status={runnable ? <LiveDot label="Live preview" /> : undefined} />
          {runnable && (
            <PreviewPanel label="Preview" note={s.ran ? undefined : 'Make your guess, then press Run It.'}>
              {s.ran ? (
                <PreviewFrame files={step.files} label="What the code really does" />
              ) : (
                <div className="flex h-40 items-center justify-center bg-sunken p-4"><div className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-line-strong text-[13px] text-ink-subtle">Run it to see</div></div>
              )}
            </PreviewPanel>
          )}
        </>
      )}
    </VisualCard>
  ) : undefined

  return (
    <StepGrid
      aside={aside}
      top={
        <>
          <StepHeading stage={step.stage} body={step.body} />
          <Options
            name={`step-${index}`}
            options={step.options}
            selected={s.selected}
            checkedId={showChecked ? s.checkedId : undefined}
            revealAnswer={reveal}
            locked={locked}
            onSelect={api.select}
            mono={mono}
          />
          <div className="flex flex-wrap items-center gap-3">
            {!locked && (
              <Button onClick={() => api.check()} disabled={!s.selected}>
                Check My Answer
              </Button>
            )}
            {runnable && s.checkedId && !s.ran && (
              <Button onClick={api.run}>
                <Glyph name="play" size={15} />
                Run It
              </Button>
            )}
          </div>
          <Feedback value={showChecked && s.checkedId ? verdict(step, s.checkedId, reveal) : null} focusKey={api.attempts[String(index)]} />
          <HintList hints={step.hints} shown={s.hints} />
          {runnable && s.ran && step.reveal && <Reveal html={step.reveal} />}
          {!runnable && s.checkedId && s.correct && step.reveal && <Reveal html={step.reveal} />}
        </>
      }
    />
  )
}
