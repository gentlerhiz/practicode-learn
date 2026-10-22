'use client'
import { ArrowBigUp, Play, RotateCcw, RotateCw, Star, Undo2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { useReducedMotion, type LabProps } from './shared'

type Step = 'F' | 'L' | 'R'
type Dir = 0 | 1 | 2 | 3 // north, east, south, west
type Pos = { c: number; r: number; d: Dir }
type Level = { start: Pos; star: [number, number]; walls: [number, number][]; given?: Step[]; note: string }

const SIZE = 5
const LEVELS: Record<string, Level> = {
  'Level 1': { start: { c: 0, r: 4, d: 1 }, star: [3, 4], walls: [], note: 'Get the robot to the star.' },
  'Level 2': { start: { c: 0, r: 4, d: 1 }, star: [2, 1], walls: [], note: 'The star is up and to the right. The robot can only turn on the spot.' },
  'Level 3: fix the bug': {
    start: { c: 0, r: 4, d: 1 },
    star: [4, 4],
    walls: [
      [2, 4],
      [2, 3],
    ],
    given: ['R', 'F', 'F', 'R', 'F', 'F', 'F', 'F', 'R', 'F', 'F'],
    note: 'Someone wrote this program, but the robot crashes. Run it, find the wrong step, and tap it to change it.',
  },
}

const MOVE: Record<Dir, [number, number]> = { 0: [0, -1], 1: [1, 0], 2: [0, 1], 3: [-1, 0] }
const NAMES: Record<Step, string> = { F: 'Forward', L: 'Turn left', R: 'Turn right' }

function simulate(level: Level, program: Step[]) {
  const trail: Pos[] = [level.start]
  let p = level.start
  for (const [i, s] of program.entries()) {
    if (s === 'L') p = { ...p, d: ((p.d + 3) % 4) as Dir }
    else if (s === 'R') p = { ...p, d: ((p.d + 1) % 4) as Dir }
    else {
      const [dc, dr] = MOVE[p.d]
      const next = { ...p, c: p.c + dc, r: p.r + dr }
      const blocked = next.c < 0 || next.r < 0 || next.c >= SIZE || next.r >= SIZE || level.walls.some(([c, r]) => c === next.c && r === next.r)
      if (blocked) return { trail, crashAt: i }
      p = next
    }
    trail.push(p)
  }
  return { trail, crashAt: -1 }
}

function Puzzle({ value }: { value: string }) {
  const level = LEVELS[value] ?? LEVELS['Level 1']!
  const [program, setProgram] = useState<Step[]>(level.given ?? [])
  const [shown, setShown] = useState<{ at: number; done: boolean }>({ at: 0, done: false })
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const reduce = useReducedMotion()
  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current)
  }, [])

  const result = simulate(level, program)
  const pos = result.trail[Math.min(shown.at, result.trail.length - 1)]!
  const reached = pos.c === level.star[0] && pos.r === level.star[1]
  const finished = shown.done && shown.at >= result.trail.length - 1

  const stop = () => {
    if (timer.current) clearInterval(timer.current)
    timer.current = null
  }
  const edit = (next: Step[]) => {
    stop()
    setProgram(next)
    setShown({ at: 0, done: false })
  }
  const run = () => {
    stop()
    const last = result.trail.length - 1
    if (reduce) return setShown({ at: last, done: true })
    let at = 0
    setShown({ at: 0, done: false })
    timer.current = setInterval(() => {
      at += 1
      if (at >= last) {
        stop()
        setShown({ at: last, done: true })
      } else setShown({ at, done: false })
    }, 320)
  }

  const verdict = !finished
    ? null
    : result.crashAt >= 0
      ? { ok: false, text: `Bump! Step ${result.crashAt + 1} (${NAMES[program[result.crashAt]!]}) runs into a wall or the edge.` }
      : reached
        ? { ok: true, text: `The robot reached the star in ${program.length} steps.` }
        : { ok: false, text: 'The robot stopped before the star. Add more steps, or check the turns.' }

  const cell = 100 / SIZE
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] leading-5 text-ink-soft">{level.note}</p>
      <div className="grid grid-cols-1 gap-3 @min-[520px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div
          role="img"
          aria-label={`A ${SIZE} by ${SIZE} grid. The robot is at column ${pos.c + 1}, row ${pos.r + 1}, facing ${['up', 'right', 'down', 'left'][pos.d]}. The star is at column ${level.star[0] + 1}, row ${level.star[1] + 1}.`}
          className="relative mx-auto aspect-square w-full max-w-[260px] rounded-xl border border-line bg-sunken"
        >
          {Array.from({ length: SIZE * SIZE }, (_, i) => (
            <span key={i} className="absolute border border-line/50" style={{ left: `${(i % SIZE) * cell}%`, top: `${Math.floor(i / SIZE) * cell}%`, width: `${cell}%`, height: `${cell}%` }} />
          ))}
          {level.walls.map(([c, r]) => (
            <span key={`${c}${r}`} className="absolute rounded-md bg-line-strong" style={{ left: `${c * cell + 1}%`, top: `${r * cell + 1}%`, width: `${cell - 2}%`, height: `${cell - 2}%` }} />
          ))}
          {result.trail.slice(1, shown.at + 1).map((t, i) => (
            <span key={i} className="absolute grid place-items-center" style={{ left: `${t.c * cell}%`, top: `${t.r * cell}%`, width: `${cell}%`, height: `${cell}%` }}>
              <span className="size-2 rounded-full bg-it/50" />
            </span>
          ))}
          <span className="absolute grid place-items-center text-[#ffc15c]" style={{ left: `${level.star[0] * cell}%`, top: `${level.star[1] * cell}%`, width: `${cell}%`, height: `${cell}%` }}>
            <Star size={22} fill="currentColor" aria-hidden="true" />
          </span>
          <span
            className="absolute grid place-items-center motion-safe:transition-all motion-safe:duration-300"
            style={{ left: `${pos.c * cell}%`, top: `${pos.r * cell}%`, width: `${cell}%`, height: `${cell}%` }}
          >
            <span
              className={cn('grid size-[78%] place-items-center rounded-lg text-white motion-safe:transition-transform motion-safe:duration-300', verdict && !verdict.ok && result.crashAt >= 0 ? 'bg-error' : 'bg-fe')}
              style={{ transform: `rotate(${pos.d * 90}deg)` }}
            >
              <ArrowBigUp size={18} aria-hidden="true" fill="currentColor" />
            </span>
          </span>
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-[12px] font-semibold text-ink-soft">Your program · tap a step to change it</p>
          <ol aria-label="Your program" className="flex min-h-11 flex-wrap gap-1.5 rounded-xl border border-dashed border-line-strong p-2">
            {program.length === 0 && <li className="self-center text-[12px] text-ink-subtle">Add steps below</li>}
            {program.map((s, i) => (
              <li key={i}>
                <button
                  type="button"
                  aria-label={`Step ${i + 1}: ${NAMES[s]}. Tap to change.`}
                  onClick={() => edit(program.map((x, j) => (j === i ? (({ F: 'L', L: 'R', R: 'F' }) as const)[x] : x)))}
                  className={cn(
                    'press grid size-9 cursor-pointer place-items-center rounded-lg border-[1.5px] text-ink',
                    finished && result.crashAt === i ? 'border-error bg-error/20' : shown.at > 0 && i < shown.at ? 'border-it bg-it/15' : 'border-line bg-row',
                  )}
                >
                  {s === 'F' ? <ArrowBigUp size={16} aria-hidden="true" /> : s === 'L' ? <RotateCcw size={15} aria-hidden="true" /> : <RotateCw size={15} aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ol>
          <div className="grid grid-cols-3 gap-1.5">
            {(['F', 'L', 'R'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => edit([...program, s].slice(0, 16))}
                className="press flex h-10 cursor-pointer items-center justify-center gap-1 rounded-lg border border-line-control bg-row text-[12px] font-semibold text-ink hover:bg-hover"
              >
                {s === 'F' ? <ArrowBigUp size={15} aria-hidden="true" /> : s === 'L' ? <RotateCcw size={14} aria-hidden="true" /> : <RotateCw size={14} aria-hidden="true" />}
                {s === 'F' ? 'Forward' : s === 'L' ? 'Left' : 'Right'}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={run}
              disabled={!program.length}
              className="press flex h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary text-[13px] font-semibold text-on-primary disabled:cursor-default disabled:opacity-40"
            >
              <Play size={14} aria-hidden="true" />
              Run
            </button>
            <button
              type="button"
              aria-label="Remove the last step"
              onClick={() => edit(program.slice(0, -1))}
              disabled={!program.length}
              className="press grid h-10 w-10 cursor-pointer place-items-center rounded-lg border border-line-control text-ink hover:bg-hover disabled:opacity-40"
            >
              <Undo2 size={15} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => edit(level.given ?? [])}
              className="press h-10 cursor-pointer rounded-lg border border-line-control px-3 text-[13px] text-ink hover:bg-hover"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      <p aria-live="polite" className={cn('min-h-5 text-[13px] leading-5', verdict ? (verdict.ok ? 'font-semibold text-success' : 'text-error') : 'text-ink-muted')}>
        {verdict ? verdict.text : 'Forward moves one square. Left and Right turn on the spot. Press Run when your program is ready.'}
      </p>
    </div>
  )
}

/**
 * A robot on a grid that follows the learner's program, step by step (Explore lab: value = a level).
 * The third level starts with a buggy program to fix.
 */
export function RobotSteps({ value = 'Level 1' }: LabProps) {
  return <Puzzle key={value} value={value} />
}
