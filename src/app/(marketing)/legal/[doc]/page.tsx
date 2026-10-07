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
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-72 left-1/2 h-[640px] w-[1200px] -translate-x-1/2 [opacity:var(--pc-glow-opacity)]"
        style={{ background: 'radial-gradient(closest-side at 35% 45%, rgba(77,107,255,0.24), rgba(0,0,0,0) 72%)' }}
      />
      <Container width="app" className="relative flex flex-col gap-12 pt-10 pb-20 ph:gap-20 ph:pt-14">
        <header className="flex flex-col gap-3">
          <Heading level={1} size="lg" className="[text-wrap:wrap] ph:text-[44px] ph:leading-[50px]">
            Privacy, terms and accessibility
          </Heading>
          <p className="flex flex-wrap items-center gap-3 text-[15px] text-ink-muted">
            Plain language first. Last updated {page.updated}.
            <span className="inline-flex items-center rounded-full bg-[rgba(255,138,61,0.16)] px-2.5 py-1 text-xs font-semibold text-badge-text">
              Draft for legal review
            </span>
          </p>
        </header>

        <div className="grid gap-10 tab:grid-cols-[220px_minmax(0,1fr)] tab:gap-12">
          <nav aria-label="Legal documents" className="tab:sticky tab:top-8 tab:self-start">
            <ul className="flex flex-wrap gap-1 tab:flex-col">
              {legalSlugs.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/legal/${slug}` as Route}
                    aria-current={slug === doc ? 'page' : undefined}
                    className={cn(
                      'flex h-10 items-center rounded-xl px-3 text-sm',
                      slug === doc ? 'bg-control font-semibold text-ink' : 'text-ink-muted hover:bg-hover hover:text-ink',
                    )}
                  >
                    {legalDocs[slug].title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <article className="flex max-w-[720px] flex-col gap-7">
            <h2 className="font-display text-[26px] leading-8 font-extrabold tracking-[-0.02em] text-ink ph:text-[30px] ph:leading-9">{page.title}</h2>

            <section aria-labelledby="short-version" className="flex flex-col gap-3">
              <h3 id="short-version" className="font-display text-lg font-bold text-ink">
                The short version
              </h3>
              <ul className="flex list-disc flex-col gap-2 pl-5 text-[15px] leading-6 text-ink-soft marker:text-ink">
                {page.summary.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>

            {page.sections.map((section) => (
              <section key={section.heading} className="flex flex-col gap-3">
                <h3 className="font-display text-lg font-bold text-ink">{section.heading}</h3>
                {section.body.map((p) => (
                  <p key={p} className="text-[15px] leading-[26px] text-ink-soft">
                    {p}
                  </p>
                ))}
              </section>
            ))}

            <p className="border-t border-line-subtle pt-6 text-[13px] text-ink-subtle">
              Questions? Email{' '}
              <a href="mailto:practicodeacademy@gmail.com" className="text-ink underline underline-offset-2">
                practicodeacademy@gmail.com
              </a>
              . Practicode Consult Limited, 7B Oba Olagbegi, Old Bodija, Ibadan, Nigeria.
            </p>
          </article>
        </div>
      </Container>
      <JsonLd data={breadcrumbLd([{ name: page.title, path: `/legal/${doc}` }])} />
    </div>
  )
}
