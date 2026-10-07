import type { Metadata } from 'next'
import { requirePreviews } from '@/lib/fixtures/gate'
import { DonePreview } from './done-preview'

export const metadata: Metadata = { title: 'Lesson complete preview', robots: { index: false, follow: false } }

export default async function LessonDonePreview({ searchParams }: PageProps<'/fixtures/screens/lesson-done'>) {
  requirePreviews()
  const { learner } = await searchParams
  return <DonePreview learner={learner !== undefined} />
}
