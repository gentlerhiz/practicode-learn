'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { TrackIcon, trackFill, trackText } from '@/components/learn/track-icon'
import { planLevel, planTime, planTrack } from '@/lib/onboarding/plan'
import { useSavedPlan } from '@/lib/onboarding/use-saved-plan'
import { TutorSpark } from '@/components/learn/tutor-spark'

const FREE = [
  'Module 1 of every track',
  'A 4-minute daily review',
  'AI tutor, 5 questions a day',
  'Progress saved on every device',
]

/** The "Your plan" card beside sign-up, from what the learner chose in onboarding. */
export function PlanCard() {
  const plan = useSavedPlan()
  const track = planTrack(plan)
  const rows = [
    { label: 'Time', value: planTime(plan).label },
    { label: 'Starting point', value: planLevel(plan).start },
    { label: 'First lesson', value: track.open ? 'How the web works · Lesson 1' : 'Opens soon' },
  ]
  return (
    <aside aria-labelledby="plan-title" className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[60px] opacity-(--pc-glow-opacity)"
        style={{ background: 'radial-gradient(closest-side at 50% 40%, rgba(77,107,255,0.28), rgba(77,107,255,0) 75%)' }}
      />
      <div className="relative rounded-[31px] bg-[linear-gradient(120deg,#4d6bff,#7b5cff)] p-[1.5px]">
        <div className="surface flex flex-col gap-6 rounded-[30px] p-5 ph:p-8">
          <div className="flex items-center justify-between gap-3">
            <h2 id="plan-title" className="font-display text-[22px] font-bold text-ink">
              Your plan
            </h2>
            <Link
              href={'/onboarding' as Route}
              className="text-[13px] font-medium text-fe-text underline underline-offset-2 hover:text-ink"
            >
              Change
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className={`flex size-[52px] shrink-0 items-center justify-center rounded-2xl ${trackFill[track.id]}`}>
              <TrackIcon track={track.id} size={24} />
            </span>
            <div>
              <p className="font-display text-xl leading-6 font-bold text-ink">{track.name}</p>
              <p className={`mt-1 text-[13px] ${trackText[track.id]}`}>{track.open ? track.meta : `${track.meta.split(' · ')[0]} · Opens soon`}</p>
            </div>
          </div>
          <dl className="flex flex-col border-t border-divider">
            {rows.map((row) => (
              <div key={row.label} className="flex justify-between gap-4 border-b border-divider py-4 text-sm">
                <dt className="text-ink-muted">{row.label}</dt>
                <dd className="text-right text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-ink">Free with your account</p>
            <ul className="flex flex-col gap-3 text-sm text-ink-soft">
              {FREE.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check aria-hidden="true" size={18} strokeWidth={2.2} className="shrink-0 text-fe-text" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-start gap-3 rounded-[18px] border border-divider bg-sunken p-4">
            <TutorSpark />
            <p className="text-[13px] leading-[21px] text-ink-soft">
              Tip from your tutor: 20 minutes a day beats a three-hour Saturday. Little and often is how it sticks.
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
