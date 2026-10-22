'use client'
import { Cloud, FileImage, Laptop, Server, Smartphone, WifiOff } from 'lucide-react'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

const STATES = [
  { name: 'Local', line: 'You take a photo. It’s saved on the phone’s own storage: local storage. It works anywhere, with or without the internet.' },
  { name: 'Uploaded', line: 'The photo app uploads a copy over the internet, to cloud storage.' },
  { name: 'The cloud is a computer', line: 'The cloud is another company’s computers, in a data centre. Your photo sits on their drives.' },
  { name: 'From any device', line: 'Sign in on your laptop, and the same photo is there, fetched from the data centre.' },
  { name: 'Offline', line: 'With no internet, the copy on the phone still opens. The cloud copy can’t be reached until you’re back online.' },
]

function Spot({ icon: Icon, name, on, children }: { icon: typeof Cloud; name: string; on: boolean; children?: React.ReactNode }) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col items-center gap-1.5 rounded-2xl border-[1.5px] px-2 py-3 text-center motion-safe:transition-all motion-safe:duration-300',
        on ? 'border-it bg-[rgba(255,170,60,0.12)]' : 'border-line bg-row opacity-50',
      )}
    >
      <Icon size={26} aria-hidden="true" className="text-it-text" />
      <span className="text-[12px] font-semibold text-ink">{name}</span>
      <span className="flex min-h-5 items-center">{children}</span>
    </div>
  )
}

const Photo = ({ dim }: { dim?: boolean }) => (
  <span className={cn('pop-in flex items-center gap-1 rounded-md bg-sheet px-1.5 py-0.5 text-[11px] text-ink', dim && 'opacity-40')}>
    <FileImage size={12} aria-hidden="true" />
    photo.jpg
  </span>
)

/** One photo, on the phone, in the cloud, on a laptop, and offline (Diagram lab, 5 states). */
export function CloudWhere({ state }: LabProps) {
  const at = clampState(state, STATES.length)
  const s = STATES[at]!
  const offline = at === 4
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={`${s.name}. ${s.line}`} className="grid grid-cols-3 items-stretch gap-2">
        <Spot icon={Smartphone} name="Your phone" on={at !== 2 && at !== 3}>
          <Photo />
        </Spot>
        <Spot icon={at === 2 ? Server : offline ? WifiOff : Cloud} name={at === 2 ? 'A data centre' : 'Cloud storage'} on={at >= 1 && at <= 3}>
          {at >= 1 && <Photo dim={offline} />}
        </Spot>
        <Spot icon={Laptop} name="Your laptop" on={at === 3}>
          {at >= 3 && <Photo dim={offline} />}
        </Spot>
      </div>
      <div aria-hidden="true" className="relative h-2 overflow-hidden rounded-full bg-sheet">
        <div
          className={cn('absolute inset-y-0 left-0 rounded-full motion-safe:transition-all motion-safe:duration-500', offline ? 'bg-error' : 'bg-it')}
          style={{ width: offline ? '33%' : `${[33, 66, 66, 100][at]}%` }}
        />
      </div>
      <figcaption aria-live="polite" className="flex flex-col gap-1 rounded-2xl border border-line bg-row px-4 py-3">
        <span className="font-display text-[15px] font-bold text-ink">{s.name}</span>
        <span className="text-[13px] leading-5 text-ink-soft">{s.line}</span>
      </figcaption>
    </figure>
  )
}
