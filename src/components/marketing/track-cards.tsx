import { ArrowRight, Icon } from '@/components/ui/icon'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { landing, type TrackCard, type TrackTone } from '@/content/landing'
import { LESSONS_OPEN } from '@/content/navigation'
import { cn } from '@/lib/cn'
import Link from 'next/link'
import type { Route } from 'next'
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
}

/** Each track's illustration, drawn from the canvas (decorative). */
function Illustration({ tone }: { tone: TrackTone }) {
  const cls =
    'pointer-events-none absolute -right-3 -bottom-3 h-[133px] w-[160px] ph:-right-6 ph:-bottom-4 ph:h-[216px] ph:w-[260px]'
  if (tone === 'fe')
    return (
      <svg viewBox="0 0 240 200" aria-hidden="true" className={cls}>
        <rect
          x="10"
          y="20"
          width="220"
          height="170"
          rx="20"
          fill="rgba(255,255,255,0.08)"
          stroke="rgba(142,162,255,0.5)"
          strokeWidth="1.5"
        />
        <circle cx="34" cy="42" r="5" fill="#F0407F" />
        <circle cx="50" cy="42" r="5" fill="#FF8A3D" />
        <circle cx="66" cy="42" r="5" fill="#2FE6B0" />
        <rect x="30" y="66" width="120" height="10" rx="5" fill="#8EA2FF" />
        <rect x="30" y="88" width="170" height="10" rx="5" fill="rgba(255,255,255,0.35)" />
        <rect x="30" y="110" width="90" height="10" rx="5" fill="rgba(255,255,255,0.35)" />
        <rect x="30" y="138" width="80" height="30" rx="10" fill="#FFFFFF" />
      </svg>
    )
  if (tone === 'da')
    return (
      <svg viewBox="0 0 240 200" aria-hidden="true" className={cls}>
        <rect x="20" y="110" width="34" height="80" rx="8" fill="rgba(255,255,255,0.18)" />
        <rect x="66" y="80" width="34" height="110" rx="8" fill="rgba(255,255,255,0.28)" />
        <rect x="112" y="96" width="34" height="94" rx="8" fill="rgba(255,255,255,0.18)" />
        <rect x="158" y="44" width="34" height="146" rx="8" fill="#2FE6B0" />
        <path
          d="M20 80 C60 70 80 40 120 56 S 180 20 220 16"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="220" cy="16" r="8" fill="#FFFFFF" />
      </svg>
    )
  if (tone === 'ux')
    return (
      <svg viewBox="0 0 240 200" aria-hidden="true" className={cls}>
        <rect x="40" y="30" width="120" height="150" rx="18" fill="rgba(255,255,255,0.1)" />
        <rect x="90" y="56" width="120" height="130" rx="18" fill="rgba(255,255,255,0.2)" />
        <rect x="108" y="76" width="84" height="40" rx="10" fill="#FFFFFF" />
        <rect x="108" y="126" width="60" height="8" rx="4" fill="#FFFFFF" />
        <rect x="108" y="142" width="44" height="8" rx="4" fill="rgba(255,255,255,0.6)" />
        <path
          d="M176 132 l0 34 l9 -8 l7 15 l7 -3 l-7 -15 l12 0 z"
          fill="#07060D"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
    )
  return (
    <svg viewBox="0 0 240 200" aria-hidden="true" className={cls}>
      <g stroke="rgba(255,255,255,0.35)" strokeWidth="2">
        <path d="M40 40 120 70M40 40 120 130M40 100 120 70M40 100 120 130M40 160 120 70M40 160 120 130M120 70 200 100M120 130 200 100" />
      </g>
      <g fill="rgba(255,255,255,0.85)">
        <circle cx="40" cy="40" r="12" />
        <circle cx="40" cy="100" r="12" />
        <circle cx="40" cy="160" r="12" />
        <circle cx="120" cy="70" r="14" />
        <circle cx="120" cy="130" r="14" />
      </g>
      <circle cx="200" cy="100" r="18" fill="#2FE6B0" />
    </svg>
  )
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
            href={`/tracks/${track.slug}` as Route}
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
    <Section id="tracks" labelledBy="tracks-eyebrow" className="pt-16 ph:pt-28">
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
