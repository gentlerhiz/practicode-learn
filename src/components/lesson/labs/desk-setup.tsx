'use client'
import { C, clampState, type LabProps } from './shared'

type Spot = 'screen' | 'distance' | 'arms' | 'back' | 'feet' | 'eyes' | 'breaks'

const STATES: { spot: Spot; name: string; line: string }[] = [
  { spot: 'screen', name: 'Screen at eye level', line: 'The top of the screen at, or just below, eye level, so you look slightly down without bending your neck. A laptop on a stand, with a separate keyboard, helps.' },
  { spot: 'distance', name: 'An arm’s length away', line: 'Sit about an arm’s length from the screen. Make text bigger, rather than leaning in.' },
  { spot: 'arms', name: 'Relaxed arms', line: 'Shoulders relaxed, elbows near a right angle, wrists straight while you type.' },
  { spot: 'back', name: 'A supported back', line: 'Sit back in the chair, with your lower back supported. A cushion works if the chair doesn’t.' },
  { spot: 'feet', name: 'Feet flat', line: 'Feet flat on the floor, or on a footrest or a box.' },
  { spot: 'eyes', name: 'The 20-20-20 rule', line: 'Every 20 minutes, look at something 20 feet (about 6 metres) away, for 20 seconds. It rests the muscles that focus your eyes.' },
  { spot: 'breaks', name: 'Move often', line: 'Stand up and move for a few minutes every hour. The best posture is your next one.' },
]

/** A healthy desk set-up, one habit at a time (Diagram lab, 7 states). */
export function DeskSetup({ state }: LabProps) {
  const at = clampState(state, STATES.length)
  const s = STATES[at]!
  const hi = (spot: Spot) => (s.spot === spot ? C.itText : C.soft)
  const w = (spot: Spot) => (s.spot === spot ? 3 : 2)
  return (
    <figure className="m-0 flex flex-col gap-3">
      <svg viewBox="0 0 320 220" role="img" aria-label={`${s.name}. ${s.line}`} className="mx-auto block h-auto w-full max-w-[460px]">
        {/* Desk and screen */}
        <rect x="170" y="132" width="140" height="8" rx="3" fill={C.row} stroke={C.soft} strokeWidth="2" />
        <path d="M300 140 V210" stroke={C.soft} strokeWidth="2" />
        <rect x="236" y="72" width="62" height="42" rx="4" fill={C.sunken} stroke={hi('screen')} strokeWidth={w('screen')} />
        <path d="M267 114 V132" stroke={C.soft} strokeWidth="3" />
        <rect x="186" y="126" width="40" height="5" rx="2" fill={C.lineControl} />
        {/* Chair */}
        <path d="M78 96 Q70 130 82 150" fill="none" stroke={hi('back')} strokeWidth={w('back') + 3} strokeLinecap="round" />
        <rect x="80" y="150" width="70" height="8" rx="3" fill={C.row} stroke={C.soft} strokeWidth="2" />
        <path d="M115 158 V196 M95 206 H135" stroke={C.soft} strokeWidth="2.5" strokeLinecap="round" />
        {/* Person */}
        <circle cx="112" cy="58" r="13" fill="none" stroke={C.text} strokeWidth="2.5" />
        <path d="M110 72 Q102 108 108 148" fill="none" stroke={C.text} strokeWidth="3" strokeLinecap="round" />
        <path d="M110 86 L140 118 L186 124" fill="none" stroke={hi('arms')} strokeWidth={w('arms') + 0.5} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M108 148 L160 150 L162 202 L178 204" fill="none" stroke={hi('feet')} strokeWidth={w('feet') + 0.5} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M150 206 H196" stroke={hi('feet')} strokeWidth="2" />
        {/* Eye line and distance */}
        {(s.spot === 'screen' || s.spot === 'eyes') && <path d="M124 56 L236 78" stroke={C.itText} strokeWidth="1.5" strokeDasharray="4 4" className="pop-in" />}
        {s.spot === 'distance' && (
          <g className="pop-in">
            <path d="M124 44 H236" stroke={C.itText} strokeWidth="1.5" />
            <path d="M124 39 V49 M236 39 V49" stroke={C.itText} strokeWidth="1.5" />
            <text x="180" y="36" textAnchor="middle" fontSize="11" fill={C.text} fontFamily="var(--font-sans)">
              An arm’s length
            </text>
          </g>
        )}
        {s.spot === 'eyes' && (
          <g className="pop-in">
            <text x="268" y="40" textAnchor="middle" fontSize="12" fontWeight="700" fill={C.itText} fontFamily="var(--font-sans)">
              20 · 20 · 20
            </text>
            <path d="M124 54 L20 30" stroke={C.ok} strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="22" y="22" fontSize="10" fill={C.ok} fontFamily="var(--font-sans)">
              6 m away
            </text>
          </g>
        )}
        {s.spot === 'breaks' && (
          <g className="pop-in">
            <circle cx="40" cy="120" r="9" fill="none" stroke={C.ok} strokeWidth="2" />
            <path d="M40 130 V170 M40 142 L26 156 M40 142 L54 132 M40 170 L30 198 M40 170 L52 198" stroke={C.ok} strokeWidth="2.5" strokeLinecap="round" />
            <text x="40" y="98" textAnchor="middle" fontSize="10" fill={C.ok} fontFamily="var(--font-sans)">
              Every hour
            </text>
          </g>
        )}
      </svg>
      <figcaption aria-live="polite" className="flex flex-col gap-1 rounded-2xl border border-line bg-row px-4 py-3">
        <span className="font-display text-[15px] font-bold text-ink">{s.name}</span>
        <span className="text-[13px] leading-5 text-ink-soft">{s.line}</span>
      </figcaption>
    </figure>
  )
}
