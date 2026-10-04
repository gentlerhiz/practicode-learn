import { ArrowRight, Icon } from '@/components/ui/icon'
import { buttonClasses } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { landing } from '@/content/landing'
import { primaryCta } from '@/content/navigation'
import { BrainCircuit, ChartColumn, CodeXml, PenTool } from 'lucide-react'

const { hero } = landing

/** Decorative cards that float beside the headline on wide screens: one per track's kind of work. */
function Floaters() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden wide:block">
      <div className="absolute top-16 left-[3%] -rotate-[8deg]">
        <div className="float-slow w-[232px] rounded-[22px] border border-[#4d6bff]/55 bg-[#100e1e]/80 p-4 font-mono text-xs leading-[22px] text-white">
          <div className="mb-3 flex gap-1">
            <span className="size-2 rounded-full bg-[#f0407f]" />
            <span className="size-2 rounded-full bg-[#ff8a3d]" />
            <span className="size-2 rounded-full bg-[#2fe6b0]" />
          </div>
          <div>
            <span className="text-[#8ea2ff]">&lt;h1&gt;</span>Hello, world
            <span className="text-[#8ea2ff]">&lt;/h1&gt;</span>
          </div>
          <div>
            <span className="text-[#8ea2ff]">&lt;p&gt;</span>My first website
            <span className="text-[#8ea2ff]">&lt;/p&gt;</span>
          </div>
          <div>
            <span className="text-[#8ea2ff]">&lt;button&gt;</span>Say hi
            <span className="text-[#8ea2ff]">&lt;/button&gt;</span>
          </div>
        </div>
      </div>
      <div className="absolute top-[384px] left-[6%] rotate-6">
        <div className="float-slower w-[204px] rounded-[22px] border border-[#2fe6b0]/50 bg-[#100e1e]/80 p-4">
          <p className="mb-3 text-[13px] font-semibold text-[#4be3a8]">Weekly sales</p>
          <div className="flex h-20 items-end gap-2">
            {[34, 52, 44, 72].map((h) => (
              <span key={h} className="flex-1 rounded-md bg-[#2fe6b0]/50" style={{ height: `${h}%` }} />
            ))}
            <span className="h-full flex-1 rounded-md bg-[#2fe6b0]" />
          </div>
        </div>
      </div>
      <div className="absolute top-[60px] right-[3%] rotate-[7deg]">
        <div className="float-slower flex w-[206px] items-center gap-3 rounded-[22px] border border-[#f0407f]/55 bg-[#100e1e]/80 p-4">
          <div className="flex h-[120px] w-[70px] flex-col gap-1 rounded-[14px] border-2 border-[#ff7db0] px-1.5 py-2">
            <span className="h-[26px] rounded-[5px] bg-[#ff7db0]/40" />
            <span className="h-1.5 w-[70%] rounded-[3px] bg-[#ff7db0]" />
            <span className="h-1.5 w-1/2 rounded-[3px] bg-[#ff7db0]/50" />
            <span className="mt-auto h-3.5 rounded-[5px] bg-[#f0407f]" />
          </div>
          <div className="text-xs leading-[18px]">
            <p className="font-semibold text-[#ff7db0]">Sign-up screen</p>
            <p className="mt-1 text-[#a9a6bc]">Version 3, after testing with five people</p>
          </div>
        </div>
      </div>
      <div className="absolute top-[384px] right-[6%] -rotate-6">
        <div className="float-slow w-[214px] rounded-[22px] border border-[#7b5cff]/55 bg-[#100e1e]/80 p-4">
          <svg viewBox="0 0 180 90" className="h-[90px] w-full">
            <g stroke="rgba(185,162,255,0.45)" strokeWidth="1.5">
              <path d="M20 15 90 30M20 15 90 65M20 45 90 30M20 45 90 65M20 75 90 30M20 75 90 65M90 30 160 45M90 65 160 45" />
            </g>
            <g fill="#b9a2ff">
              <circle cx="20" cy="15" r="7" />
              <circle cx="20" cy="45" r="7" />
              <circle cx="20" cy="75" r="7" />
              <circle cx="90" cy="30" r="8" />
              <circle cx="90" cy="65" r="8" />
            </g>
            <circle cx="160" cy="45" r="10" fill="#2fe6b0" />
          </svg>
          <p className="mt-2 text-xs font-medium text-[#b9a2ff]">Model accuracy: 91%</p>
        </div>
      </div>
    </div>
  )
}

const tiles = [
  { icon: CodeXml, className: 'border-[#4d6bff]/55 bg-[#4d6bff]/15 text-fe-text -rotate-[4deg]' },
  { icon: ChartColumn, className: 'border-[#2fe6b0]/50 bg-[#2fe6b0]/15 text-da-text rotate-3' },
  { icon: PenTool, className: 'border-[#f0407f]/55 bg-[#f0407f]/15 text-ux-text -rotate-3' },
  { icon: BrainCircuit, className: 'border-[#7b5cff]/55 bg-[#7b5cff]/15 text-ai-text rotate-[4deg]' },
]

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-10 pb-16 ph:pt-16 ph:pb-24">
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
          className="font-display text-[44px] leading-[54px] font-extrabold tracking-[-0.04em] text-ink ph:text-[64px] ph:leading-[76px] wide:text-[78px] wide:leading-[90px]"
        >
          {hero.title.before}{' '}
          <span className="inline-block -rotate-2 rounded-[0.3em] bg-fe px-[0.24em] pt-[0.02em] pb-[0.1em] leading-[1.08] text-white shadow-[0_0_44px_rgba(77,107,255,0.55)]">
            {hero.title.pill}
          </span>{' '}
          {hero.title.after}
        </h1>
        <p className="max-w-[640px] text-[17px] leading-7 text-ink-muted ph:text-[19px] ph:leading-[31px]">
          {hero.intro}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <LinkButton href={primaryCta.href} size="lg" className="px-8">
            {primaryCta.label}
            <Icon as={ArrowRight} size={18} />
          </LinkButton>
          <a
            href={hero.secondary.href}
            className={buttonClasses({ variant: 'secondary', size: 'lg' }, 'bg-row/40 font-medium')}
          >
            {hero.secondary.label}
          </a>
        </div>
        <div aria-hidden="true" className="grid w-full max-w-[420px] grid-cols-4 gap-3 wide:hidden">
          {tiles.map(({ icon, className }, i) => (
            <span
              key={i}
              className={`flex h-16 items-center justify-center rounded-[18px] border ${className}`}
            >
              <Icon as={icon} size={24} />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
