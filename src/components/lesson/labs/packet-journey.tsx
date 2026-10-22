'use client'
import { C, clampState, type LabProps } from './shared'

const STATES = [
  { name: 'One page, many packets', line: 'A web page is too big to send in one go, so the server cuts it into packets: small numbered pieces.' },
  { name: 'Each packet is addressed', line: 'Each packet carries its number, where it came from and where it’s going: your public IP address.' },
  { name: 'Router to router', line: 'Routers pass each packet on, towards its address. Packets from the same page can take different routes.' },
  { name: 'One gets lost', line: 'Now and then, a packet is lost on the way, perhaps at a busy router.' },
  { name: 'Asked for again', line: 'Your device notices number 3 is missing, and asks for it again. That’s TCP, one of the internet’s rules.' },
  { name: 'Put back together', line: 'With every packet in, they’re put back in order, and the page appears. HTTPS keeps each one locked, so nobody on the way can read it.' },
]

// Routers in a mesh between the server (left) and your phone (right).
const R = [
  [110, 50],
  [110, 130],
  [180, 90],
  [240, 40],
  [240, 140],
]
const LINKS: [number, number][] = [
  [0, 2],
  [1, 2],
  [0, 3],
  [2, 3],
  [2, 4],
  [1, 4],
]
// Each packet's path through the routers, and where it sits in each state.
const PATHS = [
  [[40, 90], [110, 50], [240, 40], [300, 90]],
  [[40, 90], [110, 130], [180, 90], [240, 140], [300, 90]],
  [[40, 90], [110, 50], [180, 90], [240, 40], [300, 90]],
  [[40, 90], [110, 130], [240, 140], [300, 90]],
]

function packetAt(p: number, at: number): { x: number; y: number; show: boolean; small?: boolean } {
  const path = PATHS[p]!
  const step = at <= 1 ? 0 : at === 2 ? Math.floor(path.length / 2) : path.length - 1
  if (p === 2 && (at === 3 || at === 4)) {
    // Packet 3 is lost at the middle router, then sent again.
    if (at === 3) return { x: 180, y: 90, show: false }
    return { x: 110, y: 50, show: true }
  }
  // Arrived packets stack inside the phone, smaller, so every number shows.
  if (step === path.length - 1) return { x: 303, y: 75 + p * 11, show: true, small: true }
  const [x, y] = path[step]!
  return { x: x!, y: y! + (at <= 1 ? (p - 1.5) * 16 : 0), show: true }
}

/** A page cut into packets, routed across the internet, and put back together (Diagram lab, 6 states). */
export function PacketJourney({ state }: LabProps) {
  const at = clampState(state, STATES.length)
  const s = STATES[at]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <svg viewBox="0 0 340 190" role="img" aria-label={`${s.name}. ${s.line}`} className="mx-auto block h-auto w-full max-w-[520px]">
        {LINKS.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={R[a]![0]} y1={R[a]![1]} x2={R[b]![0]} y2={R[b]![1]} stroke={C.lineControl} strokeWidth="2" />
        ))}
        <line x1="52" y1="90" x2={R[0]![0]} y2={R[0]![1]} stroke={C.lineControl} strokeWidth="2" />
        <line x1="52" y1="90" x2={R[1]![0]} y2={R[1]![1]} stroke={C.lineControl} strokeWidth="2" />
        <line x1={R[3]![0]} y1={R[3]![1]} x2="288" y2="90" stroke={C.lineControl} strokeWidth="2" />
        <line x1={R[4]![0]} y1={R[4]![1]} x2="288" y2="90" stroke={C.lineControl} strokeWidth="2" />
        {R.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="11" fill={at === 3 && i === 2 ? C.badTint : C.row} stroke={at === 3 && i === 2 ? C.bad : C.soft} strokeWidth="2" />
            <path d={`M${x! - 5} ${y} h10 M${x} ${y! - 5} v10`} stroke={C.muted} strokeWidth="1.5" />
          </g>
        ))}
        <rect x="12" y="62" width="40" height="56" rx="5" fill={C.row} stroke={C.soft} strokeWidth="2" />
        <text x="32" y="134" textAnchor="middle" fontSize="10" fill={C.muted} fontFamily="var(--font-sans)">
          Server
        </text>
        <rect x="288" y="66" width="30" height="50" rx="6" fill={C.row} stroke={C.soft} strokeWidth="2" />
        <text x="303" y="132" textAnchor="middle" fontSize="10" fill={C.muted} fontFamily="var(--font-sans)">
          You
        </text>
        {at === 5 && (
          <g className="pop-in">
            <rect x="292" y="72" width="22" height="38" rx="3" fill={C.itTint} />
            <path d="M303 158 m-6 0 h12 v10 h-12 z M299 158 v-4 a4 4 0 0 1 8 0 v4" fill="none" stroke={C.ok} strokeWidth="1.8" />
            <text x="303" y="182" textAnchor="middle" fontSize="9" fill={C.ok} fontFamily="var(--font-sans)">
              HTTPS
            </text>
          </g>
        )}
        {[0, 1, 2, 3].map((p) => {
          const { x, y, show, small } = packetAt(p, at)
          return (
            <g key={p} style={{ transform: `translate(${x}px, ${y}px) scale(${small ? 0.68 : 1})`, opacity: show && at < 5 ? 1 : 0 }} className="motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-out">
              <rect x="-9" y="-8" width="18" height="16" rx="3" fill={p === 2 && at === 4 ? C.ok : C.it} />
              <text y="4" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" fontFamily="var(--font-mono)">
                {p + 1}
              </text>
            </g>
          )
        })}
        {at === 1 && (
          <text x="60" y="30" fontSize="10" fill={C.text} fontFamily="var(--font-mono)" className="pop-in">
            to 203.0.113.42 · 3 of 4
          </text>
        )}
        {at === 3 && (
          <text x="180" y="122" textAnchor="middle" fontSize="10" fill={C.bad} fontFamily="var(--font-sans)">
            Lost
          </text>
        )}
      </svg>
      <figcaption aria-live="polite" className="flex flex-col gap-1 rounded-2xl border border-line bg-row px-4 py-3">
        <span className="font-display text-[15px] font-bold text-ink">{s.name}</span>
        <span className="text-[13px] leading-5 text-ink-soft">{s.line}</span>
      </figcaption>
    </figure>
  )
}
