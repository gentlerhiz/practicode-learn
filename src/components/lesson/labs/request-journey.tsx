'use client'
import { C, type LabProps } from './shared'

// Which parts are lit in each state: type the address, find the server, request, response, extras, page.
const ON = {
  phone: [0, 1, 2, 3, 4, 5],
  addr: [0, 1, 2],
  typed: [0],
  dns: [1],
  req: [2],
  server: [2, 3, 4],
  res: [3],
  extras: [4],
  page: [5],
  tap: [0],
} as const

const DESCRIPTION = [
  'Your phone, with the address learn.practicode.tech typed in and Go being tapped.',
  'The phone asks where the server for that address is.',
  'A request travels from the phone to the server.',
  'The server sends back a response: the page’s HTML.',
  'The phone asks the server for the extra files: CSS, an image and JavaScript.',
  'The finished page appears on the phone.',
]

function T({
  x,
  y,
  size,
  children,
  fill = C.text,
  mono = false,
  weight,
}: {
  x: number
  y: number
  size: number
  children: string
  fill?: string
  mono?: boolean
  weight?: number
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize={size}
      fill={fill}
      fontFamily={mono ? 'var(--font-mono)' : 'var(--font-sans)'}
      fontWeight={weight}
    >
      {children}
    </text>
  )
}

/** A phone and a server, with the messages that pass between them (Diagram lab, 6 states). */
export function RequestJourney({ state = 0 }: LabProps) {
  const at = Math.min(Math.max(state, 0), 5)
  const lit = (part: keyof typeof ON) => ((ON[part] as readonly number[]).includes(at) ? 1 : 0.22)
  const shown = (part: keyof typeof ON) => ((ON[part] as readonly number[]).includes(at) ? 1 : 0)
  const g = (part: keyof typeof ON, mode: 'dim' | 'hide') => ({
    style: { opacity: mode === 'dim' ? lit(part) : shown(part) },
    className: 'motion-safe:transition-opacity motion-safe:duration-250',
  })

  return (
    <figure className="m-0">
      <svg
        viewBox="0 0 320 210"
        role="img"
        aria-label="A phone on the left and a server on the right, with messages passing between them"
        className="mx-auto block h-auto w-full max-w-[440px]"
      >
        <g {...g('phone', 'dim')}>
          <rect x="8" y="14" width="92" height="166" rx="16" fill="none" stroke={C.soft} strokeWidth="2" />
          <rect x="16" y="28" width="76" height="138" rx="6" fill={C.row} stroke={C.line} />
          <T x={54} y={202} size={13} fill={C.muted}>
            Your phone
          </T>
        </g>
        {/* The address is too long to read inside a drawn phone, so the bar holds a placeholder and a callout shows it. */}
        <g {...g('addr', 'hide')}>
          <rect x="20" y="34" width="68" height="18" rx="9" fill={C.sunken} stroke={C.trackText} />
          <rect x="28" y="41" width="40" height="4" rx="2" fill={C.muted} />
        </g>
        <g {...g('typed', 'hide')}>
          <path
            d="M90 43 C 102 43, 106 23, 118 23"
            fill="none"
            stroke={C.trackText}
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <rect x="118" y="6" width="194" height="34" rx="10" fill={C.trackTint} stroke={C.trackText} />
          <T x={215} y={28} size={12} mono>
            learn.practicode.tech
          </T>
        </g>
        <g {...g('tap', 'hide')}>
          <circle cx="80" cy="43" r="10" fill={C.track} opacity="0.35" />
          <circle cx="80" cy="43" r="4.5" fill={C.track} />
        </g>
        <g {...g('page', 'hide')}>
          <rect x="22" y="36" width="50" height="9" rx="2" fill={C.track} />
          <rect x="22" y="51" width="64" height="5" rx="2" fill={C.muted} />
          <rect x="22" y="60" width="56" height="5" rx="2" fill={C.muted} />
          <rect x="22" y="71" width="64" height="40" rx="4" fill="#E8792F" />
          <rect x="22" y="117" width="64" height="5" rx="2" fill={C.muted} />
          <rect x="22" y="126" width="48" height="5" rx="2" fill={C.muted} />
          <rect x="22" y="138" width="36" height="13" rx="6.5" fill="#FED606" />
        </g>
        <g {...g('server', 'dim')}>
          {[44, 80, 116].map((y) => (
            <g key={y}>
              <rect
                x="222"
                y={y}
                width="90"
                height="30"
                rx="6"
                fill={C.row}
                stroke={C.soft}
                strokeWidth="2"
              />
              <circle cx="236" cy={y + 15} r="3.5" fill={C.ok} />
              <rect x="248" y={y + 13} width="50" height="4" rx="2" fill={C.lineControl} />
            </g>
          ))}
          <T x={267} y={168} size={13} fill={C.muted}>
            Server
          </T>
        </g>
        <g {...g('dns', 'hide')}>
          <rect x="112" y="4" width="104" height="44" rx="10" fill={C.trackTint} stroke={C.trackText} />
          <T x={164} y={22} size={12}>
            Where is the
          </T>
          <T x={164} y={39} size={12}>
            server?
          </T>
          <path
            d="M100 56 C 104 40, 106 32, 110 28"
            fill="none"
            stroke={C.trackText}
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
        </g>
        {/* Arrows run level with the centres of the server boxes (y = 59, 95, 131). */}
        <g {...g('req', 'hide')}>
          <line x1="106" y1="95" x2="210" y2="95" stroke={C.trackText} strokeWidth="3" />
          <path d="M208 88 L218 95 L208 102 Z" fill={C.trackText} />
          <T x={162} y={85} size={13} weight={600}>
            Request
          </T>
        </g>
        <g {...g('res', 'hide')}>
          <line x1="114" y1="95" x2="218" y2="95" stroke={C.ok} strokeWidth="3" />
          <path d="M116 88 L106 95 L116 102 Z" fill={C.ok} />
          <T x={162} y={85} size={13} weight={600}>
            Response
          </T>
          <rect x="134" y="105" width="56" height="22" rx="5" fill={C.okTint} stroke={C.ok} />
          <T x={162} y={120} size={11} mono>
            HTML
          </T>
        </g>
        <g {...g('extras', 'hide')}>
          {['CSS', 'Image', 'JS'].map((label, i) => {
            const y = 59 + i * 36
            return (
              <g key={label}>
                <line
                  x1="114"
                  y1={y}
                  x2="216"
                  y2={y}
                  stroke={C.trackText}
                  strokeWidth="2"
                  strokeDasharray="5 4"
                />
                <path d={`M116 ${y - 6} L106 ${y} L116 ${y + 6} Z`} fill={C.trackText} />
                <rect x="134" y={y - 11} width="56" height="22" rx="5" fill={C.row} stroke={C.trackText} />
                <T x={162} y={y + 4} size={11} mono>
                  {label}
                </T>
              </g>
            )
          })}
        </g>
      </svg>
      <figcaption className="sr-only">{DESCRIPTION[at]}</figcaption>
    </figure>
  )
}
