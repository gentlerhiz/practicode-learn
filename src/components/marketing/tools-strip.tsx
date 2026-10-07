import { landing } from '@/content/landing'

const dot = {
  fe: 'bg-[#4d6bff] shadow-[0_0_10px_#4d6bff]',
  da: 'bg-[#2fe6b0] shadow-[0_0_10px_#2fe6b0]',
  ux: 'bg-[#f0407f] shadow-[0_0_10px_#f0407f]',
  ai: 'bg-[#7b5cff] shadow-[0_0_10px_#7b5cff]',
  git: 'bg-[#ff8a3d] shadow-[0_0_10px_#ff8a3d]',
} as const

/**
 * The tools strip under the hero, scrolling as on the canvas. It pauses under the pointer and stands
 * still for anyone who asks for less motion. The list is read once; the repeat is hidden.
 */
export function ToolsStrip() {
  const items = (hidden: boolean) =>
    landing.tools.map((tool) => (
      <li key={`${tool.name}-${hidden}`} aria-hidden={hidden || undefined} className="flex items-center gap-3 whitespace-nowrap">
        <span aria-hidden="true" className={`block size-2.5 rounded-full ${dot[tool.tone]}`} />
        {tool.name}
      </li>
    ))
  return (
    <section aria-label="Tools you’ll use" className="overflow-hidden border-y border-line-subtle bg-wash py-6">
      <ul className="marquee flex w-max gap-12 font-display text-xl font-bold tracking-[-0.01em] text-ink-soft">
        {items(false)}
        {items(true)}
      </ul>
    </section>
  )
}
