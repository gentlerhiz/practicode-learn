'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const POSTS: Record<string, { post: string; reveals: string[]; risk: 0 | 1 | 2; safer: string }> = {
  'A live beach photo': {
    post: '“Two weeks in the sun!” · posted from the beach, today',
    reveals: ['Your home is empty for two weeks', 'Where you are right now'],
    risk: 2,
    safer: 'Post holiday photos after you get home.',
  },
  'A first day at school': {
    post: 'Photo: your child at the school gate, in uniform, with the school’s name on the sign',
    reveals: ['Which school your child goes to', 'What they look like, and when they’re there'],
    risk: 2,
    safer: 'Crop out the uniform badge and the sign, and share with close family only.',
  },
  'A new bank card': {
    post: 'Photo: “Finally got my new card!”, with the card number showing',
    reveals: ['Your card number, name and expiry date'],
    risk: 2,
    safer: 'Never post a card, ticket, ID or boarding pass: their codes can be read from a photo.',
  },
  'A birthday post': {
    post: '“30 today! Born 22 October 1996 in Kano.”',
    reveals: ['Your full date and place of birth, which are common security questions'],
    risk: 1,
    safer: 'Celebrate without the date of birth or the year.',
  },
  'A recipe you made': {
    post: 'Photo: a pot of jollof rice, “Sunday cooking!”',
    reveals: ['Very little: that you like cooking'],
    risk: 0,
    safer: 'Fine to share. Not every post is a risk.',
  },
}

const LEVEL = [
  { label: 'Low risk', tone: 'text-success', bar: 'bg-success-fill' },
  { label: 'Think twice', tone: 'text-badge-text', bar: 'bg-badge' },
  { label: 'High risk', tone: 'text-error', bar: 'bg-error' },
]

/** Five posts, and what a stranger could learn from each (Explore lab: value = a post). */
export function Footprint({ value = 'A live beach photo' }: LabProps) {
  const name = POSTS[value] ? value : 'A live beach photo'
  const p = POSTS[name]!
  const l = LEVEL[p.risk]!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${name}. ${l.label}. It reveals: ${p.reveals.join('; ')}. ${p.safer}`}>
      <div className="rounded-2xl border border-line bg-row px-4 py-3">
        <p className="text-[11px] text-ink-subtle">The post</p>
        <p className="text-[14px] leading-6 text-ink">{p.post}</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-ink">What a stranger learns</span>
          <span className={cn('font-semibold', l.tone)}>{l.label}</span>
        </div>
        <div aria-hidden="true" className="grid grid-cols-3 gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className={cn('h-2 rounded-full', i <= p.risk ? l.bar : 'bg-meter')} />
          ))}
        </div>
        <ul className="flex flex-col gap-1">
          {p.reveals.map((r) => (
            <li key={r} className="pop-in flex gap-2 text-[13px] leading-5 text-ink-soft">
              <span aria-hidden="true" className={l.tone}>
                •
              </span>
              {r}
            </li>
          ))}
        </ul>
      </div>
      <p aria-live="polite" className="rounded-2xl border border-line bg-row px-4 py-3 text-[13px] leading-5 text-ink">
        <span className="font-semibold text-success">Safer: </span>
        {p.safer}
      </p>
    </figure>
  )
}
