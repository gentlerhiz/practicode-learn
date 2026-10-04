import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Icon, Plus } from '@/components/ui/icon'
import { Section } from '@/components/ui/section'
import { faq } from '@/content/faq'
import { landing } from '@/content/landing'

/** Questions as native <details>, so they open with no JavaScript and work with every screen reader. */
export function Faq() {
  return (
    <Section labelledBy="faq-title">
      <Container width="prose" className="flex flex-col gap-8 ph:gap-12">
        <Heading level={2} id="faq-title" className="text-center">
          {landing.faqTitle}
        </Heading>
        <div className="flex flex-col gap-3">
          {faq.map((item, i) => (
            <details
              key={item.q}
              open={i === 0}
              className="group rounded-[20px] border border-line bg-row px-5 py-1 open:pb-5 ph:px-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {item.q}
                <Icon
                  as={Plus}
                  size={18}
                  className="shrink-0 text-ink-muted transition-transform group-open:rotate-45"
                />
              </summary>
              <p className="text-[15px] leading-6 text-ink-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  )
}
