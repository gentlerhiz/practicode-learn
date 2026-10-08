'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Briefcase, Check, GraduationCap, Rocket, Sparkles, TrendingUp, type LucideIcon } from 'lucide-react'
import { TrackIcon } from '@/components/learn/track-icon'
import { buttonClasses } from '@/components/ui'
import { cn } from '@/lib/cn'
import {
  PLAN_GOALS,
  PLAN_LEVELS,
  PLAN_TIMES,
  PLAN_TRACKS,
  planGoal,
  planLevel,
  planSummary,
  planTime,
  planTrack,
  type LearningPlan,
  type PlanGoalId,
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

const goalIcons: Record<PlanGoalId, LucideIcon> = {
  career: Briefcase,
  job: TrendingUp,
  build: Rocket,
  school: GraduationCap,
  curious: Sparkles,
}

export type OnboardingStep = 1 | 2 | 3
const stepHref = (step: OnboardingStep) => `/onboarding?step=${step}` as Route

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

/** A big choice card: icon tile, title, a line under it and a tick, as the canvas draws the tracks. */
function ChoiceCard({
  on,
  color,
  icon,
  title,
  line,
  meta,
  onClick,
}: {
  on: boolean
  color: (typeof look)[PlanTrackId]
  icon: React.ReactNode
  title: string
  line: string
  meta?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        'press flex cursor-pointer items-start gap-4 rounded-[22px] border-[1.5px] p-5 text-left text-ink',
        !on && 'surface border-line hover:border-line-strong',
      )}
      style={on ? { borderColor: color.fill, background: `linear-gradient(160deg, ${color.tint}, var(--pc-surface-sunken) 75%)` } : undefined}
    >
      <span
        className="flex size-[50px] shrink-0 items-center justify-center rounded-[15px]"
        style={on ? { background: color.fill, color: color.fillFg } : { background: color.tint, color: color.text }}
      >
        {icon}
      </span>
      <span className="flex flex-1 flex-col gap-1">
        <span className="font-display text-[19px] leading-[1.2] font-bold tracking-[-0.01em]">{title}</span>
        <span className="text-sm leading-[21px] text-ink-muted">{line}</span>
        {meta && (
          <span className="mt-1 text-xs" style={{ color: on ? color.text : 'var(--pc-text-subtle)' }}>
            {meta}
          </span>
        )}
      </span>
      <span
        aria-hidden="true"
        className={cn('flex size-6 shrink-0 items-center justify-center rounded-full border-[1.5px]', !on && 'border-line-strong')}
        style={on ? { borderColor: color.fill, background: color.fill, color: color.fillFg } : undefined}
      >
        <Check size={14} strokeWidth={2.6} className={on ? 'opacity-100' : 'opacity-0'} />
      </span>
    </button>
  )
}

function Heading({ title, intro }: { title: string; intro: string }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <h1 className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.04em] text-ink min-[700px]:text-5xl min-[700px]:leading-[52px]">
        {title}
      </h1>
      <p className="text-base leading-[26px] text-ink-muted">{intro}</p>
    </div>
  )
}

/** Back on the left, the next step on the right. */
function Actions({ back, next, nextLabel = 'Continue' }: { back: Route; next: () => void; nextLabel?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Link href={back} className="press inline-flex h-12 items-center gap-2 rounded-full text-[15px] font-medium text-ink-muted hover:text-ink">
        <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.85} />
        Back
      </Link>
      <button type="button" onClick={next} className={buttonClasses({ size: 'form' }, 'gap-3 px-8')}>
        {nextLabel}
        <ArrowRight aria-hidden="true" size={18} strokeWidth={1.85} />
      </button>
    </div>
  )
}

/** Step 1: why the learner is here. */
function GoalStep({ plan, update, next }: { plan: LearningPlan; update: (c: Partial<LearningPlan>) => void; next: () => void }) {
  const color = look.fe
  return (
    <>
      <Heading title="What brings you here?" intro="Pick the one that fits best. It helps us shape your plan." />
      <section aria-labelledby="q-goal">
        <h2 id="q-goal" className="sr-only">
          Choose a goal
        </h2>
        <div role="group" aria-labelledby="q-goal" className="grid grid-cols-1 gap-4 min-[700px]:grid-cols-2">
          {PLAN_GOALS.map((goal) => {
            const Icon = goalIcons[goal.id]
            return (
              <ChoiceCard
                key={goal.id}
                on={goal.id === plan.goal}
                color={color}
                icon={<Icon size={24} strokeWidth={1.85} aria-hidden="true" />}
                title={goal.label}
                line={goal.line}
                onClick={() => update({ goal: goal.id })}
              />
            )
          })}
        </div>
      </section>
      <Actions back={'/' as Route} next={next} />
    </>
  )
}

/** Step 2 (PrismOnboarding): a track, a daily time and a starting point. */
function TrackStep({ plan, update, next }: { plan: LearningPlan; update: (c: Partial<LearningPlan>) => void; next: () => void }) {
  const color = look[plan.track]
  return (
    <>
      <Heading title="What do you want to learn first?" intro="No pressure. You can switch any time, and every track starts free." />

      <section aria-labelledby="q-track">
        <h2 id="q-track" className="sr-only">
          Choose a track
        </h2>
        <div role="group" aria-labelledby="q-track" className="grid grid-cols-1 gap-4 min-[700px]:grid-cols-2">
          {PLAN_TRACKS.map((track) => (
            <ChoiceCard
              key={track.id}
              on={track.id === plan.track}
              color={look[track.id]}
              icon={<TrackIcon track={track.id} size={24} />}
              title={track.name}
              line={track.line}
              meta={track.open ? track.meta : `${track.meta} · Opens soon`}
              onClick={() => update({ track: track.id })}
            />
          ))}
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

      <PlanLine plan={plan} />
      <Actions back={stepHref(1)} next={next} />
    </>
  )
}

function PlanLine({ plan }: { plan: LearningPlan }) {
  const color = look[plan.track]
  return (
    <div aria-live="polite" className="rounded-[22px] p-[1.5px]" style={{ background: color.grad }}>
      <div className="flex items-start gap-4 rounded-[21px] bg-sunken px-5 py-4">
        <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[10px]" style={{ background: color.fill, color: color.fillFg }}>
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
  )
}

/** Step 3: the plan in full, the module they'll start with, and the free account that keeps it. */
function ReadyStep({ plan, firstModule, next }: { plan: LearningPlan; firstModule: FirstModule; next: () => void }) {
  const track = planTrack(plan)
  const color = look[track.open ? plan.track : 'fe']
  const rows: { label: string; value: string; change: Route }[] = [
    { label: 'Your goal', value: planGoal(plan).label, change: stepHref(1) },
    { label: 'Track', value: track.open ? track.name : `${track.name} (opens soon)`, change: stepHref(2) },
    { label: 'Time', value: `${planTime(plan).label}, ${planTime(plan).week}`, change: stepHref(2) },
    { label: 'Starting point', value: planLevel(plan).start, change: stepHref(2) },
  ]
  return (
    <>
      <Heading title="Your plan is ready" intro="Here’s how you’ll start. Create a free account to keep it on every device." />

      <div className="grid grid-cols-1 items-start gap-4 min-[860px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section aria-labelledby="plan-title" className="rounded-[24px] p-[1.5px]" style={{ background: color.grad }}>
          <div className="flex flex-col gap-4 rounded-[22.5px] bg-sunken p-6">
            <h2 id="plan-title" className="font-display text-xl font-bold text-ink">
              Your plan
            </h2>
            <dl className="flex flex-col">
              {rows.map((row) => (
                <div key={row.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 border-b border-divider py-3 last:border-b-0">
                  <dt className="text-[13px] text-ink-subtle">{row.label}</dt>
                  <dd className="col-start-1 text-[15px] font-medium text-ink">{row.value}</dd>
                  <dd className="col-start-2 row-span-2 row-start-1">
                    <Link href={row.change} className="text-[13px] text-ink-muted underline underline-offset-2 hover:text-ink">
                      Change<span className="sr-only"> {row.label.toLowerCase()}</span>
                    </Link>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="text-sm leading-[22px] text-ink-muted">{planSummary(plan)}</p>
          </div>
        </section>

        <section aria-labelledby="first-title" className="surface flex flex-col gap-4 rounded-[24px] border border-line p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[13px]" style={{ color: color.text }}>
                Front-End · Module 1
              </p>
              <h2 id="first-title" className="font-display text-xl font-bold text-ink">
                {firstModule.title}
              </h2>
            </div>
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-on-primary">Free</span>
          </div>
          {!track.open && (
            <p className="text-sm leading-[22px] text-ink-muted">
              {track.name} opens soon. You’ll start here in the meantime, and we’ll tell you when it’s ready.
            </p>
          )}
          <ol className="flex flex-col">
            {firstModule.lessons.map((title, i) => (
              <li key={title} className="flex items-center gap-3 border-b border-divider py-2.5 text-[15px] text-ink last:border-b-0">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-control text-xs font-semibold text-ink-muted">{i + 1}</span>
                {title}
              </li>
            ))}
          </ol>
          <p className="text-[13px] text-ink-subtle">Then a small project: {firstModule.project}.</p>
        </section>
      </div>

      <Actions back={stepHref(2)} next={next} nextLabel="Create My Free Account" />
      <p className="-mt-4 text-center text-sm text-ink-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-ink underline underline-offset-2">
          Log in
        </Link>
      </p>
    </>
  )
}

export type FirstModule = { title: string; lessons: string[]; project: string }

/** Onboarding in three steps: a goal, then a track and pace (PrismOnboarding), then the plan and sign-up. */
export function Onboarding({ step, firstModule }: { step: OnboardingStep; firstModule: FirstModule }) {
  const router = useRouter()
  const plan = useSavedPlan()
  const color = look[plan.track]
  const update = (change: Partial<LearningPlan>) => savePlan({ ...plan, ...change })
  const go = (to: OnboardingStep) => {
    savePlan(plan)
    router.push(stepHref(to))
  }

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[380px] left-1/2 h-[820px] w-[1400px] -translate-x-1/2 opacity-(--pc-glow-opacity) transition-[background] duration-300"
        style={{
          background: `radial-gradient(closest-side at 30% 50%, ${step === 1 ? look.fe.glow : color.glow}, rgba(0,0,0,0) 72%), radial-gradient(closest-side at 72% 55%, rgba(123,92,255,0.22), rgba(123,92,255,0) 72%)`,
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
              {([1, 2, 3] as const).map((n) => (
                <span key={n} className={cn('h-1.5 flex-1 rounded-[3px]', n < step ? 'bg-[#4d6bff]' : n === step ? 'bg-[#7b5cff]' : 'bg-meter')} />
              ))}
            </div>
            <p className="text-center text-xs text-ink-muted">Step {step} of 3</p>
          </div>
          <Link href="/login" className="text-sm text-ink-muted underline underline-offset-2 hover:text-ink">
            Log in
          </Link>
        </div>
      </header>

      <main
        id="main"
        className="relative mx-auto box-border flex max-w-[840px] flex-col gap-8 px-4 pt-8 pb-12 min-[700px]:px-6 min-[700px]:pt-12 min-[700px]:pb-20"
      >
        {step === 1 && <GoalStep plan={plan} update={update} next={() => go(2)} />}
        {step === 2 && <TrackStep plan={plan} update={update} next={() => go(3)} />}
        {step === 3 && (
          <ReadyStep
            plan={plan}
            firstModule={firstModule}
            next={() => {
              savePlan(plan)
              router.push('/signup' as Route)
            }}
          />
        )}
      </main>
    </div>
  )
}
