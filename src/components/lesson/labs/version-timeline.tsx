'use client'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

const SAVES = [
  { id: 'a1f', who: 'Ada', msg: 'Add the booking form' },
  { id: 'b72', who: 'Ada', msg: 'Add the confirmation email' },
  { id: 'c09', who: 'Tunde', msg: 'Change the button colour' },
  { id: 'd4e', who: 'Tunde', msg: 'Speed up the calendar' },
]

const STATES = [
  { show: 1, line: 'Version control keeps a history of every saved change. Each save is called a commit, with a short message saying what changed.' },
  { show: 2, line: 'Another commit. Every commit can be looked at again, or gone back to, at any time.' },
  { show: 3, line: 'Tunde changes the button colour. It breaks the page on phones.' },
  { show: 3, back: true, line: 'No panic: go back to the commit before, and the site works again. Nothing is lost: the broken change is still in the history.' },
  { show: 4, branch: true, line: 'Several people can work at once on branches, and merge their work together. The history shows who changed what, and when.' },
]

/** Saving a project's history, going back, and working together (Diagram lab, 5 states). */
export function VersionTimeline({ state }: LabProps) {
  const at = clampState(state, STATES.length)
  const s = STATES[at]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <ol role="img" aria-label={s.line} className="relative flex flex-col gap-2 pl-6">
        <span aria-hidden="true" className="absolute top-3 bottom-3 left-[9px] w-0.5 bg-line-control" />
        {SAVES.slice(0, s.show).map((c, i) => {
          const broken = i === 2
          const undone = s.back && broken
          return (
            <li key={c.id} className="pop-in relative">
              <span
                aria-hidden="true"
                className={cn(
                  'absolute top-3 -left-[21px] size-3.5 rounded-full border-2',
                  undone ? 'border-error bg-sunken' : s.back && i === 1 ? 'border-success-fill bg-success-fill' : 'border-it bg-it',
                )}
              />
              <div
                className={cn(
                  'flex flex-wrap items-baseline justify-between gap-x-3 rounded-xl border-[1.5px] px-3 py-2',
                  undone ? 'border-error/60 bg-sunken opacity-70' : broken && at === 2 ? 'border-error bg-row' : s.back && i === 1 ? 'border-success-fill bg-row' : 'border-line bg-row',
                  s.branch && i === 3 && 'ml-6',
                )}
              >
                <span className="text-[13px] text-ink">
                  <span className="font-mono text-[12px] text-it-text">{c.id}</span> {c.msg}
                </span>
                <span className="text-[11px] text-ink-muted">
                  {c.who}
                  {broken && at === 2 && <span className="ml-1.5 font-semibold text-error">breaks phones</span>}
                  {undone && <span className="ml-1.5 font-semibold text-error">gone back from</span>}
                  {s.back && i === 1 && <span className="ml-1.5 font-semibold text-success">live again</span>}
                  {s.branch && i === 3 && <span className="ml-1.5 text-it-text">on Tunde’s branch</span>}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
      <figcaption aria-live="polite" className="rounded-2xl border border-line bg-row px-4 py-3 text-[13px] leading-5 text-ink-soft">
        {s.line}
      </figcaption>
    </figure>
  )
}
