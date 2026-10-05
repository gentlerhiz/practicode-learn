'use client'
import { useId, useRef, useState, type KeyboardEvent } from 'react'
import type { LessonFile } from '@/lib/lessons/schema'
import { cn } from '@/lib/cn'
import { Editor } from './editor'
import { highlight } from './highlight'

// Inside the highlighted {{value}} line, every token takes the main text colour: coloured tokens on the
// yellow mark would fall below 4.5:1 contrast in dark mode.
const codeClass =
  'overflow-x-auto bg-sunken p-4 font-mono text-[13px] leading-6 text-ink [&_.c-attr]:text-ai-text [&_.c-com]:text-ink-subtle [&_.c-prop]:text-ai-text [&_.c-sel]:text-fe-text [&_.c-str]:text-da-text [&_.c-tag]:text-fe-text [&_.c-val]:text-da-text [&_mark]:rounded-sm [&_mark]:bg-yellow/25 [&_mark]:text-ink [&_mark]:outline [&_mark]:outline-yellow/40 [&_mark_*]:text-ink! focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-fe'

/**
 * The step's files as tabs (WAI-ARIA tabs: arrow keys move between them). Read-only files are coloured;
 * editable ones open in the editor. A `value` fills in {{value}} and marks its line.
 */
export function CodeFiles({
  files,
  value,
  active: initial,
  editable = false,
  onEdit,
}: {
  files: LessonFile[]
  value?: string | null
  active?: number
  editable?: boolean
  onEdit?: (index: number, code: string) => void
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
    <div className="overflow-hidden rounded-2xl border border-line">
      <div
        role="tablist"
        aria-label="Files"
        className="flex gap-1 border-b border-line bg-row px-2 pt-2"
        onKeyDown={onKeyDown}
      >
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
              '-mb-px rounded-t-xl border border-transparent px-3 py-2 font-mono text-[13px] text-ink-muted',
              i === active && 'border-line border-b-sunken bg-sunken text-ink',
            )}
          >
            {f.name}
            {f.readonly && editable && (
              <span className="ml-2 font-sans text-[11px] text-ink-subtle">read only</span>
            )}
          </button>
        ))}
      </div>
      {files.map((f, i) => (
        <div
          key={f.name}
          role="tabpanel"
          id={`${id}-p${i}`}
          aria-labelledby={`${id}-t${i}`}
          hidden={i !== active}
        >
          {editable && !f.readonly ? (
            <Editor label={`Edit ${f.name}`} value={f.code} onChange={(code) => onEdit?.(i, code)} />
          ) : (
            // tabIndex: wide code scrolls sideways, and keyboard users must be able to scroll it too.
            <pre className={codeClass} tabIndex={0}>
              <code dangerouslySetInnerHTML={{ __html: highlight(f.code, f.lang, value) }} />
            </pre>
          )}
        </div>
      ))}
    </div>
  )
}
