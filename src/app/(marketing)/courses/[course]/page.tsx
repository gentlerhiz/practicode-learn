import type { Metadata, Route } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/seo/json-ld'
import { Outcomes } from '@/components/marketing/outcomes'
import { ProjectsGrid } from '@/components/marketing/projects-grid'
import { Syllabus } from '@/components/marketing/syllabus'
import { TrackHero } from '@/components/marketing/track-hero'
import { CtaBand } from '@/components/marketing/cta-band'
import { getTrackContent, liveTracks } from '@/content/tracks'
import { breadcrumbLd, courseLd } from '@/lib/seo/jsonld'
import { publicPages } from '@/lib/seo/pages'
import { pageMetadata } from '@/lib/seo/metadata'

// Only live courses get a page; any other slug is a 404 (coming-soon courses get pages later).
export const dynamicParams = false

export function generateStaticParams() {
  return liveTracks().map((t) => ({ course: t.slug }))
}

export async function generateMetadata({ params }: PageProps<'/courses/[course]'>): Promise<Metadata> {
  const { course: slug } = await params
  const path = `/courses/${slug}` as Route
  const page = publicPages.find((p) => p.path === path)
  if (!page || !getTrackContent(slug)) return {}
  // The share image comes from this route's opengraph-image file (its URL carries a build hash).
  return pageMetadata({ ...page, image: 'route' })
}

export default async function CoursePage({ params }: PageProps<'/courses/[course]'>) {
  const { course: slug } = await params
  const track = getTrackContent(slug)
  if (!track || track.status !== 'live') notFound()

  const showcase = track.showcase.map((n) => track.modules[n - 1]!)

  return (
    <>
      <TrackHero track={track} />
      <Outcomes outcomes={track.outcomes} />
      <Syllabus track={track} />
      <ProjectsGrid modules={showcase} tone={track.tone} />
      <CtaBand context="track" firstLesson={track.firstLesson} />
      <JsonLd
        data={[
          courseLd(track),
          breadcrumbLd([
            { name: 'Courses', path: '/courses' },
            { name: track.title, path: `/courses/${track.slug}` },
          ]),
        ]}
      />
    </>
  )
}
