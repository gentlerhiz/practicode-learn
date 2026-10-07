import type { Metadata, Route } from 'next'
import Link from 'next/link'
import { AppPage } from '@/components/app/shell/app-shell'
import { TrackIcon } from '@/components/learn/track-icon'
import { Glyph } from '@/components/ui/glyph'
import { requireUser } from '@/lib/auth/require-user'
import { cn } from '@/lib/cn'
import { buildDashboard } from '@/lib/learn/dashboard'
import { loadLearnerTrack, type LessonStatus } from '@/lib/learn/progress'
import { moduleShare } from '@/lib/learn/stats'
import { PLAN_TRACKS } from '@/lib/onboarding/plan'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'My Tracks',
  description: 'Your tracks, modules and lessons on PractiCode Learn.',
  path: '/my-tracks',
  noindex: true,
})

const statusLook: Record<LessonStatus, { label: string; className: string }> = {
  completed: { label: 'Done', className: 'bg-success-fill text-on-success' },
  started: { label: 'In progress', className: 'bg-[rgba(77,107,255,0.18)] text-fe-text' },
  not_started: { label: '', className: '' },
}

const others = {
  da: 'rgba(47,230,176,0.14)',
  ux: 'rgba(240,64,127,0.14)',
  ai: 'rgba(123,92,255,0.16)',
} as const

/**
 * My Tracks: the learner's own view of the track, in the app shell (the public track page is for
 * visitors). Built from the canvas's track syllabus and dashboard cards.
 */
export default async function MyTracksPage() {
  const [user, track] = await Promise.all([requireUser(), loadLearnerTrack()])
  const view = buildDashboard(track, user.name, new Date())
  const lessons = track.modules.flatMap((m) => m.lessons)
  const done = lessons.filter((l) => l.status === 'completed').length
  const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0

  return (
    <AppPage>
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.035em] text-ink ph:text-[40px] ph:leading-[44px]">
          My Tracks
        </h1>
        <p className="text-base text-ink-muted">Pick up where you left off, or look ahead at what’s coming.</p>
      </div>

      <section
        aria-labelledby="track-title"
        className="flex flex-col gap-5 rounded-[30px] border border-line p-6 text-white [background:var(--pc-card-fe)] ph:p-8"
      >
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex size-[52px] items-center justify-center rounded-2xl bg-white/15">
            <TrackIcon track="fe" size={24} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[#dce1ff]">15 modules · Beginner · Aligned to the MDN Curriculum</p>
            <h2 id="track-title" className="font-display text-[28px] leading-8 font-extrabold tracking-[-0.025em] ph:text-[34px] ph:leading-[38px]">
              {track.trackTitle}
            </h2>
          </div>
          <Link
            href={`/tracks/${track.track.slug}` as Route}
            className="press rounded-full border border-white/30 px-4 py-2 text-sm font-medium hover:border-white/60 hover:bg-white/10"
          >
            Track Overview
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[13px]">
            <span className="text-[#dce1ff]">
              {done} of {lessons.length} lessons done
            </span>
            <span className="font-semibold">{pct}%</span>
          </div>
          <div aria-hidden="true" className="h-2 overflow-hidden rounded bg-white/15">
            <div className="h-2 rounded bg-[linear-gradient(90deg,#8ea2ff,#ffffff)]" style={{ width: `${pct}%` }} />
          </div>
        </div>
        {view.resume?.href && (
          <Link
            href={view.resume.href}
            className="press inline-flex h-[50px] items-center gap-3 self-start rounded-full bg-white px-6 text-[15px] font-semibold text-[#2d45d8] hover:bg-white/90"
          >
            <Glyph name="play" size={16} />
            {view.resume.action === 'Jump Back In' ? `Jump Back In: ${view.resume.title}` : `Start: ${view.resume.title}`}
          </Link>
        )}
      </section>

      <section aria-labelledby="modules-title" className="flex flex-col gap-3">
        <h2 id="modules-title" className="font-display text-2xl font-extrabold tracking-[-0.02em] text-ink">
          Modules
        </h2>
        {track.modules.map((m) => {
          const share = moduleShare(m.lessons.map((l) => l.status))
          const open = m.lessons.some((l) => l.href)
          return (
            <details
              key={m.number}
              id={`module-${m.number}`}
              open={m.free}
              className="group surface scroll-mt-6 rounded-[22px] border border-line"
            >
              <summary className="flex cursor-pointer list-none items-center gap-4 rounded-[22px] p-4 hover:bg-hover ph:px-5 [&::-webkit-details-marker]:hidden">
                <span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-[10px] text-sm font-bold',
                    share === 100 ? 'bg-success-fill text-on-success' : m.free ? 'bg-fe text-white' : 'bg-fe/15 text-fe-text',
                  )}
                >
                  {share === 100 ? <Glyph name="check" size={16} strokeWidth={2.6} /> : m.number}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-base font-semibold text-ink">{m.title}</span>
                  <span className="text-[13px] text-ink-subtle">
                    {m.lessons.length} lessons
                    {share > 0 ? ` · ${share}% done` : open ? '' : ' · opens soon'}
                  </span>
                </span>
                {m.free ? (
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-on-primary">Free</span>
                ) : (
                  <span className="flex items-center gap-1 text-[13px] text-ink-muted">
                    <Glyph name="lock" size={14} />
                    Pro
                  </span>
                )}
                <Glyph name="chevronRight" size={16} className="shrink-0 text-ink-subtle transition-transform group-open:rotate-90" />
              </summary>
              <div className="flex flex-col gap-3 px-4 pb-5 ph:px-5 ph:pl-[72px]">
                <p className="text-[15px] text-ink-muted">{m.summary}</p>
                <ol className="flex flex-col gap-2">
                  {m.lessons.map((l) => {
                    const look = statusLook[l.status]
                    const body = (
                      <>
                        <span className="w-8 shrink-0 text-xs text-ink-subtle">
                          {m.number}.{l.number}
                        </span>
                        <span className="min-w-0 flex-1">{l.title}</span>
                        {look.label && <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', look.className)}>{look.label}</span>}
                        {l.minutes && <span className="text-xs text-ink-subtle">{l.minutes} min</span>}
                        {l.href ? (
                          <Glyph name="chevronRight" size={14} className="text-ink-subtle" />
                        ) : (
                          <span className="text-xs text-ink-subtle">Soon</span>
                        )}
                      </>
                    )
                    return (
                      <li key={l.id}>
                        {l.href ? (
                          <Link
                            href={l.href}
                            className="flex items-center gap-3 rounded-xl border border-line-subtle bg-row px-3 py-2.5 text-sm text-ink transition-colors hover:border-line-strong hover:bg-hover"
                          >
                            {body}
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3 rounded-xl border border-line-subtle bg-row px-3 py-2.5 text-sm text-ink-muted">
                            {body}
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ol>
                {m.project && <p className="text-[13px] text-fe-text">Project: {m.project}</p>}
              </div>
            </details>
          )
        })}
      </section>

      <section aria-labelledby="other-title" className="flex flex-col gap-4">
        <h2 id="other-title" className="font-display text-2xl font-extrabold tracking-[-0.02em] text-ink">
          More tracks
        </h2>
        <div className="grid grid-cols-1 gap-6 tab:grid-cols-3">
          {PLAN_TRACKS.filter((t) => t.id !== 'fe').map((t) => (
            <Link
              key={t.id}
              href={'/#tracks' as Route}
              className="press flex flex-col gap-3 rounded-3xl border border-line p-6 hover:border-line-strong"
              style={{ background: `linear-gradient(160deg, ${others[t.id as keyof typeof others]}, var(--pc-sheet) 70%)` }}
            >
              <span
                className={cn(
                  'flex size-11 items-center justify-center rounded-[14px] text-white',
                  t.id === 'da' ? 'bg-da' : t.id === 'ux' ? 'bg-ux' : 'bg-ai',
                )}
              >
                <TrackIcon track={t.id} size={22} />
              </span>
              <span className="font-display text-lg leading-6 font-bold text-ink">{t.name}</span>
              <span className="text-sm leading-[22px] text-ink-muted">{t.line}</span>
              <span className="mt-auto text-sm font-medium text-ink-soft">{t.meta} · Opens soon →</span>
            </Link>
          ))}
        </div>
      </section>
    </AppPage>
  )
}
