'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

export const SECTIONS = [
  { id: 'set-profile', label: 'Profile' },
  { id: 'set-learning', label: 'Learning' },
  { id: 'set-tutor', label: 'AI tutor' },
  { id: 'set-data', label: 'Data and offline' },
  { id: 'set-plan', label: 'Plan and billing' },
  { id: 'set-privacy', label: 'Privacy' },
]

/** The settings sections down the side, following whichever section is on screen. */
export function SettingsNav() {
  const [current, setCurrent] = useState(SECTIONS[0]!.id)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setCurrent(visible.target.id)
      },
      { rootMargin: '0px 0px -60% 0px' },
    )
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])
  return (
    <nav aria-label="Settings sections" className="sticky top-6 hidden flex-col gap-0.5 text-sm tab:flex">
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-current={current === s.id ? 'true' : undefined}
          className={cn(
            'rounded-xl px-4 py-3 whitespace-nowrap transition-colors',
            current === s.id ? 'bg-hover font-semibold text-ink' : 'text-ink-muted hover:bg-hover hover:text-ink',
          )}
        >
          {s.label}
        </a>
      ))}
    </nav>
  )
}
