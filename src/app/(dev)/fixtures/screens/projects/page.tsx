import type { Metadata, Route } from 'next'
import { ProjectsView, type ProjectItem } from '@/components/app/projects/projects-view'
import { AppPage, AppShell } from '@/components/app/shell/app-shell'
import { requirePreviews } from '@/lib/fixtures/gate'
import { SAMPLE_USER } from '@/lib/fixtures/samples'

export const metadata: Metadata = { title: 'Projects preview', robots: { index: false, follow: false } }

const open = '/fixtures/screens/project' as Route
const SAMPLE: ProjectItem[] = [
  { track: 'fe', module: 6, status: 'active', title: 'Navigation bar and menu cards', blurb: 'Mama Nkechi’s navigation bar and menu cards, phone first.', passed: 3, total: 5, when: 'Edited 2 min ago', next: 'Next: make it fit a 320px screen, then fix the button contrast.', href: open },
  { track: 'da', module: 1, status: 'active', title: 'Five vague requests, made answerable', blurb: 'Turn questions like “How are sales?” into ones the data can answer.', passed: 2, total: 3, when: 'Edited yesterday', next: 'Next: give question 4 a clear time period.', href: open },
  { track: 'fe', module: 5, status: 'done', title: 'A magazine-style article page', when: 'Finished 28 September', href: open },
  { track: 'fe', module: 4, status: 'done', title: 'Style the restaurant menu', when: 'Finished 19 September', href: open },
  { track: 'fe', module: 3, status: 'done', title: 'Your menu page, live on the web', when: 'Finished 9 September', href: open },
  { track: 'fe', module: 2, status: 'done', title: 'A menu page for a local restaurant', when: 'Finished 1 September', href: open },
  { track: 'fe', module: 1, status: 'done', title: 'An “About me” page', when: 'Finished 24 August', href: open },
  { track: 'fe', module: 7, status: 'next', title: 'A responsive landing page for a local business', when: 'Unlocks when you finish Module 6' },
  { track: 'da', module: 2, status: 'next', title: 'A sales tracker in Excel', when: 'Unlocks when you finish Module 1' },
]

/** PrismProjects with the canvas's sample learner. */
export default function ProjectsPreview() {
  requirePreviews()
  return (
    <AppShell user={SAMPLE_USER} search={[]}>
      <AppPage>
        <ProjectsView items={SAMPLE} />
      </AppPage>
    </AppShell>
  )
}
