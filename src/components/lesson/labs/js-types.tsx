'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

// Each value: what typeof says, whether if treats it as true, and what value + 1 gives (checked in Node).
const VALUES: Record<string, { type: string; truthy: boolean; plusOne: string; says: string }> = {
  '3.2': { type: 'number', truthy: true, plusOne: '4.2', says: 'A number: JavaScript adds 1 to it.' },
  "'3.2'": { type: 'string', truthy: true, plusOne: "'3.21'", says: 'Text that looks like a number. + joins text, so 1 is stuck on the end. Data from forms and URLs arrives like this.' },
  true: { type: 'boolean', truthy: true, plusOne: '2', says: 'A boolean: true or false. In sums, true counts as 1.' },
  "'false'": { type: 'string', truthy: true, plusOne: "'false1'", says: 'The word false, in quotes, is text. Any text that isn’t empty counts as true in an if.' },
  '0': { type: 'number', truthy: false, plusOne: '1', says: 'Zero is a real number, but an if treats it as false.' },
  "''": { type: 'string', truthy: false, plusOne: "'1'", says: 'An empty string: text with nothing in it. An if treats it as false.' },
  null: { type: 'object', truthy: false, plusOne: '1', says: 'null means “nothing, on purpose”. typeof says object: a famous mistake from 1995 that can never be fixed.' },
  undefined: { type: 'undefined', truthy: false, plusOne: 'NaN', says: 'undefined means “no value was ever given”. Maths with it gives NaN: not a number.' },
}

/** One JavaScript value, its type and how it behaves (Explore lab: value = a value as you'd write it). */
export function JsTypes({ value = '3.2' }: LabProps) {
  const v = VALUES[value] ?? VALUES['3.2']!
  const cell = 'flex flex-col gap-1 rounded-xl border border-line bg-row px-3 py-2.5'
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${value}: typeof gives ${v.type}; an if treats it as ${v.truthy}; ${value} + 1 gives ${v.plusOne}.`}>
      <div className="rounded-2xl bg-[#15122a] px-4 py-3 font-mono text-[#f4f1ff]">
        <span className="text-[#9fb0ff]">const</span> value = <span className="text-lg font-bold">{value}</span>
      </div>
      <div className="grid grid-cols-1 gap-2 @min-[480px]:grid-cols-3">
        <div className={cell}>
          <code className="font-mono text-[12px] text-ink-muted">typeof value</code>
          <code className="font-mono text-base font-bold text-fe-text">&apos;{v.type}&apos;</code>
        </div>
        <div className={cell}>
          <code className="font-mono text-[12px] text-ink-muted">if (value)</code>
          <span className={cn('text-base font-bold', v.truthy ? 'text-success' : 'text-error')}>{v.truthy ? 'runs: truthy' : 'skipped: falsy'}</span>
        </div>
        <div className={cell}>
          <code className="font-mono text-[12px] text-ink-muted">value + 1</code>
          <code className="font-mono text-base font-bold text-ink">{v.plusOne}</code>
        </div>
      </div>
      <figcaption className="rounded-xl bg-row px-3 py-2.5 text-sm text-ink-soft">{v.says}</figcaption>
    </figure>
  )
}
