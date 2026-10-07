import type { Metadata, Route } from 'next'
import Link from 'next/link'
import { PlanCards } from '@/components/marketing/plan-cards'
import { SectionHeading } from '@/components/marketing/section-heading'
import { Container } from '@/components/ui/container'
import { Glyph, type GlyphName } from '@/components/ui/glyph'
import { Section } from '@/components/ui/section'
import { metaFor } from '@/lib/seo/pages'

export const metadata: Metadata = metaFor('/pricing' as Route)

type Cell = string | boolean
const ROWS: [string, Cell, Cell, Cell][] = [
  ['Lessons', 'Module 1 of every track', 'Every module', 'Every module'],
  ['Daily review', true, true, true],
  ['AI tutor', '5 questions a day', '50 questions a day', '50 questions a day'],
  ['Projects with automatic checks', 'Module 1 project', 'All projects', 'All projects'],
  ['Verified certificates', false, true, true],
  ['Save modules for offline', 'Module 1', 'All modules', 'All modules'],
  ['Exam prep (for example PL-300)', false, true, true],
  ['Weekly live classes', false, false, true],
  ['An instructor reviews your projects', false, false, true],
  ['Community', true, true, true],
]

const PAY: { icon: GlyphName; title: string; body: string }[] = [
  { icon: 'card', title: 'Nigeria', body: 'Card, bank transfer or USSD. USSD works on any phone, even without data.' },
  { icon: 'wallet', title: 'Ghana and Kenya', body: 'Card or mobile money, in cedis or shillings.' },
  { icon: 'globe', title: 'Everywhere else', body: 'Card, in pounds or US dollars.' },
]

const FAQ = [
  ['Do I need a card to start?', 'No. The free plan never needs one, and neither does the 7-day Pro trial. You only add a payment method if you decide to keep Pro.'],
  ['What happens when my trial ends?', 'If you haven’t chosen a plan, you go back to Free. Everything you finished stays yours, including your progress and projects.'],
  ['Can I switch between monthly and yearly?', 'Yes, any time in Settings. If you switch to yearly, we take off whatever is left of your current month.'],
  ['How do I cancel?', 'One click in Settings. No phone calls, no forms. You keep Pro until the end of the period you paid for.'],
]

function CellView({ value }: { value: Cell }) {
  if (value === true)
    return (
      <span className="inline-flex items-center gap-2 text-success">
        <Glyph name="check" size={18} strokeWidth={2.2} />
        <span className="sr-only">Included</span>
      </span>
    )
  if (value === false)
    return (
      <>
        <span aria-hidden="true" className="text-ink-subtle">
          —
        </span>
        <span className="sr-only">Not included</span>
      </>
    )
  return <>{value}</>
}

/** PrismPricing. The planned prices; checkout opens with the full track. */
export default function PricingPage() {
  return (
    <>
      <section className="relative pt-10 pb-12 ph:pt-16 ph:pb-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-[300px] left-1/2 h-[820px] w-[1300px] -translate-x-1/2 opacity-(--pc-glow-opacity)"
          style={{
            background:
              'radial-gradient(closest-side at 35% 45%, rgba(77,107,255,0.30), rgba(77,107,255,0) 72%), radial-gradient(closest-side at 68% 50%, rgba(123,92,255,0.26), rgba(123,92,255,0) 72%)',
          }}
        />
        <Container className="relative flex flex-col gap-8 ph:gap-12">
          <div className="mx-auto flex max-w-[760px] flex-col items-center gap-4 text-center">
            <h1 className="font-display text-[44px] leading-[50px] font-extrabold tracking-[-0.04em] text-ink ph:text-[64px] ph:leading-[68px]">
              Start free. Go Pro when you’re ready.
            </h1>
            <p className="text-[17px] leading-7 text-ink-muted">
              Module 1 of every track is free for good. Pro unlocks the rest, with a 7-day free trial and no card needed to start it.
            </p>
          </div>
          <PlanCards variant="pricing" />
        </Container>
      </section>

      <Section labelledBy="compare-title">
        <Container className="flex flex-col gap-8 ph:gap-12">
          <SectionHeading id="compare-title" title="Compare the plans" intro={{ plain: 'Everything in one place, so there are no surprises later.' }} />
          <div className="overflow-x-auto rounded-3xl border border-line bg-wash">
            <table className="w-full min-w-[640px] border-collapse text-left text-[13px] ph:text-[15px]">
              <caption className="sr-only">What each plan includes</caption>
              <thead>
                <tr>
                  {['What you get', 'Free', 'Pro', 'Mentor'].map((h) => (
                    <th key={h} scope="col" className="px-3 py-4 font-medium text-ink ph:px-5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([label, ...cells]) => (
                  <tr key={label} className="border-t border-line-subtle">
                    <th scope="row" className="px-3 py-4 font-medium text-ink ph:px-5">
                      {label}
                    </th>
                    {cells.map((c, i) => (
                      <td key={i} className="px-3 py-4 text-ink-soft ph:px-5">
                        <CellView value={c} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      <Section labelledBy="pay-title">
        <Container className="flex flex-col gap-8 ph:gap-12">
          <SectionHeading id="pay-title" title="Pay the way you already pay" intro={{ plain: 'Prices are set for each country, and you pay in your own currency.' }} />
          <div className="grid grid-cols-1 gap-4 ph:gap-6 tab:grid-cols-3">
            {PAY.map((p) => (
              <div key={p.title} className="surface flex flex-col gap-3 rounded-3xl border border-line p-6">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-control text-ink-soft">
                  <Glyph name={p.icon} size={24} />
                </span>
                <h3 className="font-display text-xl font-bold text-ink">{p.title}</h3>
                <p className="text-sm leading-[22px] text-ink-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section labelledBy="billing-title">
        <Container width="prose" className="flex flex-col gap-8 ph:gap-12">
          <h2
            id="billing-title"
            className="text-center font-display text-[34px] leading-10 font-extrabold tracking-[-0.035em] text-ink ph:text-[52px] ph:leading-[56px]"
          >
            Billing questions
          </h2>
          <div className="flex flex-col gap-3">
            {FAQ.map(([q, a], i) => (
              <details key={q} open={i === 0} className="group rounded-[20px] border border-line bg-row px-5 py-1 open:pb-5 ph:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-medium text-ink transition-colors hover:text-ink-soft [&::-webkit-details-marker]:hidden">
                  {q}
                  <span aria-hidden="true" className="text-xl text-ink-muted transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="text-[15px] leading-[25px] text-ink-muted">{a}</p>
              </details>
            ))}
          </div>
          <p className="text-center text-sm text-ink-subtle">Payments open with the full track. Until then, everything that’s open is free.</p>
        </Container>
      </Section>

      <Section labelledBy="scholarship-title" className="pb-16 ph:pb-28">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-8 rounded-[32px] bg-[linear-gradient(120deg,#4a30d8_0%,#8a2fa8_55%,#c42a6c_100%)] px-6 py-10 text-white ph:p-12">
            <div className="flex max-w-[640px] flex-col gap-3">
              <h2 id="scholarship-title" className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.03em] ph:text-[40px] ph:leading-[44px]">
                Money tight right now?
              </h2>
              <p className="text-[17px] leading-7 text-[#f6edff]">Apply for a scholarship. If you qualify, Pro is free. It takes about five minutes.</p>
            </div>
            <Link
              href={'/scholarship' as Route}
              className="press inline-flex h-14 items-center rounded-full bg-white px-8 text-base font-semibold text-[#07060d] hover:bg-white/90"
            >
              Apply for a Scholarship
            </Link>
          </div>
        </Container>
      </Section>
    </>
  )
}
