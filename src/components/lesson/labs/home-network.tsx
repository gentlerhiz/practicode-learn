'use client'
import { C, clampState, type LabProps } from './shared'

type Part = 'devices' | 'wifi' | 'router' | 'modem' | 'isp' | 'internet'

const STATES: { lit: Part[]; name: string; line: string }[] = [
  { lit: ['devices', 'wifi', 'router', 'modem', 'isp', 'internet'], name: 'A home network', line: 'Every device in a home, joined to the rest of the world.' },
  { lit: ['devices', 'wifi', 'router'], name: 'The local network', line: 'Devices in one place, joined by Wi-Fi or cables, make a local network (LAN). They can talk to each other, as when a laptop prints.' },
  { lit: ['router'], name: 'The router', line: 'The router joins the local network together and passes messages between it and the internet. Most home routers also make the Wi-Fi.' },
  { lit: ['modem'], name: 'The modem', line: 'The modem turns the router’s messages into signals for the line outside: fibre, cable, phone line or mobile. Often it’s built into the router.' },
  { lit: ['isp'], name: 'The internet provider', line: 'Your internet service provider (ISP) connects your home to the internet, and charges for it.' },
  { lit: ['internet'], name: 'The internet', line: 'The internet is a network of networks: millions of them, joined by routers and cables under the sea.' },
]

function Device({ x, y, kind }: { x: number; y: number; kind: 'phone' | 'laptop' | 'tv' | 'printer' }) {
  const s = { fill: C.row, stroke: C.soft, strokeWidth: 2 }
  if (kind === 'phone') return <rect x={x - 9} y={y - 15} width="18" height="30" rx="4" {...s} />
  if (kind === 'laptop')
    return (
      <g>
        <rect x={x - 16} y={y - 12} width="32" height="20" rx="2" {...s} />
        <path d={`M${x - 21} ${y + 11} H${x + 21}`} stroke={C.soft} strokeWidth="3" strokeLinecap="round" />
      </g>
    )
  if (kind === 'tv')
    return (
      <g>
        <rect x={x - 20} y={y - 13} width="40" height="24" rx="2" {...s} />
        <path d={`M${x - 8} ${y + 15} H${x + 8}`} stroke={C.soft} strokeWidth="2.5" />
      </g>
    )
  return (
    <g>
      <rect x={x - 15} y={y - 6} width="30" height="16" rx="3" {...s} />
      <rect x={x - 9} y={y - 14} width="18" height="9" {...s} />
    </g>
  )
}

/** A home network from devices out to the internet (Diagram lab, 6 states). */
export function HomeNetwork({ state }: LabProps) {
  const at = clampState(state, STATES.length)
  const s = STATES[at]!
  const g = (p: Part) => ({ style: { opacity: s.lit.includes(p) ? 1 : 0.22 }, className: 'motion-safe:transition-opacity motion-safe:duration-300' })
  const hi = (p: Part) => at > 0 && s.lit.length === 1 && s.lit[0] === p
  return (
    <figure className="m-0 flex flex-col gap-3">
      <svg viewBox="0 0 340 220" role="img" aria-label={`${s.name}. ${s.line}`} className="mx-auto block h-auto w-full max-w-[520px]">
        {/* The home */}
        <path d="M10 92 L110 28 L210 92 V206 H10 Z" fill="none" stroke={C.lineControl} strokeWidth="2" strokeDasharray="4 4" />
        <text x="22" y="200" fontSize="11" fill={C.muted} fontFamily="var(--font-sans)">
          Home
        </text>
        <g {...g('devices')}>
          <Device x={40} y={120} kind="phone" />
          <Device x={92} y={118} kind="laptop" />
          <Device x={40} y={170} kind="tv" />
          <Device x={92} y={172} kind="printer" />
        </g>
        <g {...g('wifi')}>
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${130 - i * 6} ${130 - i * 9} q ${-10 - i * 4} ${15 + i * 9} 0 ${30 + i * 18}`} fill="none" stroke={C.itText} strokeWidth="2" strokeLinecap="round" opacity={1 - i * 0.25} />
          ))}
          <path d="M108 172 H160" stroke={C.soft} strokeWidth="2" />
        </g>
        <g {...g('router')}>
          <rect x="150" y="128" width="44" height="20" rx="5" fill={hi('router') ? C.itTint : C.row} stroke={hi('router') ? C.itText : C.soft} strokeWidth="2" />
          {[158, 166, 174].map((x) => (
            <circle key={x} cx={x} cy="138" r="2" fill={C.ok} />
          ))}
          <path d="M158 128 V112 M186 128 V112" stroke={C.soft} strokeWidth="2" strokeLinecap="round" />
          <text x="172" y="164" textAnchor="middle" fontSize="11" fill={C.text} fontFamily="var(--font-sans)">
            Router
          </text>
        </g>
        <g {...g('modem')}>
          <rect x="152" y="176" width="40" height="18" rx="4" fill={hi('modem') ? C.itTint : C.row} stroke={hi('modem') ? C.itText : C.soft} strokeWidth="2" />
          <path d="M172 148 V176" stroke={C.soft} strokeWidth="2" />
          <text x="172" y="214" textAnchor="middle" fontSize="11" fill={C.text} fontFamily="var(--font-sans)">
            Modem
          </text>
        </g>
        <g {...g('isp')}>
          <path d="M192 185 H246" stroke={C.itText} strokeWidth="3" />
          <rect x="246" y="166" width="38" height="38" rx="5" fill={hi('isp') ? C.itTint : C.row} stroke={hi('isp') ? C.itText : C.soft} strokeWidth="2" />
          <text x="265" y="190" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.text} fontFamily="var(--font-sans)">
            ISP
          </text>
          <path d="M265 166 V118" stroke={C.itText} strokeWidth="3" />
        </g>
        <g {...g('internet')}>
          <path
            d="M232 86 c-14 0 -20 -16 -8 -24 c-2 -18 22 -26 32 -14 c8 -14 34 -12 38 4 c16 -2 26 14 16 26 c6 12 -6 22 -18 18 c-8 10 -30 10 -36 0 c-10 6 -26 0 -24 -10 Z"
            fill={hi('internet') ? C.itTint : C.row}
            stroke={hi('internet') ? C.itText : C.soft}
            strokeWidth="2"
          />
          {[
            [250, 60],
            [276, 50],
            [298, 70],
            [262, 82],
          ].map(([x, y], i, all) => (
            <g key={i}>
              <circle cx={x} cy={y} r="3.5" fill={C.itText} />
              {i > 0 && <line x1={all[i - 1]![0]} y1={all[i - 1]![1]} x2={x} y2={y} stroke={C.itText} strokeWidth="1.2" />}
            </g>
          ))}
          <text x="270" y="112" textAnchor="middle" fontSize="11" fill={C.text} fontFamily="var(--font-sans)">
            The internet
          </text>
        </g>
      </svg>
      <figcaption aria-live="polite" className="flex flex-col gap-1 rounded-2xl border border-line bg-row px-4 py-3">
        <span className="font-display text-[15px] font-bold text-ink">{s.name}</span>
        <span className="text-[13px] leading-5 text-ink-soft">{s.line}</span>
      </figcaption>
    </figure>
  )
}
