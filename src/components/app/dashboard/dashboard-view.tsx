import type { Route } from 'next'
import Link from 'next/link'
import { Glyph } from '@/components/ui/glyph'
import { cn } from '@/lib/cn'
import type { DashboardData, DayMark } from './types'

const card = 'surface flex flex-col gap-4 rounded-[26px] border border-line p-5 ph:p-6'
const cardTitle = 'font-display text-lg font-bold text-ink'
const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const DAY_WORDS: Record<DayMark, string> = {
  fe: ', learned Front-End',
  da: ', learned Data Analysis',
  missed: ', skipped',
  today: ', today',
  later: ', coming up',
}
const dayLook: Record<DayMark, string> = {
  fe: 'bg-[#4d6bff]',
  da: 'bg-[#2fe6b0]',
  missed: 'border-[1.5px] border-dashed border-line-strong',
  today: 'border-2 border-[#ff8a3d]',
  later: 'border-[1.5px] border-line-control',
}
const trackColour = { fe: '#4D6BFF', da: '#2FE6B0', ux: '#F0407F', ai: '#7B5CFF' } as const
const trackLink = { fe: 'text-fe-text', da: 'text-da-text', ux: 'text-ux-text', ai: 'text-ai-text' } as const

function WeekRing({ count, goal }: { count: number; goal: number }) {
  const length = 2 * Math.PI * 56
  const filled = Math.min(1, count / goal) * length
  return (
    <div className="relative size-[136px]">
      <svg viewBox="0 0 140 140" className="size-[136px] -rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id="week-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4D6BFF" />
            <stop offset="0.55" stopColor="#7B5CFF" />
            <stop offset="1" stopColor="#F0407F" />
          </linearGradient>
        </defs>
        <circle cx="70" cy="70" r="56" fill="none" stroke="var(--pc-divider)" strokeWidth="12" />
        {count > 0 && (
          <circle
            cx="70"
            cy="70"
            r="56"
            fill="none"
            stroke="url(#week-ring)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${length}`}
          />
        )}
      </svg>
      <p className="absolute inset-0 flex flex-col items-center justify-center font-display">
        <span className="text-[32px] font-extrabold tracking-[-0.03em] text-ink">
          {count}/{goal}
        </span>
        <span className="text-xs text-ink-muted">days</span>
      </p>
    </div>
  )
}

/** PrismDashboard: for a learner who has started. */
export function DashboardView({ data }: { data: DashboardData }) {
  const { resume, week, review, project, path } = data
  const totalMinutes = data.minutes.reduce((sum, d) => sum + d.fe + d.da, 0)
  const scale = Math.max(24, ...data.minutes.map((d) => d.fe + d.da))
  const H = 104
  const showDa = data.minutes.some((d) => d.da > 0)
  const rows = [path.nodes.slice(0, 8), path.nodes.slice(8)]

  return (
    <>
      {data.trialDaysLeft ? (
        <div className="flex items-center justify-between gap-3 rounded-[18px] bg-[linear-gradient(120deg,#5a3bea,#c42a6c)] py-3 pr-3 pl-4 text-white lg:hidden">
          <p className="text-sm">
            <span className="font-semibold">Pro trial</span>
            <span className="text-[#f6edff]"> · {data.trialDaysLeft} days left</span>
          </p>
          <Link href={'/checkout' as Route} className="press flex h-11 items-center rounded-full bg-white px-4 text-[13px] font-semibold text-[#07060d]">
            See Plans
          </Link>
        </div>
      ) : null}
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.035em] text-ink ph:text-[40px] ph:leading-[44px]">
          {data.firstName ? `Hey ${data.firstName}, good to see you.` : 'Good to see you.'}
        </h1>
        <p className="text-base text-ink-muted">
          {data.intro.text} {data.intro.accent && <span className="text-fe-text">{data.intro.accent}</span>}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 tab:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {resume ? (
          <section
            aria-labelledby="resume-title"
            className="relative grid grid-cols-1 items-center gap-8 overflow-hidden rounded-[30px] border border-line p-6 text-white [background:var(--pc-card-fe)] ph:p-8 ph:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
          >
            <div className="relative flex flex-col gap-4">
              <p className="self-start rounded-full bg-white/15 px-3 py-1 text-xs font-medium">{resume.eyebrow}</p>
              <h2 id="resume-title" className="font-display text-[28px] leading-8 font-extrabold tracking-[-0.025em] ph:text-[34px] ph:leading-[38px]">
                {resume.title}
              </h2>
              <p className="text-sm text-[#dce1ff]">{resume.detail}</p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#dce1ff]">Module progress</span>
                  <span className="font-semibold">{resume.modulePct}%</span>
                </div>
                <div aria-hidden="true" className="h-2 overflow-hidden rounded bg-white/15">
                  <div className="h-2 rounded bg-[linear-gradient(90deg,#8ea2ff,#ffffff)]" style={{ width: `${resume.modulePct}%` }} />
                </div>
              </div>
              {resume.href && (
                <Link
                  href={resume.href}
                  className="press mt-1.5 inline-flex h-[50px] items-center gap-3 self-start rounded-full bg-white px-6 text-[15px] font-semibold text-[#2d45d8] hover:bg-white/90"
                >
                  <Glyph name="play" size={16} />
                  {resume.action}
                </Link>
              )}
            </div>
            <div aria-hidden="true" className="relative flex flex-col gap-3">
              <div className="flex h-[140px] items-center justify-between rounded-[20px] border-[1.5px] border-dashed border-white/40 bg-black/25 px-4">
                <span className="block size-14 -rotate-6 rounded-[14px] bg-white" />
                <span className="block size-14 rounded-full bg-[#a9b7ff]" />
                <span className="block size-14 rotate-[8deg] rounded-[14px] bg-[#6f86ff]" />
              </div>
              <p className="text-center font-mono text-xs text-[#dce1ff]">
                {resume.visual.label}: <span className="text-[#a9b7ff]">{resume.visual.value}</span>
              </p>
            </div>
          </section>
        ) : null}

        <section aria-labelledby="week-title" className={cn(card, 'items-center rounded-[30px] text-center')}>
          <h2 id="week-title" className={cn(cardTitle, 'self-start')}>
            This week
          </h2>
          <WeekRing count={week.count} goal={week.goal} />
          <ul aria-label="Days this week" className="flex gap-2">
            {week.days.map((d, i) => (
              <li key={i} className="flex flex-col items-center gap-1.5 text-[11px] text-ink-muted">
                <span className={cn('block h-[22px] w-3.5 rounded-[5px]', dayLook[d])} />
                {DAY_LETTERS[i]}
                <span className="sr-only">{DAY_WORDS[d]}</span>
              </li>
            ))}
          </ul>
          <p className="text-[13px] leading-5 text-ink-muted">{week.note}</p>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-5 tab:grid-cols-3">
        <section aria-labelledby="review-title" className={card}>
          <div className="flex items-baseline justify-between">
            <h2 id="review-title" className={cardTitle}>
              Quick review
            </h2>
            <p className="text-[13px] font-semibold text-ink-soft">
              {review.due ? `${review.due} cards · ${review.minutes} min` : 'Nothing due'}
            </p>
          </div>
          {review.card ? (
            <div aria-hidden="true" className="relative h-[108px]">
              <span className="absolute inset-x-3.5 top-3 block h-[92px] -rotate-3 rounded-[14px] bg-[rgba(47,230,176,0.2)]" />
              <div className="absolute inset-x-0 top-0 h-[100px] rounded-[14px] border border-[#2fe6b0]/45 bg-control p-4">
                <p className="text-[13px] leading-5 text-ink">
                  {review.card.before}
                  <span className="text-da-text">{review.card.accent}</span>
                  {review.card.after}
                </p>
                <p className="mt-3 text-xs text-ink-subtle">Tap to flip</p>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-[22px] text-ink-muted">
              Cards come from the lessons you finish. Daily review opens soon, and it takes about 4 minutes a day.
            </p>
          )}
          <Link
            href={'/review' as Route}
            className="press mt-auto flex h-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-on-primary hover:opacity-90"
          >
            Start Review
          </Link>
        </section>

        <section aria-labelledby="time-title" className={card}>
          <div className="flex items-baseline justify-between">
            <h2 id="time-title" className={cardTitle}>
              Time learning
            </h2>
            <p className="text-[13px] text-ink-muted">{totalMinutes} min</p>
          </div>
          <div aria-hidden="true" className="flex h-[124px] items-end gap-3">
            {data.minutes.map((b) => {
              const fe = Math.round((b.fe / scale) * H)
              const da = Math.round((b.da / scale) * H)
              return (
                <div key={b.day} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="flex w-full max-w-[26px] flex-col overflow-hidden rounded-lg bg-[var(--pc-surface-row)] [box-shadow:inset_0_0_0_100px_var(--pc-hover)]">
                    <span className="block" style={{ height: Math.max(0, H - fe - da) }} />
                    <span className="block bg-[#2fe6b0]" style={{ height: da }} />
                    <span className="block bg-[#4d6bff]" style={{ height: fe }} />
                  </span>
                  <span className="text-[11px] text-ink-subtle">{b.day}</span>
                </div>
              )
            })}
          </div>
          <p className="sr-only">
            Minutes this week: {data.minutes.map((b) => `${b.day} ${b.fe + b.da}`).join(', ')}.
          </p>
          <p className="flex gap-4 text-xs text-ink-muted">
            <span className="flex items-center gap-1.5">
              <span className="block size-2.5 rounded-[3px] bg-[#4d6bff]" />
              Front-End
            </span>
            {showDa && (
              <span className="flex items-center gap-1.5">
                <span className="block size-2.5 rounded-[3px] bg-[#2fe6b0]" />
                Data
              </span>
            )}
          </p>
        </section>

        <section
          aria-labelledby="project-title"
          className="flex flex-col gap-3 rounded-[26px] border border-[#4d6bff]/35 bg-[linear-gradient(180deg,rgba(77,107,255,0.12)_0%,var(--pc-sheet)_70%)] p-5 ph:p-6"
        >
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="project-title" className={cardTitle}>
              Your project
            </h2>
            <p className="text-[13px] font-semibold text-fe-text">
              {project.total ? `${project.passed} of ${project.total} checks` : 'Opens soon'}
            </p>
          </div>
          <p className="text-sm font-medium text-ink">{project.title}</p>
          {project.checks.length ? (
            <ul className="flex flex-col gap-2 text-[13px] text-ink">
              {project.checks.map((c) => (
                <li key={c.label} className="flex items-center gap-3">
                  {c.ok ? (
                    <span className="flex size-[18px] shrink-0 items-center justify-center rounded-md bg-fe text-white">
                      <Glyph name="check" size={12} strokeWidth={3} />
                    </span>
                  ) : (
                    <span className="flex size-[18px] shrink-0 items-center justify-center rounded-md border-[1.5px] border-error text-error">
                      <Glyph name="x" size={11} strokeWidth={3} />
                    </span>
                  )}
                  <span>
                    {c.label}
                    {!c.ok && <span className="text-error"> · needs a fix</span>}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] leading-5 text-ink-muted">{project.note}</p>
          )}
          <Link
            href={project.href}
            className="press mt-auto flex h-11 items-center justify-center rounded-full border border-[#4d6bff]/55 text-sm font-semibold text-ink hover:bg-hover"
          >
            Open Project
          </Link>
        </section>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 tab:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <section aria-labelledby="path-title" className={cn(card, 'gap-6')}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="path-title" className={cardTitle}>
                Your path through {path.trackTitle}
              </h2>
              <p className="mt-1 text-[13px] text-ink-muted">
                {path.mastered} of {path.total} modules mastered
              </p>
            </div>
            <p className="rounded-full border border-[#4d6bff]/45 px-3 py-1 text-xs text-fe-text">Aligned to MDN Curriculum</p>
          </div>
          {rows.map((row, r) => (
            <div key={r} className="relative">
              <span
                aria-hidden="true"
                className="absolute top-[21px] right-[8%] left-[8%] hidden h-0.5 ph:block"
                style={{
                  background:
                    r === 0 && row.some((n) => n.state !== 'todo')
                      ? `linear-gradient(90deg, #3D5AF5 0%, #3D5AF5 ${Math.round((row.filter((n) => n.state === 'mastered').length / row.length) * 100)}%, var(--pc-meter) ${Math.min(100, Math.round(((row.filter((n) => n.state !== 'todo').length + 1) / row.length) * 100))}%)`
                      : 'var(--pc-meter)',
                }}
              />
              <ol start={r * 8 + 1} className="relative grid grid-cols-3 gap-x-2 gap-y-4 ph:grid-cols-8 ph:gap-2">
                {row.map((n, i) => {
                  const number = r * 8 + i + 1
                  return (
                    <li key={n.name} className="flex flex-col items-center gap-2 text-center">
                      <span
                        className={cn(
                          'flex size-11 items-center justify-center rounded-full text-xs font-semibold',
                          n.state === 'mastered' && 'bg-fe text-white',
                          n.state === 'progress' && 'border-2 border-[#8ea2ff] bg-control text-ink',
                          n.state === 'todo' && 'border-[1.5px] border-dashed border-line-strong bg-sunken text-ink-subtle',
                        )}
                      >
                        {n.state === 'mastered' ? '✓' : n.state === 'progress' ? `${n.pct ?? 0}%` : number}
                      </span>
                      <span className={cn('text-xs leading-4', n.state === 'todo' ? 'text-ink-subtle' : n.state === 'progress' ? 'text-ink' : 'text-ink-soft')}>
                        {n.name}
                      </span>
                      <span className="sr-only">
                        {n.state === 'mastered' ? ', mastered' : n.state === 'progress' ? `, ${n.pct ?? 0} percent, in progress` : ', not started'}
                      </span>
                    </li>
                  )
                })}
              </ol>
            </div>
          ))}
          <Link
            href={path.check.href}
            className="press flex items-center gap-4 rounded-2xl border border-line bg-row p-4 hover:border-line-strong"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-control text-ink-soft">
              <Glyph name="target" size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-ink">{path.check.title}</span>
              <span className="mt-1 block text-[13px] text-ink-muted">{path.check.detail}</span>
            </span>
            <span className="hidden text-[13px] font-medium whitespace-nowrap text-fe-text ph:inline">{path.check.action}</span>
            <Glyph name="arrowRight" size={16} className="text-fe-text" />
          </Link>
        </section>

        <section aria-labelledby="tracks-title" className={card}>
          <div>
            <h2 id="tracks-title" className={cardTitle}>
              Your tracks
            </h2>
            <p className="mt-1 text-[13px] text-ink-muted">Module 1 of each one is free.</p>
          </div>
          <ul className="flex flex-col gap-4">
            {data.tracks.map((t) => (
              <li key={t.id} className="grid grid-cols-[12px_minmax(0,1fr)_auto] items-center gap-3">
                <span className="block size-3 rounded" style={{ background: trackColour[t.id] }} />
                <div className="flex min-w-0 flex-col gap-1.5">
                  <div className="flex justify-between gap-2 text-[13px]">
                    <span className="font-medium text-ink">{t.name}</span>
                    <span className="whitespace-nowrap text-ink-subtle">{t.note}</span>
                  </div>
                  <div aria-hidden="true" className="h-1.5 overflow-hidden rounded-[3px] bg-[var(--pc-surface-row)] [box-shadow:inset_0_0_0_100px_var(--pc-hover)]">
                    <div className="h-1.5 rounded-[3px]" style={{ width: `${t.pct}%`, background: trackColour[t.id] }} />
                  </div>
                </div>
                <Link href={t.href} className={cn('text-xs font-semibold whitespace-nowrap underline underline-offset-2 hover:no-underline', trackLink[t.id])}>
                  {t.action}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
