import type { Metadata, Route } from 'next'
import { ReviewView } from '@/components/app/review/review-view'
import { loadLearnerTrack } from '@/lib/learn/progress'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Daily Review',
  description: 'Your daily review on PractiCode Learn.',
  path: '/review',
  noindex: true,
})

/** PrismReview. Review cards come with spaced review (FSRS), which hasn't launched: this says so. */
export default async function ReviewPage() {
  const track = await loadLearnerTrack()
  const finished = track.modules.some((m) => m.lessons.some((l) => l.status === 'completed'))
  return (
    <ReviewView
      cards={[]}
      exitHref={'/home' as Route}
      empty={
        finished
          ? { title: 'Daily review opens soon', body: 'Cards from the lessons you’ve finished will be waiting here, about 4 minutes a day, just before you’d forget them.' }
          : { title: 'Nothing to review yet', body: 'Your first cards show up after Lesson 1. Reviewing takes about 4 minutes a day and stops you forgetting.' }
      }
    />
  )
}
