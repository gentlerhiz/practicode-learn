import { cn } from '@/lib/cn'

const tones = {
  surface: 'surface border border-line',
  row: 'bg-row border border-line-subtle',
  sunken: 'bg-sunken border border-line',
} as const

const paddings = { none: '', md: 'p-5 ph:p-6', lg: 'p-6 ph:p-8' } as const

type CardProps = {
  as?: 'div' | 'section' | 'article' | 'li'
  tone?: keyof typeof tones
  padding?: keyof typeof paddings
} & React.HTMLAttributes<HTMLElement>

/** The standard card: 24 px radius, border and surface gradient (design system, "Shape and depth"). */
export function Card({ as: Tag = 'div', tone = 'surface', padding = 'md', className, ...props }: CardProps) {
  return <Tag className={cn('rounded-3xl', tones[tone], paddings[padding], className)} {...props} />
}
