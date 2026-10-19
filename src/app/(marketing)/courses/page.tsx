import type { Metadata, Route } from 'next'
import Link from 'next/link'
import { Fragment } from 'react'
import { CourseIcon } from '@/components/learn/track-icon'
import { CourseFinder, type FinderCourse } from '@/components/marketing/course-finder'
import { CtaBand } from '@/components/marketing/cta-band'
import { JsonLd } from '@/components/seo/json-ld'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { ArrowRight, Icon } from '@/components/ui/icon'
import { Section } from '@/components/ui/section'
import { catalogue, findCourse, PATHS, subjectOf, toneOf } from '@/content/catalogue'
import { cn } from '@/lib/cn'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { metaFor } from '@/lib/seo/pages'
import { toneClass } from '@/lib/tone'

export const metadata: Metadata = metaFor('/courses' as Route)

const courses: FinderCourse[] = catalogue.map((c) => ({
  slug: c.slug,
  code: c.code,
  title: c.title,
  subject: c.subject,
  subjectLabel: subjectOf(c).label,
  level: c.level,
  modules: c.modules,
  hours: c.hours,
  summary: c.summary,
  alignment: c.alignment,
  status: c.status,
  tone: toneOf(c),
  prerequisites: c.prerequisites.map((p) => findCourse(p)!.title),
}))

/** Every course in the catalogue, with a search and filters, then suggested orders to take them in. */
export default function CoursesPage() {
  return (
    <>
      <Section labelledBy="courses-title" className="pt-8 ph:pt-14">
        <Container>
          <CourseFinder courses={courses} title="Courses" titleId="courses-title" />
        </Container>
      </Section>

      <Section id="paths" labelledBy="paths-title">
        <Container className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <Heading level={2} id="paths-title">
              Not sure where to start?
            </Heading>
            <p className="max-w-[640px] text-[17px] leading-7 text-ink-muted">
              Follow a path. Each one starts from zero, so nothing in it assumes you’ve done it before.
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-4 ph:gap-5 tab:grid-cols-3">
            {PATHS.map((path) => {
              const steps = path.steps.map((slug) => findCourse(slug)!)
              const first = steps[0]!
              return (
                <li key={path.title} className="flex flex-col overflow-hidden rounded-[22px] border border-line surface">
                  <div
                    className="flex flex-col gap-3 p-5 text-white"
                    style={{ background: `var(--pc-card-${toneOf(steps.at(-1)!)})` }}
                  >
                    <div aria-hidden="true" className="flex items-center">
                      {steps.map((c, i) => (
                        <Fragment key={c.slug}>
                          {i > 0 && <span className="h-px w-3 bg-white/40" />}
                          <span className="flex size-9 items-center justify-center rounded-xl bg-white/15">
                            <CourseIcon code={c.code} tone={toneOf(c)} size={18} />
                          </span>
                        </Fragment>
                      ))}
                    </div>
                    <h3 className="font-display text-xl leading-7 font-bold">{path.title}</h3>
                    <p className="text-sm leading-[22px] text-white/85">{path.summary}</p>
                  </div>
                  <ol className="flex flex-1 flex-col p-3">
                    {steps.map((course, i) => {
                      const tone = toneOf(course)
                      const live = course.status === 'live'
                      const row = (
                        <>
                          <span
                            className={cn(
                              'flex size-9 shrink-0 items-center justify-center rounded-xl',
                              live ? cn(toneClass[tone].fill, 'text-white') : cn(toneClass[tone].soft, toneClass[tone].text),
                            )}
                          >
                            <CourseIcon code={course.code} tone={tone} size={18} />
                          </span>
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="text-xs text-ink-subtle">
                              Step {i + 1} · {course.level}
                            </span>
                            <span className={cn('text-sm font-semibold', live ? 'text-ink' : 'text-ink-muted')}>
                              {course.short}
                            </span>
                          </span>
                          {live ? (
                            <Icon as={ArrowRight} size={16} className={toneClass[tone].text} />
                          ) : (
                            <span className="text-xs text-ink-subtle">Coming soon</span>
                          )}
                        </>
                      )
                      return (
                        <li key={course.slug} className="relative">
                          {i < steps.length - 1 && (
                            <span aria-hidden="true" className="absolute top-12 -bottom-1 left-[25px] w-0.5 rounded bg-line" />
                          )}
                          {live ? (
                            <Link
                              href={`/courses/${course.slug}` as Route}
                              className="relative flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-hover"
                            >
                              {row}
                            </Link>
                          ) : (
                            <div className="relative flex items-center gap-3 px-2 py-2.5">{row}</div>
                          )}
                        </li>
                      )
                    })}
                  </ol>
                  <div className="px-5 pb-5">
                    <Link
                      href={`/courses/${first.slug}` as Route}
                      className="press inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-line-control text-sm font-semibold text-ink hover:border-line-strong hover:bg-hover"
                    >
                      Start with {first.short}
                      <Icon as={ArrowRight} size={16} />
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        </Container>
      </Section>

      <CtaBand />
      <JsonLd data={[breadcrumbLd([{ name: 'Courses', path: '/courses' }])]} />
    </>
  )
}
