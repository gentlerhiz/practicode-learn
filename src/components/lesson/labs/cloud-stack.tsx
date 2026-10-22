'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const LAYERS = ['Your data and settings', 'The app', 'Platform (runs the code)', 'Operating system', 'Servers and storage', 'Network', 'Building, power and cooling']

// How many layers, from the bottom, the provider looks after in each model.
const MODELS: Record<string, { provider: number; meaning: string; example: string }> = {
  'Your own servers': { provider: 0, meaning: 'You buy, run and fix everything, down to the air conditioning. Some banks and governments still do.', example: 'A server room in your own building' },
  IaaS: { provider: 3, meaning: 'Infrastructure as a service: rent servers, storage and network by the hour. You install and look after the operating system and everything on it.', example: 'Amazon EC2, Microsoft Azure Virtual Machines, Google Compute Engine' },
  PaaS: { provider: 5, meaning: 'Platform as a service: hand over your code, and the provider runs it. You look after the app and its data.', example: 'Vercel, Heroku, Google App Engine' },
  SaaS: { provider: 6, meaning: 'Software as a service: use a finished app in the browser or an app. You only look after your own data and how you use it.', example: 'Gmail, Microsoft 365, Google Docs, Zoom' },
}

/** Who looks after each layer, you or the provider, in each cloud model (Explore lab: value = a model). */
export function CloudStack({ value = 'SaaS' }: LabProps) {
  const name = MODELS[value] ? value : 'SaaS'
  const m = MODELS[name]!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${name}. The provider looks after the bottom ${m.provider} of ${LAYERS.length} layers. ${m.meaning}`}>
      <ol className="flex flex-col gap-1">
        {LAYERS.map((layer, i) => {
          const fromBottom = LAYERS.length - 1 - i
          const provider = fromBottom < m.provider
          return (
            <li
              key={layer}
              className={cn(
                'flex flex-wrap items-center justify-between gap-x-3 rounded-lg border-[1.5px] px-3 py-1.5 text-[13px] motion-safe:transition-colors motion-safe:duration-300',
                provider ? 'border-it bg-[rgba(255,170,60,0.14)]' : 'border-line bg-row',
              )}
            >
              <span className="text-ink">{layer}</span>
              <span className={cn('text-[12px] font-semibold', provider ? 'text-it-text' : 'text-ink-muted')}>{provider ? 'Provider' : 'You'}</span>
            </li>
          )
        })}
      </ol>
      <div aria-live="polite" className="flex flex-col gap-1.5 rounded-2xl border border-line bg-row px-4 py-3">
        <p className="text-[13px] leading-5 text-ink">
          <span className="font-semibold">{name}. </span>
          {m.meaning}
        </p>
        <p className="text-[12px] leading-[18px] text-ink-muted">
          <span className="font-semibold text-ink-soft">For example: </span>
          {m.example}
        </p>
      </div>
    </figure>
  )
}
