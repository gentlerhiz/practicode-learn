import type { Metadata } from 'next'
import { ProjectsView, type ProjectItem } from '@/components/app/projects/projects-view'
import { AppPage } from '@/components/app/shell/app-shell'
import { findCourse, toneOf } from '@/content/catalogue'
import { certificateDate } from '@/lib/certificates/certificates'
import { enrolledTracks } from '@/lib/learn/courses'
import { listProjects } from '@/lib/projects/load'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Projects',
  description: 'Your PractiCode Learn projects.',
  path: '/projects',
  noindex: true,
})

const tone = (track: string): ProjectItem['track'] => {
  const course = findCourse(track)
  return course ? toneOf(course) : 'fe'
}

/**
 * PrismProjects: every module project in the learner's courses. A project opens when its module's
 * lessons are done; one that's started or open is in progress, and a passed one is finished.
 */
export default async function ProjectsPage() {
  const tracks = await enrolledTracks()
  const projects = await listProjects(tracks.map((t) => t.slug))
  const items: ProjectItem[] = projects.map((p) => {
    const base = { track: tone(p.track), module: p.module, title: p.title, href: p.href ?? undefined }
    if (p.status === 'passed')
      return {
        ...base,
        status: 'done',
        when: p.passedAt ? `Passed on ${certificateDate(p.passedAt)}` : 'Passed',
      }
    if (p.status === 'open' || p.status === 'draft')
      return {
        ...base,
        status: 'active',
        blurb: p.description ?? undefined,
        passed: p.checks.passed,
        total: p.checks.total,
        when: p.status === 'draft' ? 'In progress' : 'Ready to start',
        cta: p.status === 'draft' ? 'Continue Project' : 'Start Project',
      }
    if (p.status === 'locked')
      return {
        ...base,
        status: 'next',
        when: `Opens when you finish Module ${p.module}’s lessons (${p.lessons.done} of ${p.lessons.total})`,
      }
    return { ...base, status: 'next', when: 'Brief coming soon' }
  })
  return (
    <AppPage>
      <ProjectsView items={items} />
    </AppPage>
  )
}
