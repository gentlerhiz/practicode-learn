import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/link-button'
import { Section } from '@/components/ui/section'
import { landing } from '@/content/landing'
import { primaryCta } from '@/content/navigation'
import { LessonDemo } from './lesson-demo'

/** "A lesson that talks back": how a lesson works, with a real step you can try (anchor #how-it-works). */
export function HowItWorks() {
  const { demo } = landing
  return (
    <Section id="how-it-works" labelledBy="how-title">
      <Container className="grid items-center gap-8 tab:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] tab:gap-16">
        <div className="flex flex-col gap-5">
          <Heading level={2} id="how-title">
            {demo.title}
          </Heading>
          {demo.paragraphs.map((p) => (
            <p key={p} className="text-[17px] leading-7 text-ink-muted">
              {p}
            </p>
          ))}
          <p className="text-[17px] leading-7 text-ink">
            {demo.emphasis.plain} <span className="text-success">{demo.emphasis.accent}</span>{' '}
            {demo.emphasis.end}
          </p>
          <p className="text-sm leading-6 text-ink-subtle">{demo.note}</p>
          <LinkButton href={primaryCta.href} variant="secondary" className="self-start">
            {primaryCta.label}
          </LinkButton>
        </div>
        <LessonDemo />
      </Container>
    </Section>
  )
}
