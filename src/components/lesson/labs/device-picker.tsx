'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Laptop = { name: string; price: number; cpu: string; ram: number; ssd: number; screen: string; gpu: boolean; kg: number; hours: number }

const LAPTOPS: Laptop[] = [
  { name: 'Lark 14', price: 450, cpu: '4-core Ryzen 3', ram: 8, ssd: 256, screen: '14″ Full HD', gpu: false, kg: 1.4, hours: 8 },
  { name: 'Kestrel 14', price: 650, cpu: '6-core Ryzen 5', ram: 16, ssd: 512, screen: '14″ Full HD', gpu: false, kg: 1.3, hours: 11 },
  { name: 'Atlas 16', price: 1200, cpu: '14-core Core i7', ram: 32, ssd: 1000, screen: '16″ QHD', gpu: true, kg: 2.4, hours: 5 },
]

type Need = { who: string; checks: { label: string; ok: (l: Laptop) => boolean }[]; why: string }

const NEEDS: Record<string, Need> = {
  'A student': {
    who: 'Notes, essays, research and video lessons. Budget: up to $500.',
    checks: [
      { label: 'Within $500', ok: (l) => l.price <= 500 },
      { label: '8 GB memory or more', ok: (l) => l.ram >= 8 },
      { label: 'An SSD', ok: () => true },
      { label: '8 hours of battery or more', ok: (l) => l.hours >= 8 },
    ],
    why: 'Only the Lark 14 is within budget, and it has everything a student needs. Spending more buys power the work doesn’t use.',
  },
  'A traveller': {
    who: 'Writes and takes video calls on trains and planes. Budget: up to $800.',
    checks: [
      { label: 'Within $800', ok: (l) => l.price <= 800 },
      { label: '1.4 kg or lighter', ok: (l) => l.kg <= 1.4 },
      { label: '10 hours of battery or more', ok: (l) => l.hours >= 10 },
      { label: '8 GB memory or more', ok: (l) => l.ram >= 8 },
    ],
    why: 'The Kestrel 14 is light and lasts a full day. The Lark 14 is cheaper, but its battery won’t last a long trip.',
  },
  'A video editor': {
    who: 'Edits 4K video for clients. Budget: up to $1,300.',
    checks: [
      { label: 'Within $1,300', ok: (l) => l.price <= 1300 },
      { label: '16 GB memory or more', ok: (l) => l.ram >= 16 },
      { label: 'A dedicated graphics card', ok: (l) => l.gpu },
      { label: '1 TB storage or more', ok: (l) => l.ssd >= 1000 },
    ],
    why: 'Only the Atlas 16 has a graphics card and room for big video files. It’s heavy, with a short battery life, but this work happens at a desk.',
  },
}

/** Three laptops against one person's needs, with what each meets (Explore lab: value = a person). */
export function DevicePicker({ value = 'A student' }: LabProps) {
  const who = NEEDS[value] ? value : 'A student'
  const need = NEEDS[who]!
  const scored = LAPTOPS.map((l) => ({ l, met: need.checks.map((c) => c.ok(l)) }))
  const best = scored.find((x) => x.met.every(Boolean))?.l.name
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${who}. ${need.who} Best fit: ${best}. ${need.why}`}>
      <div className="rounded-2xl border border-line bg-row px-4 py-3">
        <p className="font-display text-[15px] font-bold text-ink">{who}</p>
        <p className="text-[13px] leading-5 text-ink-soft">{need.who}</p>
      </div>
      <ul className="grid grid-cols-1 gap-2 @min-[520px]:grid-cols-3">
        {scored.map(({ l, met }) => {
          const fit = l.name === best
          return (
            <li key={l.name} className={cn('flex min-w-0 flex-col gap-2 rounded-2xl border-[1.5px] p-3', fit ? 'border-success-fill bg-row' : 'border-line bg-row')}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                <span className="font-display text-[15px] font-bold text-ink">{l.name}</span>
                <span className="font-mono text-[13px] text-it-text">${l.price.toLocaleString('en-US')}</span>
              </div>
              <p className="text-[12px] leading-[18px] text-ink-muted">
                {l.cpu} · {l.ram} GB · {l.ssd >= 1000 ? '1 TB' : `${l.ssd} GB`} SSD · {l.screen}
                {l.gpu ? ' · graphics card' : ''} · {l.kg} kg · {l.hours} h
              </p>
              <ul className="flex flex-col gap-1 text-[12px] leading-[18px]">
                {need.checks.map((c, i) => (
                  <li key={c.label} className={met[i] ? 'text-ink-soft' : 'text-error'}>
                    <span aria-hidden="true" className={cn('mr-1.5 font-bold', met[i] ? 'text-success' : 'text-error')}>
                      {met[i] ? '✓' : '✕'}
                    </span>
                    <span className="sr-only">{met[i] ? 'Meets: ' : 'Misses: '}</span>
                    {c.label}
                  </li>
                ))}
              </ul>
              {fit && <span className="self-start rounded-full bg-success-fill px-2.5 py-0.5 text-[12px] font-bold text-on-success">Best fit</span>}
            </li>
          )
        })}
      </ul>
      <p aria-live="polite" className="text-[13px] leading-5 text-ink-soft">
        {need.why} <span className="text-ink-subtle">Prices in US dollars.</span>
      </p>
    </figure>
  )
}
