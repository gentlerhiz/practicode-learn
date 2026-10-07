import type { Metadata, Route } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LessonShell } from '@/components/lesson/lesson-shell'
import { JsonLd } from '@/components/seo/json-ld'
import { LogoIcon } from '@/components/layout/logo'
import { Card, LinkButton } from '@/components/ui'
import { getTrackContent } from '@/content/tracks'
import { getLesson, listPublishedLessons } from '@/lib/lessons/catalogue'
import { loadPack } from '@/lib/lessons/packs'
import type { LessonMeta } from '@/lib/lessons/types'
import { breadcrumbLd, learningResourceLd } from '@/lib/seo/jsonld'
import { pageMetadata } from '@/lib/seo/metadata'

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
  const trackShort = TRACK_SHORT[track] ?? track
  const trackHref = (trackContent ? `/tracks/${track}` : '/') as Route
  const lessonsInModule = siblings.filter((l) => l.module === meta.module).length
  const lessonMeta = `Module ${meta.module} · Lesson ${meta.lesson} of ${lessonsInModule}`
  const eyebrow = `${trackShort} · Module ${meta.module} · Lesson ${meta.lesson}`
  const crumbs = [
    ...(trackContent ? [{ name: trackContent.title, path: `/tracks/${track}` }] : []),
    { name: meta.title, path: pathOf(meta) },
  ]

  if (!meta.free) {
    return (
      <>
        <header className="border-b border-line">
          <div className="mx-auto flex h-[72px] w-full max-w-5xl items-center justify-between gap-4 px-4 ph:px-6">
            <Link href="/" prefetch={false} aria-label="PractiCode Learn home" className="flex">
              <LogoIcon />
            </Link>
            <LinkButton href={trackHref} prefetch={false} variant="secondary" size="sm">
              Exit Lesson
            </LinkButton>
          </div>
        </header>
        <main id="main" className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pt-8 pb-16 ph:px-6">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-fe-text">{eyebrow}</p>
            <h1 className="font-display text-[30px] leading-9 font-bold tracking-[-0.02em] text-ink ph:text-[40px] ph:leading-[46px]">
              {meta.title}
            </h1>
            <p className="text-base leading-[26px] text-ink-soft">{meta.description}</p>
          </div>
          <Card padding="lg">
            <p className="text-base leading-[26px] text-ink-soft">
              This lesson is part of Pro, which launches with the full track.
            </p>
          </Card>
        </main>
      </>
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
    </>
  )
}
