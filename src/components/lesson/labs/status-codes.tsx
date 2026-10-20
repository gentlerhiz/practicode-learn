'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const FAMILIES = [
  { first: '1', name: 'Information' },
  { first: '2', name: 'Success' },
  { first: '3', name: 'Go elsewhere' },
  { first: '4', name: 'Your request’s problem' },
  { first: '5', name: 'The server’s problem' },
] as const

const CODES: Record<string, { name: string; means: string; cafe: string }> = {
  '200': { name: 'OK', means: 'It worked, and here’s what you asked for.', cafe: 'GET /menu gives back the menu.' },
  '201': { name: 'Created', means: 'It worked, and something new now exists.', cafe: 'POST /orders creates order 1042.' },
  '400': {
    name: 'Bad Request',
    means: 'The request itself is wrong, so the server won’t act on it.',
    cafe: 'An order for -3 coffees, or with the quantity missing.',
  },
  '401': {
    name: 'Unauthorized',
    means: 'The server doesn’t know who you are. Sign in and try again.',
    cafe: 'Ordering without being signed in.',
  },
  '404': { name: 'Not Found', means: 'Nothing lives at that path.', cafe: 'GET /menu/99, when the menu stops at 12.' },
  '429': {
    name: 'Too Many Requests',
    means: 'Slow down: you’ve sent too many requests too fast.',
    cafe: 'An app asking for the menu 500 times a second.',
  },
  '500': {
    name: 'Internal Server Error',
    means: 'The server broke while handling a request that was fine.',
    cafe: 'A bug in the server’s code crashes it while saving the order.',
  },
}

/** What a status code means, and whose problem it is (Explore lab: value = a code). */
export function StatusCodes({ value = '200' }: LabProps) {
  const c = CODES[value] ?? CODES['200']!
  const family = FAMILIES.find((f) => f.first === value[0])!
  const tone = value.startsWith('2') ? 'ok' : value.startsWith('4') ? 'warn' : 'bad'
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${value} ${c.name}: ${c.means}`}>
      <div aria-hidden="true" className="grid grid-cols-5 gap-1.5">
        {FAMILIES.map((f) => (
          <div
            key={f.first}
            className={cn(
              'flex flex-col items-center rounded-xl border-[1.5px] px-1 py-2 text-center motion-safe:transition-colors',
              f === family ? 'border-fe bg-[rgba(77,107,255,0.16)]' : 'border-line bg-row',
            )}
          >
            <span className={cn('font-mono text-sm font-bold', f === family ? 'text-ink' : 'text-ink-muted')}>
              {f.first}xx
            </span>
            <span className="hidden text-[11px] leading-4 text-ink-soft min-[560px]:block">{f.name}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 rounded-2xl border border-line bg-row p-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={cn(
              'rounded-lg px-2.5 py-1 font-mono text-base font-bold',
              tone === 'ok' && 'bg-success-fill text-on-success',
              tone === 'warn' && 'bg-[rgba(255,170,60,0.25)] text-ink',
              tone === 'bad' && 'bg-[rgba(255,154,162,0.3)] text-ink',
            )}
          >
            {value}
          </span>
          <span className="font-display text-lg font-bold text-ink">{c.name}</span>
          <span className="text-[13px] text-ink-subtle">{family.name}</span>
        </div>
        <p className="m-0 text-sm text-ink">{c.means}</p>
        <p className="m-0 text-[13px] text-ink-soft">At the café: {c.cafe}</p>
      </div>
    </figure>
  )
}
