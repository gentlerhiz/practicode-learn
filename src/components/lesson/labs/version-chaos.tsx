'use client'
import { File, GitCommitHorizontal } from 'lucide-react'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

const COPIES = ['app.js', 'app-final.js', 'app-final-2.js', 'app-final-REAL.js', 'app-amara-fixed.js', 'app (copy).js']
const QUESTIONS = ['Which one is live?', 'What changed between final and final-2?', 'Who broke the order total, and when?', 'Amara and Ada both edited it. Whose wins?']
const COMMITS = [
  ['a41c2e9', 'Ada', 'Add the order total'],
  ['7d03b18', 'Amara', 'Fix rounding on the total'],
  ['c92f6a0', 'Ada', 'Add banana bread to the prices'],
  ['e5b7d41', 'Ada', 'Charge 30p for oat milk'],
]

const SAYS = [
  'Without version control: a folder of copies. Every “final” version is another file.',
  'Then the questions start, and the folder can’t answer any of them.',
  'With Git there’s one app.js, plus a history: every saved change, who made it, when, and why.',
  'Something broke? Compare any two commits, or go back to one that worked. Nothing is ever lost.',
  'Two people at once? Each works on a branch, and Git merges the work, line by line.',
]

/** Copies of files versus a Git history (Diagram lab, 5 states). */
export function VersionChaos({ state }: LabProps) {
  const i = clampState(state, SAYS.length)
  const git = i >= 2
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={SAYS[i]} className="flex min-h-[220px] flex-col gap-2 rounded-2xl border border-line bg-row p-3">
        {!git ? (
          <>
            <p className="text-[12px] font-semibold text-ink-soft">~/cafe-api</p>
            <ul className="m-0 grid list-none grid-cols-1 gap-1.5 p-0 font-mono text-[12.5px] @min-[420px]:grid-cols-2">
              {COPIES.map((c) => (
                <li key={c} className="flex items-center gap-1.5 text-ink">
                  <File size={14} aria-hidden="true" className="shrink-0 text-ink-muted" />
                  {c}
                </li>
              ))}
            </ul>
            {i === 1 && (
              <ul className="m-0 mt-1 flex list-none flex-col gap-1.5 p-0">
                {QUESTIONS.map((q) => (
                  <li key={q} className="rounded-lg bg-error/12 px-2.5 py-1.5 text-[13px] text-ink">
                    {q}
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <>
            <p className="flex items-center gap-1.5 font-mono text-[12.5px] text-ink">
              <File size={14} aria-hidden="true" className="text-ink-muted" />
              app.js
            </p>
            <ol className="m-0 flex list-none flex-col gap-1 p-0">
              {[...COMMITS].reverse().map(([id, who, msg], k) => (
                <li
                  key={id}
                  className={cn(
                    'flex min-w-0 items-center gap-2 rounded-lg px-2 py-1 text-[12.5px]',
                    i === 3 && k === 2 && 'bg-success/15',
                    i === 3 && k === 0 && 'bg-error/12',
                  )}
                >
                  <GitCommitHorizontal size={15} aria-hidden="true" className="shrink-0 text-fe-text" />
                  <code className="shrink-0 font-mono text-ink-muted">{id}</code>
                  <span className="min-w-0 text-ink [overflow-wrap:anywhere]">{msg}</span>
                  <span className="ml-auto shrink-0 text-[11.5px] text-ink-muted">{who}</span>
                </li>
              ))}
            </ol>
            {i === 3 && <p className="text-[12.5px] text-ink-soft">The newest commit broke it? Go back to 7d03b18, which worked, or see exactly what changed since.</p>}
            {i === 4 && (
              <div className="grid grid-cols-2 gap-2 text-[12px]">
                <span className="rounded-lg border border-fe/50 bg-fe/10 px-2 py-1.5 text-ink">
                  <b className="font-mono">ada/loyalty-card</b>: Ada’s work
                </span>
                <span className="rounded-lg border border-ai/50 bg-ai/10 px-2 py-1.5 text-ink">
                  <b className="font-mono">amara/opening-hours</b>: Amara’s
                </span>
              </div>
            )}
          </>
        )}
      </div>
      <figcaption className="rounded-xl bg-row px-3 py-2.5 text-sm text-ink">{SAYS[i]}</figcaption>
    </figure>
  )
}
