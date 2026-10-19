import type { Metadata, Route } from 'next'
import { catalogue } from '@/content/catalogue'
import { notFound } from 'next/navigation'
import { LessonShell } from '@/components/lesson/lesson-shell'
import { ProLesson } from '@/components/lesson/pro-lesson'
import { JsonLd } from '@/components/seo/json-ld'
import { getTrackContent } from '@/content/tracks'
import { getLesson, lessonsToPrebuild, listPublishedLessons } from '@/lib/lessons/catalogue'
import { loadPack } from '@/lib/lessons/packs'
import type { LessonMeta } from '@/lib/lessons/types'
import { breadcrumbLd, learningResourceLd } from '@/lib/seo/jsonld'
import { pageMetadata } from '@/lib/seo/metadata'

const TRACK_SHORT: Record<string, string> = {
  ...Object.fromEntries(catalogue.map((c) => [c.slug, c.short])),
  samples: 'Samples',
}
const pathOf = (l: Pick<LessonMeta, 'track' | 'slug'>) => `/learn/${l.track}/${l.slug}`
const plain = (html: string) => html.replace(/<[^>]+>/g, '').trim()

// Free lessons in real tracks are built ahead of time; others render on request (and answer 404 if unknown).
export async function generateStaticParams() {
  return lessonsToPrebuild(await listPublishedLessons()).map((l) => ({ track: l.track, lesson: l.slug }))
}

export async function generateMetadata({ params }: PageProps<'/learn/[track]/[lesson]'>): Promise<Metadata> {
  const { track, lesson } = await params
  const meta = await getLesson(track, lesson)
  if (!meta) return {}
  return pageMetadata({
    title: meta.title,
    description: meta.description,
    path: pathOf(meta),
    type: 'article',
    // Sample lessons exist to test the player, and Pro lessons have nothing public to show.
    noindex: meta.track === 'samples' || !meta.free,
    image: 'route',
  })
}

export default async function LessonPage({ params }: PageProps<'/learn/[track]/[lesson]'>) {
  const { track, lesson } = await params
  const meta = await getLesson(track, lesson)
  if (!meta) notFound()
  const trackContent = getTrackContent(track)
  const siblings = await listPublishedLessons(track)
  const following = siblings[siblings.findIndex((l) => l.id === meta.id) + 1]
  const trackShort = TRACK_SHORT[track] ?? track
  const trackHref = (trackContent ? `/courses/${track}` : '/') as Route
  // The syllabus knows the whole module, even while only some of its lessons are published.
  const lessonsInModule = Math.max(
    trackContent?.modules.find((m) => m.number === meta.module)?.lessons.length ?? 0,
    siblings.filter((l) => l.module === meta.module).length,
  )
  const lessonMeta = `Module ${meta.module} · Lesson ${meta.lesson} of ${lessonsInModule}`
  const eyebrow = `${trackShort} · Module ${meta.module} · Lesson ${meta.lesson}`
  const crumbs = [
    ...(trackContent ? [{ name: trackContent.title, path: `/tracks/${track}` }] : []),
    { name: meta.title, path: pathOf(meta) },
  ]

  const next = following
    ? {
        href: pathOf(following) as Route,
        title: following.title,
        lesson: following.lesson,
        minutes: following.minutes,
      }
    : undefined

  // Never load a Pro pack here: this page is static and public. The browser asks for it after a plan check.
  if (!meta.free) {
    return (
      <ProLesson
        lessonId={meta.id}
        title={meta.title}
        description={meta.description}
        eyebrow={eyebrow}
        lessonPath={pathOf(meta)}
        trackLabel={trackShort}
        lessonMeta={lessonMeta}
        trackHref={trackHref}
        nextLesson={next}
      />
    )
  }

  const pack = await loadPack(meta)
  const points = pack.steps.flatMap((s) => (s.type === 'recap' ? s.points : []))
  return (
    <>
      <JsonLd
        data={learningResourceLd(meta, { trackTitle: trackContent?.title, teaches: points.map(plain) })}
      />
      <JsonLd data={breadcrumbLd(crumbs)} />
      <LessonShell
        pack={pack}
        lessonPath={pathOf(meta)}
        trackLabel={trackShort}
        lessonMeta={lessonMeta}
        trackHref={trackHref}
        eyebrow={eyebrow}
        nextLesson={next}
      />
    </>
  )
}
