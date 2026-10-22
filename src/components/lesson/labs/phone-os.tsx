'use client'
import { C, type LabProps } from './shared'

type Os = { made: string; phones: string; store: string; updates: string; custom: string; share: string }

const SYSTEMS: Record<string, Os> = {
  Android: {
    made: 'Google, with phone makers such as Samsung, Xiaomi, Tecno and Motorola adding their own touches',
    phones: 'Thousands of models, at every price',
    store: 'Google Play, and other stores if you allow them',
    updates: 'Up to the phone maker: from about 2 years on some budget phones to 7 years on some flagship phones',
    custom: 'A lot: home screens, default apps and widgets can all be changed',
    share: 'About 7 in 10 of the world’s phones',
  },
  iOS: {
    made: 'Apple, for its own iPhones only',
    phones: 'A few iPhone models each year, mostly at higher prices',
    store: 'The App Store (a few regions now allow other stores)',
    updates: 'Usually about 5 to 7 years for every iPhone',
    custom: 'Less, though home screens and widgets can now be arranged freely',
    share: 'About 3 in 10 of the world’s phones',
  },
}

const ROWS = [
  ['made', 'Made by'],
  ['phones', 'Phones'],
  ['store', 'Apps from'],
  ['updates', 'Updates for'],
  ['custom', 'Customising'],
  ['share', 'Used on'],
] as const

function Phone({ os }: { os: string }) {
  const colours = ['#3d5af5', '#0a7d5c', '#d9306f', '#a85a00', '#6e4cf5', '#0e7490', '#ff8a3d', '#4be3a8']
  return (
    <svg viewBox="0 0 120 220" aria-hidden="true" className="h-auto w-[96px] shrink-0">
      <rect x="4" y="4" width="112" height="212" rx="20" fill={C.sunken} stroke={C.soft} strokeWidth="2.5" />
      <rect x="10" y="10" width="100" height="200" rx="15" fill={os === 'iOS' ? '#1c2785' : '#0a4e3d'} />
      {os === 'iOS' ? (
        <rect x="44" y="15" width="32" height="9" rx="4.5" fill="#000" />
      ) : (
        <circle cx="60" cy="19" r="3.5" fill="#000" />
      )}
      {colours.map((c, i) => (
        <rect key={c} x={20 + (i % 4) * 21} y={40 + Math.floor(i / 4) * 26} width="16" height="16" rx={os === 'iOS' ? 4.5 : 8} fill={c} />
      ))}
      {os === 'Android' && <rect x="18" y="100" width="84" height="26" rx="13" fill="rgba(255,255,255,0.18)" />}
      <rect x="18" y="176" width="84" height="22" rx="11" fill="rgba(255,255,255,0.15)" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={24 + i * 20} y="179" width="16" height="16" rx={os === 'iOS' ? 4.5 : 8} fill={colours[i + 4]} />
      ))}
      {os === 'iOS' ? <rect x="42" y="203" width="36" height="3" rx="1.5" fill="#fff" /> : <rect x="48" y="203" width="24" height="3" rx="1.5" fill="#fff" />}
    </svg>
  )
}

/** Android and iOS side by side, with a phone drawn for each (Explore lab: value = Android or iOS). */
export function PhoneOs({ value = 'Android' }: LabProps) {
  const name = SYSTEMS[value] ? value : 'Android'
  const os = SYSTEMS[name]!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${name}. Made by ${os.made}. Apps from ${os.store}.`}>
      <div className="flex items-start gap-4">
        <Phone os={name} />
        <div className="flex min-w-0 flex-col gap-1 pt-2">
          <p className="font-display text-xl font-bold text-ink">{name}</p>
          <p className="text-[13px] leading-5 text-ink-soft">{os.share}</p>
        </div>
      </div>
      <dl className="flex flex-col divide-y divide-divider">
        {ROWS.map(([key, label]) => (
          <div key={key} className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 py-1.5 text-[13px] leading-5">
            <dt className="text-ink-subtle">{label}</dt>
            <dd className="text-ink">{os[key]}</dd>
          </div>
        ))}
      </dl>
    </figure>
  )
}
