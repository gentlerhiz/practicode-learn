'use client'
import { C, clampState, type LabProps } from './shared'

type Part = 'building' | 'racks' | 'server' | 'power' | 'cooling' | 'regions'

const STATES: { part: Part; name: string; line: string }[] = [
  { part: 'building', name: 'A data centre', line: 'A windowless building the size of a few football pitches, with guards, fences and cameras.' },
  { part: 'racks', name: 'Rows of racks', line: 'Inside, rows and rows of tall cabinets called racks, each holding dozens of servers.' },
  { part: 'server', name: 'One server', line: 'Each slim drawer is a server: processors, memory and drives, like a computer with no screen. Your files and apps are on servers like this.' },
  { part: 'power', name: 'Power that never stops', line: 'Mains power, banks of batteries and diesel generators, so a power cut doesn’t stop anything.' },
  { part: 'cooling', name: 'Cooling', line: 'Thousands of servers make a lot of heat. Cold air or water is pumped through, which uses a great deal of energy, and often water.' },
  { part: 'regions', name: 'Copies in other places', line: 'Big providers run data centres in many regions, and keep copies in more than one, so a fire or flood in one doesn’t lose your data.' },
]

/** Inside a data centre, from the building down to one server and back out to other regions (Diagram lab, 6 states). */
export function DataCentre({ state }: LabProps) {
  const at = clampState(state, STATES.length)
  const s = STATES[at]!
  const on = (p: Part) => ({ style: { opacity: s.part === p || (p === 'racks' && s.part === 'server') ? 1 : 0.25 }, className: 'motion-safe:transition-opacity motion-safe:duration-300' })
  return (
    <figure className="m-0 flex flex-col gap-3">
      <svg viewBox="0 0 340 200" role="img" aria-label={`${s.name}. ${s.line}`} className="mx-auto block h-auto w-full max-w-[520px]">
        <g {...on('building')}>
          <rect x="10" y="40" width="230" height="150" rx="6" fill="none" stroke={s.part === 'building' ? C.itText : C.soft} strokeWidth="2.5" />
          <path d="M10 40 L125 14 L240 40" fill="none" stroke={C.soft} strokeWidth="2" />
          <path d="M4 194 H246" stroke={C.lineControl} strokeWidth="2" strokeDasharray="2 4" />
        </g>
        <g {...on('racks')}>
          {[26, 74, 122, 170].map((x) => (
            <g key={x}>
              <rect x={x} y="66" width="40" height="104" rx="3" fill={C.row} stroke={s.part === 'racks' ? C.itText : C.soft} strokeWidth="2" />
              {Array.from({ length: 8 }, (_, i) => (
                <g key={i}>
                  <rect x={x + 4} y={72 + i * 12} width="32" height="9" rx="1.5" fill={s.part === 'server' && x === 74 && i === 3 ? C.it : C.sunken} stroke={C.lineControl} strokeWidth="0.8" />
                  <circle cx={x + 9} cy={76.5 + i * 12} r="1.3" fill={C.ok} />
                </g>
              ))}
            </g>
          ))}
        </g>
        {s.part === 'server' && (
          <g className="pop-in">
            <path d="M114 112 L180 22" stroke={C.itText} strokeWidth="1.5" strokeDasharray="3 3" />
            <rect x="180" y="6" width="150" height="34" rx="6" fill={C.row} stroke={C.itText} strokeWidth="2" />
            {[190, 212, 234].map((x) => (
              <rect key={x} x={x} y="14" width="16" height="18" rx="2" fill={C.lineControl} />
            ))}
            {[262, 280, 298].map((x) => (
              <rect key={x} x={x} y="16" width="12" height="14" rx="1.5" fill={C.sunken} stroke={C.muted} strokeWidth="0.8" />
            ))}
          </g>
        )}
        <g {...on('power')}>
          <rect x="256" y="120" width="34" height="50" rx="4" fill={C.row} stroke={s.part === 'power' ? C.itText : C.soft} strokeWidth="2" />
          <path d="M276 132 L266 148 H274 L269 162 L284 142 H276 L281 132 Z" fill={s.part === 'power' ? C.itText : C.muted} />
          <rect x="296" y="140" width="36" height="30" rx="4" fill={C.row} stroke={s.part === 'power' ? C.itText : C.soft} strokeWidth="2" />
          <text x="314" y="186" textAnchor="middle" fontSize="9" fill={C.muted} fontFamily="var(--font-sans)">
            Generator
          </text>
        </g>
        <g {...on('cooling')}>
          {[52, 100, 148, 196].map((x) => (
            <path key={x} d={`M${x} 178 C ${x - 6} 168, ${x + 6} 160, ${x} 150`} fill="none" stroke="#5fd8f2" strokeWidth="2" strokeLinecap="round" />
          ))}
          <rect x="256" y="56" width="76" height="40" rx="5" fill={C.row} stroke={s.part === 'cooling' ? C.itText : C.soft} strokeWidth="2" />
          {[272, 294, 316].map((x) => (
            <circle key={x} cx={x} cy="76" r="8" fill="none" stroke="#5fd8f2" strokeWidth="1.8" />
          ))}
        </g>
        {s.part === 'regions' && (
          <g className="pop-in">
            {[
              [270, 76, 'Region B'],
              [300, 150, 'Region C'],
            ].map(([x, y, label]) => (
              <g key={label as string}>
                <path d={`M240 115 L${x} ${y}`} stroke={C.itText} strokeWidth="2" strokeDasharray="4 4" />
                <rect x={(x as number) - 30} y={(y as number) - 14} width="60" height="28" rx="6" fill={C.row} stroke={C.itText} strokeWidth="2" />
                <text x={x as number} y={(y as number) + 4} textAnchor="middle" fontSize="10" fill={C.text} fontFamily="var(--font-sans)">
                  {label as string}
                </text>
              </g>
            ))}
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
