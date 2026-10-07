import type { Metadata, Route } from 'next'
import { notFound } from 'next/navigation'
import { CheckView } from '@/components/app/checks/check-view'
import { loadLearnerTrack } from '@/lib/learn/progress'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Module Check',
  description: 'Your module check on PractiCode Learn.',
  path: '/checks',
  noindex: true,
})

/** PrismModuleCheck. Question banks arrive with the full track; until then the page says what it will cover. */
export default async function CheckPage({ params }: PageProps<'/checks/[module]'>) {
  const { module } = await params
  const track = await loadLearnerTrack()
  const m = track.modules.find((x) => String(x.number) === module)
  if (!m) notFound()
  return (
    <CheckView
      data={{
        title: `Module check: ${m.title.split(':')[0]}`,
        module: m.number,
        total: 12,
        startAt: 1,
        questions: [],
        covers: m.lessons.map((l) => ({ topic: l.title, count: '2 questions' })).slice(0, 6),
        finishHref: null,
        exitHref: '/my-tracks' as Route,
        closedNote: `Each module ends with a short check: about 12 questions on what the lessons covered, and you pass with 80%. The Module ${m.number} check opens with the full track. Until then, every lesson already checks your answers as you go.`,
      }}
    />
  )
}
