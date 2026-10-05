import type { Metadata, Route } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LessonOutline } from '@/components/lesson/lesson-outline'
import { LessonShell } from '@/components/lesson/lesson-shell'
import { JsonLd } from '@/components/seo/json-ld'
import { Card } from '@/components/ui'
import { getTrackContent } from '@/content/tracks'
import { getLesson, listPublishedLessons } from '@/lib/lessons/catalogue'
import { loadPack } from '@/lib/lessons/packs'
import type { LessonMeta } from '@/lib/lessons/types'
import { breadcrumbLd, learningResourceLd } from '@/lib/seo/jsonld'
import { pageMetadata } from '@/lib/seo/metadata'
import { absoluteUrl } from '@/lib/site'

const TRACK_SHORT: Record<string, string> = { 'front-end-web-development': 'Front-End', samples: 'Samples' }
const pathOf = (l: Pick<LessonMeta, 'track' | 'slug'>) => `/learn/${l.track}/${l.slug}`
const plain = (html: string) => html.replace(/<[^>]+>/g, '').trim()

// Every free lesson is built ahead of time; others render on request (and answer 404 if unknown).
export async function generateStaticParams() {
  return (await listPublishedLessons()).filter((l) => l.free).map((l) => ({ track: l.track, lesson: l.slug }))
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
    // Sample lessons exist to test the player, and Pro lessons have nothing to show yet.
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
  const eyebrow = `${TRACK_SHORT[track] ?? track} · Module ${meta.module} · Lesson ${meta.lesson}`
  const crumbs = [
    ...(trackContent ? [{ name: trackContent.title, path: `/tracks/${track}` }] : []),
    { name: meta.title, path: pathOf(meta) },
  ]

  const header = (
    <header className="flex flex-col gap-3">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap gap-x-2 text-sm text-ink-muted">
          <li>
            <Link href="/" prefetch={false} className="hover:text-ink">
              Home
            </Link>
          </li>
          {trackContent && (
            <li>
              <span aria-hidden="true">› </span>
              <Link href={`/tracks/${track}` as Route} prefetch={false} className="hover:text-ink">
                {trackContent.title}
              </Link>
            </li>
          )}
          <li aria-current="page">
            <span aria-hidden="true">› </span>
            {meta.title}
          </li>
        </ol>
      </nav>
      <p className="text-sm font-semibold text-fe-text">{eyebrow}</p>
      <h1
        id="lesson-title"
        className="font-display text-[30px] leading-9 font-bold tracking-[-0.02em] text-ink ph:text-[40px] ph:leading-[46px]"
      >
        {meta.title}
      </h1>
      <p className="text-base leading-[26px] text-ink-soft">{meta.description}</p>
      <p className="text-sm text-ink-muted">
        {meta.minutes} min · {meta.free ? 'Free' : 'Pro'}
      </p>
    </header>
  )

  if (!meta.free) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {header}
        <Card padding="lg">
          <p className="text-base leading-[26px] text-ink-soft">
            This lesson is part of Pro, which launches with the full track.
          </p>
        </Card>
      </div>
    )
  }

  const pack = await loadPack(meta)
  const points = pack.steps.flatMap((s) => (s.type === 'recap' ? s.points : []))
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <JsonLd
        data={learningResourceLd(meta, { trackTitle: trackContent?.title, teaches: points.map(plain) })}
      />
      <JsonLd data={breadcrumbLd(crumbs)} />
      {header}
      <LessonOutline pack={pack} />
      <LessonShell
        pack={pack}
        lessonPath={pathOf(meta)}
        shareUrl={absoluteUrl(pathOf(meta))}
        eyebrow={eyebrow}
        nextLesson={
          following
            ? {
                href: pathOf(following) as Route,
                title: following.title,
                lesson: following.lesson,
                minutes: following.minutes,
              }
            : undefined
        }
      />
    </div>
  )
}
