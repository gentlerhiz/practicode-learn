import type { Metadata, Route } from 'next'
import { notFound } from 'next/navigation'
import { Workspace } from '@/components/app/projects/workspace'
import { loadLearnerTrack } from '@/lib/learn/progress'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Project',
  description: 'Your project workspace.',
  path: '/projects',
  noindex: true,
})

const STARTER_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My project</title>
  </head>
  <body>
    <h1>Start here</h1>
  </body>
</html>`

const STARTER_CSS = `body {
  font-family: system-ui, sans-serif;
  margin: 24px;
}`

/** PrismProject for one module's project. You can build and preview it now; automatic checks open soon. */
export default async function ProjectPage({ params }: PageProps<'/projects/[module]'>) {
  const { module } = await params
  const track = await loadLearnerTrack()
  const m = track.modules.find((x) => String(x.number) === module)
  if (!m?.project) notFound()
  return (
    <Workspace
      data={{
        title: m.project,
        track: 'Front-End',
        module: m.number,
        brief: `${m.summary} This module ends with a project briefed like a real job, so it shows what you can do.`,
        asks: [],
        askedBy: 'What the brief asks for',
        checks: [],
        checksNote: `Automatic checks for this project open with Module ${m.number}’s project. You can build and preview it here now; your work stays in this browser tab.`,
        files: [
          { name: 'index.html', lang: 'html', code: STARTER_HTML },
          { name: 'styles.css', lang: 'css', code: STARTER_CSS },
        ],
        editable: true,
        backHref: '/projects' as Route,
      }}
    />
  )
}
