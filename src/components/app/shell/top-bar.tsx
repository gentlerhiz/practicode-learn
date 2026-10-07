'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { LogoIcon } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { TutorSpark } from '@/components/learn/tutor-spark'
import { Glyph } from '@/components/ui/glyph'
import { cn } from '@/lib/cn'
import { NavList } from './app-nav'
import type { AppNavItem } from './nav-items'

export type SearchEntry = { label: string; meta: string; href: Route }

type ShellValue = {
  entries: SearchEntry[]
  menuItems: AppNavItem[]
  account: React.ReactNode
  initials: string
}
const ShellContext = createContext<ShellValue>({ entries: [], menuItems: [], account: null, initials: '' })

/** Set by AppShell, so a page's top bar knows the learner and the menu. */
export function ShellProvider({ value, children }: { value: ShellValue; children: React.ReactNode }) {
  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>
}

/** Closes a popover on Escape or a click outside it. */
function useDismiss(open: boolean, close: () => void, ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    const onClick = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && close()
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open, close, ref])
}

const roundButton =
  'press flex size-[42px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-line text-ink hover:border-line-strong hover:bg-hover'
const popover =
  'absolute top-[calc(100%+12px)] right-0 z-40 flex w-[340px] max-w-[calc(100vw-32px)] flex-col gap-0.5 rounded-[20px] border border-line bg-[var(--pc-surface-row)] p-2 shadow-[0_24px_48px_rgba(0,0,0,0.5)]'

/** "What do you want to learn today?": finds a module or lesson of the open track. */
function Search({ entries }: { entries: SearchEntry[] }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const listId = useId()
  useDismiss(open, () => setOpen(false), box)
  const q = query.trim().toLowerCase()
  const results = q ? entries.filter((e) => `${e.label} ${e.meta}`.toLowerCase().includes(q)).slice(0, 6) : []
  return (
    <div ref={box} className="relative max-w-[440px] flex-1">
      <label htmlFor="app-search" className="sr-only">
        Search
      </label>
      <Glyph
        name="search"
        size={18}
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-subtle"
      />
      <input
        id="app-search"
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && results[0]) router.push(results[0].href)
        }}
        placeholder="What do you want to learn today?"
        role="combobox"
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={open && q.length > 0}
        className="h-11 w-full rounded-full border border-line bg-sunken pr-4 pl-12 text-sm text-ink transition-[border-color,box-shadow] placeholder:text-ink-subtle hover:border-line-control focus:border-focus focus:shadow-[0_0_0_3px_rgba(77,107,255,0.25)] focus:outline-none"
      />
      {open && q && (
        <div id={listId} className={cn(popover, 'right-auto left-0 w-full')}>
          {results.length ? (
            results.map((r) => (
              <Link
                key={`${r.href}-${r.label}`}
                href={r.href}
                onClick={() => setOpen(false)}
                className="flex flex-col rounded-[14px] px-3 py-2.5 hover:bg-hover"
              >
                <span className="text-sm font-semibold text-ink">{r.label}</span>
                <span className="text-[13px] text-ink-muted">{r.meta}</span>
              </Link>
            ))
          ) : (
            <p className="px-3 py-2.5 text-sm text-ink-muted">Nothing matches “{query.trim()}” yet.</p>
          )}
        </div>
      )}
    </div>
  )
}

/** How many lesson pages the service worker has saved for offline use. */
function useSavedLessons() {
  const [count, setCount] = useState<number | null>(null)
  useEffect(() => {
    if (!('caches' in window)) return
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names.filter((n) => n.startsWith('pc-pages')).map((n) => caches.open(n).then((c) => c.keys())),
        ),
      )
      .then((lists) =>
        setCount(lists.flat().filter((req) => new URL(req.url).pathname.startsWith('/learn/')).length),
      )
      .catch(() => setCount(null))
  }, [])
  return count
}

function Popover({
  label,
  trigger,
  children,
}: {
  label: string
  trigger: (props: { open: boolean; toggle: () => void; id: string }) => React.ReactNode
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  useDismiss(open, () => setOpen(false), ref)
  return (
    <div ref={ref} className="relative">
      {trigger({ open, toggle: () => setOpen((v) => !v), id })}
      {open && (
        <div id={id} role="region" aria-label={label} className={popover}>
          {children}
        </div>
      )}
    </div>
  )
}

const noop = () => () => {}

/** The signed-in top bar (PrismDashboard): search, offline status, Ask AI, notifications and, on phones, the menu. */
export function TopBar({ variant = 'compact' }: { variant?: 'full' | 'compact' }) {
  const { entries, menuItems, account, initials } = useContext(ShellContext)
  const full = variant === 'full'
  const saved = useSavedLessons()
  const [menu, setMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useDismiss(menu, () => setMenu(false), menuRef)
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )

  return (
    <div
      ref={menuRef}
      className={cn(
        'relative flex items-center gap-4 border-b border-line-subtle px-4',
        full ? 'h-16 lg:h-[74px] lg:px-8' : 'h-16 lg:hidden',
      )}
    >
      <Link href={'/home' as Route} aria-label="PractiCode Learn home" className="lg:hidden">
        <LogoIcon className="h-6 w-7" />
      </Link>
      {full && (
        <div className="hidden flex-1 sm:flex">
          <Search entries={entries} />
        </div>
      )}
      <div className="ml-auto flex items-center gap-2">
        {!full && (
          <Link
            href={'/settings' as Route}
            aria-label="Your settings"
            className="flex size-9 items-center justify-center rounded-xl bg-badge text-[13px] font-bold text-on-badge"
          >
            {initials}
          </Link>
        )}
        {full && hydrated && saved ? (
          <p className="hidden h-10 items-center gap-2 rounded-full border border-line px-4 text-[13px] text-ink-soft ph:flex">
            <span className="block size-2 rounded-full bg-success-fill shadow-[0_0_8px_#2fe6b0]" />
            {saved === 1 ? '1 lesson saved offline' : `${saved} lessons saved offline`}
          </p>
        ) : null}
        {full && (
          <>
            <Popover
              label="Ask AI"
              trigger={({ open, toggle, id }) => (
                <button
                  type="button"
                  onClick={toggle}
                  aria-expanded={open}
                  aria-controls={id}
                  className="flex h-[42px] press cursor-pointer items-center gap-2 rounded-full border border-line pr-4 pl-1.5 text-sm font-medium text-ink hover:border-line-strong hover:bg-hover"
                >
                  <TutorSpark size={30} />
                  Ask AI
                </button>
              )}
            >
              <div className="flex gap-3 p-3">
                <TutorSpark size={36} />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-ink">Your AI tutor is coming soon</p>
                  <p className="text-[13px] leading-5 text-ink-muted">
                    It will sit beside every lesson, give hints first and link each answer to the lesson it’s
                    based on. Until then, every step has three hints built in.
                  </p>
                </div>
              </div>
            </Popover>
            <Popover
              label="Notifications"
              trigger={({ open, toggle, id }) => (
                <button
                  type="button"
                  onClick={toggle}
                  aria-expanded={open}
                  aria-controls={id}
                  aria-label="Notifications"
                  className={roundButton}
                >
                  <Glyph name="bell" size={20} />
                </button>
              )}
            >
              <p className="px-3 pt-2 pb-1 text-[13px] font-semibold text-ink-muted">Notifications</p>
              <div className="flex items-start gap-3 rounded-[14px] p-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-control text-ink-soft">
                  <Glyph name="check" size={18} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">You’re all caught up</span>
                  <span className="block text-[13px] text-ink-muted">
                    Reviews and project results will show up here.
                  </span>
                </span>
              </div>
            </Popover>
          </>
        )}
        <button
          type="button"
          onClick={() => setMenu((v) => !v)}
          aria-expanded={menu}
          aria-controls="app-menu"
          aria-label={menu ? 'Close menu' : 'Open menu'}
          className={cn(roundButton, 'border-line-control lg:hidden')}
        >
          <Glyph name={menu ? 'close' : 'menu'} size={20} />
        </button>
      </div>
      {menu && (
        <div
          id="app-menu"
          className="absolute inset-x-0 top-full z-30 border-b border-line-subtle bg-sheet shadow-[0_32px_48px_rgba(0,0,0,0.55)] lg:hidden"
        >
          <nav aria-label="Main menu" className="flex flex-col gap-3 px-4 pt-3 pb-5">
            <NavList items={menuItems} onNavigate={() => setMenu(false)} />
            <div className="flex flex-col gap-3 border-t border-line-subtle pt-4">
              <ThemeToggle variant="row" />
              {account}
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
