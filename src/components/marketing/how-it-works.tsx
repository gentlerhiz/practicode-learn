import type { Route } from 'next'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/link-button'
import { Section } from '@/components/ui/section'
import { FIRST_LESSON } from '@/content/navigation'
import { LessonDemo } from './lesson-demo'

/** "A lesson that talks back" (anchor #how), with the canvas's live question to try. */
export function HowItWorks() {
  return (
    <Section id="how" labelledBy="how-title">
      <Container className="grid items-center gap-8 ph:gap-10 tab:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] tab:gap-16">
        <div className="flex flex-col gap-5">
          <Heading level={2} id="how-title">
            A lesson that talks back
          </Heading>
          <p className="text-[17px] leading-7 text-ink-muted">
            Every step asks you to do something. Pick an answer, change a number, fix a formula.
          </p>
          <p className="text-[17px] leading-7 text-ink">
            Get it wrong and the chart shows you why.{' '}
            <span className="text-success">Get it right and the next step builds on it.</span> You find out what you know by
            using it, not by being told.
          </p>
          <p className="text-[15px] leading-6 text-ink-muted">
            Go on, try this one from the Data Analysis track. It’s the kind of call analysts make every week.
          </p>
          <LinkButton href={FIRST_LESSON as Route} variant="secondary" className="h-[46px] self-start bg-transparent px-6 font-medium">
            Try a Free Lesson
          </LinkButton>
        </div>
        <LessonDemo />
      </Container>
    </Section>
  )
}
