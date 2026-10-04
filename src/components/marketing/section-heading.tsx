import { Heading } from '@/components/ui/heading'
import { cn } from '@/lib/cn'

type Accent = { plain: string; accent?: string }

const accentTones = {
  fe: 'text-fe-text',
  da: 'text-da-text',
  ux: 'text-ux-text',
  ai: 'text-ai-text',
} as const

/**
 * A marketing section's heading block: optional eyebrow, an h2 and an intro whose last phrase can be
 * picked out in a track colour, as on the canvas. "split" puts the intro beside the heading on wide screens.
 */
export function SectionHeading({
  id,
  eyebrow,
  eyebrowId,
  title,
  intro,
  accentTone = 'fe',
  align = 'center',
}: {
  id: string
  eyebrow?: string
  eyebrowId?: string
  title: string
  intro?: Accent
  accentTone?: keyof typeof accentTones
  align?: 'center' | 'split'
}) {
  const introText = intro && (
    <p
      className={cn(
        'text-[17px] leading-7 text-ink-muted',
        align === 'center' ? 'max-w-[640px]' : 'max-w-[380px]',
      )}
    >
      {intro.plain}
      {intro.accent && (
        <>
          {' '}
          <span className={accentTones[accentTone]}>{intro.accent}</span>
        </>
      )}
    </p>
  )

  if (align === 'split') {
    return (
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-3">
          {eyebrow && (
            <p id={eyebrowId} className="text-[15px] font-semibold text-ai-text">
              {eyebrow}
            </p>
          )}
          <Heading level={2} id={id} className="max-w-[720px]">
            {title}
          </Heading>
        </div>
        {introText}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {eyebrow && (
        <p id={eyebrowId} className="text-[15px] font-semibold text-ai-text">
          {eyebrow}
        </p>
      )}
      <Heading level={2} id={id}>
        {title}
      </Heading>
      {introText}
    </div>
  )
}
