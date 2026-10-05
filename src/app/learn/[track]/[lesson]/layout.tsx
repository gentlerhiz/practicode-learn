import type { Route } from 'next'
import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { LinkButton, SkipLink } from '@/components/ui'
import { getTrackContent } from '@/content/tracks'

/**
 * A lesson gets a quiet frame: the logo, the theme switch and a way out, nothing else to distract.
 * Its links don't prefetch: a learner on metered data shouldn't download other pages' code mid-lesson.
 */
export default async function LessonLayout({ children, params }: LayoutProps<'/learn/[track]/[lesson]'>) {
  const { track } = await params
  const exit = (getTrackContent(track) ? `/tracks/${track}` : '/') as Route
  return (
    <>
      <SkipLink />
      <header className="border-b border-line-subtle">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
          <Logo prefetch={false} />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LinkButton href={exit} prefetch={false} variant="secondary" size="sm">
              Exit Lesson
            </LinkButton>
          </div>
        </div>
      </header>
      <main id="main" className="px-4 pt-6 pb-16 ph:pt-8">
        {children}
      </main>
    </>
  )
}
