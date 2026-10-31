'use client'
import { Button } from '@/components/ui'
import { plainText as plain } from '@/lib/lessons/plain-text'
import type { LessonStep } from '@/lib/lessons/schema'
import { cn } from '@/lib/cn'
import type { LessonPlayerApi } from '../player/use-lesson-player'
import { Feedback } from '../parts/feedback'
import { HintList } from '../parts/hints'
import { Prose } from '../parts/prose'
import { StepGrid, StepHeading } from '../parts/step-layout'

type SortStepData = Extract<LessonStep, { type: 'sort' }>

// Each group has its own colour and letter, so a choice never rests on colour alone.
const TONES = [
  'border-fe bg-fe text-white',
  'border-da bg-da text-white',
  'border-ux bg-ux text-white',
  'border-ai bg-ai text-white',
]

/**
 * Sort each item into one of two to four groups. Each item is a native radio group, so arrow keys and
 * screen readers work as they do everywhere else; Check marks every item, and a wrong one says why.
 */
export function SortStep({ step, index, api }: { step: SortStepData; index: number; api: LessonPlayerApi }) {
  const s = api.state
  const picks = s.picks ?? step.items.map(() => null)
  const checked = Boolean(s.picksChecked)
  const solved = Boolean(s.solved)
  const right = step.items.filter((item, i) => picks[i] === item.group).length
  const pick = (item: number, group: number) => api.setPicks(picks.map((p, i) => (i === item ? group : (p ?? null))))

  return (
    <StepGrid
      top={
        <>
          <StepHeading stage={step.stage} body={step.body} />
          <ul className="flex flex-col gap-2.5">
            {step.items.map((item, i) => {
              const ok = picks[i] === item.group
              return (
                <li
                  key={i}
                  className={cn(
                    'flex flex-col gap-3 rounded-2xl border-[1.5px] bg-row p-3.5 ph:flex-row ph:items-center ph:justify-between',
                    checked ? (ok ? 'border-success-fill' : 'border-error') : 'border-line',
                  )}
                >
                  <fieldset disabled={solved} className="contents">
                    <legend className="sr-only">{`${plain(item.html)}: which group?`}</legend>
                    <div className="min-w-0 flex-1 text-[15px] leading-[22px] text-ink">
                      <Prose html={item.html} inline />
                      {checked && <span className="sr-only">{ok ? ', in the right group' : ', not in the right group yet'}</span>}
                      {checked && !ok && picks[i] !== null && (
                        <p className="mt-1.5 text-sm leading-5 text-error">
                          <Prose html={item.feedback} inline />
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-1.5">
                      {step.groups.map((group, g) => {
                        const on = picks[i] === g
                        return (
                          <label
                            key={group}
                            className={cn(
                              'press relative flex h-10 cursor-pointer items-center gap-1.5 rounded-xl border px-3 text-[13px] font-semibold in-disabled:cursor-default has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus',
                              on ? TONES[g] : 'border-line-control bg-sunken text-ink-soft hover:border-line-strong hover:text-ink',
                            )}
                          >
                            <input
                              type="radio"
                              name={`step-${index}-item-${i}`}
                              checked={on}
                              onChange={() => pick(i, g)}
                              className="absolute inset-0 z-10 m-0 cursor-pointer appearance-none opacity-0 disabled:cursor-default"
                            />
                            <span aria-hidden="true" className={cn('font-mono text-[11px]', on ? 'text-white/80' : 'text-ink-subtle')}>
                              {String.fromCharCode(65 + g)}
                            </span>
                            {group}
                          </label>
                        )
                      })}
                    </div>
                  </fieldset>
                </li>
              )
            })}
          </ul>
          <div className="flex flex-wrap items-center gap-3">
            {!solved && (
              <Button onClick={api.checkPicks} disabled={picks.some((p) => p === null)}>
                Check My Groups
              </Button>
            )}
          </div>
          <Feedback
            focusKey={api.attempts[String(index)]}
            value={
              checked
                ? solved
                  ? { ok: true, verdict: 'Correct.', html: 'Every item is in the right group.' }
                  : {
                      ok: false,
                      verdict: 'Not yet.',
                      html: `${right} of ${step.items.length} are in the right group. The ones marked in red say why they belong somewhere else.`,
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
