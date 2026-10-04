'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/link-button'

/** Shown when a page throws. Offers a retry and a way home, and never shows technical details. */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main id="main">
      <Container width="prose" className="flex flex-col items-center gap-6 py-20 text-center ph:py-28">
        <Heading level={1} size="lg">
          Something went wrong on our side
        </Heading>
        <p className="max-w-[520px] text-[17px] leading-7 text-ink-muted">
          Your progress is safe. Try again, and if it keeps happening, email practicodeacademy@gmail.com
          {error.digest ? ` with this code: ${error.digest}` : ''}.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={reset}>
            Try Again
          </Button>
          <LinkButton href="/" variant="secondary" size="lg">
            Go to the Home Page
          </LinkButton>
        </div>
      </Container>
    </main>
  )
}
