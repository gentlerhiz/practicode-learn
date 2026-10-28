'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Branch = 'free' | 'half' | 'full'

const fee: Record<Branch, string> = { free: '0', half: '2.5', full: '4' }

/** Which branch a total takes: conditions are checked top to bottom, and the first true one wins. */
function route(total: number): { checks: { test: string; result: boolean }[]; branch: Branch } {
  const checks = [{ test: `${total} >= 20`, result: total >= 20 }]
  if (total >= 20) return { checks, branch: 'free' }
  checks.push({ test: `${total} >= 10`, result: total >= 10 })
  if (total >= 10) return { checks, branch: 'half' }
  return { checks, branch: 'full' }
}

const LINES: { code: string; branch?: Branch; test?: 0 | 1 }[] = [
  { code: 'function deliveryFee(total) {' },
  { code: '  if (total >= 20) {', test: 0 },
  { code: '    return 0', branch: 'free' },
  { code: '  } else if (total >= 10) {', test: 1 },
  { code: '    return 2.5', branch: 'half' },
  { code: '  } else {' },
  { code: '    return 4', branch: 'full' },
  { code: '  }' },
  { code: '}' },
]

/** An if / else if / else on a café's delivery fee (Explore lab: value = an order total). */
export function IfFlow({ value = '25' }: LabProps) {
  const total = Number(value)
  const { checks, branch } = route(Number.isFinite(total) ? total : 25)
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`deliveryFee(${value}): ${checks.map((c) => `${c.test} is ${c.result}`).join(', then ')}. It returns ${fee[branch]}.`}>
      <div className="overflow-x-auto rounded-2xl border border-line bg-row py-2 font-mono text-[12.5px] leading-6 @min-[420px]:text-[13px]">
        {LINES.map((l, i) => {
          const check = l.test !== undefined ? checks[l.test] : undefined
          const taken = l.branch === branch
          const skipped = (l.branch && !taken) || (l.test !== undefined && !check)
          return (
            <div key={i} className={cn('flex flex-wrap items-center justify-between gap-x-3 px-3', taken && 'bg-success/15 font-bold text-ink', skipped && 'text-ink-subtle', !taken && !skipped && 'text-ink')}>
              <span className="whitespace-pre">{l.code}</span>
              {check && (
                <span className={cn('shrink-0 rounded-md px-1.5 font-sans text-[11.5px] font-semibold', check.result ? 'bg-success-fill text-on-success' : 'bg-error/15 text-error')}>
                  {check.test}: {String(check.result)}
                </span>
              )}
              {taken && <span className="shrink-0 font-sans text-[11.5px] font-semibold text-success">runs</span>}
            </div>
          )
        })}
      </div>
      <figcaption className="flex flex-col gap-1 rounded-xl bg-row px-3 py-2.5 text-sm text-ink">
        <span>
          <code className="font-mono font-bold">deliveryFee({value})</code> returns <code className="font-mono font-bold text-fe-text">{fee[branch]}</code>
        </span>
        <span className="text-ink-soft">
          {branch === 'free'
            ? 'The first condition is true, so its block runs and the rest are never checked.'
            : branch === 'half'
              ? 'The first condition is false, so JavaScript checks the next one. That one is true, so its block runs.'
              : 'Both conditions are false, so the else block runs: it catches everything left over.'}
        </span>
      </figcaption>
    </figure>
  )
}
