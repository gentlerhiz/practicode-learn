'use client'
import { C, type LabProps } from './shared'

type Os = { made: string; cost: string; start: string; files: string; settings: string; store: string; terminal: string; found: string }

const SYSTEMS: Record<string, Os> = {
  Windows: {
    made: 'Microsoft',
    cost: 'Included in the price of most PCs',
    start: 'The Start button, on the taskbar at the bottom',
    files: 'File Explorer',
    settings: 'Settings',
    store: 'Microsoft Store',
    terminal: 'Terminal (Command Prompt and PowerShell)',
    found: 'Most desktop PCs and laptops',
  },
  macOS: {
    made: 'Apple',
    cost: 'Free with every Mac',
    start: 'The Dock at the bottom, or Spotlight search',
    files: 'Finder',
    settings: 'System Settings',
    store: 'App Store',
    terminal: 'Terminal',
    found: 'Only Apple’s Mac computers',
  },
  Linux: {
    made: 'Thousands of developers. Ubuntu, shown here, is one version, from Canonical',
    cost: 'Free and open source',
    start: 'The dock on the left, or Show Apps',
    files: 'Files',
    settings: 'Settings',
    store: 'App Center',
    terminal: 'Terminal',
    found: 'Most of the world’s servers, and some desktops and laptops',
  },
}

const ROWS = [
  ['made', 'Made by'],
  ['cost', 'Costs'],
  ['start', 'Open apps from'],
  ['files', 'Files app'],
  ['settings', 'Settings app'],
  ['store', 'App store'],
  ['terminal', 'Command line'],
  ['found', 'Runs on'],
] as const

function Screen({ os }: { os: string }) {
  const bar = { fill: C.sheet, stroke: C.line }
  const icon = (x: number, y: number, colour: string, key: string) => <rect key={key} x={x} y={y} width="12" height="12" rx="3" fill={colour} />
  const window = (x: number, controls: 'left' | 'right') => (
    <g>
      <rect x={x} y="40" width="168" height="104" rx="6" fill={C.row} stroke={C.lineControl} />
      <rect x={x} y="40" width="168" height="16" rx="6" fill={C.sunken} />
      {controls === 'left'
        ? ['#ff5f57', '#febc2e', '#28c840'].map((c, i) => <circle key={c} cx={x + 10 + i * 10} cy="48" r="3.2" fill={c} />)
        : ['—', '▢', '✕'].map((t, i) => (
            <text key={t} x={x + 134 + i * 12} y="52" fontSize="8" textAnchor="middle" fill={C.muted} fontFamily="var(--font-sans)">
              {t}
            </text>
          ))}
      {[66, 78, 90].map((y, i) => (
        <rect key={y} x={x + 12} y={y} width={[120, 96, 132][i]} height="5" rx="2.5" fill={C.lineControl} />
      ))}
      <rect x={x + 12} y="104" width="56" height="30" rx="4" fill={C.itTint} stroke={C.itText} strokeWidth="1" />
    </g>
  )
  const colours = ['#3d5af5', '#0a7d5c', '#d9306f', '#a85a00', '#6e4cf5']
  if (os === 'Windows')
    return (
      <>
        <rect x="0" y="0" width="320" height="200" rx="10" fill="url(#wall-win)" />
        {window(76, 'right')}
        <rect x="0" y="176" width="320" height="24" rx="0" {...bar} />
        {/* Start: four squares, then pinned apps, centred */}
        <g transform="translate(110 182)">
          {[0, 1].flatMap((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={c * 6} y={r * 6} width="5" height="5" fill="#3d8bfd" />))}
        </g>
        {colours.map((c, i) => icon(128 + i * 16, 182, c, c))}
        <text x="300" y="192" fontSize="8" textAnchor="end" fill={C.muted} fontFamily="var(--font-sans)">
          12:30
        </text>
      </>
    )
  if (os === 'macOS')
    return (
      <>
        <rect x="0" y="0" width="320" height="200" rx="10" fill="url(#wall-mac)" />
        <rect x="0" y="0" width="320" height="14" {...bar} />
        <circle cx="12" cy="7" r="3.5" fill={C.text} />
        {['Finder', 'File', 'Edit', 'View'].map((t, i) => (
          <text key={t} x={24 + i * 28} y="10" fontSize="7.5" fill={C.text} fontWeight={i ? 400 : 700} fontFamily="var(--font-sans)">
            {t}
          </text>
        ))}
        {window(76, 'left')}
        <rect x="90" y="172" width="140" height="22" rx="8" fill={C.glass} stroke={C.line} />
        {colours.map((c, i) => icon(102 + i * 24, 177, c, c))}
      </>
    )
  return (
    <>
      <rect x="0" y="0" width="320" height="200" rx="10" fill="url(#wall-linux)" />
      <rect x="0" y="0" width="320" height="14" {...bar} />
      <text x="10" y="10" fontSize="7.5" fill={C.text} fontFamily="var(--font-sans)">
        Activities
      </text>
      <text x="160" y="10" fontSize="7.5" fill={C.text} textAnchor="middle" fontFamily="var(--font-sans)">
        Mon 12:30
      </text>
      <rect x="4" y="22" width="22" height="160" rx="6" fill={C.glass} stroke={C.line} />
      {colours.map((c, i) => icon(9, 30 + i * 20, c, c))}
      <g transform="translate(9 162)">
        {[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={2 + c * 4} cy={2 + r * 4} r="1.2" fill={C.text} />))}
      </g>
      {window(84, 'right')}
    </>
  )
}

/** Windows, macOS and Linux, drawn as you'd see them, with where things live (Explore lab: value = a system). */
export function DesktopOs({ value = 'Windows' }: LabProps) {
  const name = SYSTEMS[value] ? value : 'Windows'
  const os = SYSTEMS[name]!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${name}. Made by ${os.made}. Open apps from ${os.start}. Files app: ${os.files}.`}>
      <svg viewBox="0 0 320 200" aria-hidden="true" className="block h-auto w-full rounded-xl">
        <defs>
          <linearGradient id="wall-win" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1f3a8a" />
            <stop offset="1" stopColor="#3d8bfd" />
          </linearGradient>
          <linearGradient id="wall-mac" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6e4cf5" />
            <stop offset="1" stopColor="#d9306f" />
          </linearGradient>
          <linearGradient id="wall-linux" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4a1d3f" />
            <stop offset="1" stopColor="#e95420" />
          </linearGradient>
        </defs>
        <Screen os={name} />
      </svg>
      <dl className="flex flex-col divide-y divide-divider">
        {ROWS.map(([key, label]) => (
          <div key={key} className="grid grid-cols-[104px_minmax(0,1fr)] gap-3 py-1.5 text-[13px] leading-5">
            <dt className="text-ink-subtle">{label}</dt>
            <dd className="text-ink">{os[key]}</dd>
          </div>
        ))}
      </dl>
    </figure>
  )
}
