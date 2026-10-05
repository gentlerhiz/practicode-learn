'use client'
import type { LessonOption } from '@/lib/lessons/schema'
import { cn } from '@/lib/cn'
import { Prose } from './prose'

/**
 * The answers, as native radio buttons in a fieldset, so keyboards and screen readers work as expected.
 * After a check, the chosen answer shows right or wrong; `revealAnswer` also marks the correct one.
 */
export function Options({
  name,
  options,
  selected,
  checkedId,
  revealAnswer,
  locked,
  onSelect,
}: {
  name: string
  options: LessonOption[]
  selected?: string
  checkedId?: string
  revealAnswer?: boolean
  locked: boolean
  onSelect: (id: string) => void
}) {
  return (
    <fieldset disabled={locked} className="flex flex-col gap-2.5">
      <legend className="sr-only">Choose an answer</legend>
      {options.map((o) => {
        const status =
          checkedId === o.id
            ? o.correct
              ? 'right'
              : 'wrong'
            : checkedId && revealAnswer && o.correct
              ? 'right'
              : null
        return (
          <label
            key={o.id}
            className={cn(
              'flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-row px-4 py-3.5 text-[15px] leading-6 text-ink in-disabled:cursor-default has-checked:border-fe has-focus-visible:outline-2 has-focus-visible:outline-fe',
              status === 'right' && 'border-success has-checked:border-success',
              status === 'wrong' && 'border-error has-checked:border-error',
            )}
          >
            <input
              type="radio"
              name={name}
              value={o.id}
              checked={selected === o.id}
              onChange={() => onSelect(o.id)}
              className="mt-1 size-4 shrink-0 accent-[#3d5af5]"
            />
            <Prose html={o.html} inline className="min-w-0 flex-1" />
            {status && (
              <span
                className={cn(
                  'shrink-0 text-sm font-semibold',
                  status === 'right' ? 'text-success' : 'text-error',
                )}
              >
                {status === 'right' ? '✓ Right' : '✕ Not this one'}
              </span>
            )}
          </label>
        )
      })}
    </fieldset>
  )
}
