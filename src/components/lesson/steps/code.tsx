'use client'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui'
import { Glyph } from '@/components/ui/glyph'
import type { LessonFile, LessonStep } from '@/lib/lessons/schema'
import type { TestResult } from '@/lib/runner/protocol'
import { PreviewFrame, type PreviewFrameHandle } from '../preview-frame'
import type { LessonPlayerApi } from '../player/use-lesson-player'
import { CodeFiles } from '../parts/code-files'
import { Feedback } from '../parts/feedback'
import { HintList } from '../parts/hints'
import { PreviewPanel } from '../parts/preview-panel'
import { StepGrid, StepHeading, VisualCard } from '../parts/step-layout'
import { TestsList } from '../parts/tests-list'

type CodeStepData = Extract<LessonStep, { type: 'code' }>

/**
 * Modify and Make (PrismStepModify, PrismStepMake): edit the files, Run to see the result, Run Tests to
 * check it. The preview changes when the learner runs the code, not on every keystroke. On phones the
 * editor comes before the tests, as on the canvas. Done when every test passes.
 */
export function CodeStep({ step, api }: { step: CodeStepData; api: LessonPlayerApi }) {
  const files = api.state.files ?? step.files
  const results = api.state.results
  const frame = useRef<PreviewFrameHandle>(null)
  const [ran, setRan] = useState<{ files: LessonFile[]; testing: boolean }>({ files, testing: false })
  const [checking, setChecking] = useState(false)

  const start = (testing: boolean) => {
    const same = ran.files === files && ran.testing === testing
    setRan({ files, testing })
    setChecking(testing)
    if (same) frame.current?.run() // nothing changed, so ask for a fresh run
  }
  const onResults = (r: TestResult[]) => {
    setChecking(false)
    api.recordTests(r)
  }
  const edit = (i: number, code: string) => api.setFiles(files.map((f, j) => (j === i ? { ...f, code } : f)))
  const passing = (results ?? []).filter((r) => r.pass).length
  const allPass = Boolean(results?.length) && passing === results!.length

  return (
    <StepGrid
      top={<StepHeading stage={step.stage} body={step.body} />}
      aside={
        <VisualCard label="Code editor and preview">
          <CodeFiles
            files={files}
            editable
            active={files.findIndex((f) => !f.readonly)}
            onEdit={edit}
            status={<span>{ran.files === files ? 'Saved' : 'Not run yet'}</span>}
          />
          <PreviewPanel label="Preview · updates when you run it">
            <PreviewFrame
              ref={frame}
              files={ran.files}
              tests={ran.testing ? step.tests : undefined}
              onResults={ran.testing ? onResults : undefined}
              label="Preview of your code"
            />
          </PreviewPanel>
          <div className="flex flex-wrap gap-2 px-4 pb-5 ph:px-6">
            <Button variant="secondary" size="sm" onClick={() => start(false)} className="bg-transparent font-medium">
              <Glyph name="play" size={14} />
              Run
            </Button>
          </div>
        </VisualCard>
      }
      bottom={
        <section aria-label="Tests" className="surface flex flex-col gap-4 rounded-3xl border border-line p-5 ph:p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-sm font-semibold text-ink">Tests</h3>
            <p className="text-[13px] text-ink-muted">
              {results ? `${passing} of ${results.length} passing` : `${step.tests.length} to pass`}
            </p>
          </div>
          <TestsList tests={step.tests} results={results} />
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" onClick={() => start(true)} pending={checking}>
              {!checking && <Glyph name="play" size={14} />}
              {checking ? 'Checking…' : 'Run Tests'}
            </Button>
          </div>
          {allPass && <Feedback value={{ ok: true, verdict: 'All checks pass.', html: 'Nicely done.' }} />}
          <HintList hints={step.hints} shown={api.state.hints} />
        </section>
      }
    />
  )
}
