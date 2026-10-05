import { landing } from '@/content/landing'

/**
 * The tools the Front-End track teaches. A still, wrapping list: an endlessly scrolling strip would
 * need a pause control to meet WCAG 2.2.2 (Pause, Stop, Hide).
 */
export function ToolsStrip() {
  return (
    <section aria-label="Tools you will use" className="border-y border-line-subtle py-6">
      <ul className="mx-auto flex max-w-[1240px] flex-wrap justify-center gap-x-10 gap-y-4 px-4 font-display text-lg font-bold text-ink ph:text-xl">
        {landing.tools.map((tool) => (
          <li key={tool} className="flex items-center gap-3 whitespace-nowrap">
            <span aria-hidden="true" className="size-2 rounded-full bg-fe" />
            {tool}
          </li>
        ))}
      </ul>
    </section>
  )
}
