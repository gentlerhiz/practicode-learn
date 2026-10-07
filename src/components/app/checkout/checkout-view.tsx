'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { Logo } from '@/components/layout/logo'
import { buttonClasses } from '@/components/ui/button'
import { Field, Input, inputClasses } from '@/components/ui/field'
import { Glyph } from '@/components/ui/glyph'
import { cn } from '@/lib/cn'

const PERIODS = [
  { id: 'yearly', name: 'Yearly', price: '₦59,000', per: ' /year', note: 'About ₦4,917 a month. Save 24%.', best: true },
  { id: 'monthly', name: 'Monthly', price: '₦6,500', per: ' /month', note: 'Flexible. Stop whenever you like.', best: false },
] as const

const METHODS = [
  { id: 'card', label: 'Card', path: 'M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM2 10h20M6 15h4' },
  { id: 'bank', label: 'Bank transfer', path: 'M3 10 12 4l9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18' },
  { id: 'ussd', label: 'USSD', path: 'M4 9h16M4 15h16M10 3 8 21M16 3l-2 18' },
] as const

const PRO = ['Every module in every track', 'AI tutor, 50 questions a day', 'Projects with automatic checks', 'Verified certificates', 'Download any module for offline']

function MethodIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.85} strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  )
}

/**
 * PrismCheckout. `live` is false until payments are real: then nothing can be paid, the card fields are
 * never shown, and the page says so. The canvas version (with card fields) appears only in the preview.
 */
export function CheckoutView({ live, trial }: { live: boolean; trial?: { ends: string; daysLeft: number } }) {
  const [period, setPeriod] = useState<'yearly' | 'monthly'>('yearly')
  const [method, setMethod] = useState<'card' | 'bank' | 'ussd'>('card')
  const [code, setCode] = useState('')
  const [codeNote, setCodeNote] = useState('')
  const chosen = PERIODS.find((p) => p.id === period)!
  const every = period === 'yearly' ? 'each year' : 'each month'
  const sumName = `Pro, ${period === 'yearly' ? 'yearly' : 'monthly'}`

  const submitLabel = !live
    ? 'Payments Open Soon'
    : method === 'card'
      ? 'Save Card and Keep Pro'
      : method === 'bank'
        ? 'Get Account Details'
        : 'Get My USSD Code'
  const submitHref = (method === 'card' ? '/fixtures/screens/paid' : '/fixtures/screens/bank-transfer') as Route

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[300px] -right-[200px] h-[820px] w-[1100px] opacity-(--pc-glow-opacity)"
        style={{
          background:
            'radial-gradient(closest-side at 40% 45%, rgba(123,92,255,0.28), rgba(123,92,255,0) 72%), radial-gradient(closest-side at 70% 65%, rgba(240,64,127,0.18), rgba(240,64,127,0) 72%)',
        }}
      />
      <header className="relative border-b border-line-subtle">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-4 px-4 ph:px-6">
          <Logo href={'/home' as Route} compact />
          <p className="flex items-center gap-2 text-sm text-ink-muted">
            <Glyph name="lock" size={16} />
            Secure checkout
          </p>
        </div>
      </header>
      <main id="main" className="relative mx-auto box-border grid max-w-[1200px] grid-cols-1 items-start gap-10 px-4 pt-8 pb-16 ph:px-6 ph:pt-12 ph:pb-20 tab:grid-cols-[minmax(0,1fr)_minmax(0,420px)] tab:gap-14">
        <div className="flex min-w-0 flex-col gap-8">
          <div className="flex flex-col gap-3">
            <Link href={'/pricing' as Route} className="flex items-center gap-2 self-start text-sm text-ink-muted hover:text-ink">
              <Glyph name="chevronRight" size={16} className="rotate-180" />
              Back to plans
            </Link>
            <h1 className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.035em] text-ink ph:text-[46px] ph:leading-[50px]">
              {trial ? 'Keep Pro after your trial.' : 'Choose your Pro plan.'}
            </h1>
            <p className="max-w-[560px] text-[17px] leading-7 text-ink-muted">
              {trial
                ? `Your free trial ends on ${trial.ends}. Choose a plan now and nothing changes: every module, verified certificates and 50 AI tutor questions a day. You won’t pay anything today.`
                : 'Pro launches with the full track. This is exactly how checkout will work, but payments aren’t open yet, so nothing can be charged and we won’t ask for card details.'}
            </p>
          </div>

          <section aria-labelledby="period-title" className="flex flex-col gap-4">
            <h2 id="period-title" className="font-display text-xl font-bold text-ink">
              1. How often do you want to pay?
            </h2>
            <div role="radiogroup" aria-labelledby="period-title" className="grid grid-cols-1 gap-3 ph:grid-cols-2">
              {PERIODS.map((p) => {
                const on = p.id === period
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setPeriod(p.id)}
                    className={cn(
                      'press relative flex cursor-pointer flex-col gap-1 rounded-[20px] border-[1.5px] py-4 pr-4 pl-14 text-left text-ink',
                      on ? 'border-primary bg-hover' : 'border-line hover:border-line-strong',
                    )}
                  >
                    <span className={cn('absolute top-5 left-[18px] flex size-5 items-center justify-center rounded-full border-[1.5px]', on ? 'border-primary' : 'border-line-strong')}>
                      {on && <span className="block size-2.5 rounded-full bg-primary" />}
                    </span>
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-semibold">{p.name}</span>
                      {p.best && <span className="rounded-full bg-badge px-2 py-0.5 text-xs font-bold text-on-badge">Best value</span>}
                    </span>
                    <span className="font-display text-[26px] leading-8 font-extrabold tracking-[-0.02em]">
                      {p.price}
                      <span className="font-sans text-sm font-normal tracking-normal text-ink-muted">{p.per}</span>
                    </span>
                    <span className="text-[13px] text-ink-muted">{p.note}</span>
                  </button>
                )
              })}
            </div>
            <p className="text-[13px] text-ink-subtle">
              Prices in Nigerian naira.{' '}
              <Link href={'/pricing' as Route} className="text-ink-soft underline underline-offset-2 hover:text-ink">
                Change currency
              </Link>
            </p>
          </section>

          <section aria-labelledby="method-title" className="flex flex-col gap-4">
            <h2 id="method-title" className="font-display text-xl font-bold text-ink">
              2. How would you like to pay?
            </h2>
            <div role="radiogroup" aria-labelledby="method-title" className="grid grid-cols-1 gap-3 ph:grid-cols-3">
              {METHODS.map((m) => {
                const on = m.id === method
                return (
                  <button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setMethod(m.id)}
                    className={cn(
                      'press flex h-16 cursor-pointer items-center justify-center gap-3 rounded-2xl border-[1.5px] text-[15px] font-medium text-ink',
                      on ? 'border-[#7b5cff] bg-[rgba(123,92,255,0.14)] [&_svg]:text-ai-text' : 'border-line bg-sunken hover:border-line-strong [&_svg]:text-ink-muted',
                    )}
                  >
                    <MethodIcon path={m.path} />
                    {m.label}
                  </button>
                )
              })}
            </div>
            <div className="surface flex flex-col gap-4 rounded-[22px] border border-line p-6">
              {method === 'card' &&
                (live ? (
                  <>
                    <Field id="cc" label="Card number">
                      <Input id="cc" inputMode="numeric" autoComplete="cc-number" defaultValue="5399 8312 0047 2216" />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field id="exp" label="Expiry">
                        <Input id="exp" autoComplete="cc-exp" placeholder="MM / YY" />
                      </Field>
                      <Field id="cvc" label="Security code">
                        <Input id="cvc" inputMode="numeric" autoComplete="cc-csc" placeholder="3 digits on the back" />
                      </Field>
                    </div>
                    <p className="text-[13px] leading-5 text-ink-subtle">
                      Your bank may send a one-time code to confirm. We’ll take a tiny verification charge and refund it straight away.
                    </p>
                  </>
                ) : (
                  <div className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-[rgba(123,92,255,0.16)] text-ai-text">
                      <Glyph name="lock" size={20} />
                    </span>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-base font-semibold text-ink">Card payments open with Pro</p>
                      <p className="text-sm leading-[22px] text-ink-muted">
                        When they do, your card goes straight to our payment provider. We never see or store your full card number.
                      </p>
                    </div>
                  </div>
                ))}
              {method === 'bank' && (
                <>
                  <div className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-[rgba(123,92,255,0.16)] text-ai-text">
                      <MethodIcon path={METHODS[1].path} />
                    </span>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-base font-semibold text-ink">Pay by bank transfer</p>
                      <p className="text-sm leading-[22px] text-ink-muted">
                        On the next screen you’ll get an account number just for this payment. Transfers usually confirm within a few
                        minutes, and we’ll email you when it lands.
                      </p>
                    </div>
                  </div>
                  <p className="text-[13px] leading-5 text-ink-subtle">Bank transfer can’t renew by itself, so we’ll send you a reminder before each payment is due.</p>
                </>
              )}
              {method === 'ussd' && (
                <>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="bank" className="text-sm font-medium text-ink">
                      Your bank
                    </label>
                    <select id="bank" disabled={!live} className={cn(inputClasses, 'text-ink-muted')} defaultValue="">
                      <option value="" disabled>
                        Choose your bank
                      </option>
                      {['Access Bank', 'First Bank', 'GTBank', 'Opay', 'UBA', 'Zenith Bank'].map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-sm leading-[22px] text-ink-muted">We’ll give you a short code to dial. It works on any phone, even without data.</p>
                </>
              )}
            </div>
          </section>

          <div className="flex flex-col gap-4">
            {live ? (
              <Link href={submitHref} className={buttonClasses({}, 'h-14 w-full text-base')}>
                {submitLabel}
              </Link>
            ) : (
              <button type="button" disabled className={buttonClasses({}, 'h-14 w-full text-base')}>
                {submitLabel}
              </button>
            )}
            <p className="text-center text-[13px] leading-[21px] text-ink-subtle">
              {live
                ? `You won’t pay anything today. Then ${chosen.price} ${every} until you cancel.`
                : 'Until Pro launches, every lesson that’s open is free, with no card and no trial clock.'}
            </p>
          </div>
        </div>

        <aside aria-labelledby="order-title" className="flex flex-col gap-4 tab:sticky tab:top-6">
          <div className="rounded-[29px] bg-[linear-gradient(160deg,#4d6bff_0%,#7b5cff_45%,#f0407f_100%)] p-[1.5px]">
            <div className="flex flex-col gap-5 rounded-[28px] bg-[linear-gradient(180deg,var(--pc-pro-top),var(--pc-sheet))] p-6 ph:p-8">
              <h2 id="order-title" className="font-display text-[22px] font-bold text-ink">
                Your order
              </h2>
              <div className="flex flex-col gap-3 text-[15px] text-ink">
                <div className="flex justify-between gap-3">
                  <span>{sumName}</span>
                  <span>{chosen.price}</span>
                </div>
                {trial && (
                  <div className="flex justify-between gap-3 text-success">
                    <span>Free until {trial.ends}</span>
                    <span>{trial.daysLeft} days left</span>
                  </div>
                )}
              </div>
              <details className="border-t border-divider pt-4">
                <summary className="cursor-pointer text-sm text-ink-soft hover:text-ink">Got a coupon or scholarship code?</summary>
                <div className="mt-3 flex gap-2">
                  <input aria-label="Code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter code" className={inputClasses} />
                  <button
                    type="button"
                    onClick={() => setCodeNote(code.trim() ? 'Codes can be used once payments open.' : 'Enter a code first.')}
                    className={buttonClasses({ variant: 'secondary' }, 'h-[52px] bg-transparent px-5 font-medium')}
                  >
                    Apply
                  </button>
                </div>
                {codeNote && (
                  <p role="status" className="mt-2 text-[13px] text-ink-muted">
                    {codeNote}
                  </p>
                )}
              </details>
              <div className="flex flex-col gap-1.5 border-t border-divider pt-4">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-base font-semibold text-ink">Due today</span>
                  <span className="font-display text-4xl leading-10 font-extrabold text-ink">₦0</span>
                </div>
                <p className="text-[13px] text-ink-muted">{live ? `Then ${chosen.price} ${every}.` : 'Nothing can be charged until payments open.'}</p>
              </div>
              <ul className="flex flex-col gap-3 text-sm text-ink-soft">
                {PRO.map((p) => (
                  <li key={p} className="flex gap-3">
                    <Glyph name="check" size={18} className="shrink-0 text-ai-text" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-3 px-2 text-[13px] leading-5 text-ink-muted">
            <p className="flex gap-3">
              <Glyph name="bell" size={18} className="shrink-0" />
              <span>We’ll remind you two days before your trial ends, so nothing comes as a surprise.</span>
            </p>
            <p className="flex gap-3">
              <Glyph name="lock" size={18} className="shrink-0" />
              <span>Payments are encrypted. We never see or store your full card number.</span>
            </p>
            <p className="flex gap-3">
              <Glyph name="check" size={18} className="shrink-0" />
              <span>Cancel in one click from Settings. No phone calls, no forms.</span>
            </p>
          </div>
          <p className="px-2 text-[13px] text-ink-muted">
            Money tight right now?{' '}
            <Link href={'/scholarship' as Route} className="text-fe-text underline underline-offset-2 hover:text-ink">
              Apply for a scholarship
            </Link>
          </p>
        </aside>
      </main>
    </div>
  )
}
