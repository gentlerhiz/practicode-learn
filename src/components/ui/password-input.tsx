'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import { buttonClasses } from './button'
import { inputClasses } from './field'

/** A password field with the canvas's Show and Hide button inside it. */
export function PasswordInput({ className, ...props }: Omit<React.ComponentProps<'input'>, 'type'>) {
  const [shown, setShown] = useState(false)
  return (
    <div className="relative">
      <input type={shown ? 'text' : 'password'} className={cn(inputClasses, 'pr-24', className)} {...props} />
      <button
        type="button"
        aria-pressed={shown}
        aria-label={shown ? 'Hide password' : 'Show password'}
        onClick={() => setShown((s) => !s)}
        className={buttonClasses({ variant: 'quiet', size: 'sm' }, 'absolute top-2 right-2 h-9 px-3 text-[13px] font-medium')}
      >
        {shown ? 'Hide' : 'Show'}
      </button>
    </div>
  )
}
