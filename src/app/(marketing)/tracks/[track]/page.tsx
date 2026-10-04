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

// Only live tracks get a page; any other slug is a 404 (coming-soon tracks get pages later).
export const dynamicParams = false

export function generateStaticParams() {
  return liveTracks().map((t) => ({ track: t.slug }))
}

export async function generateMetadata({ params }: PageProps<'/tracks/[track]'>): Promise<Metadata> {
  const { track: slug } = await params
  const path = `/tracks/${slug}` as Route
  const page = publicPages.find((p) => p.path === path)
  if (!page || !getTrackContent(slug)) return {}
  // The share image comes from this route's opengraph-image file (its URL carries a build hash).
  return pageMetadata({ ...page, image: 'route' })
}

export default async function TrackPage({ params }: PageProps<'/tracks/[track]'>) {
  const { track: slug } = await params
  const track = getTrackContent(slug)
  if (!track || track.status !== 'live') notFound()

  // Three projects that show the range: HTML, layout, and live data.
  const showcase = [2, 7, 11].map((n) => track.modules[n - 1]!)

  return (
    <>
      <TrackHero track={track} />
      <Outcomes outcomes={track.outcomes} />
      <Syllabus track={track} />
      <ProjectsGrid modules={showcase} />
      <CtaBand context="track" />
      <JsonLd
        data={[courseLd(track), breadcrumbLd([{ name: track.title, path: `/tracks/${track.slug}` }])]}
      />
    </>
  )
}
