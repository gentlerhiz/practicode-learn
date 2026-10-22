'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

// Addresses from the ranges set aside for examples and home networks, never real ones.
const DEVICES: Record<string, { ip: string; side: 'inside' | 'outside'; says: string }> = {
  Phone: { ip: '192.168.1.23', side: 'inside', says: 'A private address, handed out by the router when the phone joined the Wi-Fi. Only devices in this home can reach it.' },
  Laptop: { ip: '192.168.1.24', side: 'inside', says: 'The next private address. Every device in the home gets its own, so messages reach the right one.' },
  'Smart TV': { ip: '192.168.1.31', side: 'inside', says: 'Private addresses start 192.168, 10 or 172.16 to 172.31. The same ones are used in millions of homes.' },
  'Router (inside)': { ip: '192.168.1.1', side: 'inside', says: 'The router’s address on the home network: the door every device sends its internet traffic through.' },
  'Router (outside)': {
    ip: '203.0.113.42',
    side: 'outside',
    says: 'The public address the internet provider gives the home. Websites see this one, for every device in the home. The router remembers which device asked for what.',
  },
}

/** Private addresses inside a home, and the one public address outside (Explore lab: value = a device). */
export function IpAddress({ value = 'Phone' }: LabProps) {
  const name = DEVICES[value] ? value : 'Phone'
  const d = DEVICES[name]!
  const inside = Object.entries(DEVICES).filter(([, v]) => v.side === 'inside')
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${name}: ${d.ip}. ${d.says}`}>
      <div className="grid grid-cols-1 gap-2 @min-[460px]:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-1.5 rounded-2xl border border-dashed border-line-strong p-3">
          <p className="text-[12px] font-semibold text-ink-soft">Inside the home: private addresses</p>
          <ul className="flex flex-col gap-1.5">
            {inside.map(([n, v]) => (
              <li
                key={n}
                className={cn(
                  'flex flex-wrap items-baseline justify-between gap-x-2 rounded-lg border px-2.5 py-1.5 motion-safe:transition-colors motion-safe:duration-300',
                  n === name ? 'border-it bg-[rgba(255,170,60,0.14)]' : 'border-line bg-row',
                )}
              >
                <span className="text-[13px] text-ink">{n}</span>
                <span className="font-mono text-[12.5px] text-ink">{v.ip}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex min-w-0 flex-col gap-1.5 rounded-2xl border border-line p-3">
          <p className="text-[12px] font-semibold text-ink-soft">Outside: one public address</p>
          <div
            className={cn(
              'flex flex-wrap items-baseline justify-between gap-x-2 rounded-lg border px-2.5 py-1.5 motion-safe:transition-colors motion-safe:duration-300',
              name === 'Router (outside)' ? 'border-it bg-[rgba(255,170,60,0.14)]' : 'border-line bg-row',
            )}
          >
            <span className="text-[13px] text-ink">Router (outside)</span>
            <span className="font-mono text-[12.5px] text-ink">203.0.113.42</span>
          </div>
          <p className="text-[12px] leading-[18px] text-ink-muted">What every website sees for this home.</p>
        </div>
      </div>
      <div aria-live="polite" className="flex flex-col gap-1 rounded-2xl border border-line bg-row px-4 py-3">
        <p className="font-mono text-lg font-bold text-it-text">{d.ip}</p>
        <p className="text-[13px] leading-5 text-ink-soft">{d.says}</p>
      </div>
      <p className="text-[12px] leading-[18px] text-ink-muted">
        These are IPv4 addresses: four numbers from 0 to 255. Newer IPv6 addresses are longer, such as <span className="font-mono">2001:db8::23</span>, because the world ran short of IPv4 ones.
      </p>
    </figure>
  )
}
