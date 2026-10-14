'use client'

import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

/** How far down the page, in pixels, before the button appears. */
const SHOW_AFTER = 600

/**
 * A round "Back to top" button, bottom right on public pages, once the visitor has scrolled down. It sits
 * where the site assistant's button was; the two shouldn't show together.
 */
export function ScrollToTop() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const update = () => setShown(window.scrollY > SHOW_AFTER)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const toTop = () => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      title="Back to top"
      className={cn(
        'press fixed right-4 bottom-4 z-50 flex size-12 cursor-pointer items-center justify-center rounded-full border border-line-control bg-row text-ink shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-[opacity,translate] duration-200 hover:border-line-strong hover:bg-hover ph:right-6 ph:bottom-6',
        shown ? 'translate-y-0 opacity-100' : 'pointer-events-none invisible translate-y-2 opacity-0',
      )}
    >
      <ArrowUp size={20} strokeWidth={2} aria-hidden="true" />
    </button>
  )
}
