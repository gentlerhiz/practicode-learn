'use client'
import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type Ref,
} from 'react'
import type { LessonFile, LessonTest } from '@/lib/lessons/schema'
import { buildDocument } from '@/lib/runner/build-document'
import { parseRunnerMessage, RUN_TIMEOUT_MS, TIMEOUT_MESSAGE, type TestResult } from '@/lib/runner/protocol'
import { cn } from '@/lib/cn'

export type PreviewFrameHandle = { run(): void }

const noSubscription = () => () => {}

/**
 * Runs learner code in /runner.html: a sandboxed frame with an opaque origin, so the code can't reach
 * the learner's session, storage or this page. Each run loads a fresh document. With tests, results come
 * back by postMessage, and code that never reports within 4 seconds gets one friendly failed result.
 */
export function PreviewFrame({
  files,
  value,
  tests,
  onResults,
  label,
  className,
  ref,
}: {
  files: LessonFile[]
  value?: string | null
  tests?: LessonTest[]
  onResults?: (results: TestResult[]) => void
  label: string
  className?: string
  ref?: Ref<PreviewFrameHandle>
}) {
  const frame = useRef<HTMLIFrameElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [run, setRun] = useState(0)
  const doc = useMemo(() => buildDocument(files, { value, tests }), [files, value, tests])
  // The message listener reads the latest values without re-subscribing.
  const latest = useRef({ doc, tests, onResults })
  useEffect(() => {
    latest.current = { doc, tests, onResults }
  })

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const target = frame.current?.contentWindow
      if (!target || event.source !== target) return
      const message = parseRunnerMessage(event.data)
      if (!message) return
      if (message.type === 'ready') {
        target.postMessage({ type: 'run', html: latest.current.doc }, '*')
        clearTimeout(timer.current)
        if (latest.current.tests?.length) {
          timer.current = setTimeout(
            () => latest.current.onResults?.([{ name: 'Your code', pass: false, message: TIMEOUT_MESSAGE }]),
            RUN_TIMEOUT_MS,
          )
        }
      } else {
        clearTimeout(timer.current)
        latest.current.onResults?.(message.results)
      }
    }
    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
      clearTimeout(timer.current)
    }
  }, [])

  // A fresh document whenever the code changes, and whenever run() is called.
  const [shown, setShown] = useState(doc)
  if (shown !== doc) {
    setShown(doc)
    setRun((n) => n + 1)
  }
  useImperativeHandle(ref, () => ({ run: () => setRun((n) => n + 1) }), [])

  // The frame is created only in the browser, after the message listener above is attached: a frame in
  // the server HTML would load, and say it's ready, before anyone was listening.
  const inBrowser = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  )
  const frameClass = cn('h-64 w-full rounded-2xl border border-line bg-white', className)
  if (!inBrowser) return <div className={frameClass} aria-hidden="true" />

  return (
    <iframe
      ref={frame}
      src={`/runner.html?r=${run}`}
      sandbox="allow-scripts"
      title={label}
      className={frameClass}
    />
  )
}
