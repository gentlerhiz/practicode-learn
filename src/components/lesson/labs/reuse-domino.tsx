'use client'
import { Briefcase, Landmark, Mail, MessageCircle, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const ACCOUNTS = [
  { name: 'Food delivery app', icon: ShoppingBag, breached: true },
  { name: 'Email', icon: Mail },
  { name: 'Bank', icon: Landmark },
  { name: 'Social media', icon: MessageCircle },
  { name: 'Work', icon: Briefcase },
]

type Habit = { passwords: string[]; falls: boolean[]; says: string }

const HABITS: Record<string, Habit> = {
  'One password everywhere': {
    passwords: ['Sunshine#88', 'Sunshine#88', 'Sunshine#88', 'Sunshine#88', 'Sunshine#88'],
    falls: [true, true, true, true, true],
    says: 'The delivery app is breached. Attackers try the leaked password on every popular site, and it works everywhere. One breach, five accounts gone, starting with email, which resets all the others.',
  },
  'Small changes per site': {
    passwords: ['Sunshine#88fd', 'Sunshine#88em', 'Sunshine#88bk', 'Sunshine#88sm', 'Sunshine#88wk'],
    falls: [true, true, true, true, false],
    says: 'Attackers’ tools try the obvious changes automatically: a different ending, a capital, a year. A pattern is still one password. Only the work account, which made you use something else, survives.',
  },
  'A different password for each': {
    passwords: ['otter-plume-saga-brick', 'k7#Qv9!mW2rT', 'lantern-figs-velvet-crane', 'Zp3@xL8$dN4q', 'harbour-mint-quiver-oak'],
    falls: [true, false, false, false, false],
    says: 'The breach exposes only the delivery app’s password, and it opens nothing else. Change that one, and you’re done. Nobody remembers five of these: that’s what password managers are for.',
  },
  'Different plus two-factor': {
    passwords: ['otter-plume-saga-brick', 'k7#Qv9!mW2rT', 'lantern-figs-velvet-crane', 'Zp3@xL8$dN4q', 'harbour-mint-quiver-oak'],
    falls: [false, false, false, false, false],
    says: 'Even the breached account holds: the attacker has the password but not your phone, so they can’t give the code. You get a warning, and time to change it.',
  },
}

/** One breach, and how many accounts fall with it, by password habit (Explore lab: value = a habit). */
export function ReuseDomino({ value = 'One password everywhere' }: LabProps) {
  const h = HABITS[value] ?? HABITS['One password everywhere']!
  const lost = h.falls.filter(Boolean).length
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${value}. After the food delivery app is breached, ${lost} of 5 accounts are taken over. ${h.says}`}>
      <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 @min-[460px]:grid-cols-2">
        {ACCOUNTS.map((a, i) => {
          const Icon = a.icon
          const falls = h.falls[i]
          return (
            <li key={a.name} className={cn('flex items-center gap-2.5 rounded-xl border-[1.5px] px-3 py-2 motion-safe:transition-colors motion-safe:duration-300', falls ? 'border-error bg-error/10' : 'border-success-fill bg-success/10')} style={{ transitionDelay: `${i * 80}ms` }}>
              <Icon size={18} aria-hidden="true" className={falls ? 'text-error' : 'text-success'} />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-[13px] font-semibold text-ink">
                  {a.name}
                  {a.breached && <span className="ml-1.5 rounded bg-error/15 px-1 text-[10.5px] font-semibold text-error">Breached</span>}
                </span>
                <span className="font-mono text-[11.5px] [overflow-wrap:anywhere] text-ink-muted">{h.passwords[i]}</span>
              </span>
              <span className={cn('shrink-0 text-[12px] font-semibold', falls ? 'text-error' : 'text-success')}>{falls ? 'Taken over' : 'Safe'}</span>
            </li>
          )
        })}
      </ul>
      <figcaption className="flex flex-col gap-1 rounded-xl bg-row px-3 py-2.5 text-[13px] leading-5 text-ink-soft">
        <span className="font-semibold text-ink">{lost === 1 ? '1 account lost' : `${lost} accounts lost`}</span>
        {h.says}
      </figcaption>
    </figure>
  )
}
