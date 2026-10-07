import type { Metadata, Route } from 'next'
import Link from 'next/link'
import { connection } from 'next/server'
import { NotFoundActions, NotFoundSearch, type SearchEntry } from '@/components/errors/not-found-parts'
import { TrackIcon, trackTint } from '@/components/learn/track-icon'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { SkipLink } from '@/components/ui/skip-link'
import { TRACK_PAGE } from '@/content/navigation'
import { listPublishedLessons } from '@/lib/lessons/catalogue'
import { cn } from '@/lib/cn'

// Next.js adds <meta name="robots" content="noindex"> to 404 responses itself.
export const metadata: Metadata = { title: 'Page not found' }

// Tracks without lessons yet link to their card on the landing page, as the footer does.
const TRACKS = [
  { id: 'fe', title: 'Front-End Web Development', href: TRACK_PAGE, open: true },
  { id: 'da', title: 'Data Analysis', href: '/#tracks' as Route, open: false },
  { id: 'ux', title: 'UI/UX Product Design', href: '/#tracks' as Route, open: false },
  { id: 'ai', title: 'AI & Machine Learning', href: '/#tracks' as Route, open: false },
] as const

const chip: Record<(typeof TRACKS)[number]['id'], string> = {
  fe: 'border-[rgba(77,107,255,0.45)]',
  da: 'border-[rgba(47,230,176,0.45)]',
  ux: 'border-[rgba(240,64,127,0.45)]',
  ai: 'border-[rgba(123,92,255,0.45)] bg-[rgba(123,92,255,0.1)]',
}

/** PrismError: the gradient 404, a search over the real catalogue, the tracks, and a way home. */
export default async function NotFound() {
  // Rendered per request: a 404 under a signed-in path (say /login/x) carries the nonce CSP, and only
  // per-request rendering adds the nonce to its scripts. 404s are rare, so the cost is small.
  await connection()
  const lessons = (await listPublishedLessons()).filter((l) => l.track !== 'samples')
  const entries: SearchEntry[] = [
    ...TRACKS.map((t) => ({ href: t.href, title: t.title, meta: t.open ? 'Track · Module 1 free' : 'Track · Coming soon' })),
    ...lessons.map((l) => ({
      href: `/learn/${l.track}/${l.slug}` as Route,
      title: l.title,
      meta: `Lesson · Module ${l.module} · ${l.minutes} min${l.free ? ' · Free' : ''}`,
    })),
  ]

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-360px] left-1/2 h-[860px] w-[1400px] -translate-x-1/2"
        style={{
          background:
            'radial-gradient(closest-side at 35% 45%, rgba(123,92,255,0.26), rgba(0,0,0,0) 72%), radial-gradient(closest-side at 68% 55%, rgba(240,64,127,0.16), rgba(0,0,0,0) 72%)',
        }}
      />
      <SkipLink />
      <SiteHeader />
      <main id="main" className="relative py-16 ph:py-28">
        <div className="mx-auto flex max-w-[760px] flex-col items-center gap-8 px-4 text-center ph:px-6">
          <p
            aria-hidden="true"
            className="bg-[linear-gradient(120deg,#8EA2FF,#B9A2FF_50%,#FF7DB0)] bg-clip-text font-display text-[112px] leading-[104px] font-extrabold tracking-[-0.06em] text-transparent ph:text-[160px] ph:leading-[150px]"
          >
            404
          </p>
          <div className="flex flex-col gap-4">
            <h1 className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.04em] text-ink ph:text-5xl ph:leading-[52px]">
              We couldn’t find that page
            </h1>
            <p className="text-[17px] leading-7 text-ink-muted">
              It may have moved, or the link has a typo. Try searching, or jump into a track.
            </p>
          </div>
          <NotFoundSearch entries={entries} />
          <nav aria-label="Tracks" className="flex flex-wrap justify-center gap-3">
            {TRACKS.map((t) => (
              <Link
                key={t.id}
                href={t.href}
                className={cn(
                  'press inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium hover:opacity-90',
                  trackTint[t.id],
                  chip[t.id],
                )}
              >
                <TrackIcon track={t.id} size={16} />
                {t.title}
              </Link>
            ))}
          </nav>
          <NotFoundActions />
          <p className="text-sm text-ink-subtle">
            Followed a link from us?{' '}
            <a
              href="mailto:practicodeacademy@gmail.com?subject=Broken%20link%20on%20PractiCode%20Learn"
              className="text-ink-soft underline underline-offset-2"
            >
              Tell us
            </a>{' '}
            and we’ll fix it.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
