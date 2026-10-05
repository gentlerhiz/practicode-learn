import { Check, Icon } from '@/components/ui/icon'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { landing } from '@/content/landing'
import { LESSONS_OPEN } from '@/content/navigation'
import { SectionHeading } from './section-heading'

/** A real table, so screen readers announce the row and column for every cell. */
export function Comparison() {
  const { comparison } = landing
  const [what, usual, ours] = comparison.columns
  return (
    <Section labelledBy="compare-title">
      <Container className="flex flex-col gap-8 ph:gap-12">
        <SectionHeading
          id="compare-title"
          title={comparison.title}
          intro={comparison.intro}
          accentTone="ai"
        />
        <div className="overflow-hidden rounded-3xl border border-line">
          <table className="w-full border-collapse text-left text-[13px] ph:text-[15px]">
            <caption className="sr-only">PractiCode Learn compared with a typical video course</caption>
            <thead>
              <tr className="bg-sunken">
                <th scope="col" className="px-3 py-4 font-semibold text-ink ph:px-6">
                  {what}
                </th>
                <th scope="col" className="px-3 py-4 font-semibold text-ink ph:px-6">
                  {usual}
                </th>
                <th scope="col" className="px-3 py-4 font-semibold text-ink ph:px-6">
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className="flex gap-0.5">
                      {['bg-[#4d6bff]', 'bg-[#2fe6b0]', 'bg-[#f0407f]', 'bg-[#7b5cff]'].map((c) => (
                        <span key={c} className={`h-3.5 w-1.5 rounded-full ${c}`} />
                      ))}
                    </span>
                    {ours}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map(([label, theirs, mine]) => (
                <tr key={label} className="border-t border-line-subtle">
                  <th scope="row" className="px-3 py-4 font-semibold text-ink ph:px-6">
                    {label}
                  </th>
                  <td className="px-3 py-4 text-ink-muted ph:px-6">{theirs}</td>
                  <td className="px-3 py-4 text-ink ph:px-6">
                    <span className="flex items-start gap-2">
                      <Icon as={Check} size={16} className="mt-0.5 shrink-0 text-success" />
                      {mine}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!LESSONS_OPEN && (
          <p className="text-center text-sm text-ink-subtle">
            PractiCode Learn is in beta: this column describes Module 1, which opens soon.
          </p>
        )}
      </Container>
    </Section>
  )
}
