import type { Route } from 'next'
import { BrainCircuit, ChartColumn, CodeXml, PenTool } from 'lucide-react'
import { ArrowRight, Icon } from '@/components/ui/icon'
import { buttonClasses } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { landing, type TrackTone } from '@/content/landing'
import { cn } from '@/lib/cn'

const { hero } = landing

/** Each headline pill: the track's fill, a slight tilt and a soft glow of its own colour. */
const pill: Record<TrackTone, string> = {
  fe: 'bg-fe text-white -rotate-2 shadow-[0_0_44px_rgba(77,107,255,0.55)]',
  da: 'bg-success-fill text-on-success rotate-[1.5deg] shadow-[0_0_44px_rgba(47,230,176,0.45)]',
  ux: 'bg-ux text-white -rotate-[1.5deg] shadow-[0_0_44px_rgba(240,64,127,0.5)]',
  ai: 'bg-ai text-white rotate-2 shadow-[0_0_44px_rgba(123,92,255,0.55)]',
}

/** Decorative cards that float beside the headline on wide screens: one per track's kind of work. */
function Floaters() {
  const card = 'rounded-[22px] border bg-glass p-4'
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden wide:block">
      <div className="absolute top-16 left-[3%] -rotate-[8deg]">
        <div
          className={cn(card, 'float-slow w-[232px] border-[#4d6bff]/55 font-mono text-xs leading-[22px] text-ink shadow-[0_24px_60px_rgba(77,107,255,0.28)]')}
        >
          <div className="mb-3 flex gap-1">
            <span className="size-2 rounded-full bg-[#f0407f]" />
            <span className="size-2 rounded-full bg-[#ff8a3d]" />
            <span className="size-2 rounded-full bg-[#2fe6b0]" />
          </div>
          {[
            ['h1', 'Hello, world'],
            ['p', 'My first website'],
            ['button', 'Say hi'],
          ].map(([tag, text]) => (
            <div key={tag}>
              <span className="text-fe-text">&lt;{tag}&gt;</span>
              {text}
              <span className="text-fe-text">&lt;/{tag}&gt;</span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-[384px] left-[6%] rotate-6">
        <div className={cn(card, 'float-slower w-[204px] border-[#2fe6b0]/50 shadow-[0_24px_60px_rgba(47,230,176,0.2)]')}>
          <p className="mb-3 text-[13px] font-semibold text-da-text">Weekly sales</p>
          <div className="flex h-20 items-end gap-2">
            {[
              [34, 0.35],
              [52, 0.5],
              [44, 0.45],
              [72, 0.7],
              [100, 1],
            ].map(([h, a]) => (
              <span key={h} className="flex-1 rounded-md" style={{ height: `${h}%`, background: `rgba(47,230,176,${a})` }} />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute top-[60px] right-[3%] rotate-[7deg]">
        <div
          className={cn(card, 'float-slower flex w-[206px] items-center gap-3 border-[#f0407f]/55 shadow-[0_24px_60px_rgba(240,64,127,0.24)]')}
        >
          <div className="flex h-[120px] w-[70px] shrink-0 flex-col gap-1 rounded-[14px] border-2 border-[#ff7db0] px-1.5 py-2">
            <span className="h-[26px] rounded-[5px] bg-[#ff7db0]/40" />
            <span className="h-1.5 w-[70%] rounded-[3px] bg-[#ff7db0]" />
            <span className="h-1.5 w-1/2 rounded-[3px] bg-[#ff7db0]/50" />
            <span className="mt-auto h-3.5 rounded-[5px] bg-[#f0407f]" />
          </div>
          <div className="text-xs leading-[18px]">
            <p className="font-semibold text-ux-text">Sign-up screen</p>
            <p className="mt-1 text-ink-muted">Version 3, after testing with five people</p>
          </div>
        </div>
      </div>
      <div className="absolute top-[384px] right-[6%] -rotate-6">
        <div className={cn(card, 'float-slow w-[214px] border-[#7b5cff]/55 shadow-[0_24px_60px_rgba(123,92,255,0.26)]')}>
          <svg viewBox="0 0 170 90" className="h-[86px] w-full">
            <g stroke="rgba(185,162,255,0.45)" strokeWidth="1.4">
              <path d="M20 15 85 25M20 15 85 65M20 45 85 25M20 45 85 65M20 75 85 25M20 75 85 65M85 25 150 45M85 65 150 45" />
            </g>
            <g fill="#b9a2ff">
              <circle cx="20" cy="15" r="7" />
              <circle cx="20" cy="45" r="7" />
              <circle cx="20" cy="75" r="7" />
              <circle cx="85" cy="25" r="8" />
              <circle cx="85" cy="65" r="8" />
            </g>
            <circle cx="150" cy="45" r="10" fill="#2fe6b0" />
          </svg>
          <p className="mt-2 text-xs font-medium text-ai-text">Model accuracy: 91%</p>
        </div>
      </div>
    </div>
  )
}

const tiles = [
  { icon: CodeXml, className: 'border-[#4d6bff]/55 bg-[rgba(77,107,255,0.16)] text-fe-text -rotate-[4deg]' },
  { icon: ChartColumn, className: 'border-[#2fe6b0]/50 bg-[rgba(47,230,176,0.14)] text-da-text rotate-3' },
  { icon: PenTool, className: 'border-[#f0407f]/55 bg-[rgba(240,64,127,0.14)] text-ux-text -rotate-3' },
  { icon: BrainCircuit, className: 'border-[#7b5cff]/55 bg-[rgba(123,92,255,0.16)] text-ai-text rotate-[4deg]' },
]

/** PrismLanding's hero: one pill per track in the headline, floating work samples on wide screens. */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative pt-10 pb-16 ph:pt-16 ph:pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[280px] left-1/2 h-[900px] w-[1500px] -translate-x-1/2"
        style={{
          opacity: 'var(--pc-glow-opacity)',
          background:
            'radial-gradient(closest-side at 30% 45%, rgba(77,107,255,0.34), rgba(77,107,255,0) 70%), radial-gradient(closest-side at 70% 40%, rgba(240,64,127,0.28), rgba(240,64,127,0) 70%), radial-gradient(closest-side at 50% 75%, rgba(123,92,255,0.32), rgba(123,92,255,0) 70%), radial-gradient(closest-side at 50% 20%, rgba(47,230,176,0.16), rgba(47,230,176,0) 70%)',
        }}
      />
      <Floaters />
      <div className="relative mx-auto flex max-w-[880px] flex-col items-center gap-8 px-4 text-center ph:px-6">
        <h1
          id="hero-title"
          className="font-display text-[44px] leading-[54px] font-extrabold tracking-[-0.04em] text-ink [text-wrap:wrap] ph:text-[78px] ph:leading-[90px]"
        >
          Learn{' '}
          {hero.pills.map(({ word, tone }, i) => (
            <span key={word}>
              <span className={cn('inline-block rounded-[0.3em] px-[0.24em] pt-[0.02em] pb-[0.1em] leading-[1.08]', pill[tone])}>
                {word}
              </span>
              {i < hero.pills.length - 2 ? ', ' : i === hero.pills.length - 2 ? ' and ' : ' '}
            </span>
          ))}
          by actually doing it.
        </h1>
        <p className="max-w-[640px] text-[19px] leading-[31px] text-ink-muted">{hero.intro}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <LinkButton href={'/onboarding' as Route} size="lg" className="gap-3 px-8">
            {hero.primary}
            <Icon as={ArrowRight} size={18} />
          </LinkButton>
          <a href={hero.secondary.href} className={buttonClasses({ variant: 'secondary', size: 'lg' }, 'px-6 font-medium')}>
            {hero.secondary.label}
          </a>
        </div>
        <div aria-hidden="true" className="grid w-full max-w-[420px] grid-cols-4 gap-3 wide:hidden">
          {tiles.map(({ icon, className }, i) => (
            <span key={i} className={`flex h-16 items-center justify-center rounded-[18px] border ${className}`}>
              <Icon as={icon} size={24} />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
