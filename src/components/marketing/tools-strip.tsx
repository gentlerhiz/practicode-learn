import {
  Braces,
  Cloud,
  CodeXml,
  Database,
  GitBranch,
  KeyRound,
  Palette,
  PenTool,
  Route,
  Server,
  ShieldCheck,
  SquareTerminal,
  Table2,
  type LucideIcon,
} from 'lucide-react'
import { CourseIcon } from '@/components/learn/track-icon'
import { landing } from '@/content/landing'

// Each tool's icon, in its course's colour. Python uses its course's own snake.
const icons: Record<string, LucideIcon | 'py'> = {
  HTML: CodeXml,
  CSS: Palette,
  JavaScript: Braces,
  'The command line': SquareTerminal,
  'Cloud storage': Cloud,
  Passkeys: KeyRound,
  'Two-factor sign-in': ShieldCheck,
  'Node.js': Server,
  Express: Route,
  Python: 'py',
  SQL: Table2,
  PostgreSQL: Database,
  Figma: PenTool,
  Git: GitBranch,
}

// The course colours that keep their contrast in both themes.
const colour = {
  fe: 'text-fe-text',
  da: 'text-da-text',
  ux: 'text-ux-text',
  ai: 'text-ai-text',
  it: 'text-it-text',
  cy: 'text-cy-text',
  git: 'text-[#ff8a3d]',
} as const

/**
 * The tools strip under the hero, scrolling as on the canvas. It pauses under the pointer and stands
 * still for anyone who asks for less motion. The list is read once; the repeat is hidden.
 */
export function ToolsStrip() {
  const items = (hidden: boolean) =>
    landing.tools.map((tool) => {
      const Icon = icons[tool.name] ?? CodeXml
      return (
        <li key={`${tool.name}-${hidden}`} aria-hidden={hidden || undefined} className="flex items-center gap-2.5 whitespace-nowrap">
          {Icon === 'py' ? (
            <CourseIcon code="py" tone="fe" size={20} className={colour[tool.tone]} />
          ) : (
            <Icon aria-hidden="true" size={20} strokeWidth={1.85} className={colour[tool.tone]} />
          )}
          {tool.name}
        </li>
      )
    })
  return (
    <section aria-label="Tools you’ll use" className="overflow-hidden border-y border-line-subtle bg-wash py-4">
      <ul className="marquee flex w-max gap-10 font-display text-lg font-bold tracking-[-0.01em] text-ink-soft">
        {items(false)}
        {items(true)}
      </ul>
    </section>
  )
}
