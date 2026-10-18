import type { Metadata, Route } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Workspace } from '@/components/app/projects/workspace'
import { buttonClasses } from '@/components/ui/button'
import { getTrackContent } from '@/content/tracks'
import { loadProject } from '@/lib/projects/load'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Project',
  description: 'Your project workspace.',
  path: '/projects',
  noindex: true,
})

/** PrismProject: one module's project, with the learner's saved work. */
export default async function ProjectPage({ params }: PageProps<'/projects/[track]/[slug]'>) {
  const { track, slug } = await params
  const course = getTrackContent(track)
  const view = course ? await loadProject(track, slug) : null
  if (!view || !course) notFound()

  if (!view.pack) {
    return (
      <main id="main" className="mx-auto flex max-w-[560px] flex-col items-start gap-4 px-4 py-16 ph:px-6">
        <p className="text-sm font-semibold text-fe-text">Module {view.meta.module} project</p>
        <h1 className="font-display text-[32px] leading-9 font-extrabold tracking-[-0.03em] text-ink">
          {view.meta.title}
        </h1>
        <p className="text-base leading-7 text-ink-muted">
          This project is part of Pro, with every module after Module 1.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href={'/pricing' as Route} className={buttonClasses({}, 'h-12 px-6')}>
            See Pro
          </Link>
          <Link
            href={'/projects' as Route}
            className={buttonClasses({ variant: 'secondary' }, 'h-12 bg-transparent px-6 font-medium')}
          >
            Back to Projects
          </Link>
        </div>
      </main>
    )
  }

  const { pack } = view
  return (
    <Workspace
      data={{
        projectId: pack.id,
        version: pack.version,
        title: pack.title,
        track: course.title.replace(' Web Development', ''),
        module: pack.module,
        client: pack.client,
        brief: pack.brief,
        must: pack.must,
        nice: pack.nice,
        checks: pack.checks,
        checkNames: view.checkNames,
        results: view.results,
        review: pack.review,
        needsSite: pack.needsSite,
        siteUrl: view.siteUrl,
        status: view.status,
        savedAt: view.savedAt,
        files: view.files,
        locked: view.unlocked ? null : view.lessons,
        backHref: '/projects' as Route,
      }}
    />
  )
}
