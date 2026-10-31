'use client'
import { useState } from 'react'
import { Button } from '@/components/ui'
import { plainText as plain } from '@/lib/lessons/plain-text'
import type { LessonStep } from '@/lib/lessons/schema'
import { cn } from '@/lib/cn'
import { fixedShuffle, type LessonPlayerApi } from '../player/use-lesson-player'
import { Feedback } from '../parts/feedback'
import { HintList } from '../parts/hints'
import { Prose } from '../parts/prose'
import { StepGrid, StepHeading } from '../parts/step-layout'

type MatchStepData = Extract<LessonStep, { type: 'match' }>

/**
 * Pair each term with its match: choose a term, then the match it goes with. Every control is a button,
 * so it works by tap, keyboard and screen reader alike, and each term carries a number as well as a
 * colour. The matches start in a fixed shuffle, the same for everyone.
 */
export function MatchStep({ step, index, api }: { step: MatchStepData; index: number; api: LessonPlayerApi }) {
  const s = api.state
  const n = step.pairs.length
  const picks = s.picks ?? step.pairs.map(() => null)
  const order = fixedShuffle(n)
  const checked = Boolean(s.picksChecked)
  const solved = Boolean(s.solved)
  const firstFree = picks.findIndex((p) => p === null)
  const [active, setActive] = useState(firstFree < 0 ? 0 : firstFree)
  const [said, setSaid] = useState('')
  const termAt = (match: number) => picks.findIndex((p) => p === match)
  const wrong = step.pairs.map((_, t) => t).filter((t) => picks[t] !== t)

  const pair = (match: number) => {
    if (solved) return
    const next = picks.map((p, t) => (t === active ? match : p === match ? null : (p ?? null)))
    api.setPicks(next)
    setSaid(`${plain(step.pairs[active]!.term)} paired with ${plain(step.pairs[match]!.match)}.`)
    const free = next.findIndex((p, t) => p === null && t !== active)
    if (free >= 0) setActive(free)
  }

  return (
    <StepGrid
      top={
        <>
          <StepHeading stage={step.stage} body={step.body} />
          <div className="flex flex-col gap-4 ph:grid ph:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] ph:items-start">
            <div role="group" aria-label="Terms. Choose one, then its match." className="flex flex-wrap gap-2 ph:flex-col">
              {step.pairs.map((p, t) => {
                const on = t === active && !solved
                const ok = checked && picks[t] === t
                return (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={on}
                    aria-label={`${plain(p.term)}, ${picks[t] === null ? 'not paired yet' : `paired with ${plain(step.pairs[picks[t]!]!.match)}`}`}
                    disabled={solved}
                    onClick={() => setActive(t)}
                    className={cn(
                      'press flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border-[1.5px] px-3 py-2 text-left text-[15px] leading-5 font-semibold text-ink disabled:cursor-default',
                      on ? 'border-it bg-it/15' : checked ? (ok ? 'border-success-fill bg-row' : 'border-error bg-row') : 'border-line bg-row hover:border-line-strong',
                    )}
                  >
                    <span aria-hidden="true" className={cn('grid size-6 shrink-0 place-items-center rounded-full font-mono text-[12px] font-bold', on ? 'bg-it text-white' : 'bg-divider text-ink')}>
                      {t + 1}
                    </span>
                    <Prose html={p.term} inline className="min-w-0" />
                  </button>
                )
              })}
            </div>
            <ul aria-label="Matches" className="flex flex-col gap-2">
              {order.map((m) => {
                const t = termAt(m)
                const mark = checked && t >= 0 ? (t === m ? 'right' : 'wrong') : null
                return (
                  <li key={m}>
                    <button
                      type="button"
                      disabled={solved}
                      onClick={() => pair(m)}
                      aria-label={`${plain(step.pairs[m]!.match)}. ${t >= 0 ? `Paired with ${plain(step.pairs[t]!.term)}.` : 'Not paired yet.'}${solved ? '' : ` Pair with ${plain(step.pairs[active]!.term)}.`}`}
                      className={cn(
                        'press flex w-full cursor-pointer items-center gap-3 rounded-2xl border-[1.5px] bg-row px-3 py-2.5 text-left text-[15px] leading-[22px] text-ink disabled:cursor-default',
                        mark === 'right' ? 'border-success-fill' : mark === 'wrong' ? 'border-error' : 'border-line hover:border-line-strong',
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          'grid size-7 shrink-0 place-items-center rounded-full font-mono text-[12px] font-bold',
                          t >= 0 ? 'bg-it text-white' : 'border-[1.5px] border-dashed border-line-strong text-transparent',
                        )}
                      >
                        {t >= 0 ? t + 1 : '·'}
                      </span>
                      <Prose html={step.pairs[m]!.match} inline className="min-w-0 flex-1" />
                      {mark && (
                        <span aria-hidden="true" className={cn('shrink-0 text-sm font-semibold', mark === 'right' ? 'text-success' : 'text-error')}>
                          {mark === 'right' ? '✓' : '✕'}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
          <p aria-live="polite" className="sr-only">
            {said}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {!solved && (
              <Button onClick={api.checkPicks} disabled={picks.some((p) => p === null)}>
                Check My Pairs
              </Button>
            )}
          </div>
          <Feedback
            focusKey={api.attempts[String(index)]}
            value={
              checked
                ? solved
                  ? { ok: true, verdict: 'Correct.', html: 'Every pair matches.' }
                  : {
                      ok: false,
                      verdict: 'Not yet.',
                      html: `${n - wrong.length} of ${n} pairs match. ${wrong.map((t) => step.pairs[t]!.feedback).join(' ')}`,
                    }
                : null
            }
          />
          <HintList hints={step.hints} shown={s.hints} />
        </>
      }
    />
  )
}
