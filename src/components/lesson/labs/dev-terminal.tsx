'use client'
import { File, Folder, GitCommitHorizontal, GitMerge, Pencil, RotateCcw } from 'lucide-react'
import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'
import { complete, graph, newDev, prompt, run, saveFile, SCENARIOS, tree, type Dev, type Row, type Scenario } from './dev-engine'

type Line = { prompt: string; cmd: string; out: string; error: boolean }

/** "Repository: git log --oneline" starts from the Repository scenario and runs git log first. */
function parse(value: string): { scenario: Scenario; line: string } {
  const [head, ...rest] = value.split(':')
  const scenario = SCENARIOS.find((s) => s.toLowerCase() === head!.trim().toLowerCase())
  if (!scenario) return { scenario: 'Project', line: value.trim() }
  return { scenario, line: rest.join(':').trim() }
}

function begin(value: string): { dev: Dev; lines: Line[] } {
  const { scenario, line } = parse(value)
  const dev = newDev(scenario)
  if (!line) return { dev, lines: [] }
  const r = run(dev, line)
  return { dev: r.dev, lines: [{ prompt: prompt(dev), cmd: line, out: r.out, error: r.error }] }
}

const MARKS: Record<NonNullable<Row['mark']>, { label: string; short: string; className: string }> = {
  untracked: { label: 'untracked', short: 'U', className: 'text-it-text' },
  modified: { label: 'changed, not staged', short: 'M', className: 'text-ux-text' },
  staged: { label: 'staged', short: 'A', className: 'text-success' },
  conflict: { label: 'conflict', short: '!', className: 'text-error' },
  ignored: { label: 'ignored', short: '–', className: 'text-ink-subtle' },
}

function Session({ value }: { value: string }) {
  const [{ dev, lines }, setState] = useState(() => begin(value))
  const [draft, setDraft] = useState('')
  const [recall, setRecall] = useState<number | null>(null)
  const [editing, setEditing] = useState<{ path: string; text: string } | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const log = useRef<HTMLDivElement>(null)
  const id = useId()
  const typed = lines.map((l) => l.cmd)

  const submit = () => {
    const line = draft.trim()
    setDraft('')
    setRecall(null)
    if (!line) return
    const r = run(dev, line)
    setState({ dev: r.dev, lines: r.clear ? [] : [...lines, { prompt: prompt(dev), cmd: line, out: r.out, error: r.error }].slice(-40) })
    requestAnimationFrame(() => log.current?.scrollTo({ top: log.current.scrollHeight }))
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    } else if (e.key === 'Tab' && !e.shiftKey) {
      const done = complete(dev, draft)
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

  const rows = tree(dev)
  const commits = graph(dev)
  const repo = dev.repo

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full border border-line bg-row px-3 py-1 text-[12px] font-semibold text-ink">
          Practice terminal · Ada’s laptop{repo ? ` · ${repo.head}` : ''}
        </span>
        <button
          type="button"
          onClick={() => {
            setState(begin(value))
            setDraft('')
            setEditing(null)
            input.current?.focus()
          }}
          className="press inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-line-control px-3 text-[13px] font-medium text-ink hover:bg-hover"
        >
          <RotateCcw size={14} aria-hidden="true" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 @min-[620px]:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-line bg-[#0d0b16] font-mono text-[12px] leading-5 text-[#e8e6f0] @min-[420px]:text-[13px] @min-[420px]:leading-6">
            <div ref={log} role="log" aria-live="polite" aria-label="Terminal output" className="max-h-72 min-h-28 overflow-y-auto p-3">
              {lines.length === 0 && <p className="text-[#8b88a0]">Type a command and press Enter. Type help for a list. Tab finishes a name.</p>}
              {lines.map((l, i) => (
                <div key={i}>
                  <p className="whitespace-pre-wrap [overflow-wrap:anywhere]">
                    <span className="text-[#7ee2b8]">{l.prompt}</span> {l.cmd}
                  </p>
                  {l.out && <p className={cn('whitespace-pre-wrap [overflow-wrap:anywhere]', l.error && 'text-[#ff8f8f]')}>{l.out}</p>}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t border-[#2a2540] px-3 py-2">
              <label htmlFor={id} className="max-w-[60%] shrink-0 truncate text-[#7ee2b8]" title={prompt(dev)}>
                {prompt(dev)}
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

          {editing && (
            <form
              className="flex flex-col gap-2 rounded-xl border border-line bg-row p-3"
              onSubmit={(e) => {
                e.preventDefault()
                setState({ dev: saveFile(dev, editing.path, editing.text), lines })
                setEditing(null)
                input.current?.focus()
              }}
            >
              <label htmlFor={`${id}-editor`} className="text-[12px] font-semibold text-ink-soft">
                Editing {editing.path.split('/').slice(1).join('/') || editing.path}
              </label>
              <textarea
                id={`${id}-editor`}
                value={editing.text}
                onChange={(e) => setEditing({ ...editing, text: e.target.value })}
                rows={Math.min(12, Math.max(4, editing.text.split('\n').length + 1))}
                spellCheck={false}
                className="w-full resize-y rounded-lg border border-line-control bg-sunken p-2.5 font-mono text-[12.5px] leading-5 text-ink outline-none focus:border-fe"
              />
              <div className="flex gap-2">
                <button type="submit" className="press h-9 cursor-pointer rounded-full bg-primary px-4 text-[13px] font-semibold text-on-primary">
                  Save File
                </button>
                <button type="button" onClick={() => setEditing(null)} className="press h-9 cursor-pointer rounded-full border border-line-control px-4 text-[13px] text-ink hover:bg-hover">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex min-w-0 flex-col gap-2 rounded-xl border border-line bg-row p-3">
            <p className="text-[12px] font-semibold text-ink-soft">Files · tap a file to edit it</p>
            <ul aria-label="Folders and files" className="flex flex-col font-mono text-[12.5px] leading-6">
              {rows.map((r) => {
                const here = r.path === dev.cwd
                const changed = dev.touched.includes(r.path)
                const mark = r.mark ? MARKS[r.mark] : null
                return (
                  <li key={r.path} style={{ paddingLeft: `${r.depth * 12}px` }} className={cn('flex min-w-0 items-center gap-1.5 rounded-md', changed && 'bg-fe/10')}>
                    {r.dir ? (
                      <span className={cn('flex min-w-0 items-center gap-1.5', here ? 'font-semibold text-fe-text' : 'text-ink')}>
                        <Folder size={14} aria-hidden="true" className="shrink-0 text-fe-text" />
                        <span className="min-w-0 [overflow-wrap:anywhere]">{r.name}/</span>
                        {here && <span className="shrink-0 font-sans text-[11px]">you are here</span>}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditing({ path: r.path, text: dev.files[r.path] ?? '' })}
                        className="group flex min-w-0 cursor-pointer items-center gap-1.5 rounded text-left text-ink hover:text-fe-text"
                        aria-label={`Edit ${r.name}${mark ? `, ${mark.label}` : ''}`}
                      >
                        <File size={14} aria-hidden="true" className="shrink-0 text-ink-muted" />
                        <span className="min-w-0 [overflow-wrap:anywhere]">{r.name}</span>
                        <Pencil size={11} aria-hidden="true" className="shrink-0 opacity-0 group-hover:opacity-60 group-focus-visible:opacity-60" />
                      </button>
                    )}
                    {mark && (
                      <span className={cn('ml-auto shrink-0 font-sans text-[11px] font-semibold', mark.className)} aria-hidden={!r.dir}>
                        {mark.label}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>

          {repo && (
            <div className="flex min-w-0 flex-col gap-2 rounded-xl border border-line bg-row p-3">
              <p className="text-[12px] font-semibold text-ink-soft">History{repo.merging ? ' · merging' : ''}</p>
              {commits.length === 0 ? (
                <p className="text-[12.5px] text-ink-muted">No commits yet.</p>
              ) : (
                <ol aria-label="Commits, newest first" className="flex flex-col gap-1.5">
                  {commits.slice(0, 8).map((c) => (
                    <li key={c.id} className="flex min-w-0 items-start gap-2 text-[12.5px] leading-5">
                      {c.merge ? (
                        <GitMerge size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-ai-text" />
                      ) : (
                        <GitCommitHorizontal size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-fe-text" />
                      )}
                      <span className="flex min-w-0 flex-col">
                        <span className="text-ink [overflow-wrap:anywhere]">
                          <code className="font-mono text-ink-muted">{c.id}</code> {c.message}
                        </span>
                        {c.labels.length > 0 && (
                          <span className="flex flex-wrap gap-1 pt-0.5">
                            {c.labels.map((l) => (
                              <span key={l} className={cn('rounded-full px-2 font-mono text-[10.5px] leading-[18px]', l.startsWith('HEAD') ? 'bg-fe text-white' : l.startsWith('origin') ? 'border border-line-control text-ink-soft' : 'bg-fe/15 text-fe-text')}>
                                {l}
                              </span>
                            ))}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * A developer's practice terminal on Ada's laptop (Explore lab): files, node and real Git. The value picks
 * a starting point and a first command, such as "Repository: git log --oneline"; then the learner can
 * type anything. Files open in a small editor, for fixing merge conflicts. Reset puts everything back.
 */
export function DevTerminal({ value = 'Project' }: LabProps) {
  return <Session key={value} value={value} />
}
