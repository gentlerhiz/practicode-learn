'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

// makeCoffee(item) takes 2 seconds and gives back the coffee; in "Rejected" it runs out of milk.
type Log = { at: number; text: string; bad?: boolean }
type Case = { code: string; logs: Log[]; says: string }

const CASES: Record<string, Case> = {
  setTimeout: {
    code: "console.log('1. Order taken')\n\nsetTimeout(() => {\n  console.log('3. Coffee ready')\n}, 2000)\n\nconsole.log('2. Next customer')",
    logs: [
      { at: 0, text: '1. Order taken' },
      { at: 0, text: '2. Next customer' },
      { at: 2, text: '3. Coffee ready' },
    ],
    says: 'setTimeout doesn’t pause the program. It books the function for later and moves on at once, so line 2 prints before line 3.',
  },
  Callback: {
    code: "makeCoffee('Flat white', (error, coffee) => {\n  if (error) return console.log('Sorry: ' + error.message)\n  console.log('Served: ' + coffee)\n})\n\nconsole.log('Next customer')",
    logs: [
      { at: 0, text: 'Next customer' },
      { at: 2, text: 'Served: Flat white' },
    ],
    says: 'A callback is a function you hand over to be called when the work is done. Node’s older functions take the error first, then the result.',
  },
  Promise: {
    code: "makeCoffee('Flat white')\n  .then((coffee) => console.log('Served: ' + coffee))\n  .catch((error) => console.log('Sorry: ' + error.message))\n\nconsole.log('Next customer')",
    logs: [
      { at: 0, text: 'Next customer' },
      { at: 2, text: 'Served: Flat white' },
    ],
    says: 'makeCoffee returns a promise straight away: a receipt for a coffee that isn’t ready yet. .then runs when it’s fulfilled.',
  },
  Rejected: {
    code: "makeCoffee('Flat white')\n  .then((coffee) => console.log('Served: ' + coffee))\n  .catch((error) => console.log('Sorry: ' + error.message))\n\nconsole.log('Next customer')",
    logs: [
      { at: 0, text: 'Next customer' },
      { at: 2, text: 'Sorry: Out of milk', bad: true },
    ],
    says: 'This time the promise is rejected, so .then is skipped and .catch runs with the error.',
  },
  'async/await': {
    code: "async function serve() {\n  console.log('1. Order taken')\n  const coffee = await makeCoffee('Flat white')\n  console.log('3. Served: ' + coffee)\n}\n\nserve()\nconsole.log('2. Next customer')",
    logs: [
      { at: 0, text: '1. Order taken' },
      { at: 0, text: '2. Next customer' },
      { at: 2, text: '3. Served: Flat white' },
    ],
    says: 'await pauses only serve(), until the coffee is ready. The rest of the program carries on, so the café can serve the next customer.',
  },
  'Forgot await': {
    code: "async function serve() {\n  const coffee = makeCoffee('Flat white')\n  console.log('Served: ' + coffee)\n}\n\nserve()",
    logs: [{ at: 0, text: 'Served: [object Promise]', bad: true }],
    says: 'Without await, coffee is the promise, not the coffee. Joined to text, it prints as [object Promise]. A classic bug.',
  },
  'One after another': {
    code: "const a = await makeCoffee('Flat white')\nconst b = await makeCoffee('Espresso')\nconsole.log('Both ready: ' + a + ', ' + b)",
    logs: [{ at: 4, text: 'Both ready: Flat white, Espresso' }],
    says: 'Each await waits for the one before, so two 2-second coffees take 4 seconds.',
  },
  'Promise.all': {
    code: "const [a, b] = await Promise.all([\n  makeCoffee('Flat white'),\n  makeCoffee('Espresso'),\n])\nconsole.log('Both ready: ' + a + ', ' + b)",
    logs: [{ at: 2, text: 'Both ready: Flat white, Espresso' }],
    says: 'Promise.all starts both at once and waits for all of them: 2 seconds, not 4. If one is rejected, the whole thing is rejected.',
  },
}

/** When asynchronous code prints, on a timeline in seconds (Explore lab: value = a way of waiting). */
export function AsyncTimeline({ value = 'setTimeout' }: LabProps) {
  const c = CASES[value] ?? CASES.setTimeout!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`Prints, in order: ${c.logs.map((l) => `at ${l.at} seconds, ${l.text}`).join('; ')}. ${c.says}`}>
      <pre className="m-0 rounded-2xl border border-line bg-row p-3 font-mono text-[12.5px] leading-5 whitespace-pre-wrap text-ink [overflow-wrap:anywhere]">{c.code}</pre>
      <div className="flex flex-col gap-2 rounded-2xl bg-[#15122a] p-3 text-[#f4f1ff]">
        <p className="font-sans text-[12px] text-[#a9a5c0]">Console, with the time each line appears</p>
        <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
          {c.logs.map((l, i) => (
            <li key={i} className="flex items-center gap-3 font-mono text-[12.5px]">
              <span className="w-12 shrink-0 rounded-md bg-white/10 px-1.5 py-0.5 text-center font-sans text-[11px]">{l.at} s</span>
              <span className={cn('[overflow-wrap:anywhere]', l.bad && 'text-[#ff8f8f]')}>{l.text}</span>
            </li>
          ))}
        </ol>
        <div aria-hidden="true" className="relative mt-1 h-6">
          <div className="absolute inset-x-0 top-3 h-px bg-white/25" />
          {[0, 1, 2, 3, 4].map((s) => (
            <span key={s} className={`absolute top-0 font-sans text-[10px] text-[#a9a5c0] ${s === 0 ? '' : s === 4 ? '-translate-x-full' : '-translate-x-1/2'}`} style={{ left: `${s * 25}%` }}>
              {s}s
            </span>
          ))}
          {[...new Set(c.logs.map((l) => l.at))].map((at) => (
            <span key={at} className={`absolute top-[7px] size-3 rounded-full bg-[#7ee2b8] ${at === 0 ? '' : at === 4 ? '-translate-x-full' : '-translate-x-1/2'}`} style={{ left: `${at * 25}%` }} />
          ))}
        </div>
      </div>
      <figcaption className="rounded-xl bg-row px-3 py-2.5 text-sm text-ink-soft">{c.says}</figcaption>
    </figure>
  )
}
