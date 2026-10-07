import Link from 'next/link'
import { TrackIcon } from '@/components/learn/track-icon'
import { TutorSpark } from '@/components/learn/tutor-spark'
import { Glyph } from '@/components/ui/glyph'
import { cn } from '@/lib/cn'
import type { NewDashboardData } from './types'

const card = 'surface flex flex-col gap-4 rounded-3xl border border-line p-5 ph:p-6'
const title = 'font-display text-xl leading-[26px] font-bold text-ink'
const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const other = {
  fe: { tile: 'bg-fe text-white', bg: 'rgba(77,107,255,0.16)', link: 'text-fe-text' },
  da: { tile: 'bg-da text-white', bg: 'rgba(47,230,176,0.14)', link: 'text-da-text' },
  ux: { tile: 'bg-ux text-white', bg: 'rgba(240,64,127,0.14)', link: 'text-ux-text' },
  ai: { tile: 'bg-ai text-white', bg: 'rgba(123,92,255,0.16)', link: 'text-ai-text' },
} as const

/** PrismDashboardNew: the first thing a new learner sees. */
export function NewDashboardView({ data }: { data: NewDashboardData }) {
  const done = data.checklist.filter((c) => c.done).length
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.035em] text-ink ph:text-[40px] ph:leading-[44px]">
          {data.firstName ? `Welcome, ${data.firstName}. Let’s start.` : 'Welcome. Let’s start.'}
        </h1>
        <p className="text-base leading-6 text-ink-muted">Your plan: {data.plan}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] bg-[linear-gradient(120deg,#4a30d8_0%,#8a2fa8_55%,#c42a6c_100%)] px-5 py-4 text-white">
        <p className="flex flex-wrap items-center gap-x-3 text-[15px] leading-[22px]">
          <span className="font-semibold">{data.banner.text}</span>
          <span className="text-[#f6edff]">{data.banner.accent}</span>
        </p>
        <Link href={data.banner.link.href} className="text-sm font-medium underline underline-offset-2 hover:no-underline">
          {data.banner.link.label}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 tab:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section
          aria-labelledby="first-title"
          className="flex flex-col gap-4 rounded-[28px] border border-line p-6 text-white [background:var(--pc-card-fe)] ph:p-8"
        >
          <p className="self-start rounded-full bg-white/15 px-3 py-1 text-xs font-medium">{data.first.eyebrow}</p>
          <h2 id="first-title" className="font-display text-[28px] leading-8 font-extrabold tracking-[-0.025em] ph:text-[34px] ph:leading-[38px]">
            {data.first.title}
          </h2>
          <p className="max-w-[460px] text-[15px] leading-6 text-[#dce1ff]">{data.first.summary}</p>
          {data.first.href && (
            <Link
              href={data.first.href}
              className="press mt-2 inline-flex h-[52px] items-center gap-2 self-start rounded-full bg-white px-6 text-[15px] font-semibold text-[#2d45d8] hover:bg-white/90"
            >
              <Glyph name="play" size={16} />
              {data.first.action}
            </Link>
          )}
        </section>

        <section aria-labelledby="start-title" className={card}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="start-title" className={title}>
              Getting started
            </h2>
            <span className="text-[13px] text-ink-muted">
              {done} of {data.checklist.length}
            </span>
          </div>
          <div aria-hidden="true" className="flex gap-1">
            {data.checklist.map((c, i) => (
              <span key={i} className={cn('block h-1.5 flex-1 rounded-[3px]', i < done ? 'bg-fe' : 'bg-meter')} />
            ))}
          </div>
          <ul className="flex flex-col gap-3">
            {data.checklist.map((c) => (
              <li key={c.label} className="flex items-center gap-3 text-sm leading-[22px]">
                <span
                  className={cn(
                    'flex size-[22px] shrink-0 items-center justify-center rounded-lg border-[1.5px]',
                    c.done ? 'border-fe bg-fe text-white' : 'border-line-strong',
                  )}
                >
                  {c.done && <Glyph name="check" size={13} strokeWidth={2.6} />}
                </span>
                <span className={c.done ? 'text-ink-muted line-through' : 'text-ink'}>
                  {c.label}
                  <span className="sr-only">{c.done ? ', done' : ', to do'}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 tab:grid-cols-3">
        <section className={card}>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-control text-ink-soft">
            <Glyph name="review" size={20} />
          </span>
          <h2 className={title}>Nothing to review yet</h2>
          <p className="text-sm leading-[22px] text-ink-muted">
            Your first cards show up after Lesson 1. Reviewing takes about 4 minutes a day and stops you forgetting.
          </p>
        </section>
        <section className={card}>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-control text-ink-soft">
            <Glyph name="clock" size={20} />
          </span>
          <h2 className={title}>
            This week: {data.week.count} of {data.week.goal} days
          </h2>
          <div aria-hidden="true" className="flex gap-1.5">
            {DAY_LETTERS.map((d, i) => (
              <span key={i} className="flex flex-1 flex-col items-center gap-1.5 text-[11px] text-ink-subtle">
                <span
                  className={cn(
                    'block h-7 w-full rounded-lg',
                    i < data.week.count
                      ? 'bg-[#4d6bff]'
                      : i === data.week.today
                        ? 'border-[1.5px] border-focus shadow-[0_0_0_3px_rgba(77,107,255,0.25)]'
                        : 'border-[1.5px] border-dashed border-[var(--pc-line-strong)]',
                  )}
                />
                {d}
              </span>
            ))}
          </div>
          <p className="text-sm leading-[22px] text-ink-muted">A day counts once you finish one lesson. Missing one doesn’t reset anything.</p>
        </section>
        <section className={card}>
          <TutorSpark size={44} />
          <h2 className={title}>{data.tutor.title}</h2>
          <p className="text-sm leading-[22px] text-ink-muted">{data.tutor.body}</p>
          <Link href={data.tutor.link.href} className="mt-auto text-sm font-medium text-ai-text underline underline-offset-2 hover:no-underline">
            {data.tutor.link.label}
          </Link>
        </section>
      </div>

      <section aria-labelledby="other-title" className="flex flex-col gap-4">
        <h2 id="other-title" className="font-display text-2xl font-extrabold tracking-[-0.02em] text-ink">
          Curious about another track?
        </h2>
        <div className="grid grid-cols-1 gap-6 tab:grid-cols-3">
          {data.others.map((t) => (
            <Link
              key={t.id}
              href={t.href}
              className="press flex flex-col gap-3 rounded-3xl border border-line p-6 hover:border-line-strong"
              style={{ background: `linear-gradient(160deg, ${other[t.id].bg}, var(--pc-sheet) 70%)` }}
            >
              <span className={cn('flex size-11 items-center justify-center rounded-[14px]', other[t.id].tile)}>
                <TrackIcon track={t.id} size={22} />
              </span>
              <span className="font-display text-lg leading-6 font-bold text-ink">{t.name}</span>
              <span className="text-sm leading-[22px] text-ink-muted">{t.line}</span>
              <span className={cn('mt-auto text-sm font-medium', other[t.id].link)}>{t.action} →</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
