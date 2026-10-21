'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Device = {
  name: string
  input: string
  process: string | null
  output: string
  storage: string | null
  verdict: string
}

const DEVICES: Record<string, Device> = {
  Phone: {
    name: 'A phone',
    input: 'Touchscreen, microphone, camera',
    process: 'A processor runs your apps',
    output: 'Screen, speaker, vibration',
    storage: 'Photos, messages, apps',
    verdict: 'A computer: it follows instructions to turn input into output.',
  },
  Microwave: {
    name: 'A microwave',
    input: 'Buttons for time and power',
    process: 'A tiny chip counts down and switches the heater',
    output: 'Heat, a beep, the display',
    storage: 'The clock and your last setting',
    verdict: 'A computer, built into the machine. These are called embedded computers.',
  },
  Torch: {
    name: 'A torch',
    input: 'One switch',
    process: null,
    output: 'Light',
    storage: null,
    verdict:
      'Not a computer: the switch just connects the battery to the bulb. Nothing follows instructions.',
  },
  'Smart watch': {
    name: 'A smart watch',
    input: 'Touch, a heart-rate sensor, movement',
    process: 'A processor counts steps and runs apps',
    output: 'Screen, a buzz on your wrist',
    storage: 'Your steps, your heart rate, its apps',
    verdict: 'A computer, small enough to wear.',
  },
}

const ROWS = [
  ['input', 'Input'],
  ['process', 'Processing'],
  ['output', 'Output'],
  ['storage', 'Storage'],
] as const

/** Is it a computer? A device's input, processing, output and storage (Explore lab: value = a device). */
export function DeviceCheck({ value = 'Phone' }: LabProps) {
  const d = DEVICES[value] ?? DEVICES.Phone!
  const computer = Boolean(d.process)
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${d.name}: ${d.verdict}`}>
      <div className="flex flex-col gap-2 rounded-2xl border border-line bg-row p-4">
        <p className="font-display text-lg font-bold text-ink">{d.name}</p>
        <dl className="grid grid-cols-1 gap-2 @min-[340px]:grid-cols-2">
          {ROWS.map(([key, label]) => {
            const text = d[key]
            return (
              <div
                key={key}
                className={cn(
                  'flex flex-col gap-0.5 rounded-xl border px-3 py-2',
                  text ? 'border-line bg-sheet' : 'border-dashed border-line-control',
                )}
              >
                <dt className="text-xs font-semibold text-ink-subtle">{label}</dt>
                <dd className={cn('text-sm', text ? 'text-ink' : 'text-ink-subtle')}>{text ?? 'None'}</dd>
              </div>
            )
          })}
        </dl>
      </div>
      <figcaption
        className={cn(
          'rounded-xl px-3 py-2.5 text-sm font-medium',
          computer ? 'bg-success-fill/15 text-ink' : 'bg-[rgba(255,154,162,0.12)] text-ink',
        )}
      >
        {d.verdict}
      </figcaption>
    </figure>
  )
}
