import { ImageResponse } from 'next/og'
import { getTrackContent, liveTracks } from '@/content/tracks'
import { brandCard, ogFonts } from '@/lib/og/brand-card'

export const alt = 'A course on PractiCode Learn, with its name and what you’ll learn'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return liveTracks().map((t) => ({ course: t.slug }))
}

export default async function Image({ params }: { params: Promise<{ course: string }> }) {
  const { course: slug } = await params
  const track = getTrackContent(slug)
  return new ImageResponse(
    brandCard({
      eyebrow: track?.title ?? 'PractiCode Learn',
      title: track?.tagline ?? 'Learn the skills employers are hiring for',
      footer: track ? `${track.modules.length} modules · Module 1 free` : 'learn.practicode.tech',
    }),
    { ...size, fonts: await ogFonts() },
  )
}
