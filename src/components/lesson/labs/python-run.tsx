'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const LINES = ['print("Good morning!")', 'print(3 + 4)', 'print("Done")']
// What the console holds after each state: nothing yet, then one line per line run.
const OUTPUT = [[], ['Good morning!'], ['Good morning!', '7'], ['Good morning!', '7', 'Done']]

/** Python running a program one line at a time, top to bottom (Diagram lab, 4 states). */
export function PythonRun({ state = 0 }: LabProps) {
  const at = Math.min(Math.max(state, 0), OUTPUT.length - 1)
  const out = OUTPUT[at]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div
        role="img"
        aria-label={
          at === 0
            ? 'A three-line program, not run yet.'
            : `Python has run line ${at}. The output so far: ${out.join(', ')}.`
        }
        className="flex flex-col gap-2 min-[560px]:flex-row"
      >
        <div className="flex flex-1 flex-col gap-1 rounded-2xl border border-line bg-row p-3">
          <span className="mb-1 text-xs font-semibold text-ink-subtle">main.py</span>
          {LINES.map((line, i) => (
            <div
              key={line}
              className={cn(
                'flex items-center gap-2 rounded-lg px-2 py-1 font-mono text-[13px] motion-safe:transition-colors',
                i === at - 1 ? 'bg-[rgba(77,107,255,0.18)] text-ink' : 'text-ink-soft',
              )}
            >
              <span className="w-4 text-right text-ink-subtle">{i + 1}</span>
              {line}
              {i === at - 1 && <span className="ml-auto font-sans text-xs font-semibold text-fe-text">Running</span>}
            </div>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-1 rounded-2xl bg-[#15122a] p-3 font-mono text-[13px] text-[#f4f1ff]">
          <span className="mb-1 font-sans text-xs font-semibold text-[#c9c3e6]">Console</span>
          {out.length ? out.map((l, i) => <span key={i}>{l}</span>) : <span className="text-[#c9c3e6]">Nothing yet</span>}
        </div>
      </div>
    </figure>
  )
}
