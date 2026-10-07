'use client'
import type { Route } from 'next'
import Link from 'next/link'
import { useId, useState } from 'react'
import { useHasSession } from '@/components/layout/account-actions'
import { LinkButton } from '@/components/ui'
import { inputClasses } from '@/components/ui/field'
import { Glyph } from '@/components/ui/glyph'
import { cn } from '@/lib/cn'

export type SearchEntry = { href: Route; title: string; meta: string }

/** The 404 search (PrismError): filters the tracks and published lessons on the page itself. */
export function NotFoundSearch({ entries }: { entries: SearchEntry[] }) {
  const [query, setQuery] = useState('')
  const id = useId()
  const q = query.trim().toLowerCase()
  const results = q ? entries.filter((e) => `${e.title} ${e.meta}`.toLowerCase().includes(q)).slice(0, 6) : []
  return (
    <div className="flex w-full max-w-[520px] flex-col gap-2 text-left">
      <form role="search" className="relative" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor={id} className="sr-only">
          Search lessons and tracks
        </label>
        <Glyph name="search" size={18} className="pointer-events-none absolute top-[17px] left-5 text-ink-subtle" />
        <input
          id={id}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search lessons and tracks"
          autoComplete="off"
          className={cn(inputClasses, 'rounded-full pl-14')}
        />
      </form>
      {q && (
        <ul aria-live="polite" className="surface flex flex-col overflow-hidden rounded-2xl border border-line">
          {results.length ? (
            results.map((r) => (
              <li key={r.href + r.title} className="border-b border-divider last:border-b-0">
                <Link href={r.href} className="flex flex-col px-5 py-3 hover:bg-hover">
                  <span className="text-[15px] font-semibold text-ink">{r.title}</span>
                  <span className="text-[13px] text-ink-muted">{r.meta}</span>
                </Link>
              </li>
            ))
          ) : (
            <li className="px-5 py-3 text-[15px] text-ink-muted">Nothing matches “{query.trim()}”. Try a track below.</li>
          )}
        </ul>
      )}
    </div>
  )
}

/** Home, and My Dashboard for someone signed in. */
export function NotFoundActions() {
  const signedIn = useHasSession()
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <LinkButton href="/" className="h-12">
        Go to the Home Page
      </LinkButton>
      {signedIn && (
        <LinkButton href={'/home' as Route} variant="secondary" className="h-12 font-medium">
          My Dashboard
        </LinkButton>
      )}
    </div>
  )
}
