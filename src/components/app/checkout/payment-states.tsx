'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { Logo } from '@/components/layout/logo'
import { buttonClasses } from '@/components/ui/button'
import { Glyph, type GlyphName } from '@/components/ui/glyph'
import { cn } from '@/lib/cn'

/** The slim payment header with its glow (PrismBankTransfer, PrismPaid, PrismPayFailed). */
function PayFrame({ glow, aside, children, width = 'max-w-[600px]' }: { glow: string; aside: React.ReactNode; children: React.ReactNode; width?: string }) {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[360px] left-1/2 h-[860px] w-[1400px] -translate-x-1/2 opacity-(--pc-glow-opacity)"
        style={{ background: `radial-gradient(closest-side at 40% 45%, ${glow}, rgba(0,0,0,0) 72%), radial-gradient(closest-side at 65% 55%, rgba(123,92,255,0.22), rgba(123,92,255,0) 72%)` }}
      />
      <header className="relative border-b border-line-subtle">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-4 px-4 ph:px-6">
          <Logo href={'/home' as Route} compact />
          {aside}
        </div>
      </header>
      <main id="main" className={cn('relative mx-auto box-border flex flex-col gap-8 px-4 pt-8 pb-16 ph:px-6 ph:pt-12 ph:pb-20', width)}>
        {children}
      </main>
    </div>
  )
}

const secure = (
  <p className="flex items-center gap-2 text-[13px] text-success">
    <Glyph name="lock" size={15} />
    Secure payment
  </p>
)

export type TransferData = { amount: string; account: string; bank: string; name: string; expires: string; ussd: string; startsNote: string }

/** PrismBankTransfer: one-off account details, or a USSD code, then "checking", then received. */
export function BankTransferView({ data }: { data: TransferData }) {
  const [method, setMethod] = useState<'bank' | 'ussd'>('bank')
  const [stage, setStage] = useState<'waiting' | 'checking' | 'done'>('waiting')
  const [copied, setCopied] = useState('')
  const copy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value.replace(/\s/g, label === 'Account name' || label === 'Bank' ? ' ' : '')).then(() => setCopied(label), () => setCopied(''))
  }
  const rows: [string, string, string?][] = [
    ['Amount', data.amount, 'font-display text-[22px] font-extrabold'],
    ['Account number', data.account, 'font-mono text-[22px] font-semibold tracking-[0.06em]'],
    ['Bank', data.bank],
    ['Account name', data.name],
  ]
  return (
    <PayFrame glow="rgba(123,92,255,0.26)" aside={secure}>
      {stage === 'waiting' && (
        <>
          <Link href={'/fixtures/screens/checkout' as Route} className="flex items-center gap-2 self-start text-[13px] text-ink-muted hover:text-ink">
            <Glyph name="chevronRight" size={15} className="rotate-180" />
            Choose another way to pay
          </Link>
          <div className="flex flex-col gap-3">
            <h1 className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.035em] text-ink ph:text-[34px] ph:leading-10">Pay {data.amount} to keep Pro</h1>
            <p className="text-[15px] leading-6 text-ink-muted">{data.startsNote}</p>
          </div>
          <div role="group" aria-label="Payment method" className="flex gap-1 rounded-full border border-line bg-wash p-1">
            {(['bank', 'ussd'] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={method === m}
                onClick={() => setMethod(m)}
                className={cn('press h-10 flex-1 cursor-pointer rounded-full text-sm font-medium', method === m ? 'bg-primary text-on-primary' : 'text-ink-soft hover:bg-hover')}
              >
                {m === 'bank' ? 'Bank transfer' : 'USSD'}
              </button>
            ))}
          </div>
          {method === 'bank' ? (
            <>
              <div className="surface flex flex-col rounded-[22px] border border-line px-5 py-4">
                <div className="flex items-center justify-between gap-3 pb-3">
                  <p className="text-sm font-semibold text-ink">Send exactly this</p>
                  <p className="flex items-center gap-1.5 text-xs text-badge-text">
                    <Glyph name="clock" size={14} />
                    Account expires in {data.expires}
                  </p>
                </div>
                {rows.map(([label, value, look]) => (
                  <div key={label} className="flex items-center justify-between gap-3 border-t border-line-subtle py-3">
                    <div>
                      <p className="text-xs text-ink-subtle">{label}</p>
                      <p className={cn('mt-0.5 text-[15px] text-ink', look)}>{value}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copy(label, value)}
                      aria-label={`Copy ${label.toLowerCase()}`}
                      className="press flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-line-control px-3 text-xs text-ink hover:bg-hover"
                    >
                      <Glyph name={copied === label ? 'check' : 'copy'} size={13} />
                      {copied === label ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>
              <ol className="flex flex-col gap-3 text-sm leading-[22px] text-ink-soft">
                {[
                  'Open your bank app, or dial your bank’s USSD code.',
                  `Send exactly ${data.amount} to the account above. This account is only for this payment.`,
                  'Come back here. We confirm it for you, usually within a few minutes.',
                ].map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-on-primary">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <div className="surface flex flex-col gap-3 rounded-[22px] border border-line p-6">
              <p className="text-sm text-ink-muted">Dial this code from the phone linked to your bank account</p>
              <p className="font-display text-[32px] font-extrabold tracking-[-0.02em] text-ink">{data.ussd}</p>
              <p className="text-sm leading-[22px] text-ink-muted">
                Your bank asks you to confirm {data.amount} to PractiCode Learn with your PIN. It works on any phone, even without data. The code expires in {data.expires}.
              </p>
            </div>
          )}
          <div className="flex flex-col gap-3">
            <button type="button" onClick={() => setStage('checking')} className={buttonClasses({ size: 'form' }, 'w-full')}>
              I’ve Sent the Money
            </button>
            <p className="text-center text-xs text-ink-subtle">Sent a different amount by mistake? We refund it within 2 working days.</p>
          </div>
        </>
      )}
      {stage === 'checking' && (
        <div className="flex flex-col items-center gap-6 pt-8 text-center">
          <span aria-hidden="true" className="block size-14 animate-spin rounded-full border-4 border-line border-t-[#7b5cff]" />
          <div className="flex flex-col gap-3">
            <h1 className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.035em] text-ink">Checking for your payment</h1>
            <p className="text-[15px] leading-6 text-ink-muted">This usually takes a few minutes. You can close this page. We’ll email you the moment it lands.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => setStage('done')} className={buttonClasses({}, 'h-12 px-6')}>
              Check Again
            </button>
            <Link href={'/fixtures/screens/dashboard' as Route} className={buttonClasses({ variant: 'secondary' }, 'h-12 bg-transparent px-6 font-medium')}>
              Back to My Dashboard
            </Link>
          </div>
        </div>
      )}
      {stage === 'done' && (
        <div className="flex flex-col items-center gap-6 pt-8 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-[rgba(47,230,176,0.16)] text-success">
            <Glyph name="check" size={26} strokeWidth={2.2} />
          </span>
          <h1 className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.035em] text-ink">Payment received</h1>
          <p className="text-[15px] leading-6 text-ink-muted">Thank you. Pro stays on, and a receipt is on its way to your email.</p>
          <Link href={'/fixtures/screens/paid' as Route} className={buttonClasses({}, 'h-12 px-6')}>
            See My Receipt
          </Link>
        </div>
      )}
    </PayFrame>
  )
}

export type PaidData = { firstName: string; intro: string; receipt: [string, string][]; continueHref: Route }

const UNLOCKED: { icon: GlyphName; title: string; body: string }[] = [
  { icon: 'book', title: 'Every module in every track', body: 'Front-End, Data, Design and AI. Switch whenever you like.' },
  { icon: 'target', title: 'AI tutor, 50 questions a day', body: 'Ten times the help when you get stuck.' },
  { icon: 'shield', title: 'Verified certificates', body: 'Earn one for each track you finish.' },
  { icon: 'download', title: 'Download any module', body: 'Learn on the bus, offline.' },
]

/** PrismPaid. */
export function PaidView({ data }: { data: PaidData }) {
  return (
    <PayFrame
      glow="rgba(47,230,176,0.22)"
      width="max-w-[880px]"
      aside={
        <Link href={'/fixtures/screens/dashboard' as Route} className="text-sm text-ink-muted underline underline-offset-2 hover:text-ink">
          Back to Home
        </Link>
      }
    >
      <section className="flex flex-col items-center gap-5 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-[rgba(47,230,176,0.16)] text-success">
          <Glyph name="check" size={26} strokeWidth={2.2} />
        </span>
        <h1 className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.035em] text-ink ph:text-[40px] ph:leading-[44px]">
          You’re set, {data.firstName}. Pro is yours.
        </h1>
        <p className="max-w-[520px] text-[15px] leading-6 text-ink-muted">{data.intro}</p>
        <div className="flex w-full flex-col justify-center gap-3 ph:w-auto ph:flex-row">
          <Link href={data.continueHref} className={buttonClasses({}, 'h-12 px-6')}>
            Continue My Lesson
            <Glyph name="arrowRight" size={16} />
          </Link>
          <Link href={'/settings' as Route} className={buttonClasses({ variant: 'secondary' }, 'h-12 bg-transparent px-6 font-medium')}>
            Save Modules for Offline
          </Link>
        </div>
      </section>
      <div className="grid grid-cols-1 gap-4 tab:grid-cols-2">
        <div className="surface flex flex-col gap-4 rounded-3xl border border-line p-6">
          <h2 className="font-display text-lg font-bold text-ink">Your receipt</h2>
          <dl className="flex flex-col text-[13px]">
            {data.receipt.map(([k, v], i) => (
              <div key={k} className={cn('flex justify-between gap-3 py-2.5', i > 0 && 'border-t border-line-subtle')}>
                <dt className="text-ink-subtle">{k}</dt>
                <dd className="text-right text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <Link href={'/settings' as Route} className="text-[13px] text-fe-text underline underline-offset-2 hover:text-ink">
            Manage your plan
          </Link>
        </div>
        <div className="surface flex flex-col gap-4 rounded-3xl border border-line p-6">
          <h2 className="font-display text-lg font-bold text-ink">Now unlocked</h2>
          {UNLOCKED.map((u) => (
            <div key={u.title} className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(123,92,255,0.16)] text-ai-text">
                <Glyph name={u.icon} size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{u.title}</p>
                <p className="text-[13px] text-ink-muted">{u.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PayFrame>
  )
}

const OTHER: { icon: GlyphName; title: string; body: string; action: string }[] = [
  { icon: 'card', title: 'Try another card', body: 'Any Visa, Mastercard or Verve card.', action: 'Use a card' },
  { icon: 'home', title: 'Bank transfer', body: 'Get an account number just for this payment.', action: 'Get details' },
  { icon: 'menu', title: 'USSD', body: 'Pay from any phone, even without data.', action: 'Get a code' },
]

/** PrismPayFailed: what went wrong, what usually fixes it, and other ways to pay. */
export function PayFailedView({ trialEnds, reference }: { trialEnds: string; reference: string }) {
  return (
    <PayFrame glow="rgba(255,154,162,0.18)" aside={secure}>
      <div className="flex flex-col gap-3">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-[rgba(255,154,162,0.14)] text-error">
          <Glyph name="x" size={22} strokeWidth={2.2} />
        </span>
        <h1 className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.035em] text-ink ph:text-[34px] ph:leading-10">Your bank declined the card</h1>
        <p className="text-[15px] leading-6 text-ink-muted">
          Nothing was charged, and your Pro trial carries on until {trialEnds}. This often happens when a card isn’t set up for online payments.
        </p>
      </div>
      <div className="surface flex flex-col gap-3 rounded-[22px] border border-line p-5">
        <p className="text-sm font-semibold text-ink">What usually fixes it</p>
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-[13px] leading-5 text-ink-soft">
          <li>Turn on online or international payments in your bank app.</li>
          <li>Check the card hasn’t expired and has enough money on it.</li>
          <li>Try again in a few minutes. Banks sometimes block a first payment to a new shop.</li>
        </ul>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-ink">Or pay another way</p>
        {OTHER.map((o) => (
          <Link
            key={o.title}
            href={(o.icon === 'card' ? '/fixtures/screens/checkout' : '/fixtures/screens/bank-transfer') as Route}
            className="flex items-center gap-4 rounded-[18px] border border-line bg-row p-4 transition-colors hover:border-line-strong hover:bg-hover"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-control text-ink-soft">
              <Glyph name={o.icon} size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-ink">{o.title}</span>
              <span className="block text-[13px] text-ink-muted">{o.body}</span>
            </span>
            <span className="hidden text-[13px] text-ink-soft ph:inline">{o.action}</span>
            <Glyph name="arrowRight" size={16} className="text-ink-soft" />
          </Link>
        ))}
      </div>
      <p className="text-[13px] leading-5 text-ink-subtle">
        Still stuck?{' '}
        <a href="mailto:practicodeacademy@gmail.com" className="text-ink-soft underline underline-offset-2">
          Email us
        </a>{' '}
        with the time you tried, and a person will look into it. Reference: {reference}.
      </p>
    </PayFrame>
  )
}
