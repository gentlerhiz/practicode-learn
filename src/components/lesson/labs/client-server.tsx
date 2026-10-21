'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

// The programs listening on one server, each behind its own port.
const PORTS = [
  { port: 22, name: 'Remote login (SSH)' },
  { port: 80, name: 'Web, unencrypted (HTTP)' },
  { port: 443, name: 'Web, encrypted (HTTPS)' },
  { port: 5432, name: 'Database (PostgreSQL)' },
]

// What each state lights: the client, the name, the address, the port, then the program answering.
const STATES = ['client', 'name', 'address', 'port', 'answer'] as const

/** A phone finding a server by name, address and port (Diagram lab, 5 states). */
export function ClientServer({ state = 0 }: LabProps) {
  const at = STATES[Math.min(Math.max(state, 0), STATES.length - 1)]!
  const step = STATES.indexOf(at)
  const chip = (on: boolean) =>
    cn(
      'rounded-xl border-[1.5px] px-3 py-2 font-mono text-[13px] motion-safe:transition-colors motion-safe:duration-250',
      on ? 'border-fe bg-[rgba(77,107,255,0.16)] text-ink' : 'border-line bg-row text-ink-muted',
    )
  const label = [
    'The client: the app on your phone',
    'It knows the server by name: cafe.example.com',
    'DNS turns the name into an address: 203.0.113.10',
    'The request goes to port 443, the door for HTTPS',
    'The web server program listening on port 443 answers',
  ][step]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={label} className="flex flex-col gap-3 @min-[480px]:flex-row @min-[480px]:items-stretch">
        <div className="flex flex-col gap-2 @min-[480px]:w-[45%]">
          <div className={chip(at === 'client')}>
            <span className="font-sans text-xs text-ink-subtle">Client</span>
            <br />
            Your phone
          </div>
          <div className={chip(at === 'name')}>cafe.example.com</div>
          <div className={chip(at === 'address' || at === 'port')}>
            203.0.113.10<span className={at === 'port' ? 'font-bold text-fe-text' : ''}>:443</span>
          </div>
        </div>
        <div
          className={cn(
            'flex flex-1 flex-col gap-1.5 rounded-2xl border-[1.5px] p-3 motion-safe:transition-colors',
            step >= 3 ? 'border-fe' : 'border-line',
          )}
        >
          <span className="text-xs text-ink-subtle">Server at 203.0.113.10</span>
          {PORTS.map((p) => {
            const on = p.port === 443 && step >= 3
            return (
              <div
                key={p.port}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px]',
                  on ? 'bg-[rgba(77,107,255,0.16)] text-ink' : 'bg-row text-ink-muted',
                )}
              >
                <span className="w-11 font-mono font-bold">{p.port}</span>
                <span>{p.name}</span>
                {on && at === 'answer' && <span className="ml-auto text-xs font-semibold text-fe-text">Answers</span>}
              </div>
            )
          })}
        </div>
      </div>
      <figcaption className="flex items-start gap-3 rounded-xl bg-row px-3 py-2.5 text-sm text-ink">
        <span
          aria-hidden="true"
          className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-fe text-xs font-bold text-white"
        >
          {step + 1}
        </span>
        {label}.
      </figcaption>
    </figure>
  )
}
