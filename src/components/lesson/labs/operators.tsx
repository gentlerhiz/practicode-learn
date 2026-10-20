'use client'
import type { LabProps } from './shared'

// Python's arithmetic operators on 7 and 2, with the result Python gives and its type.
const OPS: Record<string, { result: string; type: 'int' | 'float'; says: string }> = {
  '7 + 2': { result: '9', type: 'int', says: 'Adds. Two whole numbers give a whole number, an int.' },
  '7 - 2': { result: '5', type: 'int', says: 'Subtracts.' },
  '7 * 2': { result: '14', type: 'int', says: 'Multiplies. Python uses *, not ×.' },
  '7 / 2': { result: '3.5', type: 'float', says: 'Divides. The answer is always a float, a number with a decimal point, even 8 / 2 gives 4.0.' },
  '7 // 2': { result: '3', type: 'int', says: 'Floor division: how many whole 2s fit in 7, dropping what’s left over.' },
  '7 % 2': { result: '1', type: 'int', says: 'Modulo: what’s left over after the whole 2s. 7 % 2 is 1, so 7 is odd.' },
  '7 ** 2': { result: '49', type: 'int', says: 'Power: 7 to the power of 2, which is 7 × 7.' },
}

/** One Python expression and its result (Explore lab: value = an expression). */
export function Operators({ value = '7 + 2' }: LabProps) {
  const op = OPS[value] ?? OPS['7 + 2']!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${value} gives ${op.result}, a ${op.type}.`}>
      <div className="flex flex-col gap-1.5 rounded-2xl bg-[#15122a] p-4 font-mono text-[#f4f1ff]">
        <span className="text-base">
          <span className="text-[#9fb0ff]">&gt;&gt;&gt;</span> {value}
        </span>
        <span className="text-2xl font-bold">{op.result}</span>
      </div>
      <figcaption className="flex flex-col gap-1 rounded-xl bg-row px-3 py-2.5 text-sm text-ink">
        <span>
          Type: <code className="font-mono font-bold text-fe-text">{op.type}</code>
        </span>
        <span className="text-ink-soft">{op.says}</span>
      </figcaption>
    </figure>
  )
}
