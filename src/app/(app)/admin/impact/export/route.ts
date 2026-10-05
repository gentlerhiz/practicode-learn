import { loadImpact } from '@/lib/impact/load'
import { METRICS } from '@/lib/impact/metrics'

const cell = (value: unknown) => {
  const text = value === null || value === undefined ? '' : String(value)
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}
const row = (...values: unknown[]) => values.map(cell).join(',')

/** The admin page's figures as CSV, for funder reports and evidence packs. Admins only. */
export async function GET() {
  const data = await loadImpact()
  if (!data) return new Response('Not found', { status: 404 })
  const { summary, countries, snapshots } = data
  const lines = [
    row('figure', 'value', 'definition'),
    ...METRICS.map((m) => row(m.label, summary[m.key], m.definition)),
    row('measured at (UTC)', summary.measured_at, ''),
    '',
    row('country', 'learners', 'active learners (28 days)'),
    ...countries.map((c) => row(c.country_code, c.learners, c.active_learners_28d)),
    '',
    row('month', ...METRICS.map((m) => m.label)),
    ...snapshots.map((s) => row(s.month, ...METRICS.map((m) => s.metrics[m.key]))),
  ]
  const date = new Date().toISOString().slice(0, 10)
  return new Response(`${lines.join('\n')}\n`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="practicode-learn-impact-${date}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
