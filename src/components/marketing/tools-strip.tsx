import { landing } from '@/content/landing'

/** The tools the Front-End track teaches, scrolling slowly (still under reduced motion). */
export function ToolsStrip() {
  const tools = landing.tools
  return (
    <section aria-label="Tools you will use" className="overflow-hidden border-y border-line-subtle py-5">
      <div className="marquee-track flex w-max gap-12 font-display text-xl font-bold text-ink">
        <ul className="flex gap-12">
          {tools.map((tool) => (
            <li key={tool} className="flex items-center gap-3 whitespace-nowrap">
              <span aria-hidden="true" className="size-2 rounded-full bg-fe" />
              {tool}
            </li>
          ))}
        </ul>
        {/* A second copy makes the loop seamless; screen readers skip it. */}
        <ul aria-hidden="true" className="flex gap-12">
          {tools.map((tool) => (
            <li key={tool} className="flex items-center gap-3 whitespace-nowrap">
              <span className="size-2 rounded-full bg-fe" />
              {tool}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
