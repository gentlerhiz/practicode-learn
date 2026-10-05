import { ImageResponse } from 'next/og'
import { getLesson, listPublishedLessons } from '@/lib/lessons/catalogue'
import { brandCard, ogFonts } from '@/lib/og/brand-card'

export const alt = 'A lesson on PractiCode Learn'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const TRACK_SHORT: Record<string, string> = { 'front-end-web-development': 'Front-End', samples: 'Samples' }

export async function generateStaticParams() {
  return (await listPublishedLessons()).filter((l) => l.free).map((l) => ({ track: l.track, lesson: l.slug }))
}

/** The share card for one lesson: where it sits in the track, its title, and that it's free. */
export default async function Image({ params }: { params: Promise<{ track: string; lesson: string }> }) {
  const { track, lesson } = await params
  const meta = await getLesson(track, lesson)
  return new ImageResponse(
    brandCard({
      eyebrow: meta
        ? `${TRACK_SHORT[track] ?? track} · Module ${meta.module} · Lesson ${meta.lesson}`
        : 'PractiCode Learn',
      title: meta?.title ?? 'Learn the skills employers are hiring for',
      footer: meta?.free ? 'Free lesson · learn.practicode.tech' : 'learn.practicode.tech',
    }),
    { ...size, fonts: await ogFonts() },
  )
}
