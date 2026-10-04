import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { metaFor } from '@/lib/seo/pages'

export const metadata = metaFor('/')

// Replaced by the full landing page in Task 6.
export default function Home() {
  return (
    <Container className="py-16">
      <Heading level={1} size="display">
        Learn the skills employers are hiring for
      </Heading>
    </Container>
  )
}
