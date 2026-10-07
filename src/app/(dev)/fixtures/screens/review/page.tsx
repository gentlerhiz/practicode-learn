import type { Metadata, Route } from 'next'
import { ReviewView, type ReviewCard } from '@/components/app/review/review-view'
import { requirePreviews } from '@/lib/fixtures/gate'

export const metadata: Metadata = { title: 'Review preview', robots: { index: false, follow: false } }

const CARDS: ReviewCard[] = [
  { track: 'fe', topic: 'Front-End · Module 6', q: 'What does gap do inside a flex container?', a: 'It adds space between the items, but not around the outside edges.', code: '.nav { display: flex; gap: 12px; }', why: 'You learned this 3 days ago and got it right once. Right about now is when it starts to fade.' },
  { track: 'fe', topic: 'Front-End · Module 6', q: 'Which property controls alignment along the main axis?', a: 'justify-content. Its partner, align-items, handles the cross axis.', code: 'justify-content: space-between;', why: 'You picked the wrong answer for this in yesterday’s lesson, so it’s back sooner than usual.' },
  { track: 'da', topic: 'Data Analysis · Module 1', q: 'What makes a question answerable with data?', a: 'It is specific, measurable and tied to a decision. “Which branch sold most in June?” works. “How are we doing?” doesn’t.', code: 'Vague → specific → measurable → decision', why: 'From the free Data module you finished last week. A quick check that it stuck.' },
  { track: 'fe', topic: 'Front-End · Module 4', q: 'What is the difference between margin and padding?', a: 'Padding is space inside the border. Margin is space outside it.', code: '.card { padding: 16px; margin: 24px; }', why: 'Last seen 9 days ago. You have got it right three times, so the gaps keep growing.' },
  { track: 'fe', topic: 'Front-End · Module 4', q: 'Which wins: a class selector or an ID selector?', a: 'The ID selector. It has higher specificity, so its rules override the class.', code: '#hero beats .hero', why: 'Specificity trips most people up. You marked it Hard last week.' },
]

/** PrismReview with the canvas's five sample cards. */
export default function ReviewPreview() {
  requirePreviews()
  return <ReviewView cards={CARDS} exitHref={'/fixtures/screens/dashboard' as Route} />
}
