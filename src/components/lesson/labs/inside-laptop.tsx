'use client'
import { C, clampState, type LabProps } from './shared'

type Part = 'board' | 'cpu' | 'ram' | 'storage' | 'battery' | 'ports'

// What each state lights up, and the line under the drawing. State 0 shows everything.
const STATES: { lit: Part[]; name: string; line: string }[] = [
  {
    lit: ['board', 'cpu', 'ram', 'storage', 'battery', 'ports'],
    name: 'Inside a laptop',
    line: 'With the bottom cover off: everything sits on, or plugs into, one board.',
  },
  { lit: ['board'], name: 'Motherboard', line: 'The board every part plugs into, with tiny wires printed between them.' },
  { lit: ['cpu'], name: 'Processor and cooling', line: 'The processor (CPU), with a copper heat pipe and a fan to carry its heat away.' },
  { lit: ['ram'], name: 'Memory (RAM)', line: 'The fast working space: here, two sticks of memory chips.' },
  { lit: ['storage'], name: 'Storage (SSD)', line: 'A slim stick of memory chips that keeps your files with the power off.' },
  { lit: ['battery'], name: 'Battery', line: 'The biggest part: often more than half of the space inside.' },
  { lit: ['ports'], name: 'Ports and wireless', line: 'Sockets along the edges, and a small card for Wi-Fi and Bluetooth.' },
]

/** An opened laptop, one part at a time (Diagram lab, 7 states: everything, then each part). */
export function InsideLaptop({ state }: LabProps) {
  const at = clampState(state, STATES.length)
  const s = STATES[at]!
  const all = at === 0
  const on = (p: Part) => s.lit.includes(p)
  const g = (p: Part) => ({
    style: { opacity: on(p) ? 1 : 0.28 },
    className: 'motion-safe:transition-opacity motion-safe:duration-300',
  })
  const stroke = (p: Part) => (on(p) && !all ? C.itText : C.soft)
  const fill = (p: Part) => (on(p) && !all ? C.itTint : C.row)
  const width = (p: Part) => (on(p) && !all ? 2.5 : 1.5)

  return (
    <figure className="m-0 flex flex-col gap-3">
      <svg viewBox="0 0 340 236" role="img" aria-label={`${s.name}. ${s.line}`} className="mx-auto block h-auto w-full max-w-[520px]">
        <rect x="6" y="6" width="328" height="224" rx="16" fill={C.sunken} stroke={C.lineControl} strokeWidth="2" />

        <g {...g('board')}>
          <rect x="20" y="18" width="300" height="106" rx="8" fill={fill('board')} stroke={stroke('board')} strokeWidth={width('board')} />
          {/* Printed wires between the parts */}
          <path
            d="M66 46 H98 M66 58 H98 M66 84 H98 M66 96 H98 M148 84 H168 V102 M118 90 V102 M196 34 H214 M300 104 H310 V40 H320"
            fill="none"
            stroke={C.lineControl}
            strokeWidth="1.5"
          />
          {[[90, 112], [150, 28], [300, 112], [36, 118]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="none" stroke={C.lineControl} strokeWidth="1.5" />
          ))}
        </g>

        <g {...g('ram')}>
          {[32, 52].map((x) => (
            <g key={x}>
              <rect x={x} y="28" width="14" height="86" rx="2" fill={fill('ram')} stroke={stroke('ram')} strokeWidth={width('ram')} />
              {[34, 52, 70, 88].map((y) => (
                <rect key={y} x={x + 3} y={y} width="8" height="13" rx="1" fill={C.lineControl} />
              ))}
            </g>
          ))}
        </g>

        <g {...g('cpu')}>
          <rect x="98" y="38" width="50" height="50" rx="5" fill={fill('cpu')} stroke={stroke('cpu')} strokeWidth={width('cpu')} />
          <rect x="111" y="51" width="24" height="24" rx="3" fill={C.lineControl} />
          <path d="M148 63 H224" stroke="#c87533" strokeWidth="7" strokeLinecap="round" />
          <circle cx="258" cy="60" r="33" fill={fill('cpu')} stroke={stroke('cpu')} strokeWidth={width('cpu')} />
          {[0, 72, 144, 216, 288].map((a) => (
            <path key={a} d="M258 60 C 262 46, 274 40, 282 44 C 276 50, 268 56, 258 60 Z" fill={C.lineControl} transform={`rotate(${a} 258 60)`} />
          ))}
          <circle cx="258" cy="60" r="7" fill={C.soft} />
        </g>

        <g {...g('storage')}>
          <rect x="150" y="102" width="104" height="15" rx="2" fill={fill('storage')} stroke={stroke('storage')} strokeWidth={width('storage')} />
          {[158, 182, 206].map((x) => (
            <rect key={x} x={x} y="105" width="18" height="9" rx="1" fill={C.lineControl} />
          ))}
          <path d="M240 105 V114 M244 105 V114 M248 105 V114" stroke="#d4a017" strokeWidth="1.5" />
        </g>

        <g {...g('battery')}>
          <rect x="34" y="136" width="272" height="82" rx="10" fill={fill('battery')} stroke={stroke('battery')} strokeWidth={width('battery')} />
          <path d="M124 140 V214 M216 140 V214" stroke={C.lineControl} strokeWidth="1.5" />
          <path d="M174 158 L162 180 H172 L166 198 L182 172 H172 L178 158 Z" fill={on('battery') && !all ? C.itText : C.muted} />
        </g>

        <g {...g('ports')}>
          <rect x="98" y="100" width="40" height="17" rx="2" fill={fill('ports')} stroke={stroke('ports')} strokeWidth={width('ports')} />
          <path d="M104 100 C 100 84, 84 82, 78 70 M132 100 C 136 90, 150 92, 158 96" fill="none" stroke={C.muted} strokeWidth="1.2" />
          {/* Sockets on the left and right edges */}
          <rect x="2" y="40" width="12" height="8" rx="4" fill={C.sheet} stroke={stroke('ports')} strokeWidth={width('ports')} />
          <rect x="2" y="56" width="12" height="13" rx="1.5" fill={C.sheet} stroke={stroke('ports')} strokeWidth={width('ports')} />
          <path d="M2 78 H14 V88 L11 91 H5 L2 88 Z" fill={C.sheet} stroke={stroke('ports')} strokeWidth={width('ports')} />
          <rect x="326" y="40" width="12" height="8" rx="4" fill={C.sheet} stroke={stroke('ports')} strokeWidth={width('ports')} />
          <circle cx="332" cy="64" r="5" fill={C.sheet} stroke={stroke('ports')} strokeWidth={width('ports')} />
        </g>
      </svg>
      <figcaption className="flex flex-col gap-1 rounded-2xl border border-line bg-row px-4 py-3">
        <span className="font-display text-[15px] font-bold text-ink">{s.name}</span>
        <span className="text-[13px] leading-5 text-ink-soft">{s.line}</span>
      </figcaption>
    </figure>
  )
}
