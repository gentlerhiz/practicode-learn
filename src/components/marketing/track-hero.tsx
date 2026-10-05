import Link from 'next/link'
import { BookOpen, Clock, Icon, Mail } from '@/components/ui/icon'
import { buttonClasses } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { LinkButton } from '@/components/ui/link-button'
import { ShareButtons } from '@/components/share/share-buttons'
import type { TrackContent } from '@/content/tracks'
import { FIRST_LESSON, LESSONS_OPEN } from '@/content/navigation'
import { landing } from '@/content/landing'
import { absoluteUrl } from '@/lib/site'
import { FolderOpen, Gift } from 'lucide-react'
import type { Route } from 'next'
import { BetaNotice } from './beta-notice'

/** The browser window on the right: what the learner ends up with. Decorative. */
function PortfolioPreview() {
  return (
    <figure className="hidden flex-col items-center gap-3 tab:flex">
      <div
        aria-hidden="true"
        className="w-full max-w-[540px] rounded-3xl border border-[#4d6bff]/50 bg-sunken/80 p-4"
      >
        <div className="mb-5 flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#f0407f]" />
          <span className="size-2.5 rounded-full bg-[#ff8a3d]" />
          <span className="size-2.5 rounded-full bg-[#2fe6b0]" />
          <span className="ml-2 flex-1 rounded-lg bg-row px-3 py-1.5 font-mono text-xs text-ink-subtle">
            your-name.netlify.app
          </span>
        </div>
        <div className="flex items-center justify-between px-2">
          <span className="h-2.5 w-16 rounded-full bg-ink" />
          <span className="flex gap-2">
            <span className="h-1.5 w-8 rounded-full bg-ink-subtle/60" />
            <span className="h-1.5 w-8 rounded-full bg-ink-subtle/60" />
            <span className="h-1.5 w-8 rounded-full bg-ink-subtle/60" />
          </span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 px-2">
          <div className="flex flex-col gap-3 pt-1">
            <span className="h-4 w-full rounded-full bg-ink" />
            <span className="h-4 w-4/5 rounded-full bg-ink" />
            <span className="h-2 w-3/4 rounded-full bg-ink-subtle/50" />
            <span className="h-2 w-1/2 rounded-full bg-ink-subtle/50" />
            <span className="mt-2 h-7 w-24 rounded-full bg-fe" />
          </div>
          <span className="h-[120px] rounded-2xl bg-fe" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 px-2 pb-2">
          {[1, 2, 3].map((n) => (
            <span key={n} className="h-16 rounded-xl border border-[#4d6bff]/40 bg-fe/15" />
          ))}
        </div>
      </div>
      <figcaption className="text-sm text-ink-subtle">
        What you’ll have at the end: a portfolio site, live, under your name
      </figcaption>
    </figure>
  )
}

export function TrackHero({ track }: { track: TrackContent }) {
  const lessons = track.modules.reduce((n, m) => n + m.lessons.length, 0)
  const facts = [
    { icon: BookOpen, text: `${track.modules.length} modules, ${lessons} lessons` },
    { icon: Clock, text: `About ${track.hours} hours` },
    { icon: FolderOpen, text: `${track.modules.length} projects and a capstone` },
    { icon: Gift, text: 'Module 1 is free' },
  ]
  const [first, ...rest] = track.title.split(' ')
  const url = absoluteUrl(`/tracks/${track.slug}`)

  return (
    <section aria-labelledby="track-title" className="relative overflow-hidden pt-8 pb-12 ph:pt-12 ph:pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-64 right-[-10%] h-[700px] w-[900px] [opacity:var(--pc-glow-opacity)]"
        style={{
          background:
            'radial-gradient(closest-side at 50% 45%, rgba(77,107,255,0.30), rgba(77,107,255,0) 70%), radial-gradient(closest-side at 70% 60%, rgba(123,92,255,0.22), rgba(123,92,255,0) 70%)',
        }}
      />
      <Container className="relative grid items-center gap-12 tab:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <BetaNotice className="self-start" />
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-[13px] text-ink-subtle">
              <li>
                <Link href="/#tracks" className="underline underline-offset-2 hover:text-ink">
                  Tracks
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" className="text-ink-muted">
                {track.title}
              </li>
            </ol>
          </nav>
          <h1
            id="track-title"
            className="font-display text-[44px] leading-[50px] font-extrabold tracking-[-0.04em] text-ink ph:text-[64px] ph:leading-[70px]"
          >
            {first}{' '}
            <span className="inline-block -rotate-2 rounded-[0.25em] bg-fe px-[0.2em] pb-[0.08em] text-white shadow-[0_0_40px_rgba(77,107,255,0.5)]">
              {rest[0]}
            </span>{' '}
            {rest.slice(1).join(' ')}
          </h1>
          <p className="max-w-[580px] text-[17px] leading-7 text-ink-muted ph:text-lg ph:leading-[30px]">
            {landing.tracks.cards[0]!.summary} Fifteen modules, from your very first tag to a site with your
            name on it.
          </p>
          <ul className="grid gap-3 text-[15px] text-ink ph:grid-cols-2">
            {facts.map((f) => (
              <li key={f.text} className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-fe/15 text-fe-text">
                  <Icon as={f.icon} size={16} />
                </span>
                {f.text}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            {LESSONS_OPEN ? (
              <LinkButton href={FIRST_LESSON as Route} size="lg">
                Start Module 1 Free
              </LinkButton>
            ) : (
              <a href={landing.closing.soon.notify.href} className={buttonClasses({ size: 'lg' })}>
                <Icon as={Mail} size={18} />
                Email Me When Module 1 Opens
              </a>
            )}
            <a
              href="#syllabus"
              className={buttonClasses({ variant: 'secondary', size: 'lg' }, 'font-medium')}
            >
              See the Syllabus
            </a>
          </div>
          <p className="text-[13px] text-ink-subtle">
            Aligned to the MDN Curriculum and SFIA 9{LESSONS_OPEN ? ' · Lessons save for offline' : ''}
          </p>
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-medium text-ink-muted">Share this track</p>
            <ShareButtons
              url={url}
              title={`${track.title} · PractiCode Learn`}
              text={`${track.title} on PractiCode Learn: ${track.tagline.toLowerCase()}. Module 1 is free.`}
            />
          </div>
        </div>
        <PortfolioPreview />
      </Container>
    </section>
  )
}
