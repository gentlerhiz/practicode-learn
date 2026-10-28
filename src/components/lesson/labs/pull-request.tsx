'use client'
import { Check, CircleDot, GitMerge, GitPullRequest, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

const SAYS = [
  'Ada pushed her branch, add-hours. GitHub offers to open a pull request: a request to merge it into main.',
  'The pull request: a title, a description of what changed and why, and every changed line, for others to read.',
  'Amara reviews it and leaves a comment on one line. She asks for a change before it goes in.',
  'Ada fixes it on the same branch and pushes again. The pull request updates itself, the automatic checks pass, and Amara approves.',
  'Merged. main now has the opening hours, the branch can be deleted, and the conversation stays on record for good.',
]

const DIFF = [
  { n: 4, text: "app.get('/hours', (req, res) => {", add: true },
  { n: 5, text: "  res.json({ open: '8:00', close: '4:00' })", add: true },
  { n: 6, text: '})', add: true },
]

/** A pull request on GitHub, from push to merge (Diagram lab, 5 states). */
export function PullRequest({ state }: LabProps) {
  const i = clampState(state, SAYS.length)
  const status =
    i === 4
      ? { label: 'Merged', className: 'bg-ai text-white', Icon: GitMerge }
      : { label: i === 0 ? 'Not opened yet' : 'Open', className: i === 0 ? 'border border-line-control text-ink-soft' : 'bg-success-fill text-on-success', Icon: GitPullRequest }
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={SAYS[i]} className="flex flex-col gap-3 rounded-2xl border border-line bg-row p-3">
        {i === 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#d4a72c]/60 bg-[#d4a72c]/12 px-3 py-2.5 text-[13px] text-ink">
            <span>
              <b className="font-mono">add-hours</b> had recent pushes 1 minute ago
            </span>
            <span className="rounded-lg bg-success-fill px-3 py-1 text-[12.5px] font-semibold text-on-success">Compare &amp; pull request</span>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <p className="font-display text-[17px] font-bold text-ink">
                Add opening hours <span className="font-normal text-ink-muted">#12</span>
              </p>
              <p className="flex flex-wrap items-center gap-2 text-[12.5px] text-ink-soft">
                <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-semibold', status.className)}>
                  <status.Icon size={13} aria-hidden="true" />
                  {status.label}
                </span>
                Ada wants to merge 1 commit{i >= 3 ? 's' : ''} into <code className="rounded bg-fe/15 px-1 font-mono text-fe-text">main</code> from{' '}
                <code className="rounded bg-fe/15 px-1 font-mono text-fe-text">add-hours</code>
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-line font-mono text-[12px]">
              <p className="border-b border-line-subtle bg-sunken px-3 py-1.5 text-ink-soft">app.js</p>
              {DIFF.map((d) => (
                <div key={d.n}>
                  <div className="flex bg-success/12 text-ink">
                    <span className="w-8 shrink-0 text-center text-ink-muted">{d.n}</span>
                    <span className="min-w-0 pr-2 whitespace-pre-wrap [overflow-wrap:anywhere]">+ {i >= 3 && d.n === 5 ? "  res.json({ open: '08:00', close: '16:00' })" : d.text}</span>
                  </div>
                  {i === 2 && d.n === 5 && (
                    <div className="flex gap-2 border-y border-line bg-sunken px-3 py-2 font-sans text-[12.5px] text-ink">
                      <MessageSquare size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-ai-text" />
                      <span>
                        <b>Amara:</b> Can we use the 24-hour clock, 08:00 and 16:00? 4:00 reads like 4 in the morning.
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {i >= 3 && (
              <ul className="m-0 flex list-none flex-col gap-1 p-0 text-[12.5px]">
                <li className="flex items-center gap-2 text-ink">
                  <Check size={15} aria-hidden="true" className="text-success" /> All checks have passed: tests
                </li>
                <li className="flex items-center gap-2 text-ink">
                  <Check size={15} aria-hidden="true" className="text-success" /> Amara approved these changes
                </li>
                {i === 4 && (
                  <li className="flex items-center gap-2 text-ink">
                    <CircleDot size={15} aria-hidden="true" className="text-ai-text" /> Ada merged commit 3c1d7e0 into main · branch add-hours deleted
                  </li>
                )}
              </ul>
            )}
          </>
        )}
      </div>
      <figcaption className="rounded-xl bg-row px-3 py-2.5 text-sm text-ink">{SAYS[i]}</figcaption>
    </figure>
  )
}
