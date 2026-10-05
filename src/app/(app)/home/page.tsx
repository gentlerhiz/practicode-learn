import type { Metadata, Route } from 'next'
import { ModuleProgress, type LessonStatus, type ModuleLesson } from '@/components/app/module-progress'
import { ResumeCard } from '@/components/app/resume-card'
import { Card, Heading } from '@/components/ui'
import { getTrackContent } from '@/content/tracks'
import { requireUser } from '@/lib/auth/require-user'
import { listPublishedLessons } from '@/lib/lessons/catalogue'
import { pageMetadata } from '@/lib/seo/metadata'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = pageMetadata({
  title: 'Home',
  description: 'Your PractiCode Learn home.',
  path: '/home',
  noindex: true,
})

const TRACK = 'front-end-web-development'
const TRACK_PREFIX = 'fe'
const pad = (n: number) => String(n).padStart(2, '0')

/** Ported from PrismDashboardNew, keeping what works today: where to carry on, and Module 1 at a glance. */
export default async function HomePage() {
  const user = await requireUser()
  const track = getTrackContent(TRACK)!
  const [moduleOne, moduleTwo] = track.modules
  const supabase = await createClient()
  const [published, progressResult] = await Promise.all([
    listPublishedLessons(TRACK),
    supabase
      .from('lesson_progress')
      .select('lesson_id, status, updated_at')
      .order('updated_at', { ascending: false }),
  ])
  const progress = progressResult.data ?? []
  const statusOf = new Map(progress.map((p) => [p.lesson_id, p.status as LessonStatus]))

  // Lessons come from the syllabus; the published ones (matched by id, as the content build names them)
  // add a link, a description and the learner's status.
  const lessons: ModuleLesson[] = (moduleOne?.lessons ?? []).map((l, i) => {
    const id = `${TRACK_PREFIX}-${pad(moduleOne!.number)}-${pad(i + 1)}`
    const meta = published.find((p) => p.id === id)
    return {
      id,
      number: i + 1,
      title: meta?.title ?? l.title,
      minutes: meta?.minutes ?? l.minutes,
      description: meta?.description,
      href: meta ? (`/learn/${meta.track}/${meta.slug}` as Route) : null,
      status: statusOf.get(id) ?? 'not_started',
    }
  })
  const inProgress = progress
    .map((p) => lessons.find((l) => l.id === p.lesson_id && l.href && p.status === 'started'))
    .find(Boolean)
  const nextUp = inProgress ?? lessons.find((l) => l.href && l.status !== 'completed')
  const anyOpen = lessons.some((l) => l.href)
  const eyebrow = (l?: ModuleLesson) =>
    `Front-End · Module ${moduleOne?.number ?? 1}${l ? ` · Lesson ${l.number}` : ''}`
  const firstName = user.name?.trim().split(/\s+/)[0]

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Heading level={1} size="lg">
          {firstName ? `Welcome, ${firstName}.` : 'Welcome.'}
        </Heading>
        <p className="text-base text-ink-soft">Your track: {track.title}.</p>
      </div>
      {nextUp ? (
        <ResumeCard
          eyebrow={eyebrow(nextUp)}
          title={nextUp.title}
          summary={
            inProgress ? 'Pick up where you left off.' : (nextUp.description ?? 'Your next lesson is ready.')
          }
          href={nextUp.href ?? undefined}
          action={
            inProgress
              ? 'Continue Lesson'
              : nextUp.number === 1
                ? 'Start Your First Lesson'
                : `Start Lesson ${nextUp.number}`
          }
        />
      ) : (
        <ResumeCard
          eyebrow={eyebrow()}
          title={moduleOne?.title ?? track.title}
          summary={
            anyOpen ? 'You’ve finished every lesson that’s open so far.' : 'The first lessons open soon.'
          }
        />
      )}
      {moduleOne && <ModuleProgress number={moduleOne.number} title={moduleOne.title} lessons={lessons} />}
      {moduleTwo && (
        <Card className="flex flex-col gap-1">
          <p className="font-semibold text-ink">Module 2 is on its way</p>
          <p className="text-[15px] leading-6 text-ink-soft">
            {moduleTwo.title}: {moduleTwo.summary}
          </p>
        </Card>
      )}
    </div>
  )
}
