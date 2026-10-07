import type { Route } from 'next'
import { redirect } from 'next/navigation'

/** Results exist once checks do. Until then, this sends the learner to the check page, which explains. */
export default async function ResultsPage({ params }: PageProps<'/checks/[module]/results'>) {
  const { module } = await params
  redirect(`/checks/${encodeURIComponent(module)}` as Route)
}
