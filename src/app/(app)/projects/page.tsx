import type { Metadata } from 'next'
import { ProjectsView, type ProjectItem } from '@/components/app/projects/projects-view'
import { AppPage } from '@/components/app/shell/app-shell'
import { loadLearnerTrack } from '@/lib/learn/progress'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Projects',
  description: 'Your PractiCode Learn projects.',
  path: '/projects',
  noindex: true,
})

/** PrismProjects. Each module's project, from the syllabus; project checks open with the full track. */
export default async function ProjectsPage() {
  const track = await loadLearnerTrack()
  const items: ProjectItem[] = track.modules
    .filter((m) => m.project)
    .map((m) => ({
      track: 'fe',
      module: m.number,
      status: 'next',
      title: m.project!,
      when: m.number === 1 ? 'Opens with Module 1’s project checks' : `Unlocks when you finish Module ${m.number - 1}`,
    }))
  return (
    <AppPage>
      <ProjectsView items={items} />
    </AppPage>
  )
}
