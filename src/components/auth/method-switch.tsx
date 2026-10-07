'use client'

import { Mail, Smartphone } from 'lucide-react'
import { cn } from '@/lib/cn'

export type SignInMethod = 'email' | 'phone'

/** The canvas's Email / Phone number switch above the sign-in fields. */
export function MethodSwitch({
  label,
  value,
  onChange,
  tall = false,
}: {
  label: string
  value: SignInMethod
  onChange: (method: SignInMethod) => void
  tall?: boolean
}) {
  const options = [
    { id: 'email' as const, text: 'Email', Icon: Mail },
    { id: 'phone' as const, text: 'Phone number', Icon: Smartphone },
  ]
  return (
    <div role="group" aria-label={label} className="flex gap-1 rounded-full border border-line bg-wash p-1">
      {options.map(({ id, text, Icon }) => {
        const on = value === id
        return (
          <button
            key={id}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(id)}
            className={cn(
              'press flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-medium',
              tall ? 'h-[42px]' : 'h-10',
              on ? 'bg-primary text-on-primary' : 'text-ink-soft hover:bg-hover hover:text-ink',
            )}
          >
            <Icon aria-hidden="true" size={16} strokeWidth={1.85} />
            {text}
          </button>
        )
      })}
    </div>
  )
}
