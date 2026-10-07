import type { Metadata, Route } from 'next'
import { CheckView } from '@/components/app/checks/check-view'
import { requirePreviews } from '@/lib/fixtures/gate'

export const metadata: Metadata = { title: 'Module check preview', robots: { index: false, follow: false } }

/** PrismModuleCheck with the canvas's questions 11 and 12. */
export default function ModuleCheckPreview() {
  requirePreviews()
  return (
    <CheckView
      data={{
        title: 'Module check: Layout',
        module: 6,
        total: 12,
        startAt: 11,
        questions: [
          {
            kind: 'Read the code',
            title: 'These cards squash together on narrow screens. Which line makes them move onto a new row instead?',
            code: { lang: 'css', text: '.cards {\n  display: flex;\n  gap: 16px;\n}' },
            options: ['flex-wrap: wrap;', 'flex-direction: column;', 'overflow: hidden;', 'justify-content: space-between;'],
          },
          {
            kind: 'Read the code',
            title: 'The gallery below is 900px wide. How wide is each column?',
            code: { lang: 'css', text: '.gallery {\n  display: grid;\n  grid-template-columns: 1fr 2fr 1fr;\n  gap: 20px;\n}' },
            options: ['300px · 300px · 300px', '215px · 430px · 215px', '225px · 450px · 225px', '200px · 400px · 200px'],
          },
        ],
        covers: [
          { topic: 'Flexbox', count: '4 questions' },
          { topic: 'CSS Grid', count: '4 questions' },
          { topic: 'Responsive layout', count: '4 questions' },
        ],
        finishHref: '/fixtures/screens/module-result' as Route,
        exitHref: '/fixtures/screens/dashboard' as Route,
      }}
    />
  )
}
