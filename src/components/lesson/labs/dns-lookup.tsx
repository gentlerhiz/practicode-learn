'use client'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

type Node = 'you' | 'cache' | 'resolver' | 'root' | 'tld' | 'auth' | 'site'

const NODES: { id: Node; name: string; note: string }[] = [
  { id: 'you', name: 'Your browser', note: 'learn.practicode.tech' },
  { id: 'cache', name: 'Your device’s memory', note: 'Recent answers' },
  { id: 'resolver', name: 'A DNS resolver', note: 'Your ISP’s, or a public one' },
  { id: 'root', name: 'Root servers', note: 'Know every ending' },
  { id: 'tld', name: '.tech servers', note: 'Know every .tech name' },
  { id: 'auth', name: 'practicode.tech’s DNS', note: 'Knows the answer' },
  { id: 'site', name: 'The website’s server', note: '198.51.100.7' },
]

const STATES: { lit: Node[]; ask?: [Node, Node]; answer?: string; reply?: string; line: string }[] = [
  { lit: ['you'], line: 'You type a name. Computers find each other by IP address, so the name has to be looked up first.' },
  { lit: ['you', 'cache'], ask: ['you', 'cache'], reply: 'Not in memory', line: 'First, the device checks whether it looked this name up recently. Not this time.' },
  { lit: ['cache', 'resolver'], ask: ['cache', 'resolver'], reply: 'I’ll find out', line: 'It asks a DNS resolver: a server whose job is finding answers, run by your ISP or a company such as Cloudflare or Google.' },
  { lit: ['resolver', 'root'], ask: ['resolver', 'root'], reply: 'Ask the .tech servers', line: 'The resolver asks a root server, which only knows who handles each ending, such as .com or .tech.' },
  { lit: ['resolver', 'tld'], ask: ['resolver', 'tld'], reply: 'Ask practicode.tech’s DNS', line: 'The .tech servers know which servers hold the details for practicode.tech.' },
  { lit: ['resolver', 'auth'], ask: ['resolver', 'auth'], reply: '198.51.100.7', line: 'Those servers have the answer: the IP address for learn.practicode.tech.' },
  { lit: ['you', 'site'], answer: '198.51.100.7', line: 'The answer comes back, and is remembered for a while. Now the browser can connect to the website’s server. All of this takes a fraction of a second.' },
]

/** Looking up a name with DNS, one question at a time (Diagram lab, 7 states). */
export function DnsLookup({ state }: LabProps) {
  const at = clampState(state, STATES.length)
  const s = STATES[at]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <ol role="img" aria-label={s.line} className="flex flex-col gap-1">
        {NODES.map((n, i) => {
          const on = s.lit.includes(n.id)
          const asking = s.ask?.[1] === n.id
          return (
            <li key={n.id} className="flex flex-col gap-1">
              <div
                className={cn(
                  'flex flex-wrap items-baseline justify-between gap-x-3 rounded-xl border-[1.5px] px-3 py-2 motion-safe:transition-all motion-safe:duration-300',
                  on ? 'border-it bg-[rgba(255,170,60,0.14)]' : 'border-line bg-row opacity-45',
                )}
              >
                <span className="text-[13px] font-semibold text-ink">{n.name}</span>
                <span className={cn('text-[12px]', n.id === 'you' || n.id === 'site' ? 'font-mono text-ink' : 'text-ink-muted')}>{n.note}</span>
              </div>
              {asking && (
                <p className="pop-in ml-3 text-[12px] text-it-text">
                  “Where is learn.practicode.tech?” → “{s.reply}”
                </p>
              )}
              {i === NODES.length - 2 && at === STATES.length - 1 && <p className="pop-in ml-3 text-[12px] text-it-text">↓ Connecting to 198.51.100.7</p>}
            </li>
          )
        })}
      </ol>
      <figcaption aria-live="polite" className="rounded-2xl border border-line bg-row px-4 py-3 text-[13px] leading-5 text-ink-soft">
        {s.line}
      </figcaption>
    </figure>
  )
}
