import { serializeJsonLd } from '@/lib/seo/jsonld'

/** Structured data for search engines. The content is escaped by serializeJsonLd. */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />
}
