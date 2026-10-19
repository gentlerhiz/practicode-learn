import Link from 'next/link'
import { BookOpen, Clock, Icon, Mail } from '@/components/ui/icon'
import { buttonClasses } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { LinkButton } from '@/components/ui/link-button'
import type { TrackContent } from '@/content/tracks'
import { isComplete } from '@/content/tracks'
import { LESSONS_OPEN } from '@/content/navigation'
import { landing } from '@/content/landing'
import { cn } from '@/lib/cn'
import { toneClass } from '@/lib/tone'
import { FolderOpen, Gift } from 'lucide-react'
import type { Route } from 'next'
import { BetaNotice } from './beta-notice'

/** The browser window on the right: what a Front-End learner ends up with. Decorative. */
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

/** A practice desktop: a file manager and a command line, as in the IT Fundamentals labs. Decorative. */
function DevicesPreview() {
  return (
    <figure className="hidden flex-col items-center gap-3 tab:flex">
      <div
        aria-hidden="true"
        className="relative w-full max-w-[540px] rounded-3xl border border-[rgba(255,170,60,0.5)] bg-sunken/80 p-4"
      >
        <div className="mb-4 flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#f0407f]" />
          <span className="size-2.5 rounded-full bg-[#ff8a3d]" />
          <span className="size-2.5 rounded-full bg-[#2fe6b0]" />
          <span className="ml-2 text-xs text-ink-subtle">Practice desktop</span>
        </div>
        <div className="grid grid-cols-[1fr_1.2fr] gap-4">
          <div className="flex flex-col gap-2 rounded-2xl border border-line bg-row p-3">
            {['Documents', 'Photos', 'Projects', 'Downloads'].map((name, i) => (
              <span key={name} className="flex items-center gap-2 text-xs text-ink-soft">
                <span className={cn('h-3 w-4 rounded-[3px]', i === 2 ? 'bg-it' : 'bg-it/40')} />
                {name}
              </span>
            ))}
          </div>
          <div className="flex flex-col gap-1.5 rounded-2xl bg-[#0b0a12] p-3 font-mono text-[11px] leading-5 text-[#e9e7f5]">
            <span>
              <span className="text-[#ffc15c]">~ $</span> cd Projects
            </span>
            <span>
              <span className="text-[#ffc15c]">~/Projects $</span> ls
            </span>
            <span className="text-[#a9a6bc]">budget.xlsx notes.txt</span>
            <span>
              <span className="text-[#ffc15c]">~/Projects $</span> <span>▍</span>
            </span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {['8 GB memory', '256 GB storage', 'Wi-Fi 6'].map((spec) => (
            <span key={spec} className="rounded-xl border border-[rgba(255,170,60,0.4)] bg-it/15 px-3 py-3 text-center text-[11px] text-ink-soft">
              {spec}
            </span>
          ))}
        </div>
      </div>
      <figcaption className="text-sm text-ink-subtle">
        Practise in labs that run in your browser, on a phone or a computer
      </figcaption>
    </figure>
  )
}

/** A simulated inbox with a phishing message caught, as in the Cybersecurity labs. Decorative. */
function ShieldPreview() {
  return (
    <figure className="hidden flex-col items-center gap-3 tab:flex">
      <div
        aria-hidden="true"
        className="w-full max-w-[540px] rounded-3xl border border-[rgba(34,190,230,0.5)] bg-sunken/80 p-4"
      >
        <p className="mb-3 text-xs text-ink-subtle">Practice inbox</p>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-row p-3">
            <span className="size-8 shrink-0 rounded-full bg-cy/30" />
            <span className="flex flex-1 flex-col gap-1.5">
              <span className="h-2.5 w-2/5 rounded-full bg-ink" />
              <span className="h-2 w-4/5 rounded-full bg-ink-subtle/50" />
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border-[1.5px] border-[rgba(255,154,162,0.7)] bg-[rgba(255,154,162,0.08)] p-3">
            <span className="size-8 shrink-0 rounded-full bg-[rgba(255,154,162,0.4)]" />
            <span className="flex flex-1 flex-col gap-1">
              <span className="text-xs font-semibold text-ink">Your account will be closed today</span>
              <span className="font-mono text-[11px] text-error">secure-bank-login.co</span>
            </span>
            <span className="rounded-full bg-[rgba(255,154,162,0.2)] px-2.5 py-1 text-[11px] font-semibold text-error">
              Phishing
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-row p-3">
            <span className="size-8 shrink-0 rounded-full bg-cy/30" />
            <span className="flex flex-1 flex-col gap-1.5">
              <span className="h-2.5 w-1/3 rounded-full bg-ink" />
              <span className="h-2 w-3/5 rounded-full bg-ink-subtle/50" />
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-cy/15 p-3">
          <span className="flex size-8 items-center justify-center rounded-lg bg-cy text-white">✓</span>
          <span className="text-xs text-ink-soft">Two-factor sign-in on · Passkey saved · Backups: 3-2-1</span>
        </div>
      </div>
      <figcaption className="text-sm text-ink-subtle">
        Practise on simulated inboxes and accounts, never your real ones
      </figcaption>
    </figure>
  )
}

const previews = { portfolio: PortfolioPreview, devices: DevicesPreview, shield: ShieldPreview }

export function TrackHero({ track }: { track: TrackContent }) {
  const tone = toneClass[track.tone]
  const lessons = track.modules.reduce((n, m) => n + m.lessons.length, 0)
  const complete = isComplete(track)
  const facts = [
    { icon: BookOpen, text: `${track.modules.length} modules, ${lessons} lessons` },
    { icon: Clock, text: `About ${track.hours} hours` },
    { icon: FolderOpen, text: `${track.modules.length} projects and a capstone` },
    { icon: Gift, text: complete ? 'Module 1 is free' : 'Module 1 is open now, and free' },
  ]
  const { heading } = track
  const Preview = previews[track.preview]

  return (
    <section aria-labelledby="track-title" className="relative overflow-hidden pt-8 pb-12 ph:pt-12 ph:pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-64 right-[-10%] h-[700px] w-[900px] [opacity:var(--pc-glow-opacity)]"
        style={{
          background: `radial-gradient(closest-side at 50% 45%, rgba(${tone.rgb},0.30), rgba(${tone.rgb},0) 70%), radial-gradient(closest-side at 70% 60%, rgba(123,92,255,0.22), rgba(123,92,255,0) 70%)`,
        }}
      />
      <Container className="relative grid items-center gap-12 tab:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <BetaNotice className="self-start" />
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-[13px] text-ink-subtle">
              <li>
                <Link href="/courses" className="underline underline-offset-2 hover:text-ink">
                  Courses
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
            {heading.before}{' '}
            <span
              className={cn(
                'inline-block -rotate-2 rounded-[0.25em] px-[0.2em] pb-[0.08em] text-white',
                tone.fill,
              )}
              style={{ boxShadow: `0 0 40px rgba(${tone.rgb},0.5)` }}
            >
              {heading.mark}
            </span>
            {heading.after ? ` ${heading.after}` : ''}
            {heading.sub && (
              <span className="mt-2 block font-display text-[24px] leading-8 font-bold tracking-[-0.02em] text-ink-soft ph:text-[30px] ph:leading-9">
                {heading.sub}
              </span>
            )}
          </h1>
          <p className="max-w-[580px] text-[17px] leading-7 text-ink-muted ph:text-lg ph:leading-[30px]">
            {track.intro}
          </p>
          <ul className="grid gap-3 text-[15px] text-ink ph:grid-cols-2">
            {facts.map((f) => (
              <li key={f.text} className="flex items-center gap-3">
                <span className={cn('flex size-8 items-center justify-center rounded-lg', tone.soft, tone.text)}>
                  <Icon as={f.icon} size={16} />
                </span>
                {f.text}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            {LESSONS_OPEN ? (
              <LinkButton href={track.firstLesson as Route} size="lg">
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
            {track.alignmentShort}
            {LESSONS_OPEN ? ' · Lessons save for offline' : ''}
          </p>
          {!complete && (
            <p className="text-[13px] leading-5 text-ink-subtle">
              Module 1 is open. The other modules are being written and reviewed by our instructors, and
              each one opens as it’s ready.
            </p>
          )}
        </div>
        <Preview />
      </Container>
    </section>
  )
}
