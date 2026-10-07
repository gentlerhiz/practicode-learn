'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { TrackIcon } from '@/components/learn/track-icon'
import { buttonClasses } from '@/components/ui'
import { cn } from '@/lib/cn'
import {
  PLAN_LEVELS,
  PLAN_TIMES,
  PLAN_TRACKS,
  planSummary,
  type LearningPlan,
  type PlanTrackId,
} from '@/lib/onboarding/plan'
import { savePlan, useSavedPlan } from '@/lib/onboarding/use-saved-plan'

/** Track colours on onboarding, straight from the canvas. Fills stay the same in both modes. */
const look: Record<PlanTrackId, { fill: string; fillFg: string; tint: string; text: string; glow: string; grad: string }> = {
  fe: { fill: '#3D5AF5', fillFg: '#FFFFFF', tint: 'rgba(77,107,255,0.16)', text: 'var(--pc-fe-text)', glow: 'rgba(77,107,255,0.36)', grad: 'linear-gradient(120deg, #4D6BFF, #7B5CFF)' },
  da: { fill: '#2FE6B0', fillFg: '#04241A', tint: 'rgba(47,230,176,0.14)', text: 'var(--pc-da-text)', glow: 'rgba(47,230,176,0.26)', grad: 'linear-gradient(120deg, #2FE6B0, #4D6BFF)' },
  ux: { fill: '#D9306F', fillFg: '#FFFFFF', tint: 'rgba(240,64,127,0.14)', text: 'var(--pc-ux-text)', glow: 'rgba(240,64,127,0.30)', grad: 'linear-gradient(120deg, #F0407F, #7B5CFF)' },
  ai: { fill: '#6E4CF5', fillFg: '#FFFFFF', tint: 'rgba(123,92,255,0.16)', text: 'var(--pc-ai-text)', glow: 'rgba(123,92,255,0.34)', grad: 'linear-gradient(120deg, #7B5CFF, #F0407F)' },
}

function Pill({ on, color, children, onClick }: { on: boolean; color: (typeof look)[PlanTrackId]; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        'press h-11 cursor-pointer rounded-full border px-4 text-sm font-medium',
        on ? 'text-ink' : 'border-line-control text-ink-soft hover:border-line-strong hover:bg-hover hover:text-ink',
      )}
      style={on ? { borderColor: color.fill, background: color.tint } : undefined}
    >
      {children}
    </button>
  )
}

/** PrismOnboarding: pick a track, a daily time and a starting point, then go on to sign-up. */
export function Onboarding() {
  const router = useRouter()
  const plan = useSavedPlan()
  const color = look[plan.track]
  const update = (change: Partial<LearningPlan>) => savePlan({ ...plan, ...change })

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[380px] left-1/2 h-[820px] w-[1400px] -translate-x-1/2 opacity-(--pc-glow-opacity) transition-[background] duration-300"
        style={{
          background: `radial-gradient(closest-side at 30% 50%, ${color.glow}, rgba(0,0,0,0) 72%), radial-gradient(closest-side at 72% 55%, rgba(123,92,255,0.22), rgba(123,92,255,0) 72%)`,
        }}
      />
      <header className="relative">
        <div className="mx-auto flex h-[72px] max-w-[1000px] items-center justify-between gap-4 px-4 min-[700px]:px-6">
          <Link href="/" aria-label="PractiCode Learn home" className="flex items-center gap-3">
            <svg viewBox="-10.4 -9.06 20.8 18.12" className="h-6 w-7 shrink-0" aria-hidden="true">
              <g style={{ fill: 'var(--pc-logo)', stroke: 'var(--pc-logo)', strokeWidth: 0.32, strokeLinejoin: 'round' }}>
                <polygon points="1.6,8.66 5,8.66 10,0 5,-8.66 -5,-8.66 -10,0 -5,8.66 -1,8.66 -3,5.196 -6,0 -3,-5.196 3,-5.196 6,0 3,5.196 -0.4,5.196" />
                <polygon points="-2.8,0 -1.4,2.425 1.4,2.425 2.8,0 1.4,-2.425 -1.4,-2.425" />
              </g>
            </svg>
            <span className="hidden text-lg whitespace-nowrap text-ink min-[700px]:inline">
              Practi<span className="font-bold">Code</span> Learn
            </span>
          </Link>
          <div className="flex max-w-[280px] flex-1 flex-col gap-1.5">
            <div aria-hidden="true" className="flex gap-1.5">
              <span className="h-1.5 flex-1 rounded-[3px] bg-[#4d6bff]" />
              <span className="h-1.5 flex-1 rounded-[3px] bg-[#7b5cff]" />
              <span className="h-1.5 flex-1 rounded-[3px] bg-meter" />
            </div>
            <p className="text-center text-xs text-ink-muted">Step 2 of 3</p>
          </div>
          <Link href="/signup" className="text-sm text-ink-muted underline underline-offset-2 hover:text-ink">
            Skip for now
          </Link>
        </div>
      </header>

      <main
        id="main"
        className="relative mx-auto box-border flex max-w-[840px] flex-col gap-8 px-4 pt-8 pb-12 min-[700px]:px-6 min-[700px]:pt-12 min-[700px]:pb-20"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.04em] text-ink min-[700px]:text-5xl min-[700px]:leading-[52px]">
            What do you want to learn first?
          </h1>
          <p className="text-base leading-[26px] text-ink-muted">No pressure. You can switch any time, and every track starts free.</p>
        </div>

        <section aria-labelledby="q-track">
          <h2 id="q-track" className="sr-only">
            Choose a track
          </h2>
          <div role="group" aria-labelledby="q-track" className="grid grid-cols-1 gap-4 min-[700px]:grid-cols-2">
            {PLAN_TRACKS.map((track) => {
              const on = track.id === plan.track
              const c = look[track.id]
              return (
                <button
                  key={track.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => update({ track: track.id })}
                  className={cn(
                    'press flex cursor-pointer items-start gap-4 rounded-[22px] border-[1.5px] p-5 text-left text-ink',
                    !on && 'surface border-line hover:border-line-strong',
                  )}
                  style={on ? { borderColor: c.fill, background: `linear-gradient(160deg, ${c.tint}, var(--pc-surface-sunken) 75%)` } : undefined}
                >
                  <span
                    className="flex size-[50px] shrink-0 items-center justify-center rounded-[15px]"
                    style={on ? { background: c.fill, color: c.fillFg } : { background: c.tint, color: c.text }}
                  >
                    <TrackIcon track={track.id} size={24} />
                  </span>
                  <span className="flex flex-1 flex-col gap-1">
                    <span className="font-display text-[19px] leading-[1.2] font-bold tracking-[-0.01em]">{track.name}</span>
                    <span className="text-sm leading-[21px] text-ink-muted">{track.line}</span>
                    <span className="mt-1 text-xs" style={{ color: on ? c.text : 'var(--pc-text-subtle)' }}>
                      {track.open ? track.meta : `${track.meta} · Opens soon`}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn('flex size-6 shrink-0 items-center justify-center rounded-full border-[1.5px]', !on && 'border-line-strong')}
                    style={on ? { borderColor: c.fill, background: c.fill, color: c.fillFg } : undefined}
                  >
                    <Check size={14} strokeWidth={2.6} className={on ? 'opacity-100' : 'opacity-0'} />
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section aria-labelledby="q-time" className="flex flex-col gap-3">
          <h2 id="q-time" className="font-display text-xl font-bold text-ink">
            How much time can you give it?
          </h2>
          <div role="group" aria-labelledby="q-time" className="flex flex-wrap gap-2">
            {PLAN_TIMES.map((time) => (
              <Pill key={time.id} on={time.id === plan.time} color={color} onClick={() => update({ time: time.id })}>
                {time.label}
              </Pill>
            ))}
          </div>
        </section>

        <section aria-labelledby="q-level" className="flex flex-col gap-3">
          <h2 id="q-level" className="font-display text-xl font-bold text-ink">
            Have you done any of this before?
          </h2>
          <div role="group" aria-labelledby="q-level" className="flex flex-wrap gap-2">
            {PLAN_LEVELS.map((level) => (
              <Pill key={level.id} on={level.id === plan.level} color={color} onClick={() => update({ level: level.id })}>
                {level.label}
              </Pill>
            ))}
          </div>
        </section>

        <div aria-live="polite" className="rounded-[22px] p-[1.5px]" style={{ background: color.grad }}>
          <div className="flex items-start gap-4 rounded-[21px] bg-sunken px-5 py-4">
            <span
              className="flex size-[30px] shrink-0 items-center justify-center rounded-[10px]"
              style={{ background: color.fill, color: color.fillFg }}
            >
              <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.85} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" />
              </svg>
            </span>
            <p className="text-[15px] leading-6 text-ink">
              <span className="font-semibold">Your plan: </span>
              <span className="text-ink-soft">{planSummary(plan)}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="press inline-flex h-12 items-center gap-2 rounded-full text-[15px] font-medium text-ink-muted hover:text-ink">
            <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.85} />
            Back
          </Link>
          <button
            type="button"
            onClick={() => {
              savePlan(plan)
              router.push('/signup' as Route)
            }}
            className={buttonClasses({ size: 'form' }, 'gap-3 px-8')}
          >
            Continue
            <ArrowRight aria-hidden="true" size={18} strokeWidth={1.85} />
          </button>
        </div>
      </main>
    </div>
  )
}
