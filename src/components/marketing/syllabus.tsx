import { ChevronRight, Icon, Lock, Smartphone } from '@/components/ui/icon'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Pill } from '@/components/ui/pill'
import { Section } from '@/components/ui/section'
import type { TrackContent, TrackModule } from '@/content/tracks'
import { Clock } from 'lucide-react'
import { Laptop } from 'lucide-react'

function ModuleRow({ module }: { module: TrackModule }) {
  const minutes = module.lessons.length * 10
  const meta = module.free
    ? `${module.lessons.length} lessons · about ${Math.round(minutes / 60)} hour${minutes >= 90 ? 's' : ''}`
    : `${module.lessons.length} lessons`
  return (
    <details open={module.free} className="group rounded-[22px] border border-line surface">
      <summary className="flex cursor-pointer list-none items-center gap-4 p-4 ph:px-5 [&::-webkit-details-marker]:hidden">
        <span
          className={
            module.free
              ? 'flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-fe text-sm font-bold text-white'
              : 'flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-fe/15 text-sm font-bold text-fe-text'
          }
        >
          {module.number}
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-base font-semibold text-ink">{module.title}</span>
          <span className="text-[13px] text-ink-subtle">{meta}</span>
        </span>
        {module.free ? (
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-on-primary">
            Free
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[13px] text-ink-muted">
            <Icon as={Lock} size={14} />
            Pro
          </span>
        )}
        <Icon
          as={ChevronRight}
          size={16}
          className="shrink-0 text-ink-subtle transition-transform group-open:rotate-90"
        />
      </summary>
      <div className="flex flex-col gap-3 px-4 pb-5 ph:px-5 ph:pl-[72px]">
        <p className="text-[15px] text-ink-muted">{module.summary}</p>
        <ol className="flex flex-col gap-2">
          {module.lessons.map((lesson, i) => (
            <li
              key={lesson.title}
              className="flex items-center gap-3 rounded-xl border border-line-subtle bg-row px-3 py-2.5 text-sm text-ink"
            >
              <span className="w-8 shrink-0 text-xs text-ink-subtle">
                {module.number}.{i + 1}
              </span>
              {lesson.title}
            </li>
          ))}
        </ol>
        <p className="text-[13px] text-fe-text">Project: {module.project}</p>
      </div>
    </details>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section aria-label={title} className="flex flex-col gap-4 rounded-3xl border border-line p-6 surface">
      <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
      {children}
    </section>
  )
}

/** The full syllabus as native <details> (no JavaScript), with standards, devices and the certificate alongside. */
export function Syllabus({ track }: { track: TrackContent }) {
  return (
    <Section id="syllabus" labelledBy="syllabus-title">
      <Container className="grid items-start gap-8 tab:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] tab:gap-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <Heading level={2} id="syllabus-title">
              The syllabus
            </Heading>
            <p className="text-sm text-ink-subtle">Tap a module to see its lessons</p>
          </div>
          <p className="text-[15px] leading-6 text-ink-muted">
            Module 1 is free. Modules 2 to 15 come with Pro, which launches with the full track. Each lesson
            takes 10 to 15 minutes.
          </p>
          <div className="flex flex-col gap-3">
            {track.modules.map((m) => (
              <ModuleRow key={m.number} module={m} />
            ))}
            <div className="rounded-[22px] border border-dashed border-line-control p-4 ph:px-5">
              <p className="text-base font-semibold text-ink">{track.capstone.title}</p>
              <p className="text-[15px] text-ink-muted">{track.capstone.summary}</p>
              <p className="mt-2 text-[13px] text-fe-text">Project: {track.capstone.project}</p>
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-4 tab:sticky tab:top-6">
          <Panel title="Mapped to standards employers know">
            <ul className="flex flex-col gap-3 text-[15px] text-ink">
              {track.alignment.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </Panel>
          <Panel title="What you’ll need">
            <ul className="flex flex-col gap-3 text-sm leading-[22px] text-ink-soft">
              {track.deviceNotes.map((note, i) => (
                <li key={note} className="flex gap-3">
                  <Icon
                    as={i === 0 ? Smartphone : Laptop}
                    size={18}
                    className="mt-0.5 shrink-0 text-fe-text"
                  />
                  {note}
                </li>
              ))}
              <li className="flex gap-3">
                <Icon as={Clock} size={18} className="mt-0.5 shrink-0 text-fe-text" />
                {track.pace}.
              </li>
            </ul>
          </Panel>
          <section
            aria-label="Certificate"
            className="flex items-center gap-4 rounded-3xl border border-[#6e4cf5]/60 bg-sunken p-6"
          >
            <svg aria-hidden="true" viewBox="0 0 80 90" className="h-14 w-12 shrink-0">
              <path
                d="M40 4 74 24v42L40 86 6 66V24z"
                fill="none"
                stroke="#6E4CF5"
                strokeWidth="6"
                strokeLinejoin="round"
              />
              <path
                d="m26 46 10 10 19-21"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-ink"
              />
            </svg>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-lg font-bold text-ink">A verified certificate</p>
                <Pill tone="soon">Coming soon</Pill>
              </div>
              <p className="text-sm text-ink-muted">{track.credential}. It arrives with the full track.</p>
            </div>
          </section>
        </aside>
      </Container>
    </Section>
  )
}
