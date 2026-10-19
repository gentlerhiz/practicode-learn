import { ArrowRight, Icon } from '@/components/ui/icon'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { landing, type TrackCard, type TrackTone } from '@/content/landing'
import { LESSONS_OPEN } from '@/content/navigation'
import { cn } from '@/lib/cn'
import Link from 'next/link'
import type { Route } from 'next'
import { Illustration } from './course-illustration'
import { SectionHeading } from './section-heading'

const tones: Record<TrackTone, { card: string; summary: string; meta: string; button: string }> = {
  fe: {
    card: '[background:var(--pc-card-fe)]',
    summary: 'text-[#e3e7ff]',
    meta: 'text-[#c2cbff]',
    button: 'text-[#2d45d8]',
  },
  da: {
    card: '[background:var(--pc-card-da)]',
    summary: 'text-[#ddf7ec]',
    meta: 'text-[#a9ebd2]',
    button: 'text-[#006b47]',
  },
  ux: {
    card: '[background:var(--pc-card-ux)]',
    summary: 'text-[#ffe3ee]',
    meta: 'text-[#ffb8d2]',
    button: 'text-[#b5225b]',
  },
  ai: {
    card: '[background:var(--pc-card-ai)]',
    summary: 'text-[#ece6ff]',
    meta: 'text-[#cfc2ff]',
    button: 'text-[#5536d9]',
  },
  it: {
    card: '[background:var(--pc-card-it)]',
    summary: 'text-[#fff0d9]',
    meta: 'text-[#ffd59a]',
    button: 'text-[#8a4b00]',
  },
  cy: {
    card: '[background:var(--pc-card-cy)]',
    summary: 'text-[#dcf7fd]',
    meta: 'text-[#a5e9f7]',
    button: 'text-[#0b6577]',
  },
}

function Card({ track }: { track: TrackCard }) {
  const tone = tones[track.tone]
  const live = track.status === 'live'
  return (
    <article
      className={cn(
        'relative flex min-h-[360px] flex-col overflow-hidden rounded-[32px] border border-line p-5 text-white ph:p-8',
        tone.card,
      )}
    >
      <Illustration tone={track.tone} />
      <div className="relative flex flex-1 flex-col gap-4 ph:max-w-[58%]">
        <div className="flex flex-wrap items-center gap-2">
          <p className="rounded-full bg-white/15 px-3 py-1 text-[13px] font-medium">{track.level}</p>
          {!live && (
            <p className="rounded-full border border-white/40 bg-black/25 px-3 py-1 text-[13px] font-semibold">
              Coming soon
            </p>
          )}
        </div>
        <h3 className="font-display text-[28px] leading-8 font-extrabold tracking-[-0.025em] ph:text-[34px] ph:leading-[38px]">
          {track.title}
        </h3>
        <p className={cn('text-base leading-[25px]', tone.summary)}>{track.summary}</p>
        <p className={cn('mb-24 text-[13px] ph:mb-0', tone.meta)}>{track.alignment}</p>
        {live && (
          <Link
            href={`/courses/${track.slug}` as Route}
            className={cn(
              'mt-auto inline-flex h-[46px] items-center gap-2 self-start rounded-full bg-white px-5 text-[15px] font-semibold',
              tone.button,
            )}
          >
            {LESSONS_OPEN ? 'Start Free' : 'See the Syllabus'}
            <Icon as={ArrowRight} size={16} />
          </Link>
        )}
      </div>
    </article>
  )
}

export function TrackCards() {
  const { tracks } = landing
  return (
    <Section id="courses" labelledBy="tracks-eyebrow" className="pt-16 ph:pt-28">
      <Container className="flex flex-col gap-8 ph:gap-12">
        <SectionHeading
          id="tracks-title"
          eyebrow={tracks.eyebrow}
          eyebrowId="tracks-eyebrow"
          title={tracks.title}
          intro={{ plain: tracks.intro }}
          align="split"
        />
        <div className="grid grid-cols-1 gap-4 ph:gap-6 tab:grid-cols-2">
          {tracks.cards.map((track) => (
            <Card key={track.slug} track={track} />
          ))}
        </div>
        <Link
          href="/courses"
          className="press inline-flex h-[50px] items-center gap-2 self-center rounded-full border border-line-control px-6 text-[15px] font-semibold text-ink hover:border-line-strong hover:bg-hover"
        >
          {tracks.browse}
          <Icon as={ArrowRight} size={16} />
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-line-subtle pt-8">
          <p className="text-sm text-ink-subtle">{tracks.standardsLabel}</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-2 font-display text-lg font-bold text-ink-subtle">
            {tracks.standards.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  )
}
