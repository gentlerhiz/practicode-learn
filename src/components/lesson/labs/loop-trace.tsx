'use client'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

const CODE = ['const prices = [3.2, 2.5, 2.8]', 'let total = 0', '', 'for (const price of prices) {', '  total = total + price', '}', '', 'console.log(total)']

// Each state: the lines running, the round, and the totals after it (checked in Node: 3.2 + 2.5 + 2.8 = 8.5).
const VIEWS: { lines: number[]; round: number; price?: string; total: string; printed?: string }[] = [
  { lines: [0, 1], round: 0, total: '0' },
  { lines: [3, 4], round: 1, price: '3.2', total: '3.2' },
  { lines: [3, 4], round: 2, price: '2.5', total: '5.7' },
  { lines: [3, 4], round: 3, price: '2.8', total: '8.5' },
  { lines: [7], round: 4, total: '8.5', printed: '8.5' },
]

const ROUNDS = [
  ['1', '3.2', '0 + 3.2', '3.2'],
  ['2', '2.5', '3.2 + 2.5', '5.7'],
  ['3', '2.8', '5.7 + 2.8', '8.5'],
]

/** A for...of loop adding up an order, one round at a time (Diagram lab, 5 states). */
export function LoopTrace({ state }: LabProps) {
  const v = VIEWS[clampState(state, VIEWS.length)]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={v.round === 0 ? 'Before the loop, total is 0.' : v.round === 4 ? 'The loop has finished after 3 rounds. console.log prints 8.5.' : `Round ${v.round}: price is ${v.price}, so total becomes ${v.total}.`} className="flex flex-col gap-3">
        <div className="overflow-x-auto rounded-2xl border border-line bg-row py-2 font-mono text-[12.5px] leading-6 @min-[420px]:text-[13px]">
          {CODE.map((c, i) => (
            <div key={i} className={cn('px-3 whitespace-pre', v.lines.includes(i) ? 'bg-fe/15 font-semibold text-ink shadow-[inset_3px_0_0_#3d5af5]' : 'text-ink-soft')}>
              {c || ' '}
            </div>
          ))}
        </div>
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="text-[12px] text-ink-muted">
              <th className="px-2 py-1 font-medium">Round</th>
              <th className="px-2 py-1 font-medium">price</th>
              <th className="px-2 py-1 font-medium">total + price</th>
              <th className="px-2 py-1 font-medium">total after</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {ROUNDS.map((r, i) => {
              const done = v.round > i
              const now = v.round === i + 1
              return (
                <tr key={r[0]} className={cn('border-t border-line-subtle', now && 'bg-fe/10 font-bold', !done && 'text-ink-subtle')}>
                  {r.map((x, j) => (
                    <td key={j} className="px-2 py-1.5">
                      {done ? x : '·'}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="flex flex-wrap items-center gap-2 text-[13px]">
          <span className="rounded-lg border border-fe px-2 py-1 font-mono text-ink">
            total: <span className="font-bold">{v.total}</span>
          </span>
          {v.printed && <span className="rounded-lg bg-[#15122a] px-2 py-1 font-mono text-[#f4f1ff]">console: {v.printed}</span>}
        </div>
      </div>
    </figure>
  )
}
