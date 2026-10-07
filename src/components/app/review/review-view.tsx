'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { Glyph } from '@/components/ui/glyph'
import { buttonClasses } from '@/components/ui/button'
import { cn } from '@/lib/cn'

export type ReviewCard = { track: 'fe' | 'da'; topic: string; q: string; a: string; code?: string; why: string }

const LOOK = {
  fe: { chip: 'bg-fe text-white', text: 'text-fe-text', border: 'rgba(77,107,255,0.55)', wash: 'rgba(77,107,255,0.20)', tint1: 'rgba(77,107,255,0.22)', tint2: 'rgba(77,107,255,0.10)', glow: 'rgba(77,107,255,0.30)', pip: '#4D6BFF' },
  da: { chip: 'bg-success-fill text-on-success', text: 'text-da-text', border: 'rgba(47,230,176,0.5)', wash: 'rgba(47,230,176,0.16)', tint1: 'rgba(47,230,176,0.20)', tint2: 'rgba(47,230,176,0.09)', glow: 'rgba(47,230,176,0.22)', pip: '#2FE6B0' },
} as const

const RATINGS = [
  { label: 'Again', when: 'in 1 min', className: 'border-[rgba(255,154,162,0.55)] bg-[rgba(255,154,162,0.08)]', note: 'text-error' },
  { label: 'Hard', when: 'in 10 min', className: 'border-[rgba(255,138,61,0.55)] bg-[rgba(255,138,61,0.10)]', note: 'text-badge-text' },
  { label: 'Good', when: 'in 2 days', className: 'border-line-strong bg-hover', note: 'text-ink-soft' },
  { label: 'Easy', when: 'in 6 days', className: 'border-[rgba(47,230,176,0.55)] bg-[rgba(47,230,176,0.10)]', note: 'text-da-text' },
]

const side = 'surface flex flex-col gap-3 rounded-3xl border border-line p-6'

/**
 * PrismReview. With cards, it runs the canvas's flow: think, show the answer, rate it, next. With none,
 * it says why, in the same frame.
 */
export function ReviewView({
  cards,
  empty,
  exitHref,
}: {
  cards: ReviewCard[]
  empty?: { title: string; body: string }
  exitHref: Route
}) {
  const [i, setI] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState(cards.length === 0)
  const card = cards[Math.min(i, cards.length - 1)]
  const look = LOOK[card?.track ?? 'fe']
  const next = () => {
    if (i >= cards.length - 1) {
      setDone(true)
      setRevealed(false)
    } else {
      setI(i + 1)
      setRevealed(false)
    }
  }
  const mix = (['fe', 'da'] as const)
    .map((t) => ({ t, n: cards.filter((c) => c.track === t).length }))
    .filter((m) => m.n > 0)

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[340px] left-1/2 h-[820px] w-[1300px] -translate-x-1/2 opacity-(--pc-glow-opacity)"
        style={{
          background: `radial-gradient(closest-side at 35% 50%, ${look.glow}, rgba(0,0,0,0) 72%), radial-gradient(closest-side at 70% 55%, rgba(123,92,255,0.20), rgba(123,92,255,0) 72%)`,
        }}
      />
      <header className="relative border-b border-line-subtle">
        <div className="mx-auto flex h-[72px] max-w-[1100px] items-center gap-4 px-4 ph:px-6">
          <Link href={exitHref} aria-label="Exit review" className="press flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-ink hover:bg-hover">
            <Glyph name="x" size={18} />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[17px] font-bold text-ink">Daily review</p>
            <p className="text-[13px] text-ink-subtle">
              {cards.length === 0 ? 'Nothing due yet' : done ? 'All done. See you tomorrow.' : `About ${Math.max(1, 4 - i)} min left`}
            </p>
          </div>
          {cards.length > 0 && (
            <div aria-hidden="true" className="flex gap-1">
              {cards.map((c, k) => (
                <span
                  key={k}
                  className="block h-1.5 w-[26px] rounded-[3px]"
                  style={{ background: done || k < i ? LOOK[c.track].pip : k === i ? 'var(--pc-text)' : 'var(--pc-divider)' }}
                />
              ))}
            </div>
          )}
        </div>
      </header>
      <main id="review" className="relative mx-auto box-border max-w-[1100px] px-4 pt-8 pb-16 ph:px-6 ph:pt-12 ph:pb-20">
        <div className="grid grid-cols-1 items-start gap-8 tab:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex flex-col gap-5">
            {!done && card ? (
              <>
                <div className="relative pt-4">
                  <div aria-hidden="true" className="absolute inset-x-[30px] top-0 h-10 rounded-t-[28px]" style={{ background: look.tint2 }} />
                  <div aria-hidden="true" className="absolute inset-x-[15px] top-2 h-10 rounded-t-[28px]" style={{ background: look.tint1 }} />
                  <section
                    aria-live="polite"
                    className="relative box-border flex min-h-[340px] flex-col gap-6 rounded-[28px] border-[1.5px] p-6 ph:p-8"
                    style={{ borderColor: look.border, background: `linear-gradient(170deg, ${look.wash} 0%, var(--pc-sheet) 55%)` }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className={cn('rounded-full px-3 py-1 text-xs font-bold', look.chip)}>{card.topic}</p>
                      <p className="text-xs text-ink-subtle">
                        Card {i + 1} of {cards.length}
                      </p>
                    </div>
                    <h1 className="font-display text-[26px] leading-8 font-extrabold tracking-[-0.03em] text-ink ph:text-[34px] ph:leading-10">{card.q}</h1>
                    {revealed ? (
                      <div className="flex flex-col gap-3 border-t border-line pt-5">
                        <p className={cn('text-xs font-bold', look.text)}>Answer</p>
                        <p className="text-lg leading-[29px] text-ink">{card.a}</p>
                        {card.code && (
                          <p className={cn('rounded-xl border border-divider bg-sunken px-4 py-3 font-mono text-[13px]', look.text)}>{card.code}</p>
                        )}
                      </div>
                    ) : (
                      <p className="mt-auto text-sm text-ink-subtle">Say your answer out loud or in your head first. Then check.</p>
                    )}
                  </section>
                </div>
                {revealed ? (
                  <div className="flex flex-col gap-3">
                    <p className="text-center text-sm text-ink-muted">How well did you remember it?</p>
                    <div role="group" aria-label="Rate your answer" className="grid grid-cols-2 gap-3 ph:grid-cols-4">
                      {RATINGS.map((r) => (
                        <button
                          key={r.label}
                          type="button"
                          onClick={next}
                          className={cn('press flex h-[68px] cursor-pointer flex-col items-center justify-center gap-0.5 rounded-[20px] border-[1.5px] text-ink hover:brightness-110', r.className)}
                        >
                          <span className="font-display text-[17px] font-bold">{r.label}</span>
                          <span className={cn('text-xs', r.note)}>{r.when}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => setRevealed(true)} className={buttonClasses({ size: 'lg' }, 'h-14 w-full')}>
                    Show the Answer
                  </button>
                )}
              </>
            ) : (
              <section className="relative flex flex-col items-center gap-4 overflow-hidden rounded-[28px] border border-line bg-sunken px-6 py-12 text-center ph:px-8">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-(--pc-glow-opacity)"
                  style={{
                    background:
                      'radial-gradient(closest-side at 20% 20%, rgba(77,107,255,0.30), rgba(77,107,255,0) 70%), radial-gradient(closest-side at 80% 25%, rgba(240,64,127,0.24), rgba(240,64,127,0) 70%), radial-gradient(closest-side at 50% 90%, rgba(47,230,176,0.22), rgba(47,230,176,0) 70%)',
                  }}
                />
                <span aria-hidden="true" className="relative flex gap-1.5">
                  <span className="block h-[54px] w-[18px] -rotate-[8deg] rounded-[9px] bg-[#4d6bff]" />
                  <span className="block h-[54px] w-[18px] rounded-[9px] bg-[#2fe6b0]" />
                  <span className="block h-[54px] w-[18px] rotate-[8deg] rounded-[9px] bg-[#f0407f]" />
                </span>
                <h1 className="relative font-display text-[30px] leading-9 font-extrabold tracking-[-0.035em] text-ink ph:text-[40px] ph:leading-[44px]">
                  {cards.length ? 'Done for today' : (empty?.title ?? 'Nothing to review yet')}
                </h1>
                <p className="relative max-w-[440px] text-base leading-[26px] text-ink-muted">
                  {cards.length
                    ? `${cards.length} cards in about three minutes. You’ll see the tricky ones again tomorrow, and the easy ones not for a while.`
                    : empty?.body}
                </p>
                <div className="relative mt-1.5 flex flex-wrap justify-center gap-3">
                  <Link href={exitHref} className={buttonClasses({}, 'h-12 px-6')}>
                    Back to Home
                  </Link>
                  {cards.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setI(0)
                        setDone(false)
                      }}
                      className={buttonClasses({ variant: 'secondary' }, 'h-12 bg-transparent px-6 font-medium')}
                    >
                      Review Again
                    </button>
                  )}
                </div>
              </section>
            )}
          </div>
          <aside className="flex flex-col gap-4">
            <section className={side}>
              <h2 className="font-display text-[17px] font-bold text-ink">Why am I seeing this card?</h2>
              <p className="text-sm leading-[22px] text-ink-muted">
                {card && !done ? card.why : 'Cards come from the lessons you finish, and each one returns just before you’d forget it.'}
              </p>
            </section>
            <section className={side}>
              <h2 className="font-display text-[17px] font-bold text-ink">Today’s mix</h2>
              {mix.length ? (
                <ul className="flex flex-col gap-3 text-sm">
                  {mix.map((m) => (
                    <li key={m.t} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-3 text-ink">
                        <span className="block size-2.5 rounded-[3px]" style={{ background: LOOK[m.t].pip }} />
                        {m.t === 'fe' ? 'Front-End' : 'Data Analysis'}
                      </span>
                      <span className="text-ink-subtle">{m.n === 1 ? '1 card' : `${m.n} cards`}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-subtle">No cards yet.</p>
              )}
              <p className="text-[13px] leading-5 text-ink-subtle">
                Each card comes back just before you’d forget it. Get it right and the gap grows: a day, then four, then weeks.
                Scheduling by FSRS, the open-source method Anki uses.
              </p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}
