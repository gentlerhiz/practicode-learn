'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import { ChevronRight, Icon, Menu, X } from '@/components/ui/icon'
import type { NavItem } from '@/content/navigation'
import { MenuAccountButton } from './account-actions'
import { ThemeToggle } from './theme-toggle'

/**
 * PrismMenuPhone: a button that opens a sheet under the header. Escape or a link closes it, and focus
 * returns to the button. It doesn't trap focus, because the sheet is part of the page, not a dialog.
 */
export function MobileMenu({ items, className, account = true }: { items: NavItem[]; className?: string; account?: boolean }) {
  const [open, setOpen] = useState(false)
  const button = useRef<HTMLButtonElement>(null)
  const sheetId = useId()

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setOpen(false)
      button.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className={className}>
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={sheetId}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
        className="press inline-flex size-[42px] cursor-pointer items-center justify-center rounded-full border border-line-control text-ink hover:border-line-strong hover:bg-hover"
      >
        <Icon as={open ? X : Menu} size={20} />
      </button>
      <div
        id={sheetId}
        hidden={!open}
        className="absolute inset-x-0 top-full z-30 border-y border-line-subtle bg-sheet shadow-[0_32px_48px_rgba(0,0,0,0.55)]"
      >
        <nav aria-label="Main menu" className="flex flex-col px-4 pt-2 pb-6">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex h-14 items-center justify-between border-b border-line-subtle text-[17px] font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {item.label}
              <Icon as={ChevronRight} size={16} className="text-ink-subtle" />
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-6">
            <ThemeToggle variant="row" />
            {account && <MenuAccountButton onNavigate={() => setOpen(false)} />}
          </div>
        </nav>
      </div>
    </div>
  )
}
