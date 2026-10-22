'use client'
import { Check, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Fault = 'isp' | 'device' | 'site' | 'signal'
type CheckItem = { ask: string; result: string; ok: boolean }
type Case = { problem: string; checks: CheckItem[]; fault: Fault; cause: string; fix: string }

const CASES: Record<string, Case> = {
  'Nothing loads on any device': {
    problem: 'No website or app works, on the phone, the laptop or the TV.',
    fault: 'isp',
    checks: [
      { ask: 'Try another device', result: 'Nothing works on any device in the house.', ok: false },
      { ask: 'Look at the router’s lights', result: 'Power is on, Wi-Fi is on, but the internet light is red.', ok: false },
      { ask: 'Restart the router, and wait 3 minutes', result: 'It starts up again, but the internet light is still red.', ok: false },
      { ask: 'Check the provider’s status page, on mobile data', result: '“Outage in your area. We expect to fix it by 3 pm.”', ok: false },
    ],
    cause: 'The problem is outside the home: an outage at the internet provider.',
    fix: 'Nothing to fix at home. Use mobile data if you need to, and wait, or call the provider if it lasts.',
  },
  'Only the laptop is offline': {
    problem: 'The phone and the TV are fine. The laptop says “No internet”.',
    fault: 'device',
    checks: [
      { ask: 'Try another device', result: 'The phone loads websites quickly.', ok: true },
      { ask: 'Look at the router’s lights', result: 'All lights are normal.', ok: true },
      { ask: 'Check the laptop’s Wi-Fi icon', result: 'Aeroplane mode is on, so Wi-Fi is off.', ok: false },
      { ask: 'Turn aeroplane mode off', result: 'The laptop joins the Wi-Fi, and websites load.', ok: true },
    ],
    cause: 'The problem is on the laptop: aeroplane mode had turned Wi-Fi off.',
    fix: 'Turn aeroplane mode off. If Wi-Fi is on but it still fails, forget the network and join it again.',
  },
  'One website won’t load': {
    problem: 'One shopping site shows an error. Everything else works.',
    fault: 'site',
    checks: [
      { ask: 'Try other websites', result: 'Every other site loads normally.', ok: true },
      { ask: 'Try the site on another device', result: 'It fails on the phone too, even on mobile data.', ok: false },
      { ask: 'Search for whether the site is down', result: 'The site’s own status page says it’s having problems.', ok: false },
    ],
    cause: 'The problem is the website itself: its servers are down.',
    fix: 'Nothing to fix on your side. Try again later.',
  },
  'Slow in the bedroom': {
    problem: 'Videos keep pausing in the upstairs bedroom, but not in the living room.',
    fault: 'signal',
    checks: [
      { ask: 'Run a speed test next to the router', result: 'About 300 Mbps: fast.', ok: true },
      { ask: 'Run a speed test in the bedroom', result: 'About 4 Mbps, and it drops out.', ok: false },
      { ask: 'Look at the Wi-Fi bars in the bedroom', result: 'One bar, through two walls and a floor.', ok: false },
    ],
    cause: 'The problem is distance: the Wi-Fi signal is too weak that far from the router.',
    fix: 'Move the router somewhere central and high, or add a mesh point or extender upstairs.',
  },
}

const PARTS: { id: Fault | 'router'; name: string }[] = [
  { id: 'device', name: 'Device' },
  { id: 'signal', name: 'Wi-Fi' },
  { id: 'router', name: 'Router' },
  { id: 'isp', name: 'Provider' },
  { id: 'site', name: 'Website' },
]

function Investigation({ value }: { value: string }) {
  const c = CASES[value] ?? CASES['Nothing loads on any device']!
  const [done, setDone] = useState<number[]>([])
  const solved = done.length >= 2
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-line bg-row px-4 py-3">
        <p className="text-[12px] font-semibold text-ink-subtle">The problem</p>
        <p className="text-[14px] leading-6 text-ink">{c.problem}</p>
      </div>
      <ol aria-label="The path to the internet" className="flex items-center gap-1">
        {PARTS.map((p, i) => (
          <li key={p.id} className="flex min-w-0 flex-1 items-center gap-1">
            <span
              className={cn(
                'flex min-h-9 min-w-0 flex-1 items-center justify-center rounded-lg border-[1.5px] px-0.5 py-1 text-center text-[10.5px] leading-3 font-semibold motion-safe:transition-colors motion-safe:duration-300 @min-[420px]:text-[11px]',
                solved && p.id === c.fault ? 'border-error bg-error/15 text-error' : 'border-line bg-sunken text-ink-muted',
              )}
            >
              <span className="min-w-0">{p.name}</span>
              {solved && p.id === c.fault && <span className="sr-only">: the problem is here</span>}
            </span>
            {i < PARTS.length - 1 && (
              <span aria-hidden="true" className="hidden text-[10px] text-ink-subtle @min-[420px]:inline">
                →
              </span>
            )}
          </li>
        ))}
      </ol>
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-ink">Run the checks, in any order</p>
        <ul className="flex flex-col gap-2">
          {c.checks.map((ch, i) => {
            const run = done.includes(i)
            return (
              <li key={ch.ask}>
                <button
                  type="button"
                  aria-expanded={run}
                  onClick={() => setDone((d) => (d.includes(i) ? d : [...d, i]))}
                  className={cn(
                    'press flex w-full cursor-pointer flex-col items-start gap-1 rounded-xl border-[1.5px] px-3 py-2.5 text-left',
                    run ? 'border-line bg-row' : 'border-line-control bg-sunken hover:border-line-strong',
                  )}
                >
                  <span className="text-[13px] font-semibold text-ink">{ch.ask}</span>
                  {run && (
                    <span className={cn('pop-in flex gap-1.5 text-[13px] leading-5', ch.ok ? 'text-success' : 'text-error')}>
                      {ch.ok ? <Check size={15} aria-hidden="true" className="mt-0.5 shrink-0" /> : <X size={15} aria-hidden="true" className="mt-0.5 shrink-0" />}
                      <span className="text-ink-soft">
                        <span className="sr-only">{ch.ok ? 'Normal: ' : 'A clue: '}</span>
                        {ch.result}
                      </span>
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      <div aria-live="polite">
        {solved ? (
          <div className="pop-in flex flex-col gap-1 rounded-2xl border border-it bg-row px-4 py-3">
            <p className="text-[13px] leading-5 text-ink">
              <span className="font-semibold text-it-text">Diagnosis. </span>
              {c.cause}
            </p>
            <p className="text-[13px] leading-5 text-ink-soft">
              <span className="font-semibold text-ink">Fix. </span>
              {c.fix}
            </p>
          </div>
        ) : (
          <p className="text-[13px] text-ink-muted">Run at least two checks to narrow it down.</p>
        )}
      </div>
    </div>
  )
}

/**
 * Four "the internet is down" problems to diagnose: tap checks to see what they show, and the lab
 * points to where along the path the problem is (Explore lab: value = a problem).
 */
export function NetworkFault({ value = 'Nothing loads on any device' }: LabProps) {
  return <Investigation key={value} value={value} />
}
