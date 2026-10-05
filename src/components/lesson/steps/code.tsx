'use client'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui'
import type { LessonFile, LessonStep } from '@/lib/lessons/schema'
import type { TestResult } from '@/lib/runner/protocol'
import { PreviewFrame, type PreviewFrameHandle } from '../preview-frame'
import type { LessonPlayerApi } from '../player/use-lesson-player'
import { CodeFiles } from '../parts/code-files'
import { Feedback } from '../parts/feedback'
import { HintButton, HintList } from '../parts/hints'
import { PreviewPanel } from '../parts/preview-panel'
import { Prose } from '../parts/prose'
import { TestsList } from '../parts/tests-list'

type CodeStepData = Extract<LessonStep, { type: 'code' }>

/**
 * Edit the starter files, Run to see the result, and Run Tests to check it. The preview only changes when
 * the learner runs the code, not on every keystroke. Done when every test passes.
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
  const allPass = Boolean(results?.length) && (results ?? []).every((r) => r.pass)

  return (
    <div className="flex flex-col gap-5">
      {step.body && <Prose html={step.body} />}
      <div className="grid gap-4 tab:grid-cols-2">
        <CodeFiles files={files} editable active={files.findIndex((f) => !f.readonly)} onEdit={edit} />
        <PreviewPanel label="Updates when you run it">
          <PreviewFrame
            ref={frame}
            files={ran.files}
            tests={ran.testing ? step.tests : undefined}
            onResults={ran.testing ? onResults : undefined}
            label="Preview of your code"
          />
        </PreviewPanel>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={() => start(false)}>
          Run
        </Button>
        <Button onClick={() => start(true)} disabled={checking}>
          {checking ? 'Checking…' : 'Run Tests'}
        </Button>
        <HintButton shown={api.state.hints} total={step.hints.length} onMore={api.reveal} />
      </div>
      <TestsList tests={step.tests} results={results} />
      {allPass && <Feedback value={{ ok: true, verdict: 'All checks pass.', html: 'Nicely done.' }} />}
      <HintList hints={step.hints} shown={api.state.hints} />
    </div>
  )
}
