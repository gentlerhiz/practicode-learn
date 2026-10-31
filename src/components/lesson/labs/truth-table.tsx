'use client'
import { useId, useState } from 'react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Op = {
  names: string[]
  expr: (a: string, b?: string) => string
  apply: (a: boolean, b: boolean) => boolean
  says: (a: boolean, b: boolean, r: boolean) => string
}

const OPS: Record<string, Op> = {
  and: {
    names: ['has_ticket', 'has_id'],
    expr: (a, b) => `${a} and ${b}`,
    apply: (a, b) => a && b,
    says: (a, b, r) =>
      r
        ? 'Both are True, so and gives True: come in.'
        : `and needs both. ${!a ? 'has_ticket is False, so Python doesn’t even look at has_id.' : 'has_id is False, so the answer is False.'}`,
  },
  or: {
    names: ['is_member', 'has_voucher'],
    expr: (a, b) => `${a} or ${b}`,
    apply: (a, b) => a || b,
    says: (a, b, r) =>
      r
        ? `or needs just one. ${a ? 'is_member is True, so Python doesn’t even look at has_voucher.' : 'has_voucher is True, so the answer is True.'}`
        : 'Neither is True, so or gives False: no discount.',
  },
  not: {
    names: ['is_raining'],
    expr: (a) => `not ${a}`,
    apply: (a) => !a,
    says: (a) =>
      a
        ? 'not flips True to False: it’s raining, so no walk.'
        : 'not flips False to True: it isn’t raining, so go for a walk.',
  },
}

const word = (b: boolean) => (b ? 'True' : 'False')

/**
 * and, or and not with switches the learner flips, and the whole truth table with their row marked
 * (Explore lab: value = and, or or not).
 */
export function TruthTable({ value = 'and' }: LabProps) {
  const op = OPS[value] ?? OPS.and!
  const [vals, setVals] = useState([true, false])
  const id = useId()
  const [a, b] = [vals[0]!, op.names.length > 1 ? vals[1]! : false]
  const result = op.apply(a, b)
  const rows: [boolean, boolean][] =
    op.names.length > 1
      ? [
          [true, true],
          [true, false],
          [false, true],
          [false, false],
        ]
      : [
          [true, false],
          [false, false],
        ]
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {op.names.map((name, i) => (
          <button
            key={`${value}-${name}`}
            type="button"
            aria-pressed={vals[i]}
            onClick={() => setVals((v) => v.map((x, j) => (j === i ? !x : x)))}
            className={cn(
              'flex min-h-11 press items-center gap-2 rounded-xl border px-3 font-mono text-[13px]',
              vals[i]
                ? 'border-success-fill bg-success/15 text-ink'
                : 'border-line-control bg-row text-ink-soft',
            )}
          >
            {name} = <span className="font-bold">{word(vals[i]!)}</span>
          </button>
        ))}
      </div>
      <div
        aria-live="polite"
        className="flex flex-col gap-1.5 rounded-2xl bg-[#15122a] p-4 font-mono text-[#f4f1ff]"
      >
        <span className="text-[14px] [overflow-wrap:anywhere]">
          <span className="text-[#9fb0ff]">&gt;&gt;&gt;</span> {op.expr(op.names[0]!, op.names[1])}
        </span>
        <span className={cn('text-2xl font-bold', result ? 'text-[#7ee2b8]' : 'text-[#ff8f8f]')}>
          {word(result)}
        </span>
        <span className="font-sans text-[13px] leading-5 text-[#cfcbe6]">{op.says(a, b, result)}</span>
      </div>
      <p id={`${id}-about`} className="m-0 -mb-1.5 text-[12px] text-ink-muted">
        Every combination: tap the switches to move the marked row
      </p>
      <div className="overflow-hidden rounded-2xl border border-line">
        <table
          aria-label={`Every combination for ${value}`}
          aria-describedby={`${id}-about`}
          className="w-full border-collapse text-center font-mono text-[13px]"
        >
          <thead>
            <tr className="bg-row text-ink-soft">
              {op.names.map((n) => (
                <th
                  key={n}
                  scope="col"
                  className="border-b border-line px-2 py-1.5 font-semibold [overflow-wrap:anywhere]"
                >
                  {n}
                </th>
              ))}
              <th scope="col" className="border-b border-line px-2 py-1.5 font-semibold text-fe-text">
                {value === 'not' ? 'not' : value}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([x, y]) => {
              const mine = x === a && (op.names.length < 2 || y === b)
              return (
                <tr
                  key={`${x}${y}`}
                  aria-current={mine ? 'true' : undefined}
                  className={cn(mine ? 'bg-fe/15 font-bold text-ink' : 'text-ink-soft')}
                >
                  <td className="border-b border-line px-2 py-1.5">{word(x)}</td>
                  {op.names.length > 1 && <td className="border-b border-line px-2 py-1.5">{word(y)}</td>}
                  <td
                    className={cn(
                      'border-b border-line px-2 py-1.5',
                      op.apply(x, y) ? 'text-success' : 'text-error',
                    )}
                  >
                    {word(op.apply(x, y))}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </figure>
  )
}
