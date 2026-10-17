'use client'
import { cn } from '@/lib/cn'
import { C, type LabProps } from './shared'

type Dot = { id: string; x: number; y: number; label: string }

const MAIN = 44
const SIDE = 108
const DOTS: Dot[] = [
  { id: 'a', x: 34, y: MAIN, label: 'Page' },
  { id: 'b', x: 88, y: MAIN, label: 'Styles' },
  { id: 'c', x: 142, y: MAIN, label: 'Rates' },
  { id: 'd', x: 206, y: SIDE, label: 'Table' },
  { id: 'e', x: 206, y: MAIN, label: 'Footer' },
  { id: 'm', x: 276, y: MAIN, label: 'Merge' },
]
const at = (id: string) => DOTS.find((d) => d.id === id)!
const LINES: [string, string][] = [
  ['a', 'b'],
  ['b', 'c'],
  ['c', 'd'],
  ['c', 'e'],
  ['e', 'm'],
  ['d', 'm'],
]

type View = {
  dots: string[]
  main: string
  branch?: string
  on: 'main' | 'add-rates'
  says: string
  command: string
  conflict?: boolean
}

const VIEWS: View[] = [
  {
    dots: ['a', 'b', 'c'],
    main: 'c',
    on: 'main',
    says: 'Three commits on main. HEAD, the branch you are on, is main.',
    command: 'git log --oneline',
  },
  {
    dots: ['a', 'b', 'c'],
    main: 'c',
    branch: 'c',
    on: 'add-rates',
    says: 'A new branch, add-rates, starts at the same commit as main. You switch onto it. No files change.',
    command: 'git switch -c add-rates',
  },
  {
    dots: ['a', 'b', 'c', 'd'],
    main: 'c',
    branch: 'd',
    on: 'add-rates',
    says: 'You commit on add-rates. The new commit belongs to the branch, and main hasn’t moved.',
    command: 'git commit -m "Show rates in a table"',
  },
  {
    dots: ['a', 'b', 'c', 'd', 'e'],
    main: 'e',
    branch: 'd',
    on: 'add-rates',
    says: 'Meanwhile a teammate’s footer fix lands on main. The two branches have each moved on.',
    command: 'git log --oneline --all --graph',
  },
  {
    dots: ['a', 'b', 'c', 'd', 'e', 'm'],
    main: 'm',
    branch: 'd',
    on: 'main',
    says: 'On main, git merge add-rates joins the two lines of work with a merge commit. main now has both the table and the footer.',
    command: 'git switch main && git merge add-rates',
  },
  {
    dots: ['a', 'b', 'c', 'd', 'e'],
    main: 'e',
    branch: 'd',
    on: 'main',
    conflict: true,
    says: 'If both branches changed the same line, Git can’t choose. It stops, and marks both versions in the file for you to decide.',
    command: 'git merge add-rates',
  },
]

function Tag({ x, y, text, current }: { x: number; y: number; text: string; current: boolean }) {
  const width = text.length * 7 + 14
  return (
    <g>
      <rect
        x={x}
        y={y - 10}
        width={width}
        height={20}
        rx={10}
        fill={current ? C.track : 'transparent'}
        stroke={C.track}
      />
      <text
        x={x + width / 2}
        y={y + 4}
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill={current ? '#fff' : C.trackText}
      >
        {text}
      </text>
    </g>
  )
}

/** Branches as a commit graph (Diagram lab, 6 states): branch, commit, diverge, merge and a conflict. */
export function BranchGraph({ state = 0 }: LabProps) {
  const v = VIEWS[Math.min(Math.max(state, 0), VIEWS.length - 1)]!
  const shown = (id: string) => v.dots.includes(id)
  const mainTip = at(v.main)
  const branchTip = v.branch ? at(v.branch) : null

  return (
    <figure className="m-0">
      <div className="rounded-xl border border-line-subtle bg-row p-3">
        <svg role="img" aria-label={v.says} viewBox="0 0 340 150" className="w-full">
          {LINES.filter(([a, b]) => shown(a) && shown(b)).map(([a, b]) => (
            <line
              key={a + b}
              x1={at(a).x}
              y1={at(a).y}
              x2={at(b).x}
              y2={at(b).y}
              stroke={C.lineControl}
              strokeWidth={3}
            />
          ))}
          {DOTS.filter((d) => shown(d.id)).map((d) => (
            <g key={d.id}>
              <circle cx={d.x} cy={d.y} r={9} fill={d.y === SIDE ? C.track : C.text} />
              <text x={d.x} y={d.y + 24} textAnchor="middle" fontSize="10" fill={C.muted}>
                {d.label}
              </text>
            </g>
          ))}
          <Tag x={mainTip.x - 22} y={MAIN - 28} text="main" current={v.on === 'main'} />
          {branchTip && (
            <Tag
              x={branchTip.x + 14}
              y={branchTip.y === MAIN ? MAIN + 2 : SIDE}
              text="add-rates"
              current={v.on === 'add-rates'}
            />
          )}
        </svg>
        {v.conflict && (
          <pre
            aria-label="index.html, with the conflict marked"
            className="mt-2 overflow-x-auto rounded-lg bg-[#0d0b16] p-3 font-mono text-[12px] leading-5 text-[#e8e6f0]"
          >
            <span className="text-[#ff8f8f]">{'<<<<<<< HEAD'}</span>
            {'\n<h1>Currency dashboard</h1>\n'}
            <span className="text-[#ff8f8f]">{'======='}</span>
            {'\n<h1>Naira exchange rates</h1>\n'}
            <span className="text-[#ff8f8f]">{'>>>>>>> add-rates'}</span>
          </pre>
        )}
      </div>
      <p className={cn('mt-2.5 font-mono text-[13px] text-ink-muted')}>$ {v.command}</p>
      <figcaption className="sr-only">{v.says}</figcaption>
    </figure>
  )
}
