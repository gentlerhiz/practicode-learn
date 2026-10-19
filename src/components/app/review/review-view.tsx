'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { rateCard } from '@/app/(focus)/review/actions'
import { buttonClasses } from '@/components/ui/button'
import { Glyph } from '@/components/ui/glyph'
import { findCourse, toneOf } from '@/content/catalogue'
import { cn } from '@/lib/cn'
import type { ReviewSummary, SessionCard } from '@/lib/review/load'

const LOOK = {
  fe: {
    chip: 'bg-fe text-white',
    text: 'text-fe-text',
    border: 'rgba(77,107,255,0.55)',
    wash: 'rgba(77,107,255,0.20)',
    tint1: 'rgba(77,107,255,0.22)',
    tint2: 'rgba(77,107,255,0.10)',
    glow: 'rgba(77,107,255,0.30)',
    pip: '#4D6BFF',
  },
  da: {
    chip: 'bg-success-fill text-on-success',
    text: 'text-da-text',
    border: 'rgba(47,230,176,0.5)',
    wash: 'rgba(47,230,176,0.16)',
    tint1: 'rgba(47,230,176,0.20)',
    tint2: 'rgba(47,230,176,0.09)',
    glow: 'rgba(47,230,176,0.22)',
    pip: '#2FE6B0',
  },
  it: {
    chip: 'bg-it text-white',
    text: 'text-it-text',
    border: 'rgba(255,170,60,0.55)',
    wash: 'rgba(255,170,60,0.18)',
    tint1: 'rgba(255,170,60,0.22)',
    tint2: 'rgba(255,170,60,0.10)',
    glow: 'rgba(255,170,60,0.26)',
    pip: '#FFAA3C',
  },
  cy: {
    chip: 'bg-cy text-white',
    text: 'text-cy-text',
    border: 'rgba(34,190,230,0.55)',
    wash: 'rgba(34,190,230,0.18)',
    tint1: 'rgba(34,190,230,0.22)',
    tint2: 'rgba(34,190,230,0.10)',
    glow: 'rgba(34,190,230,0.26)',
    pip: '#22BEE6',
  },
} as const
const look = (track?: string) => {
  const tone = track ? toneOf(findCourse(track) ?? { subject: 'software' }) : 'fe'
  return tone === 'da' || tone === 'it' || tone === 'cy' ? LOOK[tone] : LOOK.fe
}

const RATINGS = [
  {
    label: 'Again',
    className: 'border-[rgba(255,154,162,0.55)] bg-[rgba(255,154,162,0.08)]',
    note: 'text-error',
  },
  {
    label: 'Hard',
    className: 'border-[rgba(255,138,61,0.55)] bg-[rgba(255,138,61,0.10)]',
    note: 'text-badge-text',
  },
  { label: 'Good', className: 'border-line-strong bg-hover', note: 'text-ink-soft' },
  {
    label: 'Easy',
    className: 'border-[rgba(47,230,176,0.55)] bg-[rgba(47,230,176,0.10)]',
    note: 'text-da-text',
  },
] as const

const side = 'surface flex flex-col gap-3 rounded-3xl border border-line p-6'

/**
 * PrismReview: think of the answer, show it, rate how well you remembered, next. Each rating is saved as
 * it's made, and FSRS decides when the card comes back. With no cards, it says why, in the same frame.
 */
export function ReviewView({
  cards,
  summary,
  course,
  empty,
  exitHref,
}: {
  cards: SessionCard[]
  summary: ReviewSummary
  /** The course this session is limited to, if any. */
  course: string | null
  empty?: { title: string; body: string }
  exitHref: Route
}) {
  const [i, setI] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState(cards.length === 0)
  const [forgot, setForgot] = useState<SessionCard | null>(null)
  const [failed, setFailed] = useState(false)
  const [, startSaving] = useTransition()
  const card = cards[Math.min(i, cards.length - 1)]
  const style = look(card?.track)

  const answer = (rating: 1 | 2 | 3 | 4) => {
    if (!card) return
    startSaving(async () => {
      const { ok } = await rateCard({ cardId: card.id, rating })
      if (!ok) setFailed(true)
    })
    setForgot(rating === 1 ? card : null)
    setRevealed(false)
    if (i >= cards.length - 1) setDone(true)
    else setI(i + 1)
  }

  const filters = summary.courses.length > 1

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[340px] left-1/2 h-[820px] w-[1300px] -translate-x-1/2 opacity-(--pc-glow-opacity)"
        style={{
          background: `radial-gradient(closest-side at 35% 50%, ${style.glow}, rgba(0,0,0,0) 72%), radial-gradient(closest-side at 70% 55%, rgba(123,92,255,0.20), rgba(123,92,255,0) 72%)`,
        }}
      />
      <header className="relative border-b border-line-subtle">
        <div className="mx-auto flex h-[72px] max-w-[1100px] items-center gap-4 px-4 ph:px-6">
          <Link
            href={exitHref}
            aria-label="Exit review"
            className="flex size-11 shrink-0 press items-center justify-center rounded-full border border-line text-ink hover:bg-hover"
          >
            <Glyph name="x" size={18} />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[17px] font-bold text-ink">Daily review</p>
            <p className="text-[13px] text-ink-subtle">
              {cards.length === 0
                ? 'Nothing due yet'
                : done
                  ? 'All done. See you tomorrow.'
                  : `About ${Math.max(1, Math.ceil(((cards.length - i) * 12) / 60))} min left`}
            </p>
          </div>
          {cards.length > 0 && (
            <div aria-hidden="true" className="hidden gap-1 ph:flex">
              {cards.map((c, k) => (
                <span
                  key={c.id}
                  className="block h-1.5 w-[14px] rounded-[3px] tab:w-[20px]"
                  style={{
                    background:
                      done || k < i ? look(c.track).pip : k === i ? 'var(--pc-text)' : 'var(--pc-divider)',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </header>
      <main
        id="review"
        className="relative mx-auto box-border max-w-[1100px] px-4 pt-8 pb-16 ph:px-6 ph:pt-12 ph:pb-20"
      >
        <div className="grid grid-cols-1 items-start gap-8 tab:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex flex-col gap-5">
            {failed && (
              <p role="alert" className="rounded-xl border border-line bg-row px-4 py-3 text-sm text-ink">
                A rating didn’t save, so that card may come back sooner. Check your connection.
              </p>
            )}
            {forgot && !done && (
              <p
                role="status"
                className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-line bg-row px-4 py-3 text-sm text-ink-muted"
              >
                That one comes back in a minute.
                <Link
                  href={forgot.lessonHref}
                  className="font-semibold text-fe-text underline underline-offset-2 hover:no-underline"
                >
                  See it in {forgot.lesson}
                </Link>
              </p>
            )}
            {!done && card ? (
              <>
                <div className="relative pt-4">
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-[30px] top-0 h-10 rounded-t-[28px]"
                    style={{ background: style.tint2 }}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-[15px] top-2 h-10 rounded-t-[28px]"
                    style={{ background: style.tint1 }}
                  />
                  <section
                    aria-live="polite"
                    className="relative box-border flex min-h-[340px] flex-col gap-6 rounded-[28px] border-[1.5px] p-6 ph:p-8"
                    style={{
                      borderColor: style.border,
                      background: `linear-gradient(170deg, ${style.wash} 0%, var(--pc-sheet) 55%)`,
                    }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className={cn('rounded-full px-3 py-1 text-xs font-bold', style.chip)}>
                        {card.trackTitle}
                      </p>
                      <p className="text-xs text-ink-subtle">
                        Card {i + 1} of {cards.length}
                      </p>
                    </div>
                    <h1
                      className="font-display text-[24px] leading-8 font-extrabold tracking-[-0.03em] text-ink ph:text-[32px] ph:leading-10 [&_code]:font-mono [&_code]:text-[0.85em]"
                      dangerouslySetInnerHTML={{ __html: card.front }}
                    />
                    {revealed ? (
                      <div className="flex flex-col gap-3 border-t border-line pt-5">
                        <p className={cn('text-xs font-bold', style.text)}>Answer</p>
                        <p
                          className="text-lg leading-[29px] text-ink [&_code]:rounded [&_code]:bg-sunken [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.9em]"
                          dangerouslySetInnerHTML={{ __html: card.back }}
                        />
                      </div>
                    ) : (
                      <p className="mt-auto text-sm text-ink-subtle">
                        Say your answer out loud or in your head first. Then check.
                      </p>
                    )}
                  </section>
                </div>
                {revealed ? (
                  <div className="flex flex-col gap-3">
                    <p className="text-center text-sm text-ink-muted">How well did you remember it?</p>
                    <div
                      role="group"
                      aria-label="Rate your answer"
                      className="grid grid-cols-2 gap-3 ph:grid-cols-4"
                    >
                      {RATINGS.map((r, k) => (
                        <button
                          key={r.label}
                          type="button"
                          onClick={() => answer((k + 1) as 1 | 2 | 3 | 4)}
                          className={cn(
                            'flex h-[68px] press cursor-pointer flex-col items-center justify-center gap-0.5 rounded-[20px] border-[1.5px] text-ink hover:brightness-110',
                            r.className,
                          )}
                        >
                          <span className="font-display text-[17px] font-bold">{r.label}</span>
                          <span className={cn('text-xs', r.note)}>{card.next[k]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setRevealed(true)}
                    className={buttonClasses({ size: 'lg' }, 'h-14 w-full')}
                  >
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
                      'radial-gradient(closest-side at 20% 20%, rgba(77,107,255,0.30), rgba(77,107,255,0) 70%), radial-gradient(closest-side at 80% 25%, rgba(123,92,255,0.24), rgba(123,92,255,0) 70%), radial-gradient(closest-side at 50% 90%, rgba(47,230,176,0.22), rgba(47,230,176,0) 70%)',
                  }}
                />
                <span aria-hidden="true" className="relative flex gap-1.5">
                  <span className="block h-[54px] w-[18px] -rotate-[8deg] rounded-[9px] bg-[#4d6bff]" />
                  <span className="block h-[54px] w-[18px] rounded-[9px] bg-[#2fe6b0]" />
                  <span className="block h-[54px] w-[18px] rotate-[8deg] rounded-[9px] bg-[#7b5cff]" />
                </span>
                <h1 className="relative font-display text-[30px] leading-9 font-extrabold tracking-[-0.035em] text-ink ph:text-[40px] ph:leading-[44px]">
                  {cards.length ? 'Done for today' : (empty?.title ?? 'Nothing to review yet')}
                </h1>
                <p className="relative max-w-[440px] text-base leading-[26px] text-ink-muted">
                  {cards.length
                    ? `${cards.length} ${cards.length === 1 ? 'card' : 'cards'} reviewed. You’ll see the tricky ones again soon, and the easy ones not for a while.`
                    : empty?.body}
                </p>
                {forgot && (
                  <Link
                    href={forgot.lessonHref}
                    className="relative text-sm font-semibold text-fe-text underline underline-offset-2 hover:no-underline"
                  >
                    See the last card again in {forgot.lesson}
                  </Link>
                )}
                <div className="relative mt-1.5 flex flex-wrap justify-center gap-3">
                  <Link href={exitHref} className={buttonClasses({}, 'h-12 px-6')}>
                    Back to Home
                  </Link>
                </div>
              </section>
            )}
          </div>
          <aside className="flex flex-col gap-4">
            <section className={side}>
              <h2 className="font-display text-[17px] font-bold text-ink">Why am I seeing this card?</h2>
              <p className="text-sm leading-[22px] text-ink-muted">
                {card && !done
                  ? `It’s from ${card.lesson}. Cards come back just before you’d forget them, so a few minutes a day keeps everything you’ve learned.`
                  : 'Cards come from the lessons you finish, and each one returns just before you’d forget it.'}
              </p>
            </section>
            <section className={side}>
              <h2 className="font-display text-[17px] font-bold text-ink">Today’s mix</h2>
              {summary.courses.length ? (
                <ul className="flex flex-col gap-1 text-sm">
                  {filters && (
                    <li>
                      <Link
                        href={'/review' as Route}
                        aria-current={course === null ? 'page' : undefined}
                        className={cn(
                          'flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-hover',
                          course === null && 'bg-hover font-semibold',
                        )}
                      >
                        <span className="text-ink">All courses</span>
                        <span className="text-ink-subtle">{summary.due} due</span>
                      </Link>
                    </li>
                  )}
                  {summary.courses.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={(filters ? `/review?course=${c.slug}` : '/review') as Route}
                        aria-current={course === c.slug ? 'page' : undefined}
                        className={cn(
                          'flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-hover',
                          course === c.slug && 'bg-hover font-semibold',
                        )}
                      >
                        <span className="flex items-center gap-3 text-ink">
                          <span
                            className="block size-2.5 rounded-[3px]"
                            style={{ background: look(c.slug).pip }}
                          />
                          {c.title}
                        </span>
                        <span className="text-ink-subtle">{c.due === 1 ? '1 card' : `${c.due} cards`}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-subtle">No cards yet.</p>
              )}
              <p className="text-[13px] leading-5 text-ink-subtle">
                {summary.daysThisWeek > 0
                  ? `You’ve reviewed on ${summary.daysThisWeek} of the last 7 days. `
                  : ''}
                Up to 20 cards a day. Get one right and the gap grows: a day, then four, then weeks.
                Scheduling by FSRS, the open-source method Anki uses.
              </p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}
