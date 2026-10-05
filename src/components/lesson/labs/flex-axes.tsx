'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const DESCRIPTION = [
  'A flex row. The main axis runs left to right and is highlighted.',
  'The same row. The cross axis runs top to bottom and is highlighted; the items stretch to fill it.',
  'The row with align-items: center. The items line up along the middle of the cross axis.',
  'A flex column. Now the main axis runs top to bottom and is highlighted.',
  'The column with align-items: center. The items line up along the middle, left to right.',
]

function Arrow({ direction, label, hot }: { direction: 'h' | 'v'; label: string; hot: boolean }) {
  const horizontal = direction === 'h'
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute flex items-center gap-1.5 text-[11px] font-semibold motion-safe:transition-opacity motion-safe:duration-250',
        horizontal ? 'top-1.5 right-4 left-9' : 'top-7 bottom-4 left-2 flex-col',
        hot ? 'text-fe-text' : 'text-ink-subtle',
      )}
    >
      <em
        className={cn('whitespace-nowrap not-italic', !horizontal && 'rotate-180 [writing-mode:vertical-rl]')}
      >
        {label}
      </em>
      <i className={cn('relative block bg-current', horizontal ? 'h-0.5 flex-1' : 'w-0.5 flex-1')}>
        <span
          className={cn(
            'absolute border-transparent',
            horizontal
              ? '-top-1 -right-0.5 border-y-[5px] border-l-[7px] border-l-current'
              : '-bottom-0.5 -left-1 border-x-[5px] border-t-[7px] border-t-current',
          )}
        />
      </i>
    </div>
  )
}

/** A navigation bar as a flex row, then a column, with its two axes (Diagram lab, 5 states). */
export function FlexAxes({ state = 0 }: LabProps) {
  const at = Math.min(Math.max(state, 0), 4)
  const column = at >= 3
  const align = at === 2 || at === 4 ? 'center' : 'stretch'
  const mainHot = at === 0 || at === 3 || at === 4
  const crossHot = at === 1 || at === 2 || at === 4
  const main = 'main axis · justify-content'
  const cross = 'cross axis · align-items'
  // In a column the main axis is vertical and the cross axis horizontal, so the labels trade places.
  return (
    <figure className="m-0">
      <div
        role="img"
        aria-label={`${column ? 'A flex column' : 'A flex row'} with align-items: ${align}`}
        className={cn(
          'relative flex justify-between gap-2.5 rounded-xl border border-line-subtle bg-row pt-7 pr-4 pb-4 pl-9',
          column ? 'h-[250px] flex-col' : 'h-[200px]',
        )}
        style={{ alignItems: align }}
      >
        <Arrow direction="h" label={column ? cross : main} hot={column ? crossHot : mainHot} />
        <Arrow direction="v" label={column ? main : cross} hot={column ? mainHot : crossHot} />
        {['MN', 'Menu', 'Find us', 'Order'].map((label, i) => (
          <span
            key={label}
            className={cn(
              'flex items-center justify-center rounded-lg bg-fe px-3 py-1.5 text-[13px] font-semibold text-white',
              i === 0 && 'font-display text-[22px]',
            )}
          >
            {label}
          </span>
        ))}
      </div>
      <p className="mt-2.5 font-mono text-[13px] text-ink-muted">
        .nav {'{'} display: flex;{column ? ' flex-direction: column;' : ''} align-items: {align}; {'}'}
      </p>
      <figcaption className="sr-only">{DESCRIPTION[at]}</figcaption>
    </figure>
  )
}
