'use client'
import { useId, useRef, useState, type KeyboardEvent } from 'react'
import type { LessonFile } from '@/lib/lessons/schema'
import { cn } from '@/lib/cn'
import { Editor } from './editor'
import { highlight } from './highlight'

// The canvas's code colours. Inside the highlighted {{value}} line every token takes the main text colour:
// coloured tokens on the yellow mark would fall below 4.5:1 contrast in dark mode.
const codeClass =
  'code-colours overflow-x-auto py-5 font-mono text-[13px] leading-6 text-ink ph:text-[15px] ph:leading-7 [&_mark]:block [&_mark]:bg-yellow/15 [&_mark]:text-ink [&_mark]:shadow-[inset_3px_0_0_var(--color-yellow)] [&_mark_*]:text-ink! focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus'

/** Highlighted code with the canvas's line numbers. */
function NumberedCode({ file, value }: { file: LessonFile; value?: string | null }) {
  const lines = highlight(file.code, file.lang, value).split('\n')
  return (
    // tabIndex: wide code scrolls sideways, and keyboard users must be able to scroll it too.
    <pre className={codeClass} tabIndex={0}>
      <code>
        {lines.map((line, i) => (
          <span key={i} className="flex px-4 whitespace-pre ph:px-5">
            <span aria-hidden="true" className="w-8 shrink-0 text-code-gutter select-none">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1" dangerouslySetInnerHTML={{ __html: line || ' ' }} />
          </span>
        ))}
      </code>
    </pre>
  )
}

/**
 * The step's files as the canvas's pill tabs (WAI-ARIA tabs: arrow keys move between them). Read-only
 * files are coloured and numbered; editable ones open in the editor. A `value` fills in {{value}} and
 * marks its line. `status` sits at the right of the tab bar ("Live preview", "Saved").
 */
export function CodeFiles({
  files,
  value,
  active: initial,
  editable = false,
  onEdit,
  status,
}: {
  files: LessonFile[]
  value?: string | null
  active?: number
  editable?: boolean
  onEdit?: (index: number, code: string) => void
  status?: React.ReactNode
}) {
  const id = useId()
  const [active, setActive] = useState(Math.max(0, initial ?? 0))
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const onKeyDown = (e: KeyboardEvent) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (active + step + files.length) % files.length
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <div className="flex flex-col">
      <div className="flex h-14 items-center justify-between gap-3 border-b border-divider px-4">
        <div role="tablist" aria-label="Files" className="flex gap-1 font-mono text-xs" onKeyDown={onKeyDown}>
          {files.map((f, i) => (
            <button
              key={f.name}
              ref={(el) => {
                tabs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`${id}-t${i}`}
              aria-controls={`${id}-p${i}`}
              aria-selected={i === active}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn(
                'cursor-pointer rounded-full border px-3 py-1.5',
                i === active ? 'border-[rgba(77,107,255,0.5)] bg-[rgba(77,107,255,0.18)] text-ink' : 'border-transparent text-ink-subtle hover:text-ink',
              )}
            >
              {f.name}
              {f.readonly && editable && <span className="ml-2 font-sans text-[11px] text-ink-subtle">read only</span>}
            </button>
          ))}
        </div>
        {status && <div className="text-xs text-ink-muted">{status}</div>}
      </div>
      {files.map((f, i) => (
        <div key={f.name} role="tabpanel" id={`${id}-p${i}`} aria-labelledby={`${id}-t${i}`} hidden={i !== active}>
          {editable && !f.readonly ? (
            <Editor label={`Edit ${f.name}`} value={f.code} onChange={(code) => onEdit?.(i, code)} />
          ) : (
            <NumberedCode file={f} value={value} />
          )}
        </div>
      ))}
    </div>
  )
}

/** A green dot and a word, at the right of the tab bar. */
export function LiveDot({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span aria-hidden="true" className="block size-2 rounded-full bg-success-fill" />
      {label}
    </span>
  )
}
