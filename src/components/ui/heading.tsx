import { cn } from '@/lib/cn'

const sizes = {
  display:
    'text-[44px] leading-[54px] tracking-[-0.035em] ph:text-[64px] ph:leading-[72px] wide:text-[78px] wide:leading-[90px]',
  xl: 'text-[34px] leading-10 tracking-[-0.03em] ph:text-[52px] ph:leading-[58px]',
  lg: 'text-[30px] leading-9 tracking-[-0.025em] ph:text-[40px] ph:leading-[46px]',
  md: 'text-lg leading-7 tracking-[-0.02em] ph:text-[22px] ph:leading-8',
} as const

const defaults = { 1: 'xl', 2: 'xl', 3: 'md', 4: 'md' } as const

/** Headings use Bricolage Grotesque in sentence case. The level sets the outline; size sets the look. */
export function Heading({
  level,
  size,
  className,
  ...props
}: { level: 1 | 2 | 3 | 4; size?: keyof typeof sizes } & React.HTMLAttributes<HTMLHeadingElement>) {
  const Tag = `h${level}` as const
  return (
    <Tag className={cn('font-display font-bold text-ink', sizes[size ?? defaults[level]], className)} {...props} />
  )
}
