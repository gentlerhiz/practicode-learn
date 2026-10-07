'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { Soon } from '@/components/app/settings/parts'
import { TutorSpark } from '@/components/learn/tutor-spark'
import { buttonClasses } from '@/components/ui/button'
import { Glyph } from '@/components/ui/glyph'
import { cn } from '@/lib/cn'

type Track = 'fe' | 'da' | 'ux' | 'ai'
export type Thread = { track: Track; initials: string; title: string; replies: string; when: string; answer?: string; href?: Route }

const T: Record<Track, { label: string; tint: string; soft: string }> = {
  fe: { label: 'Front-End', tint: 'var(--pc-fe-text)', soft: 'rgba(77,107,255,0.16)' },
  da: { label: 'Data Analysis', tint: 'var(--pc-da-text)', soft: 'rgba(47,230,176,0.14)' },
  ux: { label: 'UI/UX Design', tint: 'var(--pc-ux-text)', soft: 'rgba(240,64,127,0.14)' },
  ai: { label: 'AI & ML', tint: 'var(--pc-ai-text)', soft: 'rgba(123,92,255,0.16)' },
}
const FILTERS: [Track | 'all', string][] = [
  ['all', 'Everything'],
  ['fe', 'Front-End'],
  ['da', 'Data'],
  ['ux', 'Design'],
  ['ai', 'AI & ML'],
]
const RULES = ['Be kind. Everyone here is learning.', 'Share hints, not full project answers.', 'Keep it on topic and keep personal details private.']

/** PrismCommunity. Without a forum yet, the list says so and asking is marked Soon. */
export function CommunityView({ threads, open }: { threads: Thread[]; open: boolean }) {
  const [filter, setFilter] = useState<Track | 'all'>('all')
  const list = threads.filter((t) => filter === 'all' || t.track === filter)
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.035em] text-ink ph:text-[40px] ph:leading-[44px]">
            Community
            {!open && <Soon />}
          </h1>
          <p className="text-base leading-6 text-ink-muted">Ask questions, share your work and help each other.</p>
        </div>
        <button type="button" disabled={!open} className={buttonClasses({}, 'h-12 px-5')}>
          <Glyph name="people" size={18} />
          Ask a Question
        </button>
      </div>
      <div className="grid grid-cols-1 items-start gap-6 tab:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-4">
          <div role="group" aria-label="Filter by track" className="flex flex-wrap gap-2">
            {FILTERS.map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={filter === id}
                onClick={() => setFilter(id)}
                className={cn(
                  'press h-10 cursor-pointer rounded-full border px-4 text-sm',
                  filter === id ? 'border-primary bg-primary text-on-primary' : 'border-line-control text-ink-soft hover:border-line-strong hover:bg-hover',
                )}
              >
                {label}
              </button>
            ))}
          </div>
          {list.length ? (
            <ul className="flex flex-col gap-3">
              {list.map((t) => {
                const body = (
                  <>
                    <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-control text-[13px] font-bold text-ink-soft">
                      {t.initials}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-2">
                      <span className="text-base leading-6 font-semibold text-ink">{t.title}</span>
                      <span className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-ink-muted">
                        <span className="inline-flex h-6 items-center rounded-full px-3 text-xs font-semibold" style={{ background: T[t.track].soft, color: T[t.track].tint }}>
                          {T[t.track].label}
                        </span>
                        <span>{t.replies}</span>
                        <span>{t.when}</span>
                        {t.answer && (
                          <span className="inline-flex items-center gap-1 text-success">
                            <Glyph name="check" size={14} strokeWidth={2.4} />
                            {t.answer}
                          </span>
                        )}
                      </span>
                    </span>
                  </>
                )
                const box = 'flex items-start gap-4 rounded-[20px] border border-line bg-row p-5'
                return (
                  <li key={t.title}>
                    {t.href ? (
                      <Link href={t.href} className={cn(box, 'transition-colors hover:border-line-strong hover:bg-hover')}>
                        {body}
                      </Link>
                    ) : (
                      <div className={box}>{body}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-start gap-3 rounded-[20px] border border-dashed border-[var(--pc-line-strong)] p-6">
              <p className="font-display text-lg font-bold text-ink">The forum opens soon</p>
              <p className="text-sm leading-[22px] text-ink-muted">
                You’ll be able to ask questions, share your projects and find study buddies here. Until then, stuck learners can email
                us and a person will help.
              </p>
              <a href="mailto:practicodeacademy@gmail.com" className={buttonClasses({ variant: 'secondary' }, 'bg-transparent font-medium')}>
                Email Us
              </a>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 tab:sticky tab:top-6">
          <div className="surface flex flex-col gap-4 rounded-3xl border border-line p-6">
            <div className="flex items-center gap-3">
              <TutorSpark size={36} />
              <h3 className="font-display text-xl leading-[26px] font-bold text-ink">Stuck on a lesson?</h3>
            </div>
            <p className="text-sm leading-[22px] text-ink-muted">
              The AI tutor answers in seconds and knows your code. Use the community for ideas, feedback and study buddies.
            </p>
            <Link href={'/my-tracks' as Route} className="text-sm font-medium text-ai-text underline underline-offset-2 hover:no-underline">
              {open ? 'Open the tutor →' : 'Every lesson has three hints →'}
            </Link>
          </div>
          <div className="surface flex flex-col gap-4 rounded-3xl border border-line p-6">
            <h3 className="font-display text-xl leading-[26px] font-bold text-ink">House rules</h3>
            <ul className="flex flex-col gap-2 text-sm leading-6 text-ink-soft">
              {RULES.map((r) => (
                <li key={r} className="flex gap-3">
                  <Glyph name="check" size={18} className="mt-0.5 shrink-0 text-success" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
            <Link href={'/legal/terms' as Route} className="text-sm text-ink-soft underline underline-offset-2 hover:text-ink">
              Read the full guidelines
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
