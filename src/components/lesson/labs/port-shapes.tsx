'use client'
import { C, type LabProps } from './shared'

type Port = { carries: string; use: string; flip: string; found: string; note?: string }

const PORTS: Record<string, Port> = {
  'USB-A': {
    carries: 'Data, and a little power',
    use: 'Mice, keyboards, flash drives and phone chargers',
    flip: 'No: it only goes in one way up',
    found: 'Desktop PCs, older laptops, chargers and TVs',
  },
  'USB-C': {
    carries: 'Data, power to charge, and video for a screen',
    use: 'Charging phones and laptops, and connecting screens and drives',
    flip: 'Yes: it fits either way up',
    found: 'Most new phones and laptops',
    note: 'Thunderbolt and USB4 ports are the same shape, with extra speed. Not every USB-C cable or port does everything, so check the label or the spec sheet.',
  },
  HDMI: {
    carries: 'Video and sound',
    use: 'A laptop or games console to a TV, monitor or projector',
    flip: 'No: the angled corners only fit one way',
    found: 'TVs, monitors, projectors, laptops and consoles',
  },
  DisplayPort: {
    carries: 'Video and sound',
    use: 'Computers to monitors, especially fast gaming monitors',
    flip: 'No: one corner is cut off',
    found: 'Desktop PCs, graphics cards and monitors',
  },
  Ethernet: {
    carries: 'Network data, through a cable',
    use: 'A wired connection to a router: steadier and often faster than Wi-Fi',
    flip: 'No: a plastic clip holds it in and only fits one way',
    found: 'Routers, desktop PCs, games consoles and some laptops',
  },
  'Audio jack': {
    carries: 'Sound',
    use: 'Wired headphones and speakers (the 3.5 mm plug)',
    flip: 'Yes: it’s round',
    found: 'Most laptops, some phones (many new phones have dropped it)',
  },
}

function Socket({ port }: { port: string }) {
  const outer = { fill: C.sunken, stroke: C.soft, strokeWidth: 3 }
  const inner = { fill: C.lineControl }
  switch (port) {
    case 'USB-A':
      return (
        <>
          <rect x="52" y="38" width="96" height="40" rx="3" {...outer} />
          <rect x="64" y="46" width="72" height="13" rx="1.5" {...inner} />
        </>
      )
    case 'USB-C':
      return (
        <>
          <rect x="58" y="42" width="84" height="32" rx="16" {...outer} />
          <rect x="74" y="54" width="52" height="8" rx="4" {...inner} />
        </>
      )
    case 'HDMI':
      return (
        <>
          <path d="M44 40 H156 V62 L146 76 H54 L44 62 Z" {...outer} strokeLinejoin="round" />
          <rect x="58" y="52" width="84" height="8" rx="1.5" {...inner} />
        </>
      )
    case 'DisplayPort':
      return (
        <>
          <path d="M48 40 H152 V64 L140 76 H48 Z" {...outer} strokeLinejoin="round" />
          <rect x="60" y="52" width="76" height="8" rx="1.5" {...inner} />
        </>
      )
    case 'Ethernet':
      return (
        <>
          <path d="M66 24 H134 V82 H114 V94 H86 V82 H66 Z" {...outer} strokeLinejoin="round" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <rect key={i} x={74 + i * 7} y="30" width="3.5" height="14" fill="#d4a017" />
          ))}
        </>
      )
    default:
      return (
        <>
          <circle cx="100" cy="58" r="26" {...outer} />
          <circle cx="100" cy="58" r="11" fill={C.text} opacity="0.85" />
        </>
      )
  }
}

/** The common ports, drawn as you'd see them on the side of a laptop (Explore lab: value = a port). */
export function PortShapes({ value = 'USB-A' }: LabProps) {
  const name = PORTS[value] ? value : 'USB-A'
  const p = PORTS[name]!
  const rows = [
    ['Carries', p.carries],
    ['Used for', p.use],
    ['Either way up?', p.flip],
    ['Found on', p.found],
  ] as const
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${name} port. Carries ${p.carries}. ${p.flip}.`}>
      <div className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-row py-3">
        <svg viewBox="0 0 200 116" aria-hidden="true" className="h-auto w-full max-w-[240px]">
          <Socket port={name} />
        </svg>
        <p className="font-display text-lg font-bold text-ink">{name}</p>
      </div>
      <dl className="flex flex-col divide-y divide-divider">
        {rows.map(([label, text]) => (
          <div key={label} className="grid grid-cols-[104px_minmax(0,1fr)] gap-3 py-2 text-[13px] leading-5">
            <dt className="text-ink-subtle">{label}</dt>
            <dd className="text-ink">{text}</dd>
          </div>
        ))}
      </dl>
      {p.note && <p className="text-[13px] leading-5 text-ink-muted">{p.note}</p>}
    </figure>
  )
}
