'use client'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

type View = { from: string[]; fromName: string; to: string[]; arrow?: string; out?: string; bad?: boolean }

const PRICES = ["export const prices = { 'Flat white': 3.2 }", '', 'export function priceOf(item) {', '  return prices[item]', '}']
const VIEWS: View[] = [
  { from: PRICES, fromName: 'prices.js', to: ["console.log(prices['Flat white'])"], out: 'ReferenceError: prices is not defined', bad: true },
  { from: PRICES, fromName: 'prices.js', to: ["import { prices } from './prices.js'", '', "console.log(prices['Flat white'])"], arrow: 'prices', out: '3.2' },
  { from: PRICES, fromName: 'prices.js', to: ["import { prices, priceOf } from './prices.js'", '', "console.log(priceOf('Flat white'))"], arrow: 'prices, priceOf', out: '3.2' },
  { from: PRICES, fromName: 'prices.js', to: ["import { price } from './prices.js'"], out: "SyntaxError: The requested module './prices.js' does not provide an export named 'price'", bad: true },
  { from: ['export default function money(amount) {', '  return amount.toFixed(2)', '}'], fromName: 'money.js', to: ["import money from './money.js'", '', 'console.log(money(3.2))'], arrow: 'default', out: '3.20' },
]

function File({ name, lines }: { name: string; lines: string[] }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-line bg-row">
      <p className="border-b border-line-subtle px-3 py-1.5 font-mono text-[12px] font-semibold text-ink-soft">{name}</p>
      <div className="overflow-x-auto py-1.5 font-mono text-[12px] leading-5">
        {lines.map((l, i) => (
          <div key={i} className={cn('px-3 whitespace-pre-wrap [overflow-wrap:anywhere]', /^(export|import)/.test(l) ? 'font-semibold text-fe-text' : 'text-ink')}>
            {l || ' '}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Two files sharing code with export and import (Diagram lab, 5 states). */
export function ModuleGraph({ state }: LabProps) {
  const v = VIEWS[clampState(state, VIEWS.length)]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={`${v.fromName} and app.js. ${v.arrow ? `app.js imports ${v.arrow}. ` : 'app.js imports nothing. '}Running app.js gives: ${v.out}`} className="flex flex-col gap-2 @min-[680px]:flex-row @min-[680px]:items-stretch">
        <File name={v.fromName} lines={v.from} />
        <div className="flex items-center justify-center gap-1 text-[12px] font-semibold text-fe-text @min-[680px]:flex-col">
          {v.arrow ? (
            <>
              <span className="rounded-full bg-fe/15 px-2 py-0.5 font-mono">{v.arrow}</span>
              <ArrowRight size={18} aria-hidden="true" className="rotate-90 @min-[680px]:rotate-0" />
            </>
          ) : (
            <span className="text-ink-subtle">no import</span>
          )}
        </div>
        <File name="app.js" lines={v.to} />
      </div>
      <p className={cn('rounded-xl px-3 py-2.5 font-mono text-[12.5px] [overflow-wrap:anywhere]', v.bad ? 'bg-error/12 text-error' : 'bg-[#15122a] text-[#f4f1ff]')}>
        $ node app.js
        <br />
        {v.out}
      </p>
    </figure>
  )
}
