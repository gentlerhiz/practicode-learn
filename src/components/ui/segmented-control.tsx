'use client'

import { useRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Icon } from './icon'

type Option<T extends string> = { value: T; label: string; icon?: LucideIcon }

/** A radio group drawn as a pill switch. Arrow keys, Home and End move the selection. */
export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string
  value: T
  options: Option<T>[]
  onChange: (value: T) => void
  className?: string
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const current = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  )

  function select(index: number) {
    const wrapped = (index + options.length) % options.length
    const next = options[wrapped]
    if (!next) return
    onChange(next.value)
    refs.current[wrapped]?.focus()
  }

  function onKeyDown(event: React.KeyboardEvent) {
    const moves: Record<string, number> = {
      ArrowRight: current + 1,
      ArrowDown: current + 1,
      ArrowLeft: current - 1,
      ArrowUp: current - 1,
      Home: 0,
      End: options.length - 1,
    }
    const target = moves[event.key]
    if (target === undefined) return
    event.preventDefault()
    select(target)
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn('inline-flex gap-1 rounded-full border border-line bg-sunken p-1', className)}
    >
      {options.map((option, i) => {
        const checked = i === current
        return (
          <button
            key={option.value}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors',
              checked ? 'bg-primary text-on-primary' : 'text-ink-muted hover:text-ink',
            )}
          >
            {option.icon && <Icon as={option.icon} size={16} />}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
