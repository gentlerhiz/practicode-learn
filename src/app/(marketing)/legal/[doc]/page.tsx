import type { Metadata, Route } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { JsonLd } from '@/components/seo/json-ld'
import { legalDocs, legalSlugs, type LegalSlug } from '@/content/legal'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { metaFor } from '@/lib/seo/pages'
import { cn } from '@/lib/cn'

export const dynamicParams = false

export function generateStaticParams() {
  return legalSlugs.map((doc) => ({ doc }))
}

const isLegalSlug = (value: string): value is LegalSlug => (legalSlugs as string[]).includes(value)

export async function generateMetadata({ params }: PageProps<'/legal/[doc]'>): Promise<Metadata> {
  const { doc } = await params
  return isLegalSlug(doc) ? metaFor(`/legal/${doc}` as Route) : {}
}

export default async function LegalPage({ params }: PageProps<'/legal/[doc]'>) {
  const { doc } = await params
  if (!isLegalSlug(doc)) notFound()
  const page = legalDocs[doc]

  return (
    <Container
      width="app"
      className="grid gap-10 pt-10 pb-20 ph:pt-16 tab:grid-cols-[220px_minmax(0,1fr)] tab:gap-16"
    >
      <nav aria-label="Legal documents" className="tab:sticky tab:top-8 tab:self-start">
        <ul className="flex flex-wrap gap-2 tab:flex-col">
          {legalSlugs.map((slug) => (
            <li key={slug}>
              <Link
                href={`/legal/${slug}` as Route}
                aria-current={slug === doc ? 'page' : undefined}
                className={cn(
                  'inline-flex h-10 items-center rounded-full px-4 text-sm font-medium tab:flex tab:rounded-xl',
                  slug === doc
                    ? 'bg-primary text-on-primary'
                    : 'border border-line text-ink-muted hover:text-ink',
                )}
              >
                {legalDocs[slug].title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <article className="flex max-w-[720px] flex-col gap-8">
        <header className="flex flex-col gap-3">
          <Heading level={1} size="lg">
            {page.title}
          </Heading>
          <p className="text-sm text-ink-subtle">
            Last updated {page.updated}. Plain language first. Draft for legal review.
          </p>
        </header>

        <section aria-labelledby="short-version" className="rounded-3xl border border-line p-6 surface">
          <h2 id="short-version" className="mb-3 font-display text-xl font-bold text-ink">
            The short version
          </h2>
          <ul className="flex list-disc flex-col gap-2 pl-5 text-[15px] leading-6 text-ink-soft marker:text-fe-text">
            {page.summary.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        {page.sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-3">
            <h2 className="font-display text-[22px] leading-8 font-bold text-ink">{section.heading}</h2>
            {section.body.map((p) => (
              <p key={p} className="text-[16px] leading-[27px] text-ink-soft">
                {p}
              </p>
            ))}
          </section>
        ))}

        <p className="border-t border-line-subtle pt-6 text-sm text-ink-subtle">
          Questions? Email{' '}
          <a href="mailto:practicodeacademy@gmail.com" className="text-fe-text underline underline-offset-2">
            practicodeacademy@gmail.com
          </a>
          . Practicode Consult Limited, 7B Oba Olagbegi, Old Bodija, Ibadan, Nigeria.
        </p>
      </article>
      <JsonLd data={breadcrumbLd([{ name: page.title, path: `/legal/${doc}` }])} />
    </Container>
  )
}
