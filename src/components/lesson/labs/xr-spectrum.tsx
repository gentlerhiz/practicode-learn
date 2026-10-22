'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const KINDS = ['The real world', 'AR', 'Mixed reality', 'VR'] as const
const INFO: Record<(typeof KINDS)[number], { full: string; see: string; uses: string; device: string }> = {
  'The real world': { full: 'Just the room', see: 'Everything you see is real.', uses: '', device: 'Your eyes' },
  AR: {
    full: 'Augmented reality',
    see: 'The real room, with digital things laid over it on a screen: a sofa you’re thinking of buying, or directions on the street.',
    uses: 'Trying furniture at home, phone games, translation of signs, navigation',
    device: 'A phone or tablet camera, or smart glasses',
  },
  'Mixed reality': {
    full: 'Mixed reality',
    see: 'Digital things that sit in the real room and react to it: a virtual screen stays on your wall as you walk around.',
    uses: 'Training, design reviews, remote repair help',
    device: 'A headset that sees the room',
  },
  VR: {
    full: 'Virtual reality',
    see: 'The real room disappears. You see only a computer-made world, all around you.',
    uses: 'Games, practising surgery or flying safely, virtual visits',
    device: 'A headset that covers your eyes',
  },
}

/** A room from real, through AR and mixed reality, to fully virtual (Explore lab: value = a kind). */
export function XrSpectrum({ value = 'The real world' }: LabProps) {
  const kind = (KINDS as readonly string[]).includes(value) ? (value as (typeof KINDS)[number]) : 'The real world'
  const at = KINDS.indexOf(kind)
  const k = INFO[kind]
  const vr = kind === 'VR'
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${k.full}. ${k.see}`}>
      <svg viewBox="0 0 320 170" aria-hidden="true" className="mx-auto block h-auto w-full max-w-[460px] rounded-xl">
        <rect width="320" height="170" fill={vr ? '#1c2785' : '#2a2540'} className="motion-safe:transition-colors motion-safe:duration-500" />
        {!vr && (
          <g className="motion-safe:transition-opacity">
            <rect x="0" y="120" width="320" height="50" fill="#3b3752" />
            <rect x="200" y="30" width="80" height="56" rx="3" fill="#5fd8f2" opacity="0.35" stroke="#a9a6bc" />
            <rect x="30" y="92" width="70" height="30" rx="4" fill="#8b88a0" />
            <rect x="26" y="84" width="10" height="38" rx="3" fill="#a9a6bc" />
            <rect x="94" y="84" width="10" height="38" rx="3" fill="#a9a6bc" />
          </g>
        )}
        {at === 1 && (
          <g className="pop-in">
            <rect x="120" y="96" width="90" height="34" rx="6" fill="#ffc15c" opacity="0.9" stroke="#fff" strokeDasharray="4 3" />
            <text x="165" y="117" textAnchor="middle" fontSize="11" fill="#1f0e00" fontFamily="var(--font-sans)">
              New sofa?
            </text>
            <rect x="196" y="12" width="110" height="16" rx="8" fill="#fff" opacity="0.92" />
            <text x="251" y="24" textAnchor="middle" fontSize="9" fill="#15122a" fontFamily="var(--font-sans)">
              Window: 1.2 m wide
            </text>
          </g>
        )}
        {at === 2 && (
          <g className="pop-in">
            <rect x="112" y="22" width="78" height="50" rx="4" fill="#15122a" stroke="#8ea2ff" strokeWidth="2" />
            <rect x="120" y="30" width="62" height="6" rx="3" fill="#8ea2ff" />
            <rect x="120" y="42" width="44" height="5" rx="2.5" fill="#a9a6bc" />
            <rect x="120" y="52" width="54" height="5" rx="2.5" fill="#a9a6bc" />
            <path d="M151 72 L151 92" stroke="#8ea2ff" strokeDasharray="3 3" />
            <ellipse cx="151" cy="96" rx="22" ry="5" fill="#8ea2ff" opacity="0.4" />
          </g>
        )}
        {vr && (
          <g className="pop-in">
            {[
              [40, 40],
              [110, 20],
              [270, 30],
              [200, 55],
              [80, 70],
            ].map(([x, y]) => (
              <circle key={`${x}${y}`} cx={x} cy={y} r="1.6" fill="#fff" />
            ))}
            <circle cx="250" cy="70" r="22" fill="#b9a2ff" />
            <path d="M0 140 Q80 100 160 130 T320 120 V170 H0 Z" fill="#0a7d5c" />
          </g>
        )}
        {(at === 1 || at === 2) && <rect x="4" y="4" width="312" height="162" rx="10" fill="none" stroke="#fff" strokeWidth="3" opacity="0.5" />}
      </svg>
      <ol aria-hidden="true" className="grid grid-cols-4 gap-1">
        {KINDS.map((x, i) => (
          <li key={x} className={cn('rounded-lg py-1 text-center text-[11px] leading-4 font-semibold', i === at ? 'bg-ai text-white' : 'bg-sheet text-ink-muted')}>
            {x === 'The real world' ? 'Real' : x}
          </li>
        ))}
      </ol>
      <div aria-live="polite" className="flex flex-col gap-1.5 rounded-2xl border border-line bg-row px-4 py-3 text-[13px] leading-5">
        <p className="font-display text-[15px] font-bold text-ink">{k.full}</p>
        <p className="text-ink-soft">{k.see}</p>
        {k.uses && (
          <p className="text-ink-muted">
            <span className="font-semibold text-ink-soft">Used for: </span>
            {k.uses}
          </p>
        )}
        <p className="text-ink-muted">
          <span className="font-semibold text-ink-soft">You need: </span>
          {k.device}
        </p>
      </div>
    </figure>
  )
}
