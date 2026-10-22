'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Node = 'start' | 'rain' | 'umbrella' | 'cold' | 'coat' | 'tshirt' | 'end'

const WEATHER: Record<string, { path: Node[]; says: string }> = {
  'It’s raining': { path: ['start', 'rain', 'umbrella', 'end'], says: 'Raining? Yes, so take an umbrella. The question about cold is never asked.' },
  'Dry and cold': { path: ['start', 'rain', 'cold', 'coat', 'end'], says: 'Not raining, so the next question: cold? Yes, so wear a coat.' },
  'Dry and warm': { path: ['start', 'rain', 'cold', 'tshirt', 'end'], says: 'Not raining, not cold, so a T-shirt will do.' },
}

const CODE = [
  'START',
  'IF it is raining THEN',
  '    take an umbrella',
  'ELSE IF it is cold THEN',
  '    wear a coat',
  'ELSE',
  '    wear a T-shirt',
  'END',
]
// Which code lines each weather walks through (0-based), matched to the path above.
const LINES: Record<string, number[]> = { 'It’s raining': [0, 1, 2, 7], 'Dry and cold': [0, 1, 3, 4, 7], 'Dry and warm': [0, 1, 3, 5, 6, 7] }

function Box({ id, path, shape, children, x, y, w = 92 }: { id: Node; path: Node[]; shape: 'round' | 'diamond' | 'box'; children: string; x: number; y: number; w?: number }) {
  const on = path.includes(id)
  const stroke = on ? 'var(--pc-it-text)' : 'var(--pc-line-control)'
  const fill = on ? 'color-mix(in srgb, #ffa22e 18%, transparent)' : 'var(--pc-surface-row)'
  const h = shape === 'diamond' ? 44 : 30
  return (
    <g className="motion-safe:transition-opacity motion-safe:duration-300" style={{ opacity: on ? 1 : 0.45 }}>
      {shape === 'diamond' ? (
        <path d={`M${x} ${y - h / 2} L${x + w / 2} ${y} L${x} ${y + h / 2} L${x - w / 2} ${y} Z`} fill={fill} stroke={stroke} strokeWidth="2" />
      ) : (
        <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={shape === 'round' ? 15 : 5} fill={fill} stroke={stroke} strokeWidth="2" />
      )}
      <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--pc-text)" fontFamily="var(--font-sans)">
        {children}
      </text>
    </g>
  )
}

function Line({ d, on, label, lx, ly }: { d: string; on: boolean; label?: string; lx?: number; ly?: number }) {
  return (
    <g style={{ opacity: on ? 1 : 0.35 }} className="motion-safe:transition-opacity motion-safe:duration-300">
      <path d={d} fill="none" stroke={on ? 'var(--pc-it-text)' : 'var(--pc-line-control)'} strokeWidth="2" markerEnd={on ? 'url(#fc-on)' : 'url(#fc-off)'} />
      {label && (
        <text x={lx} y={ly} fontSize="10" fontWeight="700" fill={on ? 'var(--pc-it-text)' : 'var(--pc-text-subtle)'} fontFamily="var(--font-sans)">
          {label}
        </text>
      )}
    </g>
  )
}

/** A flowchart and its pseudocode for what to wear, with the path for the chosen weather lit (Explore lab). */
export function Flowchart({ value = 'It’s raining' }: LabProps) {
  const name = WEATHER[value] ? value : 'It’s raining'
  const w = WEATHER[name]!
  const p = w.path
  const has = (a: Node, b: Node) => p.includes(a) && p.includes(b) && p.indexOf(b) === p.indexOf(a) + 1
  const lit = LINES[name]!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${name}. ${w.says}`}>
      <svg viewBox="0 0 320 292" aria-hidden="true" className="mx-auto block h-auto w-full max-w-[420px]">
        <defs>
          {[
            ['fc-on', 'var(--pc-it-text)'],
            ['fc-off', 'var(--pc-line-control)'],
          ].map(([id, c]) => (
            <marker key={id} id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0 L10 5 L0 10 Z" fill={c} />
            </marker>
          ))}
        </defs>
        <Box id="start" path={p} shape="round" x={110} y={20}>
          Start
        </Box>
        <Line d="M110 35 V58" on={has('start', 'rain')} />
        <Box id="rain" path={p} shape="diamond" x={110} y={82} w={120}>
          Raining?
        </Box>
        <Line d="M170 82 H222" on={has('rain', 'umbrella')} label="Yes" lx={182} ly={76} />
        <Box id="umbrella" path={p} shape="box" x={266} y={82} w={88}>
          Umbrella
        </Box>
        <Line d="M110 104 V134" on={has('rain', 'cold')} label="No" lx={116} ly={124} />
        <Box id="cold" path={p} shape="diamond" x={110} y={158} w={110}>
          Cold?
        </Box>
        <Line d="M165 158 H222" on={has('cold', 'coat')} label="Yes" lx={178} ly={152} />
        <Box id="coat" path={p} shape="box" x={266} y={158} w={88}>
          Coat
        </Box>
        <Line d="M110 180 V212" on={has('cold', 'tshirt')} label="No" lx={116} ly={200} />
        <Box id="tshirt" path={p} shape="box" x={110} y={228} w={92}>
          T-shirt
        </Box>
        <Line d="M266 97 V266 H160" on={has('umbrella', 'end')} />
        <Line d="M266 173 V258" on={has('coat', 'end')} />
        <Line d="M110 243 V253" on={has('tshirt', 'end')} />
        <Box id="end" path={p} shape="round" x={110} y={270} w={92}>
          End
        </Box>
      </svg>
      <pre className="m-0 rounded-xl border border-line bg-[#0d0b16] p-3 font-mono text-[12px] leading-5 text-[#8b88a0]">
        {CODE.map((l, i) => (
          <span key={i} className={cn('block whitespace-pre-wrap motion-safe:transition-colors', lit.includes(i) && 'text-[#ffd08a]')}>
            {l}
          </span>
        ))}
      </pre>
      <p aria-live="polite" className="text-[13px] leading-5 text-ink-soft">
        {w.says}
      </p>
    </figure>
  )
}
