import { Check, Icon } from '@/components/ui/icon'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Section } from '@/components/ui/section'

export function Outcomes({ outcomes }: { outcomes: string[] }) {
  return (
    <Section labelledBy="outcomes-title">
      <Container className="flex flex-col gap-8 ph:gap-12">
        <Heading level={2} id="outcomes-title">
          By the end, <span className="brand-gradient-text">you’ll be able to</span>
        </Heading>
        <ul className="grid gap-4 ph:gap-6 tab:grid-cols-2 wide:grid-cols-4">
          {outcomes.map((o) => (
            <li key={o} className="flex gap-4 rounded-3xl border border-line p-5 surface ph:p-6">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-fe text-white">
                <Icon as={Check} size={14} strokeWidth={3} />
              </span>
              <span className="text-[15px] leading-6 text-ink">{o}</span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
