import type { Metadata, Route } from 'next'
import { ReviewView } from '@/components/app/review/review-view'
import { loadSession } from '@/lib/review/load'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Daily Review',
  description: 'Your daily review on PractiCode Learn.',
  path: '/review',
  noindex: true,
})

/** PrismReview: today's cards from the lessons the learner has finished, scheduled by FSRS. */
export default async function ReviewPage({ searchParams }: PageProps<'/review'>) {
  const { course } = await searchParams
  const pick = typeof course === 'string' && /^[a-z0-9-]+$/.test(course) ? course : null
  const { cards, summary } = await loadSession(pick ?? undefined)
  return (
    <ReviewView
      key={pick ?? 'all'}
      cards={cards}
      summary={summary}
      course={pick}
      exitHref={'/home' as Route}
      empty={
        summary.total > 0
          ? {
              title: 'Nothing due today',
              body: 'You’re up to date. Cards come back just before you’d forget them, so check in tomorrow.',
            }
          : {
              title: 'Nothing to review yet',
              body: 'Your first cards show up when you finish a lesson. Reviewing takes a few minutes a day and stops you forgetting.',
            }
      }
    />
  )
}
