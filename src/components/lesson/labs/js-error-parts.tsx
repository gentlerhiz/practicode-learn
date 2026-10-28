'use client'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

// Node's real output for orders.js (Node 24), with its internal stack lines trimmed.
type Part = 'where' | 'line' | 'type' | 'message' | 'stack' | 'caller'
const ROWS: { text: string; part?: Part }[] = [
  { text: '/home/ada/cafe-api/orders.js:4', part: 'where' },
  { text: '  return order.items.length', part: 'line' },
  { text: '                     ^', part: 'line' },
  { text: '' },
  { text: 'TypeError', part: 'type' },
  { text: ": Cannot read properties of undefined (reading 'length')", part: 'message' },
  { text: '    at orderSize (/home/ada/cafe-api/orders.js:4:22)', part: 'stack' },
  { text: '    at Object.<anonymous> (/home/ada/cafe-api/orders.js:7:13)', part: 'caller' },
]

const LIT: Part[][] = [[], ['where'], ['line'], ['type'], ['message'], ['stack', 'caller'], ['caller']]
const SAYS = [
  'The whole message. It looks scary, but it’s made of a few parts, and each one helps.',
  'Where: the file, then the line number. Open orders.js and go to line 4.',
  'The line itself, with a caret ^ under the exact spot where it went wrong: .length.',
  'The kind of error. A TypeError means a value isn’t the type the code expected.',
  'What happened: the code tried to read length from something that is undefined. So order.items is undefined.',
  'The stack: the chain of calls that led here, the most recent first. It failed inside orderSize, on line 4, column 22.',
  'And orderSize was called from line 7. That’s where the order came from, so that’s where to look next: does it have items?',
]

/** A Node error message taken apart (Diagram lab, 7 states). */
export function JsErrorParts({ state }: LabProps) {
  const i = clampState(state, SAYS.length)
  const lit = LIT[i]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={SAYS[i]} className="rounded-2xl bg-[#15122a] py-3 font-mono text-[11.5px] leading-5 text-[#cfcbe0] @min-[480px]:text-[12.5px]">
        {/* The TypeError and its message share a line, as Node prints them. */}
        {ROWS.map((r, k) => {
          if (r.part === 'message') return null
          const on = (p?: Part) => !!p && lit.includes(p)
          // Leading spaces stay unmarked, so the highlight sits on the code and the caret, not the indent.
          const row = (text: string, part?: Part) => {
            const indent = /^ */.exec(text)![0]
            return (
              <>
                {indent}
                <span className={cn(on(part) && 'rounded bg-[#ffd166]/25 font-bold text-white', lit.length > 0 && !on(part) && 'opacity-55')}>{text.slice(indent.length)}</span>
              </>
            )
          }
          return (
            <div key={k} className="px-4 whitespace-pre-wrap [overflow-wrap:anywhere]">
              {r.part === 'type' ? (
                <>
                  {row('TypeError', 'type')}
                  {row(ROWS[5]!.text, 'message')}
                </>
              ) : (
                row(r.text || ' ', r.part)
              )}
            </div>
          )
        })}
      </div>
      <figcaption className="rounded-xl bg-row px-3 py-2.5 text-sm text-ink">{SAYS[i]}</figcaption>
    </figure>
  )
}
