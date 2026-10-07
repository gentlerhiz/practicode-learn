'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Glyph } from '@/components/ui/glyph'
import { cn } from '@/lib/cn'
import { isCurrent, type AppNavItem } from './nav-items'

/** One sidebar row: the canvas's 32 px icon tile, then the label; white tile when it's the current page. */
export function NavRow({ item, onNavigate }: { item: AppNavItem; onNavigate?: () => void }) {
  const current = isCurrent(usePathname(), item.href)
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={current ? 'page' : undefined}
      className={cn(
        'press flex h-12 items-center gap-3 rounded-[14px] px-3 text-[15px]',
        current ? 'bg-hover font-semibold text-ink shadow-[inset_0_0_0_1px_var(--pc-line)]' : 'text-ink-soft hover:bg-hover hover:text-ink',
      )}
    >
      <span
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-[10px]',
          current ? 'bg-primary text-on-primary' : 'bg-control text-ink-soft',
        )}
      >
        <Glyph name={item.icon} size={17} />
      </span>
      {item.label}
      {item.badge ? (
        <span className="ml-auto rounded-full bg-badge px-2 py-0.5 text-xs font-bold text-on-badge">
          {item.badge}
          <span className="sr-only"> cards due</span>
        </span>
      ) : null}
    </Link>
  )
}

export function NavList({ items, onNavigate }: { items: AppNavItem[]; onNavigate?: () => void }) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map((item) => (
        <li key={item.href}>
          <NavRow item={item} onNavigate={onNavigate} />
        </li>
      ))}
    </ul>
  )
}

/** The phone tab bar along the bottom of signed-in pages. */
export function TabBar({ items }: { items: AppNavItem[] }) {
  const pathname = usePathname()
  return (
    <nav
      aria-label="Tabs"
      className="sticky bottom-0 z-10 flex h-[72px] items-center justify-around border-t border-line-subtle bg-sheet lg:hidden"
    >
      {items.map((item) => {
        const current = isCurrent(pathname, item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={current ? 'page' : undefined}
            className={cn(
              'flex min-w-14 flex-col items-center gap-1 text-xs',
              current ? 'font-semibold text-ink' : 'text-ink-muted hover:text-ink',
            )}
          >
            <span
              className={cn(
                'flex h-8 w-12 items-center justify-center rounded-[10px] transition-colors',
                current ? 'bg-primary text-on-primary' : 'hover:bg-hover',
              )}
            >
              <Glyph name={item.icon} size={20} />
            </span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
