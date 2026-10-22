'use client'
import { C, type LabProps } from './shared'

type Drive = {
  speed: number
  speedText: string
  parts: string
  sizes: string
  where: string
  cost: string
  copy: string
}

const DRIVES: Record<string, Drive> = {
  'Hard drive': {
    speed: 150,
    speedText: 'about 150 MB/s',
    parts: 'Yes: spinning disks and an arm that moves across them',
    sizes: '1 TB to over 20 TB',
    where: 'Desktop PCs, backup drives and servers that store a lot',
    cost: 'The cheapest per gigabyte',
    copy: 'about a minute',
  },
  'SATA SSD': {
    speed: 550,
    speedText: 'about 550 MB/s',
    parts: 'None: only memory chips',
    sizes: '250 GB to 4 TB',
    where: 'Older laptops, and upgrades for older computers',
    cost: 'Low',
    copy: 'about 18 seconds',
  },
  'NVMe SSD': {
    speed: 3500,
    speedText: 'about 3,500 MB/s (newer ones over 7,000)',
    parts: 'None: memory chips on a slim stick',
    sizes: '256 GB to 4 TB',
    where: 'Most new laptops and desktop PCs',
    cost: 'Low to medium',
    copy: 'about 3 seconds',
  },
  'Memory card': {
    speed: 90,
    speedText: 'about 90 MB/s',
    parts: 'None: memory chips in a thin card',
    sizes: '32 GB to 1 TB',
    where: 'Cameras, drones, games consoles and some phones',
    cost: 'Low, but slow',
    copy: 'about 2 minutes',
  },
}

function Drawing({ kind }: { kind: string }) {
  const s = { fill: C.row, stroke: C.soft, strokeWidth: 2 }
  switch (kind) {
    case 'Hard drive':
      return (
        <>
          <rect x="20" y="10" width="120" height="84" rx="6" {...s} />
          <circle cx="72" cy="52" r="34" fill={C.sunken} stroke={C.muted} strokeWidth="1.5" />
          <circle cx="72" cy="52" r="22" fill="none" stroke={C.lineControl} />
          <circle cx="72" cy="52" r="5" fill={C.soft} />
          <path d="M126 22 L84 46" stroke={C.itText} strokeWidth="4" strokeLinecap="round" />
          <circle cx="126" cy="22" r="6" fill={C.itText} />
        </>
      )
    case 'SATA SSD':
      return (
        <>
          <rect x="20" y="10" width="120" height="84" rx="6" {...s} />
          <rect x="36" y="26" width="88" height="40" rx="4" fill={C.itTint} stroke={C.itText} />
          <text x="80" y="51" textAnchor="middle" fontSize="12" fontWeight="700" fill={C.text} fontFamily="var(--font-sans)">
            SSD
          </text>
          <path d="M44 94 V86 H70 V94 M78 94 V86 H116 V94" fill="none" stroke={C.muted} strokeWidth="2" />
        </>
      )
    case 'NVMe SSD':
      return (
        <>
          <rect x="8" y="38" width="144" height="28" rx="3" {...s} />
          {[18, 48, 78].map((x) => (
            <rect key={x} x={x} y="43" width="24" height="18" rx="2" fill={C.lineControl} />
          ))}
          <path d="M116 42 V62 M121 42 V62 M126 42 V62 M131 42 V62 M136 42 V62 M141 42 V62" stroke="#d4a017" strokeWidth="2" />
          <circle cx="14" cy="52" r="3" fill={C.sunken} stroke={C.muted} />
        </>
      )
    default:
      return (
        <>
          <path d="M60 10 H112 V94 H48 V24 Z" {...s} />
          {[60, 70, 80, 90, 100].map((x) => (
            <rect key={x} x={x} y="16" width="6" height="14" rx="1" fill="#d4a017" />
          ))}
          <rect x="58" y="44" width="44" height="34" rx="3" fill={C.itTint} stroke={C.itText} />
        </>
      )
  }
}

/** A hard drive, two kinds of SSD and a memory card, with their speed (Explore lab: value = a drive). */
export function DriveTypes({ value = 'Hard drive' }: LabProps) {
  const kind = DRIVES[value] ? value : 'Hard drive'
  const d = DRIVES[kind]!
  const rows = [
    ['Moving parts', d.parts],
    ['Typical sizes', d.sizes],
    ['Found in', d.where],
    ['Cost', d.cost],
  ] as const
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${kind}: ${d.speedText}. Moving parts: ${d.parts}.`}>
      <div className="flex items-center gap-4 rounded-2xl border border-line bg-row p-3">
        <svg viewBox="0 0 160 104" aria-hidden="true" className="h-auto w-[38%] max-w-[150px] shrink-0">
          <Drawing kind={kind} />
        </svg>
        <div className="flex min-w-0 flex-col gap-1">
          <p className="font-display text-lg font-bold text-ink">{kind}</p>
          <p className="text-[13px] leading-5 text-ink-soft">
            Copies a 10 GB folder in <span className="font-semibold text-ink">{d.copy}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-[12px]">
          <span className="font-semibold text-ink">Speed</span>
          <span className="text-ink-muted">{d.speedText}</span>
        </div>
        <div aria-hidden="true" className="h-3 overflow-hidden rounded-full bg-sheet">
          <div className="h-3 rounded-full bg-it motion-safe:transition-all motion-safe:duration-300" style={{ width: `${Math.max(2.5, (d.speed / 3500) * 100)}%` }} />
        </div>
      </div>
      <dl className="flex flex-col divide-y divide-divider">
        {rows.map(([label, text]) => (
          <div key={label} className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 py-2 text-[13px] leading-5">
            <dt className="text-ink-subtle">{label}</dt>
            <dd className="text-ink">{text}</dd>
          </div>
        ))}
      </dl>
    </figure>
  )
}
