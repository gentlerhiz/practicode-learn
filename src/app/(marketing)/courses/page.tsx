import type { Metadata, Route } from 'next'
import Link from 'next/link'
import { CourseFinder, type FinderCourse } from '@/components/marketing/course-finder'
import { CtaBand } from '@/components/marketing/cta-band'
import { JsonLd } from '@/components/seo/json-ld'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Section } from '@/components/ui/section'
import { catalogue, findCourse, PATHS, subjectOf, toneOf } from '@/content/catalogue'
import { cn } from '@/lib/cn'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { metaFor } from '@/lib/seo/pages'
import { toneClass } from '@/lib/tone'

export const metadata: Metadata = metaFor('/courses' as Route)

const courses: FinderCourse[] = catalogue.map((c) => ({
  slug: c.slug,
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
      <section
        aria-labelledby="courses-title"
        className="relative overflow-hidden pt-10 pb-8 ph:pt-16 ph:pb-12"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-72 left-1/2 h-[720px] w-[1200px] -translate-x-1/2 [opacity:var(--pc-glow-opacity)]"
          style={{
            background:
              'radial-gradient(closest-side at 30% 50%, rgba(255,170,60,0.20), rgba(255,170,60,0) 70%), radial-gradient(closest-side at 55% 45%, rgba(77,107,255,0.26), rgba(77,107,255,0) 70%), radial-gradient(closest-side at 78% 55%, rgba(34,190,230,0.20), rgba(34,190,230,0) 70%)',
          }}
        />
        <Container className="relative flex flex-col gap-4">
          <p className="text-sm font-semibold text-fe-text">Courses</p>
          <h1
            id="courses-title"
            className="max-w-[820px] font-display text-[40px] leading-[46px] font-extrabold tracking-[-0.04em] text-ink ph:text-[60px] ph:leading-[64px]"
          >
            Find your next course
          </h1>
          <p className="max-w-[640px] text-[17px] leading-7 text-ink-muted ph:text-lg ph:leading-[30px]">
            Hands-on lessons and labs that run on your phone, each course lined up with a standard employers
            already trust. Module 1 of every open course is free, and more courses are on the way.
          </p>
        </Container>
      </section>

      <Section labelledBy="finder-title" className="pt-0 ph:pt-0">
        <Container>
          <h2 id="finder-title" className="sr-only">
            All courses
          </h2>
          <CourseFinder courses={courses} />
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
          <ul className="grid grid-cols-1 gap-4 ph:gap-6 tab:grid-cols-3">
            {PATHS.map((path) => (
              <li
                key={path.title}
                className="flex flex-col gap-4 rounded-[26px] border border-line p-6 surface"
              >
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-display text-xl font-bold text-ink">{path.title}</h3>
                  <p className="text-[15px] leading-6 text-ink-muted">{path.summary}</p>
                </div>
                <ol className="flex flex-col gap-2">
                  {path.steps.map((slug, i) => {
                    const course = findCourse(slug)!
                    const look = toneClass[toneOf(course)]
                    const step = (
                      <>
                        <span
                          className={cn(
                            'flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white',
                            look.fill,
                          )}
                        >
                          {i + 1}
                        </span>
                        <span className="min-w-0 flex-1">{course.short}</span>
                        <span className="text-xs text-ink-subtle">
                          {course.status === 'live' ? 'Open now' : 'Coming soon'}
                        </span>
                      </>
                    )
                    return (
                      <li key={slug}>
                        {course.status === 'live' ? (
                          <Link
                            href={`/courses/${slug}` as Route}
                            className="flex items-center gap-3 rounded-xl border border-line-subtle bg-row px-3 py-2.5 text-sm font-medium text-ink hover:border-line-strong hover:bg-hover"
                          >
                            {step}
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3 rounded-xl border border-line-subtle bg-row px-3 py-2.5 text-sm text-ink-muted">
                            {step}
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ol>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand />
      <JsonLd data={[breadcrumbLd([{ name: 'Courses', path: '/courses' }])]} />
    </>
  )
}
