'use client'
import type { LessonOption } from '@/lib/lessons/schema'
import { cn } from '@/lib/cn'
import { Prose } from './prose'

/**
 * The answers, as native radio buttons in a fieldset, so keyboards and screen readers work as expected.
 * Drawn as the canvas's lettered rows (A, B, C). After a check, the chosen answer shows right or wrong;
 * `revealAnswer` also marks the correct one.
 */
export function Options({
  name,
  options,
  selected,
  checkedId,
  revealAnswer,
  locked,
  onSelect,
  mono = false,
}: {
  name: string
  options: LessonOption[]
  selected?: string
  checkedId?: string
  revealAnswer?: boolean
  locked: boolean
  onSelect: (id: string) => void
  mono?: boolean
}) {
  return (
    <fieldset disabled={locked} className="flex flex-col gap-3">
      <legend className="sr-only">Choose an answer</legend>
      {options.map((o, i) => {
        const status =
          checkedId === o.id ? (o.correct ? 'right' : 'wrong') : checkedId && revealAnswer && o.correct ? 'right' : null
        const chosen = selected === o.id
        return (
          <label
            key={o.id}
            className={cn(
              'press relative box-border flex min-h-14 cursor-pointer items-center gap-4 rounded-2xl border-[1.5px] px-4 py-3 text-[15px] leading-[22px] text-ink in-disabled:cursor-default has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus',
              status === 'right'
                ? 'border-success-fill bg-control'
                : status === 'wrong'
                  ? 'border-error bg-control'
                  : chosen
                    ? 'border-[#8ea2ff] bg-[rgba(77,107,255,0.12)]'
                    : 'border-line bg-row hover:border-line-strong',
            )}
          >
            <input type="radio" name={name} value={o.id} checked={chosen} onChange={() => onSelect(o.id)} className="absolute inset-0 z-10 m-0 cursor-pointer appearance-none opacity-0 disabled:cursor-default" />
            <span
              aria-hidden="true"
              className={cn(
                'flex size-7 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold',
                chosen || status ? 'bg-fe text-white' : 'bg-divider text-ink',
              )}
            >
              {String.fromCharCode(65 + i)}
            </span>
            <Prose html={o.html} inline className={cn('min-w-0 flex-1', mono && 'font-mono text-sm')} />
            {status && (
              <span className={cn('shrink-0 text-sm font-semibold', status === 'right' ? 'text-success' : 'text-error')}>
                {status === 'right' ? '✓ Right' : '✕ Not this one'}
              </span>
            )}
          </label>
        )
      })}
    </fieldset>
  )
}
