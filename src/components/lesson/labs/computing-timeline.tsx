'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

// The moments the diagram's states visit, in order.
const MOMENTS = [
  {
    year: '1837',
    title: 'The Analytical Engine',
    who: 'Charles Babbage designs a machine that could follow instructions',
  },
  {
    year: '1843',
    title: 'The first program',
    who: 'Ada Lovelace publishes steps for the engine to calculate numbers',
  },
  {
    year: '1936',
    title: 'The idea of a computer',
    who: 'Alan Turing describes a machine that can carry out any set of steps',
  },
  {
    year: '1945',
    title: 'ENIAC',
    who: 'One of the first electronic computers. It filled a room and weighed about 27 tonnes',
  },
  { year: '1947', title: 'The transistor', who: 'A tiny electronic switch replaces big glass valves' },
  { year: '1971', title: 'The microprocessor', who: 'A whole processor fits on one chip' },
  {
    year: '1981',
    title: 'Personal computers',
    who: 'Computers small and cheap enough for homes and offices',
  },
  { year: '1991', title: 'The World Wide Web', who: 'Tim Berners-Lee’s web opens to everyone' },
  { year: '2007', title: 'Smartphones', who: 'A computer, a phone and the internet in your pocket' },
  { year: '2022', title: 'AI chat assistants', who: 'Anyone can ask an AI a question in plain words' },
] as const

/** Computing from 1837 to now, one moment at a time (Diagram lab, 10 states). */
export function ComputingTimeline({ state = 0 }: LabProps) {
  const at = Math.min(Math.max(state, 0), MOMENTS.length - 1)
  const m = MOMENTS[at]!
  return (
    <figure className="m-0 flex flex-col gap-4">
      <div role="img" aria-label={`${m.year}: ${m.title}. ${m.who}.`} className="relative px-1 pt-2">
        <div aria-hidden="true" className="absolute top-[18px] right-1 left-1 h-0.5 bg-line" />
        <ol aria-hidden="true" className="relative flex justify-between">
          {MOMENTS.map((x, i) => (
            <li key={x.year} className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  'block rounded-full border-2 motion-safe:transition-all motion-safe:duration-250',
                  i === at
                    ? 'size-5 border-it bg-it'
                    : i < at
                      ? 'size-3 border-it bg-it/60'
                      : 'size-3 border-line-control bg-sheet',
                )}
              />
              <span
                className={cn(
                  'hidden text-[10px] @min-[480px]:block',
                  i === at ? 'font-bold text-ink' : 'text-ink-subtle',
                )}
              >
                {x.year}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div className="flex flex-col gap-1 rounded-2xl border border-line bg-row p-4">
        <p className="font-mono text-sm font-bold text-it-text">{m.year}</p>
        <p className="font-display text-lg font-bold text-ink">{m.title}</p>
        <p className="text-sm leading-[22px] text-ink-soft">{m.who}.</p>
      </div>
    </figure>
  )
}
