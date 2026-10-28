'use client'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

const CODE = ['function lineTotal(price, quantity) {', '  return price * quantity', '}', '', 'const coffees = lineTotal(3.2, 2)', 'const espressos = lineTotal(2.5, 3)']

type View = { line: number[]; params?: [string, string][]; working?: string; vars: [string, string][]; note: string }

const VIEWS: View[] = [
  { line: [0, 1, 2], vars: [['lineTotal', 'a function']], note: 'JavaScript stores the function under its name. Nothing inside it runs yet.' },
  { line: [4], params: [['price', '3.2'], ['quantity', '2']], vars: [['lineTotal', 'a function']], note: 'The call lineTotal(3.2, 2) passes two arguments. They fill the parameters in order: price is 3.2 and quantity is 2.' },
  { line: [1], params: [['price', '3.2'], ['quantity', '2']], working: '3.2 * 2 = 6.4', vars: [['lineTotal', 'a function']], note: 'The body runs with those values.' },
  { line: [4], vars: [['lineTotal', 'a function'], ['coffees', '6.4']], note: 'return hands 6.4 back to where the call was, so coffees is 6.4. price and quantity are gone: they only exist during the call.' },
  { line: [5, 1], params: [['price', '2.5'], ['quantity', '3']], working: '2.5 * 3 = 7.5', vars: [['lineTotal', 'a function'], ['coffees', '6.4'], ['espressos', '7.5']], note: 'The same function, called again with new arguments, gives a new answer. Write it once, use it everywhere.' },
]

/** A function being defined, called, run and returning (Diagram lab, 5 states). */
export function CallTrace({ state }: LabProps) {
  const v = VIEWS[clampState(state, VIEWS.length)]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={`${v.note} Variables: ${v.vars.map(([n, x]) => `${n} is ${x}`).join(', ')}.`} className="flex flex-col gap-3">
        <div className="overflow-x-auto rounded-2xl border border-line bg-row py-2 font-mono text-[12.5px] leading-6 @min-[420px]:text-[13px]">
          {CODE.map((c, i) => (
            <div key={i} className={cn('px-3 whitespace-pre', v.line.includes(i) ? 'bg-fe/15 font-semibold text-ink shadow-[inset_3px_0_0_#3d5af5]' : 'text-ink-soft')}>
              {c || ' '}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-2 @min-[480px]:grid-cols-2">
          <div className="flex flex-col gap-1.5 rounded-xl border border-dashed border-line-strong p-3">
            <p className="text-[12px] font-semibold text-ink-soft">Inside the call</p>
            {v.params ? (
              <div className="flex flex-wrap gap-2 font-mono text-[13px]">
                {v.params.map(([n, x]) => (
                  <span key={n} className="overflow-hidden rounded-lg border border-fe">
                    <span className="bg-fe px-2 py-1 text-white">{n}</span>
                    <span className="px-2 py-1 text-ink">{x}</span>
                  </span>
                ))}
                {v.working && <span className="w-full text-ink">{v.working}</span>}
              </div>
            ) : (
              <p className="text-[13px] text-ink-muted">Not running</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5 rounded-xl border border-line bg-row p-3">
            <p className="text-[12px] font-semibold text-ink-soft">The program’s variables</p>
            <div className="flex flex-wrap gap-2 font-mono text-[13px]">
              {v.vars.map(([n, x]) => (
                <span key={n} className="rounded-lg border border-line px-2 py-1 text-ink">
                  {n}: <span className="font-bold">{x}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </figure>
  )
}
