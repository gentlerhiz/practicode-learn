'use client'
import type { LabProps } from './shared'

type Kind = { what: string; who: string; screen: string; example: string; size: string }

const KINDS: Record<string, Kind> = {
  Phone: {
    what: 'A computer you carry: calls, messages, apps and the web',
    who: 'Almost everyone, every day',
    screen: 'Yes, a touchscreen',
    example: 'An Android phone or an iPhone',
    size: 'Fits in a pocket',
  },
  Laptop: {
    what: 'A computer for longer work: writing, building, studying',
    who: 'Students, office workers, developers',
    screen: 'Yes, with a keyboard',
    example: 'A Windows laptop, a MacBook or a Chromebook',
    size: 'Fits in a bag',
  },
  Server: {
    what: 'A computer that serves others: websites, email, apps and files',
    who: 'Companies and data centres, running all day and night',
    screen: 'Usually none: people control it over the network',
    example: 'The computer that sent you this lesson',
    size: 'A slim box in a rack, with thousands of others',
  },
  Embedded: {
    what: 'A small computer inside another machine, doing one job',
    who: 'Built into cars, washing machines, card readers and traffic lights',
    screen: 'Sometimes a small one, often none',
    example: 'The chip that runs a car’s brakes or a microwave’s timer',
    size: 'Often smaller than a fingernail',
  },
  Supercomputer: {
    what: 'Thousands of processors working on one huge problem',
    who: 'Scientists: weather forecasts, medicine and climate research',
    screen: 'None of its own',
    example: 'The machines that forecast tomorrow’s weather',
    size: 'Fills a large room',
  },
}

const ROWS = [
  ['what', 'What it’s for'],
  ['who', 'Who uses it'],
  ['screen', 'A screen?'],
  ['size', 'Size'],
  ['example', 'For example'],
] as const

/** The kinds of computer, side by side (Explore lab: value = a kind). */
export function ComputerKinds({ value = 'Phone' }: LabProps) {
  const k = KINDS[value] ?? KINDS.Phone!
  return (
    <figure
      className="m-0 flex flex-col gap-2 rounded-2xl border border-line bg-row p-4"
      aria-label={`${value}: ${k.what}`}
    >
      <p className="font-display text-lg font-bold text-ink">
        {value === 'Embedded' ? 'An embedded computer' : `A ${value.toLowerCase()}`}
      </p>
      <dl className="flex flex-col divide-y divide-divider">
        {ROWS.map(([key, label]) => (
          <div key={key} className="grid grid-cols-[110px_minmax(0,1fr)] gap-3 py-2 text-sm">
            <dt className="text-ink-subtle">{label}</dt>
            <dd className="text-ink">{k[key]}</dd>
          </div>
        ))}
      </dl>
    </figure>
  )
}
