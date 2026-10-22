'use client'
import { useState, type KeyboardEvent } from 'react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

// The letter goes with Ctrl on Windows and Linux, and with Cmd on a Mac, except where noted.
const SHORTCUTS: Record<string, { key: string; does: string; win?: string[]; mac?: string[] }> = {
  Copy: { key: 'C', does: 'Copies what’s selected, leaving it where it is.' },
  Paste: { key: 'V', does: 'Puts in whatever you last copied or cut.' },
  Cut: { key: 'X', does: 'Removes what’s selected, ready to paste somewhere else.' },
  Undo: { key: 'Z', does: 'Takes back the last change. Press it again to go further back.' },
  'Select all': { key: 'A', does: 'Selects everything: all the text, or every file in a folder.' },
  Find: { key: 'F', does: 'Searches the page or document for a word.' },
  Save: { key: 'S', does: 'Saves the file. Press it often.' },
  'Switch app': { key: 'Tab', does: 'Jumps between open apps.', win: ['Alt', 'Tab'], mac: ['Cmd', 'Tab'] },
}

function Keys({ keys, lit }: { keys: string[]; lit: boolean }) {
  return (
    <span className="flex flex-wrap items-center gap-1.5">
      {keys.map((k, i) => (
        <span key={k} className="flex items-center gap-1.5">
          {i > 0 && (
            <span aria-hidden="true" className="text-ink-subtle">
              +
            </span>
          )}
          <kbd
            className={cn(
              'inline-grid h-10 min-w-10 place-items-center rounded-lg border-[1.5px] border-b-4 px-2.5 font-mono text-[14px] font-bold motion-safe:transition-colors',
              lit ? 'border-success-fill bg-success-fill/20 text-ink' : 'border-line-strong bg-row text-ink',
            )}
          >
            {k}
          </kbd>
        </span>
      ))}
    </span>
  )
}

/**
 * Everyday keyboard shortcuts, for Windows and Mac. On a computer, press the keys in the practice box
 * and they light up (Explore lab: value = a shortcut, such as Copy).
 */
export function ShortcutKeys({ value = 'Copy' }: LabProps) {
  const name = SHORTCUTS[value] ? value : 'Copy'
  const s = SHORTCUTS[name]!
  const win = s.win ?? ['Ctrl', s.key]
  const mac = s.mac ?? ['Cmd', s.key]
  const [hit, setHit] = useState<{ for: string; how: 'win' | 'mac' } | null>(null)
  const done = hit?.for === name ? hit.how : null

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const key = e.key.length === 1 ? e.key.toUpperCase() : e.key
    if (key !== s.key) return
    const isTab = s.key === 'Tab'
    if (isTab ? e.altKey : e.ctrlKey && !e.metaKey) setHit({ for: name, how: 'win' })
    else if (e.metaKey) setHit({ for: name, how: 'mac' })
    else return
    // Keep the page itself from saving, finding or printing while you practise.
    e.preventDefault()
  }

  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${name}: ${win.join(' plus ')} on Windows, ${mac.join(' plus ')} on a Mac. ${s.does}`}>
      <div className="flex flex-col gap-1 rounded-2xl border border-line bg-row px-4 py-3">
        <p className="font-display text-lg font-bold text-ink">{name}</p>
        <p className="text-[13px] leading-5 text-ink-soft">{s.does}</p>
      </div>
      <div className="grid grid-cols-1 gap-2 @min-[420px]:grid-cols-2">
        <div className="flex flex-col gap-2 rounded-xl border border-line p-3">
          <span className="text-[12px] font-semibold text-ink-soft">Windows and Linux</span>
          <Keys keys={win} lit={done === 'win'} />
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-line p-3">
          <span className="text-[12px] font-semibold text-ink-soft">Mac (Cmd is ⌘)</span>
          <Keys keys={mac} lit={done === 'mac'} />
        </div>
      </div>
      <div
        tabIndex={0}
        role="group"
        aria-label={`Practice box. On a computer, press ${win.join(' plus ')} or ${mac.join(' plus ')} here.`}
        onKeyDown={onKey}
        className="rounded-xl border-[1.5px] border-dashed border-line-strong px-3 py-3 text-center text-[13px] text-ink-muted focus-visible:border-focus focus-visible:outline-none"
      >
        <span aria-live="polite">
          {done ? <span className="font-semibold text-success">That’s it: {name.toLowerCase()} done.</span> : 'On a computer, tap here, then press the keys together. On a phone, just read along.'}
        </span>
      </div>
    </figure>
  )
}
