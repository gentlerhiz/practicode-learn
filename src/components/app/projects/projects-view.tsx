'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { Glyph } from '@/components/ui/glyph'
import { cn } from '@/lib/cn'

export type ProjectItem = {
  track: 'fe' | 'da'
  module: number
  status: 'active' | 'done' | 'next'
  title: string
  blurb?: string
  passed?: number
  total?: number
  when: string
  next?: string
  href?: Route
}

const T = {
  fe: { label: 'Front-End · Module ', fill: '#3D5AF5', tint: 'var(--pc-fe-text)', soft: 'rgba(77,107,255,0.16)', line: 'rgba(77,107,255,0.40)', btn: '#2D45D8' },
  da: { label: 'Data · Module ', fill: '#0A7D5C', tint: 'var(--pc-da-text)', soft: 'rgba(47,230,176,0.14)', line: 'rgba(47,230,176,0.36)', btn: '#006B47' },
} as const

const FILTERS = [
  { id: 'all', label: 'All tracks' },
  { id: 'fe', label: 'Front-End' },
  { id: 'da', label: 'Data Analysis' },
] as const

function Count({ n }: { n: number }) {
  return <span className="font-sans text-[15px] font-medium text-ink-subtle">{n}</span>
}

const heading = 'font-display text-2xl font-extrabold tracking-[-0.02em] text-ink'

/** PrismProjects: in progress, finished and coming up, filtered by track. */
export function ProjectsView({ items }: { items: ProjectItem[] }) {
  const [pick, setPick] = useState<'all' | 'fe' | 'da'>('all')
  const filters = FILTERS.filter((f) => f.id === 'all' || items.some((i) => i.track === f.id))
  const list = items.filter((p) => pick === 'all' || p.track === pick)
  const active = list.filter((p) => p.status === 'active')
  const done = list.filter((p) => p.status === 'done')
  const upcoming = list.filter((p) => p.status === 'next')

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.035em] text-ink ph:text-[40px] ph:leading-[44px]">
          Projects
        </h1>
        <p className="text-base leading-6 text-ink-muted">
          Real work for your portfolio. Every project has automatic checks, so you know it works before anyone else sees it.
        </p>
      </div>
      {filters.length > 2 && (
        <div role="group" aria-label="Filter by track" className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={pick === f.id}
              onClick={() => setPick(f.id)}
              className={cn(
                'press h-10 cursor-pointer rounded-full border px-4 text-sm font-medium',
                pick === f.id ? 'border-primary bg-primary text-on-primary' : 'border-line-control text-ink-soft hover:border-line-strong hover:bg-hover',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {active.length > 0 && (
        <section aria-label="In progress" className="flex flex-col gap-4">
          <h2 className={heading}>
            In progress <Count n={active.length} />
          </h2>
          <div className="grid grid-cols-1 gap-6 tab:grid-cols-2">
            {active.map((p) => {
              const c = T[p.track]
              return (
                <article
                  key={p.title}
                  className="flex flex-col gap-4 rounded-3xl border p-6"
                  style={{ borderColor: c.line, background: `linear-gradient(160deg, ${c.soft}, var(--pc-sheet) 70%)` }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex h-[26px] items-center rounded-full px-3 text-xs font-semibold" style={{ background: c.soft, color: c.tint }}>
                      {c.label}
                      {p.module}
                    </span>
                    <span className="text-[13px] text-ink-muted">{p.when}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-[22px] leading-7 font-bold text-ink">{p.title}</h3>
                    {p.blurb && <p className="text-sm leading-[22px] text-ink-muted">{p.blurb}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-ink-soft">Checks passing</span>
                      <span className="font-semibold text-ink">
                        {p.passed} of {p.total}
                      </span>
                    </div>
                    <div aria-hidden="true" className="flex gap-1">
                      {Array.from({ length: p.total ?? 0 }, (_, i) => (
                        <span key={i} className="block h-1.5 flex-1 rounded-[3px]" style={{ background: i < (p.passed ?? 0) ? c.fill : 'var(--pc-meter)' }} />
                      ))}
                    </div>
                  </div>
                  {p.next && <p className="text-[13px] leading-5 text-ink-soft">{p.next}</p>}
                  {p.href && (
                    <Link
                      href={p.href}
                      className="press mt-auto inline-flex h-11 items-center gap-2 self-start rounded-full bg-white px-5 text-sm font-semibold hover:bg-white/90"
                      style={{ color: c.btn }}
                    >
                      Continue Project
                      <Glyph name="arrowRight" size={16} />
                    </Link>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      )}

      {done.length > 0 && (
        <section aria-label="Finished" className="flex flex-col gap-4">
          <h2 className={heading}>
            Finished <Count n={done.length} />
          </h2>
          <ul className="flex flex-col gap-3">
            {done.map((p) => {
              const c = T[p.track]
              return (
                <li key={p.title} className="flex items-center gap-4 rounded-[20px] border border-line bg-row px-5 py-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: c.fill }}>
                    <Glyph name="check" size={18} strokeWidth={2.4} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-ink">{p.title}</span>
                    <span className="mt-1 block text-[13px] text-ink-muted">
                      <span style={{ color: c.tint }}>
                        {c.label}
                        {p.module}
                      </span>{' '}
                      · {p.when}
                    </span>
                  </span>
                  {p.href && (
                    <Link href={p.href} className="text-sm font-medium whitespace-nowrap text-ink-soft underline underline-offset-2 hover:text-ink">
                      View
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {upcoming.length > 0 && (
        <section aria-label="Coming up" className="flex flex-col gap-4">
          <h2 className={heading}>
            Coming up <Count n={upcoming.length} />
          </h2>
          <ul className="flex flex-col gap-3">
            {upcoming.map((p) => {
              const c = T[p.track]
              return (
                <li key={p.title} className="flex items-center gap-4 rounded-[20px] border border-dashed border-[var(--pc-line-strong)] px-5 py-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-control text-ink-subtle">
                    <Glyph name="lock" size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-ink-soft">{p.title}</span>
                    <span className="mt-1 block text-[13px] text-ink-subtle">
                      <span style={{ color: c.tint }}>
                        {c.label}
                        {p.module}
                      </span>{' '}
                      · {p.when}
                    </span>
                  </span>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </>
  )
}
