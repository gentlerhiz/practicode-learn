'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Side = { shown: string; type: string }
type Case = { left: Side; right: Side; result: boolean; says: string }

// Python comparisons, with what each side is and the True or False Python gives.
const CASES: Record<string, Case> = {
  '7 > 3': { left: { shown: '7', type: 'int' }, right: { shown: '3', type: 'int' }, result: true, says: 'Greater than. Every comparison gives back True or False, a bool.' },
  '18 >= 18': { left: { shown: '18', type: 'int' }, right: { shown: '18', type: 'int' }, result: true, says: '>= means greater than or equal to, so 18 itself counts. > alone would give False.' },
  '5 != 3': { left: { shown: '5', type: 'int' }, right: { shown: '3', type: 'int' }, result: true, says: '!= means not equal. 5 and 3 are different, so it’s True.' },
  '7 == 7.0': { left: { shown: '7', type: 'int' }, right: { shown: '7.0', type: 'float' }, result: true, says: '== compares values. A whole number and a float with the same value are equal.' },
  "'10' == 10": { left: { shown: "'10'", type: 'str' }, right: { shown: '10', type: 'int' }, result: false, says: 'Text is never equal to a number, even when it looks the same. input() always gives text, so convert it with int() first.' },
  "'apple' == 'Apple'": { left: { shown: "'apple'", type: 'str' }, right: { shown: "'Apple'", type: 'str' }, result: false, says: 'Comparing text is exact: a capital letter makes it a different string.' },
  "'apple' < 'banana'": { left: { shown: "'apple'", type: 'str' }, right: { shown: "'banana'", type: 'str' }, result: true, says: 'Text compares letter by letter, like a dictionary: a comes before b.' },
  '0.1 + 0.2 == 0.3': { left: { shown: '0.30000000000000004', type: 'float' }, right: { shown: '0.3', type: 'float' }, result: false, says: 'Decimals are stored in binary, so 0.1 + 0.2 is a hair over 0.3. Compare money in whole pennies, or round first.' },
}

/** One comparison, each side's type, and Python's answer (Explore lab: value = a comparison). */
export function PyCompare({ value = '7 > 3' }: LabProps) {
  const c = CASES[value] ?? CASES['7 > 3']!
  const answer = c.result ? 'True' : 'False'
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${value} gives ${answer}. ${c.says}`}>
      <div className="flex flex-col gap-1.5 rounded-2xl bg-[#15122a] p-4 font-mono text-[#f4f1ff]">
        <span className="text-base [overflow-wrap:anywhere]">
          <span className="text-[#9fb0ff]">&gt;&gt;&gt;</span> {value}
        </span>
        <span className={cn('text-2xl font-bold', c.result ? 'text-[#7ee2b8]' : 'text-[#ff8f8f]')}>{answer}</span>
      </div>
      <div aria-hidden="true" className="grid grid-cols-2 gap-2">
        {[
          ['Left side', c.left],
          ['Right side', c.right],
        ].map(([label, side]) => {
          const s = side as Side
          return (
            <div key={label as string} className="flex min-w-0 flex-col gap-1 rounded-xl border border-line bg-row px-3 py-2">
              <span className="text-[12px] text-ink-muted">{label as string}</span>
              <span className="font-mono text-[14px] font-semibold [overflow-wrap:anywhere] text-ink">{s.shown}</span>
              <span className="self-start rounded-md bg-fe/15 px-1.5 font-mono text-[12px] text-fe-text">{s.type}</span>
            </div>
          )
        })}
      </div>
      <figcaption className="rounded-xl bg-row px-3 py-2.5 text-sm text-ink-soft">{c.says}</figcaption>
    </figure>
  )
}
