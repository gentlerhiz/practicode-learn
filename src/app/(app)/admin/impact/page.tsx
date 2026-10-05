import type { Metadata, Route } from 'next'
import { notFound } from 'next/navigation'
import { MetricCard } from '@/components/impact/metric-card'
import { buttonClasses, Card, Heading } from '@/components/ui'
import { loadImpact } from '@/lib/impact/load'
import { DEFINITIONS_URL, formatMetric, METRICS } from '@/lib/impact/metrics'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Impact',
  description: 'Measured impact figures for PractiCode Learn.',
  path: '/admin/impact',
  noindex: true,
})

const countryName = new Intl.DisplayNames(['en-GB'], { type: 'region' })
const dateTime = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeStyle: 'short', timeZone: 'UTC' })
const monthName = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })

export default async function ImpactPage() {
  const data = await loadImpact()
  if (!data) notFound()
  const { summary, countries, snapshots } = data

  return (
    <div className="flex max-w-5xl flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Heading level={1} size="lg">
            Impact
          </Heading>
          <p className="text-sm text-ink-muted">
            Measured live from the database
            {summary.measured_at ? ` at ${dateTime.format(new Date(summary.measured_at))} UTC` : ''}. Only
            measured numbers, never estimates.
          </p>
        </div>
        <a href={'/admin/impact/export' as Route} className={buttonClasses({ variant: 'secondary' })}>
          Download CSV
        </a>
      </div>

      <ul className="grid gap-4 ph:grid-cols-2 tab:grid-cols-3">
        {METRICS.map((m) => (
          <MetricCard
            key={m.key}
            label={m.label}
            value={formatMetric(summary[m.key], m.unit)}
            definition={m.definition}
            href={DEFINITIONS_URL}
          />
        ))}
      </ul>

      <section aria-labelledby="countries" className="flex flex-col gap-4">
        <Heading level={2} size="md" id="countries">
          Countries
        </Heading>
        {countries.length === 0 ? (
          <p className="text-sm text-ink-muted">No countries recorded yet.</p>
        ) : (
          <Card padding="none" className="overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="text-ink-muted">
                <tr className="border-b border-line">
                  <th scope="col" className="px-5 py-3 font-medium">
                    Country
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    Learners
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    Active (28 days)
                  </th>
                </tr>
              </thead>
              <tbody>
                {countries.map((c) => (
                  <tr key={c.country_code} className="border-b border-line-subtle last:border-0">
                    <th scope="row" className="px-5 py-3 font-normal text-ink">
                      {countryName.of(c.country_code) ?? c.country_code}
                    </th>
                    <td className="px-5 py-3 text-right text-ink">{c.learners.toLocaleString('en-GB')}</td>
                    <td className="px-5 py-3 text-right text-ink">
                      {c.active_learners_28d.toLocaleString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </section>

      <section aria-labelledby="snapshots" className="flex flex-col gap-4">
        <Heading level={2} size="md" id="snapshots">
          Monthly snapshots
        </Heading>
        <p className="text-sm text-ink-muted">
          Saved automatically on the 1st of each month. They hold no personal data, so they stay accurate
          after learners delete their accounts.
        </p>
        {snapshots.length === 0 ? (
          <p className="text-sm text-ink-muted">The first snapshot is saved on the 1st of next month.</p>
        ) : (
          <Card padding="none" className="overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="text-ink-muted">
                <tr className="border-b border-line">
                  <th scope="col" className="px-5 py-3 font-medium">
                    Month
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    Learners
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    Active (28 days)
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    Lessons completed
                  </th>
                </tr>
              </thead>
              <tbody>
                {snapshots.map((s) => (
                  <tr key={s.month} className="border-b border-line-subtle last:border-0">
                    <th scope="row" className="px-5 py-3 font-normal text-ink">
                      {monthName.format(new Date(s.month))}
                    </th>
                    <td className="px-5 py-3 text-right text-ink">
                      {formatMetric(s.metrics.registered_learners, '')}
                    </td>
                    <td className="px-5 py-3 text-right text-ink">
                      {formatMetric(s.metrics.active_learners_28d, '')}
                    </td>
                    <td className="px-5 py-3 text-right text-ink">
                      {formatMetric(s.metrics.lessons_completed, '')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </section>
    </div>
  )
}
