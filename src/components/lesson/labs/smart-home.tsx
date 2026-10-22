'use client'
import { Cloud, Lightbulb, Smartphone, Thermometer, Wifi } from 'lucide-react'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

type Part = 'sensor' | 'wifi' | 'cloud' | 'app' | 'action'

const STATES: { lit: Part[]; risk?: boolean; name: string; line: string }[] = [
  { lit: ['sensor'], name: 'A sensor', line: 'A smart thermostat measures the temperature: 17°C. Sensors are the eyes and ears of the Internet of Things.' },
  { lit: ['sensor', 'wifi', 'cloud'], name: 'Online', line: 'It sends the reading over the home Wi-Fi to the maker’s cloud servers, every few minutes.' },
  { lit: ['cloud', 'app'], name: 'An app', line: 'Your phone’s app reads it from the cloud, so you can check, and change, the heating from anywhere.' },
  { lit: ['cloud', 'action'], name: 'An automatic rule', line: 'A rule runs in the cloud: below 18°C, turn the heating on. The device acts by itself.' },
  { lit: ['sensor', 'wifi', 'cloud', 'app', 'action'], name: 'The Internet of Things', line: 'Billions of everyday things are online like this: lights, doorbells, watches, fridges, street lights and factory machines.' },
  { lit: ['sensor', 'wifi', 'cloud'], risk: true, name: 'The risks', line: 'Every device is a computer on your network. Change default passwords, keep them updated, and check what data they collect and share.' },
]

const PARTS: { id: Part; icon: typeof Cloud; name: string; note: string }[] = [
  { id: 'sensor', icon: Thermometer, name: 'Sensor', note: '17°C' },
  { id: 'wifi', icon: Wifi, name: 'Wi-Fi', note: 'Router' },
  { id: 'cloud', icon: Cloud, name: 'Cloud', note: 'Rules' },
  { id: 'app', icon: Smartphone, name: 'App', note: 'Anywhere' },
  { id: 'action', icon: Lightbulb, name: 'Heating', note: 'On' },
]

/** A smart thermostat, from sensor to cloud to action, and the risks (Diagram lab, 6 states). */
export function SmartHome({ state }: LabProps) {
  const at = clampState(state, STATES.length)
  const s = STATES[at]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <ol role="img" aria-label={`${s.name}. ${s.line}`} className="relative grid grid-cols-5 gap-1.5">
        <span aria-hidden="true" className="absolute top-6 right-[10%] left-[10%] h-0.5 bg-line-control @min-[420px]:top-7" />
        {PARTS.map((p) => {
          const on = s.lit.includes(p.id)
          const Icon = p.icon
          return (
            <li key={p.id} className="relative flex min-w-0 flex-col items-center gap-1 text-center">
              <span
                className={cn(
                  'relative grid size-12 place-items-center rounded-2xl border-[1.5px] bg-row motion-safe:transition-all motion-safe:duration-300 @min-[420px]:size-14',
                  on
                    ? s.risk
                      ? 'border-error bg-[color-mix(in_srgb,var(--pc-error)_15%,var(--pc-surface-row))] text-error'
                      : 'border-it bg-[color-mix(in_srgb,#ffa22e_16%,var(--pc-surface-row))] text-it-text'
                    : 'border-line bg-row text-ink-subtle',
                )}
              >
                <Icon size={22} aria-hidden="true" />
              </span>
              <span className="text-[10.5px] leading-[13px] font-semibold text-ink">{p.name}</span>
              <span className="text-[10px] text-ink-muted">{p.note}</span>
            </li>
          )
        })}
      </ol>
      <figcaption aria-live="polite" className={cn('flex flex-col gap-1 rounded-2xl border px-4 py-3', s.risk ? 'border-error bg-row' : 'border-line bg-row')}>
        <span className="font-display text-[15px] font-bold text-ink">{s.name}</span>
        <span className="text-[13px] leading-5 text-ink-soft">{s.line}</span>
      </figcaption>
    </figure>
  )
}
