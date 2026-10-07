import Image from 'next/image'
import { ArrowRight, Check, Icon, Mail, Sparkles } from '@/components/ui/icon'
import { buttonClasses } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/link-button'
import { Pill } from '@/components/ui/pill'
import { Section } from '@/components/ui/section'
import { JsonLd } from '@/components/seo/json-ld'
import { about } from '@/content/about'
import { primaryCta } from '@/content/navigation'
import { BetaNotice } from '@/components/marketing/beta-notice'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { metaFor } from '@/lib/seo/pages'
import { absoluteUrl } from '@/lib/site'
import {
  Accessibility,
  Award,
  Briefcase,
  Download,
  FolderCheck,
  GraduationCap,
  Laptop,
  Lock,
  MessageSquare,
  Pointer,
  Smile,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import founder from '@/assets/images/founder.webp'

export const metadata = metaFor('/about')

function Eyebrow({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <p id={id} className="text-[15px] font-semibold text-ai-text">
      {children}
    </p>
  )
}

const teachIcons = [Pointer, Award, FolderCheck, Sparkles]
// The canvas gives each teaching card its own track colour.
const teachTones = [
  'bg-[rgba(77,107,255,0.16)] text-fe-text',
  'bg-[rgba(47,230,176,0.14)] text-da-text',
  'bg-[rgba(240,64,127,0.14)] text-ux-text',
  'bg-[rgba(123,92,255,0.16)] text-ai-text',
]
const commitIcons = [Lock, Smile, Accessibility, MessageSquare]
const factIcons = [Briefcase, Laptop, GraduationCap]

function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
      <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1a3.8 3.8 0 0 1 3.4-1.9c3.6 0 4.3 2.4 4.3 5.5v6.3ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2Zm1.8 13.1H3.5V9h3.6v11.5Z" />
    </svg>
  )
}

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
    </svg>
  )
}

export default function AboutPage() {
  const { hero, story, teach, access, commitments, leadership, work } = about
  return (
    <>
      <Section labelledBy="about-title" className="overflow-hidden pt-10 ph:pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-64 left-1/2 h-[700px] w-[1200px] -translate-x-1/2 [opacity:var(--pc-glow-opacity)]"
          style={{
            background:
              'radial-gradient(closest-side at 35% 45%, rgba(77,107,255,0.28), rgba(77,107,255,0) 70%), radial-gradient(closest-side at 65% 50%, rgba(123,92,255,0.24), rgba(123,92,255,0) 70%)',
          }}
        />
        <Container className="relative grid gap-10 tab:grid-cols-[minmax(0,1fr)_minmax(0,480px)] tab:items-center tab:gap-16">
          <div className="flex flex-col gap-6">
            <BetaNotice className="self-start" />
            <Eyebrow>{hero.eyebrow}</Eyebrow>
            <Heading level={1} size="xl" id="about-title" className="[text-wrap:wrap] tab:text-[64px] tab:leading-[68px]">
              {hero.title}
            </Heading>
            <p className="max-w-[640px] text-[17px] leading-7 text-ink-muted ph:text-lg ph:leading-[30px]">
              {hero.intro}
            </p>
            <div className="flex flex-wrap gap-3">
              <LinkButton href={primaryCta.href} size="lg">
                {primaryCta.label}
                <Icon as={ArrowRight} size={18} />
              </LinkButton>
              <a href="#work" className={buttonClasses({ variant: 'secondary', size: 'lg' }, 'font-medium')}>
                Work With Us
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-6 rounded-[32px] bg-[linear-gradient(150deg,#3D5AF5_0%,#6E4CF5_55%)] p-6 text-white ph:p-10">
            <p className="self-start rounded-full bg-[rgba(7,6,13,0.28)] px-3 py-1 text-[13px] font-semibold">
              {hero.mission.label}
            </p>
            <p className="font-display text-[26px] leading-8 font-extrabold tracking-[-0.025em] ph:text-[32px] ph:leading-10">
              {hero.mission.text}
            </p>
            <span aria-hidden="true" className="block h-px w-full bg-white/25" />
            <p className="text-[15px] leading-6">{hero.mission.note}</p>
          </div>
        </Container>
      </Section>

      <Section labelledBy="story-title">
        <Container className="grid gap-10 tab:grid-cols-2 tab:gap-16">
          <div className="flex flex-col gap-5">
            <Eyebrow>{story.eyebrow}</Eyebrow>
            <Heading level={2} size="lg" id="story-title">
              {story.title}
            </Heading>
            {story.paragraphs.map((p) => (
              <p key={p} className="text-[17px] leading-7 text-ink-soft">
                {p}
              </p>
            ))}
          </div>
          <figure className="flex flex-col justify-center gap-6 self-center rounded-[32px] border border-line p-6 surface ph:p-10">
            <svg viewBox="0 0 48 36" className="h-9 w-12 fill-current text-ai-text" aria-hidden="true">
              <path d="M0 36V20C0 8.6 6 2 18 0l2 5c-6.6 1.8-9.8 5.6-10 11h9v20zm27 0V20C27 8.6 33 2 45 0l2 5c-6.6 1.8-9.8 5.6-10 11h9v20z" />
            </svg>
            <blockquote className="font-display text-[22px] leading-8 font-bold tracking-[-0.02em] text-ink ph:text-[26px] ph:leading-9">
              <p>{story.quote}</p>
            </blockquote>
            <figcaption className="text-[15px] font-medium text-ink-muted">{story.quoteBy}</figcaption>
          </figure>
        </Container>
      </Section>

      <Section labelledBy="teach-title">
        <Container className="flex flex-col gap-8 ph:gap-12">
          <div className="flex flex-col gap-3">
            <Eyebrow>{teach.eyebrow}</Eyebrow>
            <Heading level={2} size="lg" id="teach-title" className="[text-wrap:wrap]">
              {teach.title}
            </Heading>
          </div>
          <ul className="grid gap-4 ph:gap-6 tab:grid-cols-2 wide:grid-cols-4">
            {teach.items.map((item, i) => (
              <li key={item.title} className="flex flex-col gap-4 rounded-3xl border border-line p-6 surface">
                <span className={cn('flex size-12 items-center justify-center rounded-2xl', teachTones[i])}>
                  <Icon as={teachIcons[i]!} size={22} />
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-[21px] leading-7 font-bold text-ink">{item.title}</h3>
                  {'soon' in item && <Pill tone="soon">Coming soon</Pill>}
                </div>
                <p className="text-[15px] leading-6 text-ink-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section labelledBy="access-title">
        <Container className="grid items-center gap-10 tab:grid-cols-2 tab:gap-16">
          <div className="flex flex-col gap-6">
            <Eyebrow>{access.eyebrow}</Eyebrow>
            <Heading level={2} size="lg" id="access-title">
              {access.title}
            </Heading>
            <ul className="flex flex-col gap-4">
              {access.items.map((item) => (
                <li key={item} className="flex gap-3 text-[16px] leading-[26px] text-ink-soft">
                  <Icon as={Check} size={18} className="mt-1 shrink-0 text-da-text" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6 rounded-[32px] border border-line p-6 surface ph:p-8">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-ink-muted">Pay in your currency</p>
              <ul className="flex flex-wrap gap-2">
                {access.currencies.map((c) => (
                  <li key={c} className="inline-flex h-10 items-center rounded-full border border-line-control px-4 text-sm font-medium text-ink">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-ink-muted">Pay your way</p>
                <Pill tone="soon">When Pro opens</Pill>
              </div>
              <ul className="flex flex-wrap gap-2">
                {access.methods.map((m) => (
                  <li key={m} className="inline-flex h-10 items-center rounded-full border border-line-control px-4 text-sm font-medium text-ink">
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-4 rounded-[20px] border border-line bg-sunken p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-[rgba(47,230,176,0.16)] text-da-text">
                <Icon as={Download} size={20} />
              </span>
              <div>
                <p className="text-[15px] font-semibold text-ink">Lessons you open, saved for offline</p>
                <p className="mt-0.5 text-[13px] text-ink-muted">Keeps working on the bus, at work, or when the network drops</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section labelledBy="commit-title">
        <Container className="flex flex-col gap-8 ph:gap-12">
          <div className="flex flex-col gap-3">
            <Eyebrow>{commitments.eyebrow}</Eyebrow>
            <Heading level={2} size="lg" id="commit-title">
              {commitments.title}
            </Heading>
          </div>
          <ul className="grid gap-4 ph:gap-6 tab:grid-cols-2">
            {commitments.items.map((item, i) => (
              <li key={item.title} className="flex items-start gap-5 rounded-3xl border border-line p-6 surface">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-control text-ink-soft">
                  <Icon as={commitIcons[i]!} size={20} />
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-[21px] leading-7 font-bold text-ink">{item.title}</h3>
                  <p className="text-[15px] leading-6 text-ink-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section labelledBy="lead-title">
        <Container className="flex flex-col gap-8 ph:gap-12">
          <div className="flex flex-col gap-3">
            <Eyebrow>{leadership.eyebrow}</Eyebrow>
            <Heading level={2} size="lg" id="lead-title">
              {leadership.title}
            </Heading>
          </div>
          <article className="grid gap-8 rounded-[32px] border border-line p-6 surface ph:p-10 tab:grid-cols-[240px_minmax(0,1fr)] tab:gap-12">
            <div className="flex flex-col gap-4">
              <Image
                src={founder}
                alt={`Portrait of ${leadership.name}`}
                sizes="(min-width: 960px) 240px, 60vw"
                placeholder="blur"
                className="aspect-[5/6] w-full max-w-[240px] rounded-[28px] object-cover"
              />
              <div className="flex flex-wrap gap-2">
                {leadership.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-line-control bg-row/40 px-4 text-sm font-medium text-ink hover:bg-row"
                  >
                    {link.label === 'LinkedIn' ? <LinkedInMark /> : <GitHubMark />}
                    {link.label}
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="flex min-w-0 flex-col gap-5">
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-[28px] leading-9 font-extrabold tracking-[-0.03em] text-ink ph:text-[32px] ph:leading-[38px]">
                  {leadership.name}
                </h3>
                <p className="text-base font-semibold text-ai-text">{leadership.role}</p>
              </div>
              <p className="text-[17px] leading-7 text-ink-soft">{leadership.bio}</p>
              <span aria-hidden="true" className="block h-px w-full bg-line-subtle" />
              <ul className="flex flex-col gap-3 text-[15px] leading-6 text-ink-muted">
                {leadership.facts.map((fact, i) => (
                  <li key={fact} className="flex items-start gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-row text-ink-soft">
                      <Icon as={factIcons[i]!} size={16} />
                    </span>
                    <span className="pt-1">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </Container>
      </Section>

      <Section id="work" labelledBy="work-title" className="pb-16 ph:pb-28">
        <Container className="flex flex-col gap-6">
          <h2 id="work-title" className="sr-only">
            Learn or work with us
          </h2>
          <div className="grid gap-4 ph:gap-6 tab:grid-cols-2">
            <div className="flex flex-col gap-5 rounded-[32px] border border-line p-6 surface ph:p-10">
              <h3 className="font-display text-[28px] leading-9 font-extrabold tracking-[-0.03em] text-ink ph:text-4xl ph:leading-[42px]">
                {work.learn.title}
              </h3>
              <p className="text-base leading-[26px] text-ink-muted">{work.learn.body}</p>
              <div className="mt-auto flex flex-wrap gap-3 pt-2">
                <LinkButton href={primaryCta.href} className="h-12">
                  {primaryCta.label}
                </LinkButton>
                <LinkButton href={work.learn.cohorts.href} variant="secondary" className="h-12 font-medium">
                  {work.learn.cohorts.label}
                </LinkButton>
              </div>
            </div>
            <div className="flex flex-col gap-5 rounded-[32px] border border-line p-6 text-white [background:var(--pc-card-work)] ph:p-10">
              <h3 className="font-display text-[28px] leading-9 font-extrabold tracking-[-0.03em] ph:text-4xl ph:leading-[42px]">
                {work.partner.title}
              </h3>
              <p className="text-base leading-[26px] text-white/85">{work.partner.body}</p>
              <div className="mt-auto pt-2">
                <a
                  href={work.partner.email.href}
                  className={buttonClasses({}, 'h-12 bg-white text-[#006B47] max-ph:w-full')}
                >
                  <Icon as={Mail} size={16} />
                  {work.partner.email.label}
                </a>
              </div>
              <p className="text-[13px] text-white/75">{work.address}</p>
            </div>
          </div>
        </Container>
      </Section>

      <JsonLd
        data={[
          breadcrumbLd([{ name: 'About', path: '/about' }]),
          {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: leadership.name,
            jobTitle: leadership.role,
            image: absoluteUrl(founder.src),
            alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Ibadan' },
            worksFor: { '@type': 'Organization', name: 'PractiCode Academy', url: 'https://practicode.tech' },
            sameAs: leadership.links.map((l) => l.href),
          },
        ]}
      />
    </>
  )
}
