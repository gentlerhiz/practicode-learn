'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { saveProject, submitProject } from '@/app/(focus)/projects/actions'
import { TutorSpark } from '@/components/learn/tutor-spark'
import { Editor } from '@/components/lesson/parts/editor'
import { highlight } from '@/components/lesson/parts/highlight'
import { PreviewFrame } from '@/components/lesson/preview-frame'
import { buttonClasses } from '@/components/ui/button'
import { Glyph } from '@/components/ui/glyph'
import { cn } from '@/lib/cn'
import type { LessonFile, LessonTest } from '@/lib/lessons/schema'
import type { CheckResult } from '@/lib/projects/checks'
import { CheckRunner } from './check-runner'

export type WorkspaceData = {
  projectId: string
  version: number
  title: string
  track: string
  module: number
  client: string
  /** HTML, from the project pack. */
  brief: string
  must: string[]
  nice: string[]
  checks: LessonTest[]
  /** Every check's name, in order: the brief's, then accessibility and the screen sizes. */
  checkNames: string[]
  results: CheckResult[]
  review: string[]
  needsSite: boolean
  siteUrl: string | null
  status: 'new' | 'draft' | 'passed'
  savedAt: string | null
  files: LessonFile[]
  /** When the module's lessons aren't all done yet, how far there is to go. */
  locked: { done: number; total: number } | null
  backHref: Route
}

const pill =
  'press inline-flex h-[42px] cursor-pointer items-center gap-2 rounded-full border border-line-control px-4 text-sm font-medium text-ink hover:border-line-strong hover:bg-hover disabled:cursor-not-allowed disabled:opacity-50'

const savedLabel = (iso: string | null, now = Date.now()) => {
  if (!iso) return null
  const minutes = Math.round((now - new Date(iso).getTime()) / 60000)
  return minutes < 1 ? 'Saved just now' : minutes < 60 ? `Saved ${minutes} min ago` : 'Saved'
}

/** PrismProject: the brief and checks, the code, and a live preview of it. */
export function Workspace({ data }: { data: WorkspaceData }) {
  const [files, setFiles] = useState(data.files)
  const [file, setFile] = useState(0)
  const [results, setResults] = useState<CheckResult[]>(data.results)
  const [run, setRun] = useState(0)
  const [running, setRunning] = useState(false)
  const [open, setOpen] = useState<string | null>(null)
  const [device, setDevice] = useState<'phone' | 'desk'>('phone')
  const [tutorNote, setTutorNote] = useState(false)
  const [status, setStatus] = useState(data.status)
  const [saved, setSaved] = useState<string | null>(savedLabel(data.savedAt))
  const [saveError, setSaveError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [review, setReview] = useState<boolean[]>(data.review.map(() => status === 'passed'))
  const [site, setSite] = useState(data.siteUrl ?? '')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const byName = new Map(results.map((r) => [r.name, r]))
  const checks = data.checkNames.map((name) => ({ name, result: byName.get(name) ?? null }))
  const ran = results.length > 0
  const passed = checks.filter((c) => c.result?.pass).length
  const failing = checks.filter((c) => c.result && !c.result.pass).length
  const allPass = ran && passed === checks.length
  const current = files[file]!

  const save = useCallback(
    async (extra: { results?: CheckResult[]; siteUrl?: string } = {}) => {
      setSaved('Saving…')
      const r = await saveProject({ projectId: data.projectId, version: data.version, files, ...extra })
      if (r.ok) {
        setSaved('Saved just now')
        setSaveError(null)
        setStatus((s) => (s === 'new' ? 'draft' : s))
      } else {
        setSaved(null)
        setSaveError(r.error)
      }
    },
    [data.projectId, data.version, files],
  )

  // Autosave a moment after typing stops.
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => void save(), 1500)
    return () => clearTimeout(timer.current)
  }, [files, save])

  const onDone = useCallback(
    (r: CheckResult[]) => {
      setResults(r)
      setRunning(false)
      setOpen(r.find((x) => !x.pass)?.name ?? null)
      void save({ results: r })
    },
    [save],
  )

  const submit = async () => {
    setBusy(true)
    setSubmitError(null)
    const r = await submitProject({
      projectId: data.projectId,
      version: data.version,
      files,
      results,
      review,
      siteUrl: site,
    })
    setBusy(false)
    if (r.ok) {
      setStatus('passed')
      setSubmitting(false)
    } else setSubmitError(r.error)
  }

  const note = data.locked
    ? `This project opens when you finish Module ${data.module}’s lessons: ${data.locked.done} of ${data.locked.total} done. You can start building now.`
    : status === 'passed'
      ? 'Passed. You can keep improving it: your changes still save, and the checks still run.'
      : allPass
        ? 'Every check passes. Submit it when you’re happy with it.'
        : 'Run the checks as you go. Submit opens when every check passes.'

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[360px] left-[20%] h-[700px] w-[1100px] opacity-(--pc-glow-opacity)"
        style={{
          background:
            'radial-gradient(closest-side at 40% 50%, rgba(77,107,255,0.22), rgba(77,107,255,0) 75%)',
        }}
      />
      <header className="relative border-b border-line-subtle bg-[color-mix(in_srgb,var(--pc-sheet)_85%,transparent)]">
        <div className="flex h-[72px] items-center gap-3 px-4 ph:gap-4 ph:px-6">
          <Link
            href={data.backHref}
            aria-label="Back to projects"
            className="flex size-11 shrink-0 press items-center justify-center rounded-full border border-line text-ink hover:bg-hover"
          >
            <Glyph name="chevronRight" size={18} className="rotate-180" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[15px] font-semibold text-ink">{data.title}</h1>
            <p className="truncate text-[13px] text-ink-subtle">
              <span className="text-fe-text">{data.track}</span> · Module {data.module} project
              {saved && <span className="hidden ph:inline"> · {saved}</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTutorNote((v) => !v)}
              aria-expanded={tutorNote}
              className={cn(pill, 'hidden pl-1.5 tab:inline-flex')}
            >
              <TutorSpark size={30} />
              Ask AI
            </button>
            <button
              type="button"
              className={pill}
              disabled={running}
              onClick={() => {
                setRunning(true)
                setRun((n) => n + 1)
              }}
            >
              <Glyph name="play" size={16} />
              {running ? 'Checking…' : 'Run Checks'}
            </button>
            {status === 'passed' ? (
              <p className="hidden h-[42px] items-center gap-1.5 rounded-full bg-success-fill px-4 text-sm font-bold text-on-success ph:inline-flex">
                <Glyph name="check" size={15} strokeWidth={2.6} />
                Passed
              </p>
            ) : (
              <button
                type="button"
                disabled={!allPass || Boolean(data.locked)}
                aria-describedby="submit-note"
                onClick={() => setSubmitting(true)}
                className={cn(
                  'h-[42px] items-center rounded-full px-4 text-sm font-semibold ph:inline-flex',
                  allPass && !data.locked
                    ? 'inline-flex press cursor-pointer bg-primary text-on-primary hover:opacity-90'
                    : 'hidden cursor-not-allowed border border-line-control bg-control text-ink-subtle',
                )}
              >
                Submit Project
              </button>
            )}
          </div>
        </div>
        {tutorNote && (
          <p role="status" className="border-t border-line-subtle px-6 py-3 text-[13px] text-ink-muted">
            The AI tutor works in lessons for now. Here, open a check that needs a fix: it says what to
            change.
          </p>
        )}
        {saveError && (
          <p role="alert" className="border-t border-line-subtle px-6 py-3 text-[13px] text-error">
            {saveError}
          </p>
        )}
      </header>

      {submitting && (
        <div className="relative border-b border-line-subtle bg-row px-4 py-5 ph:px-6">
          <section aria-labelledby="submit-title" className="mx-auto flex max-w-[640px] flex-col gap-4">
            <h2 id="submit-title" className="font-display text-xl font-extrabold text-ink">
              Before you submit
            </h2>
            <p className="text-sm text-ink-muted">
              Check your own work, the way a professional would. Tick each one that’s true.
            </p>
            <ul className="flex flex-col gap-2.5">
              {data.review.map((q, k) => (
                <li key={q}>
                  <label className="flex cursor-pointer items-start gap-3 text-sm leading-[21px] text-ink">
                    <input
                      type="checkbox"
                      checked={review[k]}
                      onChange={(e) => setReview((r) => r.map((v, j) => (j === k ? e.target.checked : v)))}
                      className="mt-0.5 size-[18px] shrink-0 accent-[var(--pc-primary)]"
                    />
                    {q}
                  </label>
                </li>
              ))}
            </ul>
            {/* Only Front-End teaches putting a site live (its Module 3), so other courses don't ask. */}
            {(data.needsSite || data.track === 'front-end-web-development') && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="site" className="text-sm font-medium text-ink">
                  {data.needsSite ? 'The address where it’s live' : 'The address where it’s live (optional)'}
                </label>
                <input
                  id="site"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="https://your-name.github.io/project/"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  className="h-11 rounded-xl border border-line-control bg-control px-3 text-sm text-ink placeholder:text-ink-subtle focus:border-line-strong focus:outline-none"
                />
                <p className="text-xs text-ink-subtle">
                  Publish it with GitHub Pages, as in Module 3, and paste its address.
                </p>
              </div>
            )}
            {submitError && (
              <p role="alert" className="text-sm text-error">
                {submitError}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={busy || !review.every(Boolean) || (data.needsSite && !site.trim())}
                onClick={submit}
                className={buttonClasses({}, 'h-11 px-5 disabled:cursor-not-allowed disabled:opacity-50')}
              >
                {busy ? 'Submitting…' : 'Submit Project'}
              </button>
              <button
                type="button"
                onClick={() => setSubmitting(false)}
                className={buttonClasses({ variant: 'secondary' }, 'h-11 bg-transparent px-5 font-medium')}
              >
                Not Yet
              </button>
            </div>
          </section>
        </div>
      )}

      {status === 'passed' && !submitting && (
        <p
          role="status"
          className="relative flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line-subtle bg-success-fill/15 px-4 py-3 text-sm text-ink ph:px-6"
        >
          <Glyph name="check" size={16} strokeWidth={2.6} className="text-success" />
          Project passed. It counts toward your certificate.
          <Link
            href={'/projects' as Route}
            className="font-semibold text-fe-text underline underline-offset-2 hover:no-underline"
          >
            See your projects
          </Link>
        </p>
      )}

      <div className="relative grid grid-cols-1 min-[900px]:grid-cols-[320px_minmax(0,1fr)] min-[1280px]:grid-cols-[360px_minmax(0,1fr)_400px]">
        <aside
          aria-label="Brief and checks"
          className="flex flex-col gap-6 border-b border-line-subtle px-4 py-5 min-[900px]:border-r min-[900px]:border-b-0 ph:px-5 ph:py-6"
        >
          <section aria-labelledby="brief-title" className="flex flex-col gap-3">
            <h2 id="brief-title" className="font-display text-lg font-bold text-ink">
              The brief
            </h2>
            <p className="text-xs font-semibold text-fe-text">For {data.client}</p>
            <div
              className="flex flex-col gap-3 text-sm leading-[22px] text-ink-soft [&_strong]:text-ink"
              dangerouslySetInnerHTML={{ __html: data.brief }}
            />
            <details className="text-sm" open>
              <summary className="cursor-pointer font-medium text-fe-text">What the brief asks for</summary>
              <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-4 leading-[21px] text-ink-muted">
                {data.must.map((a) => (
                  <li key={a} dangerouslySetInnerHTML={{ __html: a }} />
                ))}
              </ul>
              {data.nice.length > 0 && (
                <>
                  <p className="mt-3 text-xs font-semibold text-ink-soft">Nice to have</p>
                  <ul className="mt-1.5 flex list-disc flex-col gap-1.5 pl-4 leading-[21px] text-ink-muted">
                    {data.nice.map((a) => (
                      <li key={a} dangerouslySetInnerHTML={{ __html: a }} />
                    ))}
                  </ul>
                </>
              )}
            </details>
          </section>

          <section aria-labelledby="checks-title" className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <h2 id="checks-title" className="font-display text-lg font-bold text-ink">
                Checks
              </h2>
              <p className="text-[13px] text-ink-muted" aria-live="polite">
                {running ? 'Checking…' : ran ? `${passed} of ${checks.length} passing` : 'Not run yet'}
              </p>
            </div>
            <div aria-hidden="true" className="flex gap-1">
              {checks.map((c) => (
                <span
                  key={c.name}
                  className={cn(
                    'block h-[5px] flex-1 rounded-[3px]',
                    c.result?.pass ? 'bg-fe' : c.result ? 'bg-error/50' : 'bg-meter',
                  )}
                />
              ))}
            </div>
            <ul className="flex flex-col gap-2">
              {checks.map((c) => {
                const fail = c.result && !c.result.pass
                const isOpen = fail && open === c.name
                return (
                  <li
                    key={c.name}
                    className={cn(
                      'overflow-hidden rounded-2xl border',
                      isOpen
                        ? 'border-[rgba(255,154,162,0.55)] bg-[rgba(255,154,162,0.06)]'
                        : 'border-divider bg-row',
                    )}
                  >
                    <button
                      type="button"
                      aria-expanded={fail ? Boolean(isOpen) : undefined}
                      onClick={() => fail && setOpen(isOpen ? null : c.name)}
                      className={cn(
                        'flex w-full items-start gap-3 px-4 py-3 text-left text-sm leading-[21px] text-ink',
                        fail && 'cursor-pointer hover:bg-hover',
                      )}
                    >
                      <span
                        className={cn(
                          'mt-px flex size-[22px] shrink-0 items-center justify-center rounded-[7px] border-[1.5px]',
                          c.result?.pass
                            ? 'border-fe bg-fe text-white'
                            : fail
                              ? 'border-error text-error'
                              : 'border-line-strong text-ink-subtle',
                        )}
                      >
                        {c.result?.pass ? (
                          <Glyph name="check" size={13} strokeWidth={2.6} />
                        ) : fail ? (
                          <Glyph name="x" size={12} strokeWidth={2.6} />
                        ) : null}
                      </span>
                      <span className="flex-1">
                        <span className="block" dangerouslySetInnerHTML={{ __html: c.name }} />
                        <span className={cn('block text-xs', fail ? 'text-error' : 'text-ink-subtle')}>
                          {c.result?.pass ? 'Passed' : fail ? 'Needs a fix' : 'Not run yet'}
                        </span>
                      </span>
                    </button>
                    {isOpen && c.result?.message && (
                      <p className="px-4 pb-4 pl-12 text-[13px] leading-5 text-ink-soft">
                        {c.result.message}
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>
            <p id="submit-note" className="text-xs leading-[18px] text-ink-subtle">
              {note}
            </p>
          </section>
        </aside>

        <section
          aria-label="Code editor"
          className="flex min-w-0 flex-col border-b border-line-subtle min-[1280px]:border-r min-[1280px]:border-b-0"
        >
          <div className="flex h-[52px] items-center justify-between gap-3 border-b border-line-subtle px-4">
            <div role="tablist" aria-label="Files" className="flex gap-1 overflow-x-auto font-mono text-xs">
              {files.map((f, i) => (
                <button
                  key={f.name}
                  type="button"
                  role="tab"
                  aria-selected={file === i}
                  onClick={() => setFile(i)}
                  className={cn(
                    'h-8 shrink-0 cursor-pointer rounded-full border px-3',
                    file === i
                      ? 'border-[rgba(77,107,255,0.5)] bg-[rgba(77,107,255,0.18)] text-ink'
                      : 'border-transparent text-ink-subtle hover:text-ink',
                  )}
                >
                  {f.name}
                </button>
              ))}
            </div>
            <p className="hidden text-xs text-ink-subtle ph:block">
              {current.readonly ? 'Read only' : 'Autosaves as you type'}
            </p>
          </div>
          <div className="flex-1">
            {current.readonly ? (
              <pre
                tabIndex={0}
                aria-label={`${current.name}, read only`}
                className="overflow-x-auto py-4 font-mono text-[12.5px] leading-[26px] code-colours text-ink ph:text-sm"
              >
                {highlight(current.code, current.lang)
                  .split('\n')
                  .map((line, i) => (
                    <div key={i} className="flex px-4 whitespace-pre">
                      <span aria-hidden="true" className="w-8 shrink-0 text-code-gutter select-none">
                        {i + 1}
                      </span>
                      <span dangerouslySetInnerHTML={{ __html: line || ' ' }} />
                    </div>
                  ))}
              </pre>
            ) : (
              <Editor
                key={current.name}
                label={current.name}
                value={current.code}
                onChange={(code) => setFiles((list) => list.map((f, i) => (i === file ? { ...f, code } : f)))}
              />
            )}
          </div>
          <div className="flex items-center gap-3 border-t border-line-subtle px-5 py-3 font-mono text-xs text-ink-muted">
            <span
              className={cn(
                'block size-2 rounded-full',
                failing ? 'bg-error' : ran ? 'bg-success' : 'bg-ink-subtle',
              )}
            />
            {ran ? `Checks ran · ${passed} passed · ${failing} to fix` : 'Checks haven’t run yet'}
          </div>
        </section>

        <section
          aria-label="Live preview"
          className="flex flex-col gap-4 p-4 min-[900px]:col-span-2 min-[1280px]:col-span-1 ph:p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-ink">Preview</h2>
            <div
              role="group"
              aria-label="Screen size"
              className="flex gap-1 rounded-full border border-line p-1"
            >
              {(
                [
                  ['phone', 'Phone · 320px'],
                  ['desk', 'Laptop'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={device === id}
                  onClick={() => setDevice(id)}
                  className={cn(
                    'h-[30px] cursor-pointer rounded-full px-3 text-xs font-medium',
                    device === id ? 'bg-primary text-on-primary' : 'text-ink-soft hover:bg-hover',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex min-h-[560px] flex-1 items-start justify-center overflow-hidden rounded-[22px] border border-divider bg-sunken px-3 py-6">
            <div
              className={cn(
                'overflow-hidden border-2 border-[var(--pc-line-strong)] bg-white',
                device === 'phone'
                  ? 'h-[520px] w-[320px] max-w-full rounded-[26px]'
                  : 'h-[420px] w-full rounded-xl',
              )}
            >
              <PreviewFrame
                files={files}
                label={`Preview of ${data.title}`}
                className="h-full w-full rounded-none border-0"
              />
            </div>
          </div>
          <p className="text-xs leading-[18px] text-ink-subtle">
            This is your page as it runs. Your work saves to your account as you type.
          </p>
        </section>
      </div>
      <CheckRunner files={files} checks={data.checks} run={run} onDone={onDone} />
    </div>
  )
}
