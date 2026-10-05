'use client'
import { Button, Card, Heading, LinkButton } from '@/components/ui'

/** When a lesson pack can't be loaded or doesn't match the format (a PackError), say so plainly. */
export default function LessonError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Card padding="lg" className="mx-auto flex max-w-3xl flex-col gap-4">
      <Heading level={1} size="lg">
        This lesson couldn’t load
      </Heading>
      <p className="text-base leading-[26px] text-ink-soft">
        Something went wrong while fetching it. Check your connection and try again. If it keeps happening,
        email us and we’ll look into it.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={reset}>Try Again</Button>
        <LinkButton href="/" variant="secondary">
          Back to the Home Page
        </LinkButton>
      </div>
    </Card>
  )
}
