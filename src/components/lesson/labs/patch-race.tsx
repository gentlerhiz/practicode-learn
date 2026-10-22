'use client'
import { C, clampState, type LabProps } from './shared'

const STATES = [
  { title: 'A flaw is found', line: 'Someone finds a weakness in an app: a way in, like a window left unlocked.' },
  { title: 'A fix is made', line: 'The app’s makers write a fix, called a patch.' },
  { title: 'The update goes out', line: 'The fix goes out as an update. Now the flaw is public too.' },
  { title: 'Attackers move in', line: 'Attackers study the fix to learn the flaw, and look for devices that haven’t updated.' },
  { title: 'Updated is safe', line: 'Phone A installed the update, so the way in is closed. Phone B didn’t, and it’s still open.' },
]

function PhoneShape({ x, label, patched, attacked, show }: { x: number; label: string; patched: boolean; attacked: boolean; show: boolean }) {
  return (
    <g style={{ opacity: show ? 1 : 0.25 }} className="motion-safe:transition-opacity motion-safe:duration-300">
      <rect x={x} y="70" width="56" height="98" rx="10" fill={C.row} stroke={attacked ? C.bad : patched ? C.ok : C.soft} strokeWidth="2.5" />
      <rect x={x + 6} y="80" width="44" height="72" rx="4" fill={C.sunken} />
      {patched ? (
        <path
          d={`M${x + 28} 96 l14 6 v12 c0 10 -7 16 -14 19 c-7 -3 -14 -9 -14 -19 v-12 Z`}
          fill={C.okTint}
          stroke={C.ok}
          strokeWidth="2"
        />
      ) : (
        <g>
          <rect x={x + 16} y="108" width="24" height="18" rx="3" fill="none" stroke={attacked ? C.bad : C.muted} strokeWidth="2" />
          <path d={`M${x + 21} 108 v-6 a7 7 0 0 1 14 0`} fill="none" stroke={attacked ? C.bad : C.muted} strokeWidth="2" transform={`rotate(-25 ${x + 35} 102)`} />
        </g>
      )}
      <text x={x + 28} y="186" textAnchor="middle" fontSize="12" fontWeight="600" fill={C.text} fontFamily="var(--font-sans)">
        {label}
      </text>
    </g>
  )
}

/** The race between a fix and the attackers, with an updated and a not-updated phone (Diagram lab, 5 states). */
export function PatchRace({ state }: LabProps) {
  const at = clampState(state, STATES.length)
  const s = STATES[at]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <svg viewBox="0 0 320 200" role="img" aria-label={`${s.title}. ${s.line}`} className="mx-auto block h-auto w-full max-w-[460px]">
        {/* Timeline */}
        <line x1="24" y1="24" x2="296" y2="24" stroke={C.lineControl} strokeWidth="3" strokeLinecap="round" />
        <line x1="24" y1="24" x2={24 + (272 * at) / 4} y2="24" stroke={C.itText} strokeWidth="3" strokeLinecap="round" className="motion-safe:transition-all motion-safe:duration-300" />
        {STATES.map((_, i) => (
          <circle key={i} cx={24 + (272 * i) / 4} cy="24" r="6" fill={i <= at ? C.itText : C.sheet} stroke={i <= at ? C.itText : C.lineControl} strokeWidth="2" />
        ))}
        <text x="24" y="48" fontSize="10" fill={C.muted} fontFamily="var(--font-sans)">
          Flaw found
        </text>
        <text x="296" y="48" fontSize="10" fill={C.muted} textAnchor="end" fontFamily="var(--font-sans)">
          Days later
        </text>

        {/* The bug, then the patch */}
        <g style={{ opacity: at <= 1 ? 1 : 0 }} className="motion-safe:transition-opacity motion-safe:duration-300">
          <circle cx="160" cy="112" r="20" fill={at === 1 ? C.okTint : C.badTint} stroke={at === 1 ? C.ok : C.bad} strokeWidth="2" />
          <text x="160" y="117" textAnchor="middle" fontSize="13" fontWeight="700" fill={C.text} fontFamily="var(--font-sans)">
            {at === 1 ? 'Fix' : 'Flaw'}
          </text>
        </g>

        <PhoneShape x={44} label="Phone A" patched={at >= 2} attacked={false} show={at >= 2} />
        <PhoneShape x={220} label="Phone B" patched={false} attacked={at >= 3} show={at >= 2} />

        {/* The update reaching phone A only */}
        <g style={{ opacity: at === 2 ? 1 : 0 }} className="motion-safe:transition-opacity motion-safe:duration-300">
          <path d="M150 110 H108" stroke={C.ok} strokeWidth="3" strokeDasharray="5 4" />
          <path d="M110 103 L100 110 L110 117 Z" fill={C.ok} />
          <text x="130" y="100" textAnchor="middle" fontSize="11" fill={C.text} fontFamily="var(--font-sans)">
            Update
          </text>
          <text x="200" y="100" textAnchor="middle" fontSize="11" fill={C.muted} fontFamily="var(--font-sans)">
            Later…
          </text>
        </g>

        {/* The attacker */}
        <g style={{ opacity: at >= 3 ? 1 : 0 }} className="motion-safe:transition-opacity motion-safe:duration-300">
          <circle cx="160" cy="92" r="11" fill={C.badTint} stroke={C.bad} strokeWidth="2" />
          <path d="M146 128 c0 -14 28 -14 28 0" fill={C.badTint} stroke={C.bad} strokeWidth="2" />
          <text x="160" y="146" textAnchor="middle" fontSize="11" fill={C.bad} fontFamily="var(--font-sans)">
            Attacker
          </text>
          <path d="M176 110 H210" stroke={C.bad} strokeWidth="3" />
          <path d="M208 103 L218 110 L208 117 Z" fill={C.bad} />
          {at >= 4 && <path d="M144 110 H112" stroke={C.muted} strokeWidth="2" strokeDasharray="3 4" />}
          {at >= 4 && (
            <text x="128" y="128" textAnchor="middle" fontSize="16" fontWeight="700" fill={C.ok} fontFamily="var(--font-sans)">
              ✕
            </text>
          )}
        </g>
      </svg>
      <figcaption aria-live="polite" className="flex flex-col gap-1 rounded-2xl border border-line bg-row px-4 py-3">
        <span className="font-display text-[15px] font-bold text-ink">{s.title}</span>
        <span className="text-[13px] leading-5 text-ink-soft">{s.line}</span>
      </figcaption>
    </figure>
  )
}
