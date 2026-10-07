import type { Metadata, Route } from 'next'
import { MentorForm } from '@/components/marketing/mentor-form'
import { SectionHeading } from '@/components/marketing/section-heading'
import { Container } from '@/components/ui/container'
import { Glyph, type GlyphName } from '@/components/ui/glyph'
import { Section } from '@/components/ui/section'
import { buttonClasses } from '@/components/ui/button'
import { metaFor } from '@/lib/seo/pages'

export const metadata: Metadata = metaFor('/mentors' as Route)

const TRACKS = [
  { name: 'Front-End Web Development', className: 'bg-[rgba(77,107,255,0.16)] text-fe-text' },
  { name: 'Data Analysis', className: 'bg-[rgba(47,230,176,0.14)] text-da-text' },
  { name: 'UI/UX Product Design', className: 'bg-[rgba(240,64,127,0.14)] text-ux-text' },
  { name: 'AI & Machine Learning', className: 'bg-[rgba(123,92,255,0.16)] text-ai-text' },
]

const ADDS: { icon: GlyphName; title: string; body: string }[] = [
  { icon: 'monitor', title: 'Weekly live classes', body: 'A real instructor teaches, answers questions and works through problems with the class.' },
  { icon: 'check', title: 'Your projects, reviewed', body: 'An instructor reads your code or designs and tells you what to improve, not just whether it passes.' },
  { icon: 'people', title: 'People to learn with', body: 'A small group starting at the same time, so you keep each other going.' },
]

/** PrismMentor. */
export default function MentorsPage() {
  return (
    <>
      <section className="relative pt-10 pb-12 ph:pt-16 ph:pb-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-[300px] left-1/2 h-[820px] w-[1300px] -translate-x-1/2 opacity-(--pc-glow-opacity)"
          style={{
            background:
              'radial-gradient(closest-side at 30% 45%, rgba(240,64,127,0.24), rgba(240,64,127,0) 72%), radial-gradient(closest-side at 70% 50%, rgba(123,92,255,0.26), rgba(123,92,255,0) 72%)',
          }}
        />
        <Container className="relative grid grid-cols-1 items-start gap-10 tab:grid-cols-[minmax(0,1fr)_minmax(0,520px)] tab:gap-16">
          <div className="flex flex-col gap-6">
            <p className="text-[15px] font-semibold text-ux-text">Mentor plan · run by PractiCode Academy</p>
            <h1 className="font-display text-[44px] leading-[50px] font-extrabold tracking-[-0.04em] text-ink ph:text-[64px] ph:leading-[68px]">
              Learn with a teacher and a class.
            </h1>
            <p className="text-[17px] leading-7 text-ink-muted">
              Everything in Pro, plus a 3-month cohort with weekly live classes, an instructor who reviews your projects, and
              classmates going through it with you.
            </p>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-display text-[44px] leading-[48px] font-extrabold tracking-[-0.03em] text-ink">₦80,000</span>
              <span className="text-[15px] text-ink-muted">per course, 3 months, online or in person</span>
            </div>
            <ul className="flex flex-wrap gap-2">
              {TRACKS.map((t) => (
                <li key={t.name} className={`inline-flex h-8 items-center rounded-full px-3 text-[13px] font-medium ${t.className}`}>
                  {t.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="surface flex flex-col gap-6 rounded-[28px] border border-line p-6 ph:p-8">
            <MentorForm />
          </div>
        </Container>
      </section>

      <Section labelledBy="adds-title">
        <Container className="flex flex-col gap-8 ph:gap-12">
          <SectionHeading id="adds-title" title="What the cohort adds" intro={{ plain: 'Pro gives you the lessons and the checks. A cohort gives you people.' }} />
          <div className="grid grid-cols-1 gap-4 ph:gap-6 tab:grid-cols-3">
            {ADDS.map((a) => (
              <div key={a.title} className="surface flex flex-col gap-3 rounded-3xl border border-line p-6">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-control text-ink-soft">
                  <Glyph name={a.icon} size={20} />
                </span>
                <h3 className="font-display text-xl font-bold text-ink">{a.title}</h3>
                <p className="text-sm leading-[22px] text-ink-muted">{a.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section labelledBy="talk-title" className="pb-16 ph:pb-28">
        <Container>
          <div className="surface flex flex-wrap items-center justify-between gap-6 rounded-[28px] border border-line p-6 ph:p-8">
            <div className="flex max-w-[720px] flex-col gap-2">
              <h2 id="talk-title" className="font-display text-[26px] font-extrabold tracking-[-0.02em] text-ink">
                Rather talk to someone?
              </h2>
              <p className="text-[15px] leading-6 text-ink-muted">
                Call or WhatsApp 0903 057 8667 or +234 707 277 8657, or visit us at 7B Oba Olagbegi, Old Bodija, Ibadan.
              </p>
            </div>
            <a href="mailto:practicodeacademy@gmail.com" className={buttonClasses({ variant: 'secondary' }, 'h-12 bg-transparent px-6 font-medium')}>
              Email PractiCode Academy
            </a>
          </div>
        </Container>
      </Section>
    </>
  )
}
