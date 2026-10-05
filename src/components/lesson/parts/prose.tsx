import { cn } from '@/lib/cn'

const proseClass =
  'text-base leading-[26px] text-ink-soft [&_a]:text-fe-text [&_a]:underline [&_code]:rounded-md [&_code]:bg-row [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-ink [&_li]:mt-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3 [&_pre]:my-3 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5'

/**
 * Lesson text. The HTML was rendered from Markdown at build time by our own content pipeline and checked
 * with parsePack, so it is trusted lesson content, never learner input.
 */
export function Prose({
  html,
  className,
  inline = false,
}: {
  html: string
  className?: string
  inline?: boolean
}) {
  const Tag = inline ? 'span' : 'div'
  return <Tag className={cn(!inline && proseClass, className)} dangerouslySetInnerHTML={{ __html: html }} />
}
