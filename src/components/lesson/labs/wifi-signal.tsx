'use client'
import { cn } from '@/lib/cn'
import { C, type LabProps } from './shared'

// Typical results in a brick house. 2.4 GHz reaches further; 5 GHz is faster up close.
const SPOTS: Record<string, { x: number; y: number; walls: string; g24: number; g5: number; s24: string; s5: string; note: string }> = {
  'Next to the router': { x: 92, y: 150, walls: 'No walls', g24: 4, g5: 4, s24: 'about 100 Mbps', s5: 'about 500 Mbps', note: 'Close by, 5 GHz is far faster.' },
  'Two rooms away': { x: 200, y: 150, walls: 'Two walls', g24: 3, g5: 2, s24: 'about 60 Mbps', s5: 'about 150 Mbps', note: 'Walls weaken both bands, 5 GHz more, but it’s still the faster here.' },
  Upstairs: { x: 170, y: 84, walls: 'A floor and a wall', g24: 2, g5: 1, s24: 'about 30 Mbps', s5: 'about 10 Mbps, and it drops out', note: 'Through a floor, 2.4 GHz wins: slower, but steady.' },
  'In the garden': { x: 300, y: 150, walls: 'Three walls and 10 metres outside', g24: 1, g5: 0, s24: 'about 5 Mbps', s5: 'no signal', note: 'Too far for 5 GHz. A mesh point or extender would help.' },
}

function Bars({ n, label, speed }: { n: number; label: string; speed: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-line bg-row px-3 py-2">
      <span aria-hidden="true" className="flex h-6 shrink-0 items-end gap-0.5">
        {[1, 2, 3, 4].map((b) => (
          <span key={b} className={cn('w-1.5 rounded-sm motion-safe:transition-colors motion-safe:duration-300', b <= n ? 'bg-it' : 'bg-meter')} style={{ height: `${b * 25}%` }} />
        ))}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-[13px] font-semibold text-ink">{label}</span>
        <span className="text-[12px] text-ink-muted">{speed}</span>
      </span>
    </div>
  )
}

/** A house with the router downstairs, and the Wi-Fi signal where you stand (Explore lab: value = a place). */
export function WifiSignal({ value = 'Next to the router' }: LabProps) {
  const name = SPOTS[value] ? value : 'Next to the router'
  const s = SPOTS[name]!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${name}: ${s.walls}. 2.4 GHz: ${s.s24}. 5 GHz: ${s.s5}. ${s.note}`}>
      <svg viewBox="0 0 340 200" aria-hidden="true" className="mx-auto block h-auto w-full max-w-[520px]">
        <path d="M20 100 L130 30 L240 100" fill="none" stroke={C.soft} strokeWidth="2" />
        <rect x="20" y="100" width="220" height="90" fill="none" stroke={C.soft} strokeWidth="2" />
        <line x1="20" y1="100" x2="240" y2="100" stroke={C.soft} strokeWidth="3" />
        <rect x="40" y="56" width="180" height="44" fill="none" stroke={C.lineControl} strokeWidth="1.5" />
        <line x1="130" y1="100" x2="130" y2="190" stroke={C.lineControl} strokeWidth="3" />
        <line x1="180" y1="100" x2="180" y2="190" stroke={C.lineControl} strokeWidth="3" />
        <line x1="260" y1="190" x2="336" y2="190" stroke={C.ok} strokeWidth="2" strokeDasharray="3 4" />
        <text x="300" y="186" textAnchor="middle" fontSize="10" fill={C.muted} fontFamily="var(--font-sans)">
          Garden
        </text>
        {/* Signal rings from the router, fading with distance */}
        {[30, 60, 95, 135, 180].map((r, i) => (
          <circle key={r} cx="60" cy="172" r={r} fill="none" stroke={C.itText} strokeWidth="1.5" opacity={0.5 - i * 0.09} />
        ))}
        <rect x="44" y="164" width="32" height="14" rx="4" fill={C.row} stroke={C.itText} strokeWidth="2" />
        <text x="60" y="160" textAnchor="middle" fontSize="10" fill={C.text} fontFamily="var(--font-sans)">
          Router
        </text>
        <g className="motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out" style={{ transform: `translate(${s.x}px, ${s.y}px)` }}>
          <circle r="12" fill={C.track} opacity="0.25" />
          <rect x="-6" y="-10" width="12" height="20" rx="3" fill={C.row} stroke={C.trackText} strokeWidth="2" />
          <text y="-15" textAnchor="middle" fontSize="10" fontWeight="600" fill={C.text} fontFamily="var(--font-sans)">
            You
          </text>
        </g>
      </svg>
      <p className="text-[13px] text-ink-muted">{s.walls} between you and the router.</p>
      <div className="grid grid-cols-1 gap-2 @min-[400px]:grid-cols-2">
        <Bars n={s.g24} label="2.4 GHz band" speed={s.s24} />
        <Bars n={s.g5} label="5 GHz band" speed={s.s5} />
      </div>
      <p aria-live="polite" className="text-[13px] leading-5 text-ink-soft">
        {s.note}
      </p>
    </figure>
  )
}
