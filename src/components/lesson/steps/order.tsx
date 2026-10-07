'use client'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui'
import type { LessonStep } from '@/lib/lessons/schema'
import { cn } from '@/lib/cn'
import { fixedShuffle } from '../player/use-lesson-player'
import { Feedback } from '../parts/feedback'
import { HintList } from '../parts/hints'
import { Prose } from '../parts/prose'
import { StepGrid, StepHeading } from '../parts/step-layout'

type OrderStepData = Extract<LessonStep, { type: 'order' }>

/**
 * Put items in sequence with Move up and Move down buttons, which work with a keyboard, a screen reader
 * and touch alike (no drag and drop). The player passes a fixed shuffle and the hints revealed from the
 * header; tests pass their own order.
 */
export function OrderStep({
  step,
  initialOrder,
  initiallySolved = false,
  hintsShown = 0,
  onSolved,
  onCheck,
}: {
  step: OrderStepData
  initialOrder?: number[]
  initiallySolved?: boolean
  hintsShown?: number
  onSolved: () => void
  onCheck?: (order: number[]) => void
}) {
  const [order, setOrder] = useState(() => initialOrder ?? fixedShuffle(step.items.length))
  const [checked, setChecked] = useState(initiallySolved)
  const [solved, setSolved] = useState(initiallySolved)
  const [checks, setChecks] = useState(0)
  const buttons = useRef(new Map<string, HTMLButtonElement>())

  const move = (from: number, direction: -1 | 1) => {
    const to = from + direction
    if (to < 0 || to >= order.length) return
    const next = [...order]
    ;[next[from], next[to]] = [next[to]!, next[from]!]
    setOrder(next)
    setChecked(false)
    // Keep focus on the item that moved, so the learner can keep moving it.
    requestAnimationFrame(() =>
      (buttons.current.get(`${to}:${direction}`) ?? buttons.current.get(`${to}:${-direction}`))?.focus(),
    )
  }

  const check = () => {
    const ok = order.every((item, position) => item === position)
    setChecked(true)
    setSolved(ok)
    setChecks((n) => n + 1)
    onCheck?.(order)
    if (ok) onSolved()
  }

  return (
    <StepGrid
      top={
        <>
          <StepHeading stage={step.stage} body={step.body} />
          <ol className="flex flex-col gap-2.5">
            {order.map((item, position) => {
              const right = item === position
              return (
                <li
                  key={item}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl border border-line bg-row px-3 py-2.5 text-[15px] text-ink',
                    checked && (right ? 'border-success' : 'border-error'),
                  )}
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sunken font-mono text-[13px] text-ink-muted">
                    {position + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <Prose html={step.items[item]!} inline />
                    {checked && (
                      <span className="sr-only">
                        {right ? ', in the right place' : ', not in the right place'}
                      </span>
                    )}
                  </span>
                  {!solved && (
                    <span className="flex shrink-0 gap-1">
                      {([-1, 1] as const).map((direction) => (
                        <button
                          key={direction}
                          ref={(el) => {
                            if (el) buttons.current.set(`${position}:${direction}`, el)
                            else buttons.current.delete(`${position}:${direction}`)
                          }}
                          type="button"
                          aria-label={direction < 0 ? 'Move up' : 'Move down'}
                          disabled={direction < 0 ? position === 0 : position === order.length - 1}
                          onClick={() => move(position, direction)}
                          className="grid size-10 place-items-center rounded-xl border border-line-control text-ink hover:bg-hover disabled:opacity-30"
                        >
                          {direction < 0 ? '↑' : '↓'}
                        </button>
                      ))}
                    </span>
                  )}
                </li>
              )
            })}
          </ol>
          <div className="flex flex-wrap items-center gap-3">
            {!solved && <Button onClick={check}>Check the Order</Button>}
          </div>
          <Feedback
            focusKey={checks}
            value={
              checked
                ? solved
                  ? { ok: true, verdict: 'Correct.', html: 'That’s the right order.' }
                  : { ok: false, verdict: 'Not yet.', html: step.wrong }
                : null
            }
          />
          <HintList hints={step.hints} shown={hintsShown} />
        </>
      }
    />
  )
}
