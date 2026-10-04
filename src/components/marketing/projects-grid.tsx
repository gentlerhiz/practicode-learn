import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Section } from '@/components/ui/section'
import type { TrackModule } from '@/content/tracks'

/** Small decorative previews for a few of the projects. */
function Preview({ variant }: { variant: number }) {
  if (variant === 0)
    return (
      <div
        aria-hidden="true"
        className="flex h-[150px] flex-col gap-3 rounded-2xl border border-line bg-sunken p-4"
      >
        <span className="h-3 w-3/5 rounded-full bg-ink" />
        <span className="h-14 rounded-xl bg-fe" />
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
        <span className="rounded-xl border border-[#4d6bff]/50 bg-fe/20" />
        <span className="rounded-xl border border-[#4d6bff]/50 bg-fe/20" />
        <span className="rounded-xl border border-[#4d6bff]/50 bg-fe/20" />
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
export function ProjectsGrid({ modules }: { modules: TrackModule[] }) {
  return (
    <Section id="projects" labelledBy="projects-title">
      <Container className="flex flex-col gap-8 ph:gap-12">
        <Heading level={2} id="projects-title">
          Some of what you’ll build
        </Heading>
        <ul className="grid gap-4 ph:gap-6 tab:grid-cols-3">
          {modules.map((m, i) => (
            <li key={m.number} className="flex flex-col gap-4 rounded-3xl border border-line p-4 surface">
              <Preview variant={i} />
              <div className="flex flex-col gap-1 px-1 pb-2">
                <p className="text-[13px] text-fe-text">Module {m.number}</p>
                <p className="text-lg font-semibold text-ink">{m.project}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
