import { Icon, Lock, Smartphone } from '@/components/ui/icon'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Pill } from '@/components/ui/pill'
import { Section } from '@/components/ui/section'
import type { TrackContent, TrackModule } from '@/content/tracks'
import { Clock, Laptop } from 'lucide-react'

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
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-on-primary">Free</span>
        ) : (
          <span className="flex items-center gap-1 text-[13px] text-ink-muted">
            <Icon as={Lock} size={14} />
            Pro
          </span>
        )}
      </summary>
      <div className="flex flex-col gap-3 px-4 pb-5 ph:px-5">
        <p className="text-[15px] text-ink-muted">{module.summary}</p>
        <ol className="flex flex-col">
          {module.lessons.map((lesson) => (
            <li
              key={lesson.title}
              className="flex items-center justify-between gap-3 border-b border-divider py-3 pl-6 text-[15px] text-ink last:border-b-0"
            >
              <span>{lesson.title}</span>
              {lesson.minutes && <span className="shrink-0 text-[13px] text-ink-subtle">{lesson.minutes} min</span>}
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-2 pt-1">
          {['Module project', 'Module check'].map((chip) => (
            <span
              key={chip}
              className="inline-flex h-10 items-center rounded-full border border-line-control px-4 text-[13px] font-medium text-ink"
            >
              {chip}
            </span>
          ))}
        </div>
        <p className="text-[13px] text-fe-text">Project: {module.project}</p>
      </div>
    </details>
  )
}

/** "Label: text" lines from the track's alignment list, with SFIA's skills split into chips. */
function Standard({ line }: { line: string }) {
  const cut = line.indexOf(': ')
  const label = cut > 0 ? line.slice(0, cut) : 'Accessibility'
  const text = cut > 0 ? line.slice(cut + 2) : line
  const sfia = label.startsWith('SFIA')
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[13px] text-ink-subtle">{sfia ? `${label} skills` : label}</p>
      {sfia ? (
        <ul className="flex flex-wrap gap-2">
          {text.split(', ').map((skill) => (
            <li key={skill} className="rounded-lg bg-[rgba(77,107,255,0.16)] px-3 py-1 text-[13px] text-fe-text">
              {skill}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[15px] text-ink">{text}</p>
      )}
    </div>
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
          <div className="flex flex-col gap-3">
            {track.modules.map((m) => (
              <ModuleRow key={m.number} module={m} />
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-4 tab:sticky tab:top-6">
          <section
            aria-labelledby="standards-title"
            className="flex flex-col gap-4 rounded-3xl border border-[rgba(77,107,255,0.4)] bg-[linear-gradient(160deg,rgba(77,107,255,0.14),var(--pc-sheet)_70%)] p-6"
          >
            <h3 id="standards-title" className="font-display text-xl font-bold text-ink">
              Mapped to standards employers know
            </h3>
            {track.alignment.map((a) => (
              <Standard key={a} line={a} />
            ))}
          </section>
          <section aria-labelledby="needs-title" className="flex flex-col gap-4 rounded-3xl border border-line p-6 surface">
            <h3 id="needs-title" className="font-display text-xl font-bold text-ink">
              What you’ll need
            </h3>
            <ul className="flex flex-col gap-3 text-sm leading-[22px] text-ink-soft">
              {track.deviceNotes.map((note, i) => (
                <li key={note} className="flex gap-3">
                  <Icon as={i === 0 ? Smartphone : Laptop} size={18} className="mt-0.5 shrink-0 text-fe-text" />
                  {note}
                </li>
              ))}
              <li className="flex gap-3">
                <Icon as={Clock} size={18} className="mt-0.5 shrink-0 text-fe-text" />
                {track.pace}.
              </li>
            </ul>
          </section>
          <section
            aria-labelledby="cert-title"
            className="rounded-3xl bg-[linear-gradient(160deg,#4D6BFF_0%,#7B5CFF_45%,#F0407F_100%)] p-[1.5px]"
          >
            <div className="flex items-center gap-4 rounded-[22.5px] bg-sheet p-5">
              <svg aria-hidden="true" viewBox="0 0 100 100" className="size-12 shrink-0">
                <defs>
                  <linearGradient id="trackBadge" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#4D6BFF" />
                    <stop offset="0.5" stopColor="#7B5CFF" />
                    <stop offset="1" stopColor="#F0407F" />
                  </linearGradient>
                </defs>
                <polygon
                  points="50,4 90,27 90,73 50,96 10,73 10,27"
                  className="fill-control"
                  stroke="url(#trackBadge)"
                  strokeWidth="5"
                />
                <path
                  d="m34 51 11 11 22-24"
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
                  <h3 id="cert-title" className="font-display text-lg font-bold text-ink">
                    Finish and get a verified certificate
                  </h3>
                  <Pill tone="soon">Coming soon</Pill>
                </div>
                <p className="text-[13px] leading-5 text-ink-muted">{track.credential}. It arrives with the full track.</p>
              </div>
            </div>
          </section>
        </aside>
      </Container>
    </Section>
  )
}
