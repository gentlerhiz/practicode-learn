'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { PreviewFrame } from '@/components/lesson/preview-frame'
import type { LessonFile, LessonTest } from '@/lib/lessons/schema'
import { accessibilityCheck, SCREENS, screenCheck, type CheckResult } from '@/lib/projects/checks'

let axeSource: Promise<string> | null = null
/** axe-core, served from public/vendor (scripts/vendor.mjs), fetched once and only when checks run. */
const loadAxe = () =>
  (axeSource ??= fetch('/vendor/axe.min.js').then((r) => {
    if (!r.ok) throw new Error('axe')
    return r.text()
  }))

/**
 * Runs a project's checks the way the content build checks the model solution: the brief's own checks
 * and the accessibility check at laptop width, then the screen-size check at each width, each in its
 * own sandboxed frame of that size, out of sight. Reports every result at once, in the workspace's order.
 */
export function CheckRunner({
  files,
  checks,
  run,
  onDone,
}: {
  files: LessonFile[]
  checks: LessonTest[]
  /** Starts a run when it changes; 0 means don't run. */
  run: number
  onDone: (results: CheckResult[]) => void
}) {
  const [axe, setAxe] = useState<string | null>(null)
  const [axeFailed, setAxeFailed] = useState(false)
  const got = useRef<Record<string, CheckResult[]>>({})
  const reported = useRef(0)
  // The files as they were when this run started, so typing during a run doesn't restart it.
  const snapshot = useMemo(() => files, [run]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!run) return
    got.current = {}
    loadAxe().then(setAxe, () => setAxeFailed(true))
  }, [run])

  const frames = useMemo(
    () => [
      { key: 'brief', width: 1280, height: 800, tests: [...checks, accessibilityCheck], helpers: true },
      ...SCREENS.map((s) => ({
        key: `w${s.width}`,
        width: s.width,
        height: s.height,
        tests: [screenCheck(s)],
        helpers: false,
      })),
    ],
    [checks],
  )

  const collect = (key: string, results: CheckResult[]) => {
    got.current[key] = results
    if (reported.current === run || !frames.every((f) => got.current[f.key])) return
    reported.current = run
    onDone(frames.flatMap((f) => got.current[f.key]!))
  }

  useEffect(() => {
    if (!run || !axeFailed || reported.current === run) return
    reported.current = run
    onDone([
      ...checks.map((c) => ({
        name: c.name,
        pass: false,
        message: 'The checks couldn’t start. Check your connection and run them again.',
      })),
      {
        name: accessibilityCheck.name,
        pass: false,
        message: 'The accessibility checker didn’t load. Check your connection and run the checks again.',
      },
      ...SCREENS.map((s) => ({
        name: screenCheck(s).name,
        pass: false,
        message: 'The checks couldn’t start.',
      })),
    ])
  }, [axeFailed, run, checks, onDone])

  if (!run || !axe) return null
  return (
    <div inert className="pointer-events-none fixed top-0 -left-[20000px] opacity-0">
      {frames.map((f) => (
        <div key={`${f.key}-${run}`} style={{ width: f.width, height: f.height }}>
          <PreviewFrame
            files={snapshot}
            tests={f.tests}
            helpers={f.helpers ? axe : undefined}
            onResults={(r) => collect(f.key, r)}
            label="Project checks"
            className="h-full w-full rounded-none border-0"
          />
        </div>
      ))}
    </div>
  )
}
