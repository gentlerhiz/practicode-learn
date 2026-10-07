'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { buttonClasses } from '@/components/ui/button'
import { CURRENCIES, PLAN_FEATURES, planPrices, type Currency } from '@/content/pricing'
import { cn } from '@/lib/cn'

function Toggle({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        'press h-[38px] cursor-pointer rounded-full px-4 text-[13px] font-medium',
        on ? 'bg-primary text-on-primary' : 'text-ink-soft hover:bg-hover hover:text-ink',
      )}
    >
      {children}
    </button>
  )
}

function Features({ items, tone }: { items: string[]; tone: string }) {
  return (
    <ul className="flex flex-col gap-3 text-sm text-ink-soft">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <Check aria-hidden="true" size={18} strokeWidth={1.85} className={cn('shrink-0', tone)} />
          {item}
        </li>
      ))}
    </ul>
  )
}

const head = 'px-6 py-6 ph:px-8'
const body = 'flex flex-1 flex-col gap-5 px-5 pt-6 pb-5 ph:px-8 ph:pb-8'
const price = 'font-display text-5xl leading-[52px] font-extrabold tracking-[-0.03em] text-ink'

/** The canvas's three plans with the currency and billing switches (landing #pricing and /pricing). */
export function PlanCards() {
  const [code, setCode] = useState<Currency>('NGN')
  const [yearly, setYearly] = useState(false)
  const p = planPrices(code, yearly)

  return (
    <div className="flex flex-col gap-8 ph:gap-12">
      <div className="flex flex-wrap justify-center gap-3">
        <div role="group" aria-label="Currency" className="flex flex-wrap gap-1 rounded-full border border-line bg-wash p-1">
          {(Object.keys(CURRENCIES) as Currency[]).map((key) => (
            <Toggle key={key} on={key === code} onClick={() => setCode(key)}>
              {CURRENCIES[key].label}
            </Toggle>
          ))}
        </div>
        <div role="group" aria-label="Billing period" className="flex gap-1 rounded-full border border-line bg-wash p-1">
          <Toggle on={!yearly} onClick={() => setYearly(false)}>
            Monthly
          </Toggle>
          <Toggle on={yearly} onClick={() => setYearly(true)}>
            Yearly · save {p.save}%
          </Toggle>
        </div>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 ph:gap-6 tab:grid-cols-3">
        <article className="surface flex flex-col overflow-hidden rounded-[28px] border border-line">
          <div className={cn(head, 'bg-[rgba(77,107,255,0.14)]')}>
            <h3 className="font-display text-2xl font-extrabold text-ink">Free</h3>
            <p className="mt-1 text-sm text-fe-text">For trying things out</p>
          </div>
          <div className={body}>
            <p className="flex items-baseline gap-2">
              <span className={price}>{p.free}</span>
              <span className="text-sm text-ink-muted">forever</span>
            </p>
            <Link href={'/onboarding' as Route} className={buttonClasses({ variant: 'secondary' }, 'h-12 w-full bg-transparent font-medium')}>
              Start Free
            </Link>
            <Features items={PLAN_FEATURES.free} tone="text-fe-text" />
          </div>
        </article>

        <div className="rounded-[29px] bg-[linear-gradient(160deg,#4d6bff_0%,#7b5cff_45%,#f0407f_100%)] p-[1.5px]">
          <article className="flex h-full flex-col overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,var(--pc-pro-top),var(--pc-sheet))]">
            <div className={cn(head, 'flex items-start justify-between gap-3 bg-[rgba(123,92,255,0.16)]')}>
              <div>
                <h3 className="font-display text-2xl font-extrabold text-ink">Pro</h3>
                <p className="mt-1 text-sm text-ai-text">For finishing what you start</p>
              </div>
              <span className="rounded-full bg-badge px-3 py-1 text-xs font-bold text-on-badge">7 days free</span>
            </div>
            <div className={body}>
              <div>
                <p className="flex flex-wrap items-baseline gap-2">
                  <span className={price}>{p.pro}</span>
                  <span className="text-sm text-ink-muted">{p.proPeriod}</span>
                </p>
                <p className="mt-1 text-[13px] text-ink-muted">{p.proNote}</p>
              </div>
              <Link href={'/checkout' as Route} className={buttonClasses({}, 'h-12 w-full')}>
                Start Free Trial
              </Link>
              <Features items={PLAN_FEATURES.pro} tone="text-ai-text" />
            </div>
          </article>
        </div>

        <article className="surface flex flex-col overflow-hidden rounded-[28px] border border-line">
          <div className={cn(head, 'bg-[rgba(240,64,127,0.14)]')}>
            <h3 className="font-display text-2xl font-extrabold text-ink">Mentor</h3>
            <p className="mt-1 text-sm text-ux-text">For learning with people</p>
          </div>
          <div className={body}>
            <div>
              <p className="flex flex-wrap items-baseline gap-2">
                <span className={price}>{p.mentor}</span>
                <span className="text-sm text-ink-muted">{p.mentorPeriod}</span>
              </p>
              <p className="mt-1 text-[13px] text-ink-muted">{p.mentorNote}</p>
            </div>
            <Link href={'/mentors' as Route} className={buttonClasses({ variant: 'secondary' }, 'h-12 w-full bg-transparent font-medium')}>
              Ask About Cohorts
            </Link>
            <Features items={PLAN_FEATURES.mentor} tone="text-ux-text" />
          </div>
        </article>
      </div>
    </div>
  )
}
