import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Section } from '@/components/ui/section'
import type { TrackTone } from '@/content/catalogue'
import type { TrackModule } from '@/content/tracks'
import { cn } from '@/lib/cn'
import { toneClass } from '@/lib/tone'

/** Small decorative previews for a few of the projects, in the course's colour. */
function Preview({ variant, tone }: { variant: number; tone: TrackTone }) {
  const look = toneClass[tone]
  const box = { borderColor: `rgba(${look.rgb},0.5)`, background: `rgba(${look.rgb},0.2)` }
  if (variant === 0)
    return (
      <div
        aria-hidden="true"
        className="flex h-[150px] flex-col gap-3 rounded-2xl border border-line bg-sunken p-4"
      >
        <span className="h-3 w-3/5 rounded-full bg-ink" />
        <span className={cn('h-14 rounded-xl', look.fill)} />
        <span className="h-2 w-4/5 rounded-full bg-ink-subtle/50" />
        <span className="h-2 w-1/2 rounded-full bg-ink-subtle/50" />
      </div>
    )
  if (variant === 1)
    return (
      <div
        aria-hidden="true"
        className="grid h-[150px] grid-cols-[3fr_1fr_0.6fr] gap-3 rounded-2xl border border-line bg-sunken p-4"
      >
        <span className="rounded-xl border" style={box} />
        <span className="rounded-xl border" style={box} />
        <span className="rounded-xl border" style={box} />
      </div>
    )
  if (tone !== 'fe')
    return (
      <div
        aria-hidden="true"
        className="flex h-[150px] flex-col justify-center gap-3 rounded-2xl border border-line bg-sunken p-4"
      >
        {[true, true, false].map((done, i) => (
          <span key={i} className="flex items-center gap-3">
            <span
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded-md text-[11px] text-white',
                done ? look.fill : 'border border-line-control',
              )}
            >
              {done ? '✓' : ''}
            </span>
            <span className={cn('h-2 rounded-full bg-ink-subtle/50', i === 2 ? 'w-1/2' : 'w-4/5')} />
          </span>
        ))}
      </div>
    )
  return (
    <div
      aria-hidden="true"
      className="flex h-[150px] flex-col justify-between rounded-2xl border border-line bg-sunken p-4"
    >
      <div className="flex items-start justify-between">
        <span className="font-display text-2xl font-extrabold text-ink">31°</span>
        <span className="text-[11px] text-ink-subtle">Today · Partly cloudy</span>
      </div>
      <div className="flex items-end gap-2">
        {[30, 45, 70, 50, 35].map((h, i) => (
          <span
            key={h}
            className={i === 2 ? 'flex-1 rounded-md bg-fe' : 'flex-1 rounded-md bg-line-control'}
            style={{ height: `${h}px` }}
          />
        ))}
      </div>
    </div>
  )
}

/** "Some of what you'll build" (anchor #projects): three module projects with small previews. */
export function ProjectsGrid({ modules, tone }: { modules: TrackModule[]; tone: TrackTone }) {
  return (
    <Section id="projects" labelledBy="projects-title">
      <Container className="flex flex-col gap-8 ph:gap-12">
        <Heading level={2} id="projects-title">
          Some of what you’ll build
        </Heading>
        <ul className="grid gap-4 ph:gap-6 tab:grid-cols-3">
          {modules.map((m, i) => (
            <li key={m.number} className="flex flex-col gap-4 rounded-3xl border border-line p-4 surface">
              <Preview variant={i} tone={tone} />
              <div className="flex flex-col gap-1 px-1 pb-2">
                <p className={cn('text-[13px]', toneClass[tone].text)}>
                  Module {m.number}
                  {m.soon ? ' · Coming soon' : ''}
                </p>
                <p className="text-lg font-semibold text-ink">{m.project}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
