'use client'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

// The layers, top to bottom, and what each state shows passing between them.
const LAYERS = [
  { id: 'you', name: 'You', note: 'Taps, clicks and key presses' },
  { id: 'apps', name: 'Apps', note: 'Browser, music, camera, messages' },
  { id: 'os', name: 'Operating system', note: 'Windows, macOS, Linux, Android, iOS' },
  { id: 'hw', name: 'Hardware', note: 'Processor, memory, storage, screen, Wi-Fi' },
] as const

type Layer = (typeof LAYERS)[number]['id']

const JOBS = ['Runs apps', 'Shares memory', 'Keeps files', 'Drives devices', 'Guards accounts'] as const

const STATES: { lit: Layer[]; job?: (typeof JOBS)[number]; flow: string }[] = [
  { lit: ['you', 'apps', 'os', 'hw'], flow: 'Four layers. Each one only talks to the layer next to it.' },
  { lit: ['you', 'apps'], flow: 'You tap Play in a music app.' },
  { lit: ['apps', 'os'], job: 'Runs apps', flow: 'The app asks the operating system for time on the processor, and the OS shares it fairly between every open app.' },
  { lit: ['os', 'hw'], job: 'Shares memory', flow: 'The OS gives the app a slice of memory, and stops other apps reading it.' },
  { lit: ['os', 'hw'], job: 'Keeps files', flow: 'The OS finds the song file in storage, wherever it is on the drive.' },
  { lit: ['os', 'hw'], job: 'Drives devices', flow: 'The OS sends the sound to the speaker or headphones through a driver: a small program for that device.' },
  { lit: ['you', 'os'], job: 'Guards accounts', flow: 'The OS also checks who you are when you sign in, and what each account and app is allowed to do.' },
]

/** You, apps, the operating system and the hardware, with the OS's jobs one at a time (Diagram lab, 7 states). */
export function OsLayers({ state }: LabProps) {
  const at = clampState(state, STATES.length)
  const s = STATES[at]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={s.flow} className="flex flex-col gap-1.5">
        {LAYERS.map((l, i) => {
          const on = s.lit.includes(l.id)
          const os = l.id === 'os'
          return (
            <div key={l.id} className="flex flex-col items-stretch gap-1.5">
              <div
                className={cn(
                  'flex min-w-0 flex-col gap-2 rounded-2xl border-[1.5px] px-4 py-3 motion-safe:transition-all motion-safe:duration-300',
                  on ? 'border-it bg-[rgba(255,170,60,0.14)]' : 'border-line bg-row opacity-50',
                )}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <span className="font-display text-[15px] font-bold text-ink">{l.name}</span>
                  <span className="text-[12px] text-ink-muted">{l.note}</span>
                </div>
                {os && (
                  <ul className="flex flex-wrap gap-1.5">
                    {JOBS.map((j) => (
                      <li
                        key={j}
                        className={cn(
                          'rounded-lg px-2 py-1 text-[12px] font-semibold motion-safe:transition-colors motion-safe:duration-300',
                          s.job === j ? 'bg-it text-white' : 'bg-sheet text-ink-muted',
                        )}
                      >
                        {j}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {i < LAYERS.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'mx-auto text-sm leading-none motion-safe:transition-colors',
                    on && s.lit.includes(LAYERS[i + 1]!.id) && at > 0 ? 'text-it-text' : 'text-ink-subtle',
                  )}
                >
                  ⇅
                </span>
              )}
            </div>
          )
        })}
      </div>
      <figcaption aria-live="polite" className="rounded-2xl border border-line bg-row px-4 py-3 text-[13px] leading-5 text-ink-soft">
        {s.flow}
      </figcaption>
    </figure>
  )
}
