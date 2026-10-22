'use client'
import { Mail, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Part = { text: string; flag?: string; fine?: string }
type Message = { kind: 'sms' | 'email'; from: Part; subject?: Part; body: Part[]; real: boolean; summary: string }

// Every company, address and link here is made up for the lesson.
const MESSAGES: Record<string, Message> = {
  'A parcel text': {
    kind: 'sms',
    real: false,
    from: { text: '+44 7700 900461', flag: 'A random mobile number, not the delivery company’s usual name.' },
    body: [
      { text: 'QuickShip: your parcel is held because of an unpaid fee of $1.99.', flag: 'A tiny fee is a trick to get your card details. Were you even expecting a parcel?' },
      { text: 'Pay within 24 hours or it will be returned:', flag: 'A deadline is there to rush you, so you don’t stop to think.' },
      { text: 'quickship-redelivery-pay.com/xk2', flag: 'Not the company’s real website: a lookalike address with extra words.' },
    ],
    summary: 'A scam. To check, open the delivery company’s real app or website yourself, never the link.',
  },
  'A bank email': {
    kind: 'email',
    real: false,
    from: { text: 'Secure Bank <alerts@securebank-verify.net>', flag: 'The address isn’t the bank’s own domain. Anyone can register a name like this.' },
    subject: { text: 'Urgent: unusual sign-in detected', flag: 'Fear and urgency in the subject line.' },
    body: [
      { text: 'Dear Customer,', flag: 'Your bank knows your name.' },
      { text: 'We noticed an unusual sign-in to your account.', fine: 'Banks do send alerts like this, which is why scammers copy them.' },
      { text: 'Your account will be suspended unless you verify your details today.', flag: 'A threat with a deadline.' },
      { text: '[ Verify my account ]', flag: 'It asks you to sign in through a link. Banks tell you to open their app instead.' },
    ],
    summary: 'A scam. If you’re worried, open your bank’s app, or call the number on your card.',
  },
  'A prize message': {
    kind: 'sms',
    real: false,
    from: { text: 'PRIZE-DRAW', flag: 'A name anyone can type, from a company you’ve never dealt with.' },
    body: [
      { text: 'Congratulations! You have won a new phone!', flag: 'You can’t win a competition you never entered.' },
      { text: 'Just pay $4.50 delivery to claim it:', flag: 'A small payment to get your card details.' },
      { text: 'win-claims.net/phone', flag: 'An unknown website, asking for payment.' },
    ],
    summary: 'A scam. Delete it, and block the sender.',
  },
  'An email from a colleague': {
    kind: 'email',
    real: true,
    from: { text: 'Grace Mensah <grace@yourcompany.example>', fine: 'Your colleague’s real work address, which you’ve emailed before.' },
    subject: { text: 'Notes from this morning’s meeting', fine: 'About a meeting you were actually in.' },
    body: [
      { text: 'Hi Ada,', fine: 'She uses your name.' },
      { text: 'Here are the notes from this morning, as promised. The next meeting is Thursday at 10.', fine: 'It’s what she said she’d send. No rush, no threat, nothing to pay.' },
      { text: 'Grace', fine: 'Signed as normal.' },
    ],
    summary: 'Real. It matches what you expected, from the address you know, and asks for nothing. Not every message is a scam.',
  },
}

function Seg({ part: p, shown, onOpen, className }: { part: Part; shown: boolean; onOpen: () => void; className?: string }) {
  return (
    <button
      type="button"
      aria-expanded={shown}
      onClick={onOpen}
      className={cn(
        'press block w-full cursor-pointer rounded-lg px-2 py-1 text-left motion-safe:transition-colors',
        shown ? (p.flag ? 'bg-error/15 outline-1 outline-error' : 'bg-success-fill/15 outline-1 outline-success-fill') : 'hover:bg-hover',
        className,
      )}
    >
      <span className="[overflow-wrap:anywhere]">{p.text}</span>
      {shown && <span className={cn('pop-in mt-0.5 block text-[12px] leading-[18px]', p.flag ? 'text-error' : 'text-success')}>{p.flag ? `Red flag: ${p.flag}` : `Looks fine: ${p.fine ?? 'nothing suspicious here.'}`}</span>}
    </button>
  )
}

function Reader({ value }: { value: string }) {
  const m = MESSAGES[value] ?? MESSAGES['A parcel text']!
  const parts = [m.from, ...(m.subject ? [m.subject] : []), ...m.body]
  const flags = parts.filter((p) => p.flag).length
  const [open, setOpen] = useState<number[]>([])
  const found = open.filter((i) => parts[i]!.flag).length
  const seg = (i: number, className?: string) => <Seg key={i} part={parts[i]!} shown={open.includes(i)} onOpen={() => setOpen((o) => (o.includes(i) ? o : [...o, i]))} className={className} />
  const Icon = m.kind === 'sms' ? MessageSquare : Mail
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] text-ink-muted">Tap anything that looks suspicious.</p>
      <div className={cn('flex flex-col gap-1 rounded-2xl border border-line p-2.5 text-[13px] leading-5 text-ink', m.kind === 'sms' ? 'bg-sunken' : 'bg-row')}>
        <div className="flex items-start gap-1.5">
          <Icon size={15} aria-hidden="true" className="mt-1.5 shrink-0 text-ink-muted" />
          {seg(0, 'font-semibold')}
        </div>
        {m.subject && seg(1, 'font-semibold')}
        <div className={cn('flex flex-col gap-0.5', m.kind === 'sms' && 'rounded-2xl rounded-tl-md bg-row p-1')}>
          {m.body.map((_, j) => seg(j + (m.subject ? 2 : 1)))}
        </div>
      </div>
      <p aria-live="polite" className="text-[13px] leading-5 text-ink-soft">
        {flags === 0
          ? open.length >= parts.length
            ? m.summary
            : `Checked ${open.length} of ${parts.length} parts.`
          : found >= flags
            ? `All ${flags} red flags found. ${m.summary}`
            : `Red flags found: ${found} of ${flags}.`}
      </p>
    </div>
  )
}

/** Four messages to inspect, part by part, for the signs of phishing; one is genuine (Explore lab). */
export function PhishingSpot({ value = 'A parcel text' }: LabProps) {
  return <Reader key={value} value={value} />
}
