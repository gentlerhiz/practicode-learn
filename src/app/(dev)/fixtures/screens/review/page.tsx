import type { Metadata, Route } from 'next'
import { ReviewView } from '@/components/app/review/review-view'
import { requirePreviews } from '@/lib/fixtures/gate'
import type { SessionCard } from '@/lib/review/load'

export const metadata: Metadata = { title: 'Review preview', robots: { index: false, follow: false } }

const card = (id: string, lesson: string, front: string, back: string): SessionCard => ({
  id,
  track: 'front-end-web-development',
  trackTitle: 'Front-End Web Development',
  lesson,
  lessonHref: '/fixtures/screens/lesson' as Route,
  front,
  back,
  next: ['in 1 min', 'in 6 min', 'in 2 days', 'in 6 days'],
})

const CARDS: SessionCard[] = [
  card(
    'fe-06-05:00000001',
    'Lesson 6.5: Wrapping and gap',
    'What does <code>gap</code> do inside a flex container?',
    'It adds space between the items, but not around the outside edges.',
  ),
  card(
    'fe-06-03:00000002',
    'Lesson 6.3: justify-content',
    'Which property aligns items along the main axis?',
    '<code>justify-content</code>. Its partner, <code>align-items</code>, handles the cross axis.',
  ),
  card(
    'fe-04-07:00000003',
    'Lesson 4.7: The box model',
    'What’s the difference between margin and padding?',
    'Padding is space inside the border. Margin is space outside it.',
  ),
  card(
    'fe-04-03:00000004',
    'Lesson 4.3: The cascade and specificity',
    'Which wins: a class selector or an ID selector?',
    'The ID selector. It has higher specificity.',
  ),
]

/** PrismReview with sample cards. Ratings don't save here: there's no learner. */
export default function ReviewPreview() {
  requirePreviews()
  return (
    <ReviewView
      cards={CARDS}
      summary={{
        due: CARDS.length,
        total: 40,
        daysThisWeek: 3,
        next: CARDS[0]!.front,
        courses: [
          { slug: 'front-end-web-development', title: 'Front-End Web Development', due: CARDS.length },
        ],
      }}
      course={null}
      exitHref={'/fixtures/screens/dashboard' as Route}
    />
  )
}
