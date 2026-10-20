'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const PARTS = [
  { text: 'Traceback (most recent call last):', label: 'Something went wrong. Read from the bottom up.' },
  { text: '  File "main.py", line 3, in <module>', label: 'Where: the file and the line number.' },
  { text: '    print(totl)', label: 'The line itself, copied from your code.' },
  { text: "NameError: name 'totl' is not defined", label: 'What: the kind of error, then what Python couldn’t do.' },
]
// Which lines each state lights: the whole message, then where, the line, and what went wrong.
const LIT = [[0], [1], [2], [3]]

/** A Python error message, read one part at a time (Diagram lab, 4 states). */
export function TracebackParts({ state = 0 }: LabProps) {
  const at = Math.min(Math.max(state, 0), LIT.length - 1)
  const lit = LIT[at]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div
        role="img"
        aria-label={`${PARTS[at]!.text.trim()}: ${PARTS[at]!.label}`}
        className="flex flex-col gap-0.5 rounded-2xl bg-[#15122a] p-3 font-mono text-[13px] whitespace-pre-wrap"
      >
        {PARTS.map((p, i) => (
          <span
            key={p.text}
            className={cn(
              'rounded-md px-2 py-1 motion-safe:transition-colors',
              lit.includes(i) ? 'bg-[rgba(252,165,165,0.22)] text-[#fecaca]' : 'text-[#c9c3e6]',
            )}
          >
            {p.text}
          </span>
        ))}
      </div>
      <figcaption className="flex items-start gap-3 rounded-xl bg-row px-3 py-2.5 text-sm text-ink">
        <span
          aria-hidden="true"
          className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-fe text-xs font-bold text-white"
        >
          {at + 1}
        </span>
        {PARTS[at]!.label}
      </figcaption>
    </figure>
  )
}
