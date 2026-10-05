'use client'
import { useId, useRef, type KeyboardEvent } from 'react'

const SYMBOLS = ['{', '}', ':', ';', '<', '>', '/', '=', '"', '(', ')', '-', '#', '.']

/**
 * A plain textarea editor: 16px text on phones (so iOS doesn't zoom), a bar of symbols that are awkward
 * to type on a phone, and Tab inserts two spaces. Esc, then Tab, leaves the editor, so keyboard users
 * are never trapped (WCAG 2.1.2).
 */
export function Editor({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (code: string) => void
}) {
  const area = useRef<HTMLTextAreaElement>(null)
  const leaving = useRef(false)
  const helpId = useId()

  const insert = (text: string) => {
    const ta = area.current
    if (!ta) return
    const { selectionStart: a, selectionEnd: b } = ta
    onChange(value.slice(0, a) + text + value.slice(b))
    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = a + text.length
      ta.focus()
    })
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      leaving.current = true
      return
    }
    if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey && !leaving.current) {
      e.preventDefault()
      insert('  ')
      return
    }
    leaving.current = false
  }

  return (
    <div className="flex flex-col bg-sunken">
      <textarea
        ref={area}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => (leaving.current = false)}
        aria-label={label}
        aria-describedby={helpId}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        rows={Math.max(6, value.split('\n').length + 1)}
        className="w-full resize-y bg-transparent p-4 font-mono text-base leading-6 text-ink outline-none focus-visible:ring-2 focus-visible:ring-fe focus-visible:ring-inset ph:text-[13px]"
      />
      <div
        role="group"
        aria-label="Insert a symbol"
        className="flex flex-wrap gap-1 border-t border-line-subtle p-2"
      >
        {SYMBOLS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => insert(s)}
            aria-label={`Insert ${s}`}
            className="h-9 min-w-9 rounded-lg border border-line bg-row px-2 font-mono text-sm text-ink hover:bg-bg"
          >
            {s}
          </button>
        ))}
      </div>
      <p id={helpId} className="px-3 pb-2 text-[12px] text-ink-subtle">
        Tab adds two spaces. Press Esc, then Tab, to move on.
      </p>
    </div>
  )
}
