'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { TutorSpark } from '@/components/learn/tutor-spark'
import { Editor } from '@/components/lesson/parts/editor'
import { highlight } from '@/components/lesson/parts/highlight'
import { PreviewFrame } from '@/components/lesson/preview-frame'
import { Glyph } from '@/components/ui/glyph'
import { cn } from '@/lib/cn'
import type { LessonFile } from '@/lib/lessons/schema'

export type WorkspaceCheck = {
  id: string
  name: string
  /** null: the check hasn't run (or can't run yet). */
  pass: boolean | null
  detail?: string
  where?: string
  /** The explanation behind "Ask AI why": written with the check, so it's there before the tutor is. */
  why?: string
  /** 1-based lines in the CSS file this check points at, highlighted when it's open. */
  lines?: number[]
}

export type WorkspaceData = {
  title: string
  track: string
  module: number
  saved?: string
  brief: string
  asks: string[]
  askedBy: string
  checks: WorkspaceCheck[]
  checksNote: string
  files: LessonFile[]
  editable: boolean
  backHref: Route
}

const pill =
  'press inline-flex h-[42px] cursor-pointer items-center gap-2 rounded-full border border-line-control px-4 text-sm font-medium text-ink hover:border-line-strong hover:bg-hover'

/** PrismProject: the brief and checks, the code, and a live preview of it. */
export function Workspace({ data }: { data: WorkspaceData }) {
  const [files, setFiles] = useState(data.files)
  const [file, setFile] = useState(data.files.length > 1 ? 1 : 0)
  const firstFail = data.checks.find((c) => c.pass === false)?.id ?? null
  const [open, setOpen] = useState<string | null>(firstFail)
  const [asked, setAsked] = useState<string[]>([])
  const [device, setDevice] = useState<'phone' | 'desk'>('phone')
  const [tutorNote, setTutorNote] = useState(false)
  const passed = data.checks.filter((c) => c.pass).length
  const failing = data.checks.filter((c) => c.pass === false).length
  const ran = data.checks.some((c) => c.pass !== null)
  const current = files[file]!
  const selected = data.checks.find((c) => c.id === open)
  const html = useMemo(() => highlight(current.code, current.lang), [current])

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[360px] left-[20%] h-[700px] w-[1100px] opacity-(--pc-glow-opacity)"
        style={{ background: 'radial-gradient(closest-side at 40% 50%, rgba(77,107,255,0.22), rgba(77,107,255,0) 75%)' }}
      />
      <header className="relative border-b border-line-subtle bg-[color-mix(in_srgb,var(--pc-sheet)_85%,transparent)]">
        <div className="flex h-[72px] items-center gap-4 px-4 ph:px-6">
          <Link href={data.backHref} aria-label="Back to projects" className="press flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-ink hover:bg-hover">
            <Glyph name="chevronRight" size={18} className="rotate-180" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-ink">{data.title}</p>
            <p className="text-[13px] text-ink-subtle">
              <span className="text-fe-text">{data.track}</span> · Module {data.module} project
              {data.saved && <span className="hidden ph:inline"> · {data.saved}</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setTutorNote((v) => !v)} aria-expanded={tutorNote} className={cn(pill, 'hidden pl-1.5 ph:inline-flex')}>
              <TutorSpark size={30} />
              Ask AI
            </button>
            <button type="button" className={pill} disabled={!data.checks.length}>
              <Glyph name="play" size={16} />
              Run Checks
            </button>
            <button
              type="button"
              disabled
              aria-describedby="submit-note"
              className="hidden h-[42px] cursor-not-allowed items-center rounded-full border border-line-control bg-control px-4 text-sm font-semibold text-ink-subtle ph:inline-flex"
            >
              Submit Project
            </button>
          </div>
        </div>
        {tutorNote && (
          <p role="status" className="border-t border-line-subtle px-6 py-3 text-[13px] text-ink-muted">
            The AI tutor arrives soon. Until then, open a check that needs a fix and use its explanation.
          </p>
        )}
      </header>

      <div className="relative grid grid-cols-1 min-[900px]:grid-cols-[320px_minmax(0,1fr)] min-[1280px]:grid-cols-[360px_minmax(0,1fr)_400px]">
        <aside aria-label="Brief and checks" className="flex flex-col gap-6 border-b border-line-subtle px-4 py-5 ph:px-5 ph:py-6 min-[900px]:border-r min-[900px]:border-b-0">
          <section aria-labelledby="brief-title" className="flex flex-col gap-3">
            <h2 id="brief-title" className="font-display text-lg font-bold text-ink">
              The brief
            </h2>
            <p className="text-sm leading-[22px] text-ink-soft">{data.brief}</p>
            {data.asks.length > 0 && (
              <details className="text-sm">
                <summary className="cursor-pointer font-medium text-fe-text">{data.askedBy}</summary>
                <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-4 leading-[21px] text-ink-muted">
                  {data.asks.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </details>
            )}
          </section>

          <section aria-labelledby="checks-title" className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <h2 id="checks-title" className="font-display text-lg font-bold text-ink">
                Checks
              </h2>
              <p className="text-[13px] text-ink-muted">
                {data.checks.length ? (ran ? `${passed} of ${data.checks.length} passing` : 'Not run yet') : 'Opening soon'}
              </p>
            </div>
            {data.checks.length > 0 && (
              <div aria-hidden="true" className="flex gap-1">
                {data.checks.map((c) => (
                  <span key={c.id} className={cn('block h-[5px] flex-1 rounded-[3px]', c.pass ? 'bg-fe' : c.pass === false ? 'bg-[#3a2a35]' : 'bg-meter')} />
                ))}
              </div>
            )}
            <ul className="flex flex-col gap-2">
              {data.checks.map((c) => {
                const isOpen = c.pass === false && open === c.id
                return (
                  <li
                    key={c.id}
                    className={cn('overflow-hidden rounded-2xl border', isOpen ? 'border-[rgba(255,154,162,0.55)] bg-[rgba(255,154,162,0.06)]' : 'border-divider bg-row')}
                  >
                    <button
                      type="button"
                      aria-expanded={c.pass === false ? isOpen : undefined}
                      onClick={() => c.pass === false && setOpen(isOpen ? null : c.id)}
                      className={cn('flex w-full items-start gap-3 px-4 py-3 text-left text-sm leading-[21px] text-ink', c.pass === false && 'cursor-pointer hover:bg-hover')}
                    >
                      <span
                        className={cn(
                          'mt-px flex size-[22px] shrink-0 items-center justify-center rounded-[7px] border-[1.5px]',
                          c.pass ? 'border-fe bg-fe text-white' : c.pass === false ? 'border-error text-error' : 'border-line-strong text-ink-subtle',
                        )}
                      >
                        {c.pass ? <Glyph name="check" size={13} strokeWidth={2.6} /> : c.pass === false ? <Glyph name="x" size={12} strokeWidth={2.6} /> : null}
                      </span>
                      <span className="flex-1">
                        <span className="block">{c.name}</span>
                        <span className={cn('block text-xs', c.pass === false ? 'text-error' : 'text-ink-subtle')}>
                          {c.pass ? 'Passed' : c.pass === false ? 'Needs a fix' : 'Not run yet'}
                        </span>
                      </span>
                    </button>
                    {isOpen && (
                      <div className="flex flex-col gap-3 px-4 pb-4 pl-12">
                        {c.detail && <p className="text-[13px] leading-5 text-ink-soft">{c.detail}</p>}
                        {c.where && <p className="font-mono text-xs text-ink-subtle">{c.where}</p>}
                        {c.why && (
                          <button
                            type="button"
                            onClick={() => setAsked((a) => (a.includes(c.id) ? a : [...a, c.id]))}
                            className="press flex h-[34px] cursor-pointer items-center gap-1.5 self-start rounded-full border border-[var(--pc-line-strong)] pr-3 pl-1 text-[13px] text-ink hover:bg-hover"
                          >
                            <TutorSpark size={26} />
                            Ask AI why
                          </button>
                        )}
                        {c.why && asked.includes(c.id) && (
                          <div aria-live="polite" className="flex items-start gap-2">
                            <TutorSpark size={24} />
                            <p className="rounded-[6px_16px_16px_16px] border border-line bg-control px-3 py-2 text-[13px] leading-5 text-ink-soft">{c.why}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
            <p id="submit-note" className="text-xs leading-[18px] text-ink-subtle">
              {data.checksNote}
            </p>
          </section>
        </aside>

        <section aria-label="Code editor" className="flex min-w-0 flex-col border-b border-line-subtle min-[1280px]:border-r min-[1280px]:border-b-0">
          <div className="flex h-[52px] items-center justify-between gap-3 border-b border-line-subtle px-4">
            <div role="tablist" aria-label="Files" className="flex gap-1 font-mono text-xs">
              {files.map((f, i) => (
                <button
                  key={f.name}
                  type="button"
                  role="tab"
                  aria-selected={file === i}
                  onClick={() => setFile(i)}
                  className={cn(
                    'h-8 cursor-pointer rounded-full border px-3',
                    file === i ? 'border-[rgba(77,107,255,0.5)] bg-[rgba(77,107,255,0.18)] text-ink' : 'border-transparent text-ink-subtle hover:text-ink',
                  )}
                >
                  {f.name}
                  {f.name.endsWith('.css') && failing > 0 && <span className="text-error"> · {failing}</span>}
                </button>
              ))}
            </div>
            <p className="hidden text-xs text-ink-subtle ph:block">{data.editable ? 'Autosaves as you type' : 'Saved'}</p>
          </div>
          <div className="flex-1">
            {data.editable ? (
              <Editor
                label={current.name}
                value={current.code}
                onChange={(code) => setFiles((list) => list.map((f, i) => (i === file ? { ...f, code } : f)))}
              />
            ) : (
              <pre tabIndex={0} aria-label={current.name} className="code-colours overflow-x-auto py-4 font-mono text-[12.5px] leading-[26px] text-ink ph:text-sm">
                {html.split('\n').map((line, i) => {
                  const flagged = current.name.endsWith('.css') && selected?.lines?.includes(i + 1)
                  return (
                    <div key={i} className={cn('flex px-4 whitespace-pre', flagged && 'bg-[rgba(255,154,162,0.12)] shadow-[inset_3px_0_0_#ff9aa2]')}>
                      <span className="w-8 shrink-0 text-code-gutter select-none">{i + 1}</span>
                      <span dangerouslySetInnerHTML={{ __html: line || ' ' }} />
                    </div>
                  )
                })}
              </pre>
            )}
          </div>
          <div className="flex items-center gap-3 border-t border-line-subtle px-5 py-3 font-mono text-xs text-ink-muted">
            <span className={cn('block size-2 rounded-full', failing ? 'bg-error' : ran ? 'bg-success' : 'bg-ink-subtle')} />
            {ran ? `Checks ran · ${passed} passed · ${failing} to fix` : data.checks.length ? 'Checks haven’t run yet' : 'Checks for this project open soon'}
          </div>
        </section>

        <section aria-label="Live preview" className="flex flex-col gap-4 p-4 ph:p-5 min-[900px]:col-span-2 min-[1280px]:col-span-1">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-ink">Preview</h2>
            <div role="group" aria-label="Screen size" className="flex gap-1 rounded-full border border-line p-1">
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
                  className={cn('h-[30px] cursor-pointer rounded-full px-3 text-xs font-medium', device === id ? 'bg-primary text-on-primary' : 'text-ink-soft hover:bg-hover')}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex min-h-[560px] flex-1 items-start justify-center overflow-hidden rounded-[22px] border border-divider bg-sunken px-3 py-6">
            <div className={cn('overflow-hidden border-2 border-[var(--pc-line-strong)] bg-white', device === 'phone' ? 'h-[520px] w-[320px] rounded-[26px]' : 'h-[420px] w-full rounded-xl')}>
              <PreviewFrame files={files} label={`Preview of ${data.title}`} className="h-full w-full" />
            </div>
          </div>
          <p className="text-xs leading-[18px] text-ink-subtle">This is your page as it runs. Nothing here is published until you submit.</p>
        </section>
      </div>
    </div>
  )
}
