import type { Metadata, Route } from 'next'
import { ResultView } from '@/components/app/checks/result-view'
import { requirePreviews } from '@/lib/fixtures/gate'

export const metadata: Metadata = { title: 'Module results preview', robots: { index: false, follow: false } }

const mono = (t: string) => <span className="font-mono text-sm text-ux-text">{t}</span>

/** PrismModuleResult with the canvas's sample: 10 of 12, passed. */
export default function ModuleResultPreview() {
  requirePreviews()
  return (
    <ResultView
      data={{
        firstName: 'Tolu',
        module: 6,
        score: 83,
        right: 10,
        total: 12,
        summary:
          'You needed 80% and you got 83%. Layout is one of the trickiest parts of CSS, and you can now build pages that hold together from a small phone to a wide screen.',
        next: { label: 'Start Module 7: Grid and responsive design', href: '/fixtures/screens/lesson' as Route },
        reviewHref: '/fixtures/screens/module-check' as Route,
        skills: [
          { name: 'Flexbox', right: 4, of: 4, map: 'MDN Curriculum: CSS layout' },
          { name: 'CSS Grid', right: 3, of: 4, map: 'MDN Curriculum: CSS layout' },
          { name: 'Responsive layout', right: 3, of: 4, map: 'MDN Curriculum: responsive design' },
        ],
        missed: [
          {
            where: 'Question 5 · CSS Grid',
            said: <>You chose {mono('auto-fill')}, but the cards needed to stretch to fill the row.</>,
            why: 'auto-fill keeps empty columns in place. auto-fit collapses them, so the cards you do have can grow.',
          },
          {
            where: 'Question 9 · Responsive layout',
            said: 'You set the breakpoint at 768px, but the cards were already squashed at 820px.',
            why: 'Pick breakpoints where your content starts to break, not where popular devices happen to be.',
          },
        ],
        calibration: [
          { label: 'Certain', value: '8 of 8 right' },
          { label: 'Fairly sure', value: '1 of 2 right' },
          { label: 'Guessing', value: '1 of 2 right' },
        ],
        calibrationNote:
          'When you were certain, you were right every time. That’s a great sign. We’ll bring back the lucky guess in your review, just in case.',
        mastered: 6,
        modules: 15,
        project: { title: 'Module 6 project', note: '2 checks still to fix', href: '/fixtures/screens/project' as Route },
        homeHref: '/fixtures/screens/dashboard' as Route,
      }}
    />
  )
}
