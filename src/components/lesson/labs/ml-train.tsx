'use client'
import { cn } from '@/lib/cn'
import { C, type LabProps } from './shared'
import { accuracy, predict, TEST, train, TRAINING } from './ml-model'

const NOTES: Record<string, string> = {
  '4 examples': 'Four examples aren’t enough to learn the pattern well. It guesses wrong on many new bananas.',
  '20 examples': 'More examples, a better guess. The boundary moves closer to the real one.',
  '200 examples': 'With plenty of varied examples, it gets most new bananas right. It still makes some mistakes near the line.',
  'Biased examples': 'Only hard bananas, so it never saw a soft green one. It decides colour is all that matters, and gets soft green bananas wrong.',
}

const W = 220
const PAD = 26

/** A real model learning ripe or not ripe from examples, then tested on bananas it hasn't seen (Explore lab). */
export function MlTrain({ value = '20 examples' }: LabProps) {
  const name = TRAINING[value] ? value : '20 examples'
  const examples = TRAINING[name]!
  const model = train(examples)
  const score = accuracy(model)
  const right = Math.round((score / 100) * TEST.length)
  const grid = 22
  const x = (v: number) => PAD + v * (W - PAD - 6)
  const y = (v: number) => W - PAD - v * (W - PAD - 6)
  const cell = (W - PAD - 6) / grid
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`Trained on ${name}. It gets ${right} of ${TEST.length} new bananas right: ${score}%. ${NOTES[name]}`}>
      <div className="grid grid-cols-1 items-center gap-3 @min-[480px]:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <svg viewBox={`0 0 ${W} ${W}`} aria-hidden="true" className="mx-auto block h-auto w-full max-w-[280px]">
          {/* What the model would say for every banana: shaded where it says ripe. */}
          {Array.from({ length: grid * grid }, (_, i) => {
            const cx = (i % grid) / grid + 0.5 / grid
            const cy = Math.floor(i / grid) / grid + 0.5 / grid
            return predict(model, { colour: cx, soft: cy }) ? (
              <rect key={i} x={x(cx) - cell / 2} y={y(cy) - cell / 2} width={cell + 0.5} height={cell + 0.5} fill="#ffc15c" opacity="0.16" />
            ) : null
          })}
          <line x1={x(0)} y1={y(1)} x2={x(1)} y2={y(0)} stroke={C.subtle} strokeWidth="1.2" strokeDasharray="3 4" />
          <rect x={x(0)} y={y(1)} width={W - PAD - 6} height={W - PAD - 6} fill="none" stroke={C.lineControl} />
          {examples.slice(0, 120).map((p, i) =>
            p.ripe ? (
              <circle key={i} cx={x(p.colour)} cy={y(p.soft)} r="3.6" fill="#ffc15c" stroke="#a85a00" strokeWidth="1" />
            ) : (
              <path key={i} d={`M${x(p.colour)} ${y(p.soft) - 4} l4 7 h-8 Z`} fill="#4be3a8" stroke="#0a7d5c" strokeWidth="1" />
            ),
          )}
          <text x={x(0.5)} y={W - 6} textAnchor="middle" fontSize="10" fill={C.muted} fontFamily="var(--font-sans)">
            Colour: green → yellow
          </text>
          <text x="10" y={y(0.5)} textAnchor="middle" fontSize="10" fill={C.muted} fontFamily="var(--font-sans)" transform={`rotate(-90 10 ${y(0.5)})`}>
            Softness: hard → soft
          </text>
        </svg>
        <div className="flex min-w-0 flex-col gap-2">
          <ul className="flex flex-col gap-1 text-[12px] text-ink-soft">
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full border border-[#a85a00] bg-[#ffc15c]" />
              Ripe example
            </li>
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-0 w-0 shrink-0 border-x-[5px] border-b-[9px] border-x-transparent border-b-[#4be3a8]" />
              Not ripe example
            </li>
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className="size-2.5 shrink-0 rounded-sm bg-[#ffc15c]/30" />
              Where the model says ripe
            </li>
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className="w-3 shrink-0 border-t border-dashed border-ink-subtle" />
              The real dividing line
            </li>
          </ul>
          <div className="flex flex-col gap-1 rounded-xl border border-line bg-row px-3 py-2">
            <span className="text-[12px] text-ink-muted">Tested on {TEST.length} new bananas</span>
            <span className={cn('font-display text-2xl font-extrabold', score >= 90 ? 'text-success' : score >= 80 ? 'text-it-text' : 'text-error')}>{score}% right</span>
            <span className="h-2 overflow-hidden rounded-full bg-sheet">
              <span className="block h-2 rounded-full bg-it motion-safe:transition-all motion-safe:duration-500" style={{ width: `${score}%` }} />
            </span>
          </div>
        </div>
      </div>
      <p aria-live="polite" className="text-[13px] leading-5 text-ink-soft">
        {NOTES[name]}
      </p>
    </figure>
  )
}
