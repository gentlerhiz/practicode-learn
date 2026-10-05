'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const EXCHANGES = [
  {
    match: /home/i,
    path: '/',
    code: 200,
    reason: 'OK',
    headers: [
      ['Content-Type', 'text/html; charset=utf-8'],
      ['Content-Length', '5120'],
    ],
    address: 'learn.practicode.tech',
    shows: 'The home page appears.',
    says: 'The server found the page and sent it back: 200 OK.',
  },
  {
    match: /missing|not found/i,
    path: '/trakcs',
    code: 404,
    reason: 'Not Found',
    headers: [
      ['Content-Type', 'text/html; charset=utf-8'],
      ['Content-Length', '1830'],
    ],
    address: 'learn.practicode.tech/trakcs',
    shows: 'We couldn’t find that page.',
    says: 'There is no page at that address, so the server answered 404 Not Found.',
  },
  {
    match: /moved/i,
    path: '/track',
    code: 301,
    reason: 'Moved Permanently',
    headers: [
      ['Location', '/tracks'],
      ['Content-Length', '0'],
    ],
    address: 'learn.practicode.tech/tracks',
    shows: 'The browser goes straight to the new address and shows the tracks page.',
    says: 'The page has a new address. The server answered 301 Moved Permanently and named it, so the browser went there.',
  },
  {
    match: /down|unavailable/i,
    path: '/',
    code: 503,
    reason: 'Service Unavailable',
    headers: [
      ['Retry-After', '120'],
      ['Content-Type', 'text/html; charset=utf-8'],
    ],
    address: 'learn.practicode.tech',
    shows: 'Service unavailable. Try again in a few minutes.',
    says: 'The server can’t answer right now, so it sent 503 Service Unavailable.',
  },
] as const

/**
 * One request and the server's response: the status line, the headers and what the browser shows
 * (Explore lab: the home page, a missing page, a page that moved, the server is down).
 */
export function HttpExchange({ value = '' }: LabProps) {
  const x = EXCHANGES.find((e) => e.match.test(value)) ?? EXCHANGES[0]
  const tone = x.code < 300 ? 'text-success' : x.code < 400 ? 'text-fe-text' : 'text-error'

  return (
    <div className="grid gap-3 tab:grid-cols-3">
      <section aria-label="The request" className="rounded-xl border border-line bg-row p-3">
        <h3 className="mb-2 text-[12px] font-semibold text-ink-muted">The request</h3>
        <pre className="font-mono text-[13px] leading-6 whitespace-pre-wrap text-ink">
          {`GET ${x.path} HTTP/1.1\nHost: learn.practicode.tech`}
        </pre>
      </section>
      <section aria-label="The response" className="rounded-xl border border-line bg-row p-3">
        <h3 className="mb-2 text-[12px] font-semibold text-ink-muted">The response</h3>
        <p className={cn('font-mono text-[13px] font-semibold', tone)}>
          HTTP/1.1 {x.code} {x.reason}
        </p>
        <dl className="mt-1 font-mono text-[12px] leading-5 text-ink-soft">
          {x.headers.map(([name, val]) => (
            <div key={name}>
              <dt className="inline">{name}:</dt> <dd className="inline">{val}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section
        aria-label="What the browser shows"
        className="overflow-hidden rounded-xl border border-line bg-white text-[#15122a]"
      >
        <p className="truncate border-b border-[#e4e1ed] bg-[#f2f0f8] px-3 py-2 text-[12px] text-[#5d5972]">
          {x.address}
        </p>
        <p className="p-3 text-[13px]">{x.shows}</p>
      </section>
      <p aria-live="polite" className="text-[13px] text-ink-muted tab:col-span-3">
        {x.says}
      </p>
    </div>
  )
}
