'use client'

import { CircleCheck, CircleX } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/cn'

const OPTIONS = [
  {
    key: 'a',
    label: '=AVERAGE(B2:B8)',
    mono: true,
    feedback:
      'Not quite. One bulk order on Sunday drags the average up to ₦70,000, more than any normal day ever makes. See how far the dashed line floats above the other six bars?',
  },
  {
    key: 'b',
    label: '=MEDIAN(B2:B8)',
    mono: true,
    feedback:
      'Spot on. The median ignores how huge Sunday was and finds the middle day: ₦42,000. That is what a normal day at this shop really looks like.',
  },
  {
    key: 'c',
    label: 'Either. They give the same number.',
    mono: false,
    feedback:
      'Not this time. With one huge day in the mix they split apart: the average is ₦70,000 but the median is ₦42,000. Compare the two lines.',
  },
] as const

const DAYS = [
  ['Mon', 38, 25],
  ['Tue', 42, 28],
  ['Wed', 40, 27],
  ['Thu', 45, 30],
  ['Fri', 41, 27],
  ['Sat', 44, 29],
] as const

/** The canvas's live question from the Data Analysis track: pick a formula and the chart answers. */
export function LessonDemo() {
  // The canvas opens on the right answer, so the chart already shows both lines.
  const [pick, setPick] = useState<(typeof OPTIONS)[number]['key'] | null>('b')
  const chosen = OPTIONS.find((o) => o.key === pick)
  const correct = pick === 'b'

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[70px] opacity-(--pc-glow-opacity)"
        style={{
          background:
            'radial-gradient(closest-side at 35% 40%, rgba(47,230,176,0.24), rgba(47,230,176,0) 75%), radial-gradient(closest-side at 72% 72%, rgba(77,107,255,0.20), rgba(77,107,255,0) 75%)',
        }}
      />
      <div className="surface relative flex flex-col gap-4 rounded-[28px] border border-line p-5 ph:p-8">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] text-ink-muted">
            <span className="text-da-text">Data Analysis</span> · Module 5 · Statistics you’ll actually use
          </p>
          <p className="shrink-0 rounded-full bg-success-fill px-3 py-1 text-xs font-semibold text-on-success">Predict</p>
        </div>
        <div aria-hidden="true" className="flex gap-1">
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i} className={cn('h-[5px] flex-1 rounded-[3px]', i < 2 ? 'bg-success-fill' : 'bg-meter')} />
          ))}
        </div>
        <h3 className="font-display text-2xl leading-[30px] font-bold tracking-[-0.01em] text-ink">
          Your manager wants a typical day’s sales. Which formula gives the honest answer?
        </h3>
        <div className="overflow-hidden rounded-2xl border border-divider bg-sunken">
          <div className="flex items-center gap-3 border-b border-divider px-4 py-3 font-mono text-[13px]">
            <span className="border-r border-line pr-3 text-ink-subtle italic">fx</span>
            <span className="text-da-text">{chosen?.mono ? chosen.label : '=?(B2:B8)'}</span>
          </div>
          <div className="flex flex-col gap-3 p-4">
            <p className="text-xs text-ink-muted">Daily sales at a phone shop in Ikeja, in thousands of naira</p>
            <div
              role="img"
              aria-label={`Bar chart of daily sales: Monday 38, Tuesday 42, Wednesday 40, Thursday 45, Friday 41, Saturday 44 and Sunday 240 thousand naira.${pick ? ' The average, 70 thousand, sits above every day except Sunday. The median is 42 thousand.' : ''}`}
              className="relative flex h-44 items-end gap-3 border-b border-line px-1"
            >
              {DAYS.map(([day, , h]) => (
                <span key={day} className="block flex-1 rounded-t-md bg-[rgba(47,230,176,0.42)]" style={{ height: h }} />
              ))}
              <span className="flex h-40 flex-1 justify-center rounded-t-md bg-success-fill">
                <span className="-mt-5 text-[11px] font-semibold whitespace-nowrap text-da-text">240k</span>
              </span>
              {pick && (
                <>
                  <span className="absolute inset-x-0 bottom-[47px] block border-t-2 border-dashed border-[#ff8a3d]" />
                  <span className="absolute inset-x-0 bottom-7 block border-t-2 border-ink" />
                </>
              )}
            </div>
            <div aria-hidden="true" className="flex gap-3 px-1 text-center text-[11px] leading-[15px] text-ink-subtle">
              {DAYS.map(([day, k]) => (
                <span key={day} className="flex-1">
                  {day}
                  <br />
                  {k}k
                </span>
              ))}
              <span className="flex-1 text-da-text">
                Sun
                <br />
                240k
              </span>
            </div>
            {pick && (
              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1 text-[13px] text-ink">
                <span className="flex items-center gap-2">
                  <span className="block w-[18px] border-t-2 border-dashed border-[#ff8a3d]" />
                  <span className="font-mono text-ink-muted">AVERAGE</span>
                  <span className="font-semibold">₦70,000</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="block w-[18px] border-t-2 border-ink" />
                  <span className="font-mono text-ink-muted">MEDIAN</span>
                  <span className="font-semibold">₦42,000</span>
                </span>
              </div>
            )}
          </div>
        </div>
        <div role="group" aria-label="Your prediction" className="flex flex-col gap-3">
          {OPTIONS.map((option, i) => {
            const on = option.key === pick
            return (
              <button
                key={option.key}
                type="button"
                aria-pressed={on}
                onClick={() => setPick(option.key)}
                className={cn(
                  'press flex min-h-[52px] w-full cursor-pointer items-center gap-4 rounded-2xl border-[1.5px] px-4 py-3 text-left text-[15px] text-ink',
                  option.mono && 'font-mono',
                  on
                    ? option.key === 'b'
                      ? 'border-success-fill bg-control'
                      : 'border-error bg-control'
                    : 'border-divider bg-row hover:border-line-strong',
                )}
              >
                <span className="flex size-[26px] shrink-0 items-center justify-center rounded-lg bg-divider font-sans text-[13px] font-semibold">
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{option.label}</span>
              </button>
            )
          })}
        </div>
        <div aria-live="polite" className="min-h-[66px]">
          {chosen && (
            <p className={cn('flex gap-3 text-sm leading-[22px]', correct ? 'text-success' : 'text-error')}>
              {correct ? (
                <CircleCheck aria-hidden="true" size={20} strokeWidth={1.85} className="shrink-0" />
              ) : (
                <CircleX aria-hidden="true" size={20} strokeWidth={1.85} className="shrink-0" />
              )}
              <span>{chosen.feedback}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
