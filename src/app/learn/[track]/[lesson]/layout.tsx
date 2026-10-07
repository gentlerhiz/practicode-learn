import { SkipLink } from '@/components/ui'

/**
 * A lesson is a full-screen frame of its own: the lesson header, the step, and the sticky footer all come
 * from the player (see LessonShell). The layout only adds the skip link, so there is no second header or
 * a nested <main>.
 */
export default function LessonLayout({ children }: LayoutProps<'/learn/[track]/[lesson]'>) {
  return (
    <>
      <SkipLink />
      {children}
    </>
  )
}
