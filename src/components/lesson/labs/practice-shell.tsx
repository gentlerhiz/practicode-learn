'use client'
import { File, Folder, FolderOpen, RotateCcw } from 'lucide-react'
import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'
import { complete, newShell, prompt, run, walk, type Os, type Shell } from './shell-engine'

type Line = { prompt: string; cmd: string; out: string; error: boolean }

/** "Windows: dir" runs dir in the Command Prompt; "Linux and Mac: ls" runs ls in bash. */
function parse(value: string): { os: Os; line: string } {
  const m = /^(Windows|Linux and Mac)\s*:?\s*(.*)$/i.exec(value.trim())
  if (!m) return { os: 'posix', line: value.trim() }
  return { os: /^windows/i.test(m[1]!) ? 'windows' : 'posix', line: m[2]!.trim() }
}

function begin(value: string): { shell: Shell; lines: Line[] } {
  const { os, line } = parse(value)
  const shell = newShell(os)
  if (!line) return { shell, lines: [] }
  const r = run(shell, line)
  return { shell: r.shell, lines: [{ prompt: prompt(shell), cmd: line, out: r.out, error: r.error }] }
}

function Session({ value }: { value: string }) {
  const [{ shell, lines }, setState] = useState(() => begin(value))
  const [draft, setDraft] = useState('')
  const [recall, setRecall] = useState<number | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const log = useRef<HTMLDivElement>(null)
  const id = useId()
  const posix = shell.os === 'posix'
  const typed = lines.map((l) => l.cmd)

  const submit = () => {
    const line = draft.trim()
    setDraft('')
    setRecall(null)
    if (!line) return
    const r = run(shell, line)
    setState({ shell: r.shell, lines: r.clear ? [] : [...lines, { prompt: prompt(shell), cmd: line, out: r.out, error: r.error }].slice(-40) })
    requestAnimationFrame(() => log.current?.scrollTo({ top: log.current.scrollHeight }))
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    } else if (e.key === 'Tab' && !e.shiftKey) {
      // Completes a name when there's one to complete; otherwise Tab moves focus on as usual.
      const done = complete(shell, draft)
      if (done) {
        e.preventDefault()
        setDraft(done)
      }
    } else if (e.key === 'ArrowUp' && typed.length) {
      e.preventDefault()
      const at = recall === null ? typed.length - 1 : Math.max(0, recall - 1)
      setRecall(at)
      setDraft(typed[at]!)
    } else if (e.key === 'ArrowDown' && recall !== null) {
      e.preventDefault()
      const at = recall + 1
      setRecall(at < typed.length ? at : null)
      setDraft(at < typed.length ? typed[at]! : '')
    }
  }

  const tree = walk(shell)
  const here = shell.cwd.join('/')
  const rootName = posix ? '/' : 'C:\\'

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full border border-line bg-row px-3 py-1 text-[12px] font-semibold text-ink">
          {posix ? 'Linux and Mac · Terminal (bash)' : 'Windows · Command Prompt'}
        </span>
        <button
          type="button"
          onClick={() => {
            setState(begin(value))
            setDraft('')
            input.current?.focus()
          }}
          className="press inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-line-control px-3 text-[13px] font-medium text-ink hover:bg-hover"
        >
          <RotateCcw size={14} aria-hidden="true" />
          Reset
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 @min-[600px]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-line bg-[#0d0b16] font-mono text-[12px] leading-5 text-[#e8e6f0] @min-[420px]:text-[13px] @min-[420px]:leading-6">
          <div ref={log} role="log" aria-live="polite" aria-label="Terminal output" className="max-h-64 min-h-24 overflow-y-auto p-3">
            {lines.length === 0 && <p className="text-[#8b88a0]">Type a command and press Enter. Type help for a list. Tab finishes a name.</p>}
            {lines.map((l, i) => (
              <div key={i}>
                <p className="whitespace-pre-wrap [overflow-wrap:anywhere]">
                  <span className={posix ? 'text-[#7ee2b8]' : 'text-[#c9c6d8]'}>{l.prompt}</span> {l.cmd}
                </p>
                {l.out && <p className={cn('whitespace-pre-wrap [overflow-wrap:anywhere]', l.error && 'text-[#ff8f8f]')}>{l.out}</p>}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-[#2a2540] px-3 py-2">
            <label htmlFor={id} className="max-w-[55%] shrink-0 truncate text-[#7ee2b8]" title={prompt(shell)}>
              <span className={posix ? '' : 'text-[#c9c6d8]'}>{prompt(shell)}</span>
              <span className="sr-only"> Type a command</span>
            </label>
            <input
              ref={input}
              id={id}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKey}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="go"
              className="min-w-0 flex-1 bg-transparent text-[#e8e6f0] caret-[#7ee2b8] outline-none placeholder:text-[#5e5a75]"
              placeholder="type here"
            />
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-2 rounded-xl border border-line bg-row p-3">
          <p className="text-[12px] font-semibold text-ink-soft">The practice computer’s folders</p>
          <ul aria-label="Folders and files" className="flex flex-col font-mono text-[12.5px] leading-6">
            <li className={cn('flex items-center gap-1.5', here === '' && 'font-semibold text-it-text')}>
              <FolderOpen size={14} aria-hidden="true" className="shrink-0" />
              {rootName}
              {here === '' && <span className="font-sans text-[11px]">you are here</span>}
            </li>
            {tree.map((e) => {
              const isHere = e.path === here
              const isNew = shell.added.includes(e.path)
              const Icon = e.dir ? (isHere ? FolderOpen : Folder) : File
              return (
                <li
                  key={e.path}
                  style={{ paddingLeft: `${(e.depth + 1) * 12}px` }}
                  className={cn('flex min-w-0 items-center gap-1.5 rounded-md', isHere && 'font-semibold text-it-text', isNew && 'bg-success/15', !isHere && 'text-ink')}
                >
                  <Icon size={14} aria-hidden="true" className={cn('shrink-0', e.dir ? 'text-it-text' : 'text-ink-muted')} />
                  <span className="min-w-0 [overflow-wrap:anywhere]">{e.name}</span>
                  {isHere && <span className="shrink-0 font-sans text-[11px]">you are here</span>}
                  {isNew && <span className="shrink-0 font-sans text-[11px] text-success">new</span>}
                </li>
              )
            })}
          </ul>
          {shell.removed.length > 0 && (
            <p className="text-[12px] leading-5 text-error">
              Deleted for good: {shell.removed.map((p) => p.split('/').pop()).join(', ')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * A practice terminal on a practice computer (Explore lab). The value picks the system and a first
 * command, such as "Linux and Mac: ls" or "Windows: dir"; then the learner can type any command they
 * like. Reset puts every file back.
 */
export function PracticeShell({ value = 'Linux and Mac: pwd' }: LabProps) {
  return <Session key={value} value={value} />
}
