import { Check } from '@/components/ui/icon'
import { Icon } from '@/components/ui/icon'
import { Container } from '@/components/ui/container'
import { Pill } from '@/components/ui/pill'
import { Section } from '@/components/ui/section'
import { landing } from '@/content/landing'
import { SectionHeading } from './section-heading'

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-[200px] flex-col items-center justify-center gap-4 overflow-hidden rounded-[18px] border border-line-subtle bg-sunken px-5"
    >
      {children}
    </div>
  )
}

function LabVisual() {
  return (
    <Frame>
      <div className="flex h-[72px] w-full items-center justify-between rounded-xl border-[1.5px] border-dashed border-line-control px-3">
        <span className="size-11 rounded-[10px] bg-[#4d6bff]" />
        <span className="size-11 rounded-[10px] bg-[#6f86ff]" />
        <span className="size-11 rounded-[10px] bg-[#a9b7ff]" />
      </div>
      <div className="flex gap-1.5 font-mono text-[11px]">
        <span className="rounded-lg border border-line px-2 py-1 text-ink-muted">start</span>
        <span className="rounded-lg border border-line px-2 py-1 text-ink-muted">center</span>
        <span className="rounded-lg border border-[#4d6bff] bg-[#4d6bff]/20 px-2 py-1 text-ink">
          space-between
        </span>
      </div>
    </Frame>
  )
}

function ChecksVisual() {
  const checks = [
    ['Links sit in one row', true],
    ['Logo stays on the left', true],
    ['Links spread evenly', true],
    ['Menu wraps on small phones', false],
  ] as const
  return (
    <Frame>
      <div className="flex w-full flex-col gap-2.5 text-[13px]">
        <div className="flex justify-between text-xs">
          <span className="text-fe-text">Navigation bar project</span>
          <span className="text-ink-muted">3 of 4 checks</span>
        </div>
        {checks.map(([label, done]) => (
          <div key={label} className="flex items-center gap-2.5">
            <span
              className={
                done
                  ? 'flex size-[18px] items-center justify-center rounded-[5px] bg-fe text-white'
                  : 'size-[18px] rounded-[5px] border border-line-control'
              }
            >
              {done && <Icon as={Check} size={12} strokeWidth={3} />}
            </span>
            <span className={done ? 'text-ink' : 'text-ink-muted'}>{label}</span>
          </div>
        ))}
      </div>
    </Frame>
  )
}

function PhoneVisual() {
  return (
    <Frame>
      <div className="absolute top-6 flex h-[220px] w-[170px] flex-col gap-2 rounded-[22px] border border-line bg-bg p-3">
        <div className="mx-auto h-1 w-10 rounded-full bg-line" />
        <div className="rounded-lg bg-sunken p-2 font-mono text-[10px] leading-4 text-ink-soft">
          <div>
            <span className="text-fe-text">&lt;h1&gt;</span>Hi!
            <span className="text-fe-text">&lt;/h1&gt;</span>
          </div>
          <div>
            <span className="text-fe-text">&lt;p&gt;</span>Made on a phone
            <span className="text-fe-text">&lt;/p&gt;</span>
          </div>
        </div>
        <div className="flex justify-between gap-1 font-mono text-[11px] text-ink">
          {['<', '>', '/', '{', '}', ';'].map((k) => (
            <span
              key={k}
              className="flex h-6 flex-1 items-center justify-center rounded-md border border-line"
            >
              {k}
            </span>
          ))}
        </div>
      </div>
    </Frame>
  )
}

function OfflineVisual() {
  const lessons = [
    ['1.1 What happens when you open a website', true],
    ['1.2 URLs, domains and DNS', true],
    ['1.3 Requests, responses and status codes', false],
  ] as const
  return (
    <Frame>
      <div className="flex w-full flex-col gap-3 text-xs">
        {lessons.map(([title, saved]) => (
          <div key={title} className="flex items-center justify-between gap-3">
            <span className="text-ink">{title}</span>
            <span className={saved ? 'shrink-0 text-success' : 'shrink-0 text-ink-subtle'}>
              {saved ? 'Saved ✓' : 'Not yet'}
            </span>
          </div>
        ))}
      </div>
    </Frame>
  )
}

function TutorVisual() {
  return (
    <Frame>
      <div className="flex w-full flex-col gap-2 text-xs">
        <p className="self-end rounded-xl bg-row px-3 py-2 text-ink">Why are my links stacked?</p>
        <p className="max-w-[85%] rounded-xl border border-line px-3 py-2 text-ink-soft">
          Good question. Look at the parent. Is it a flex container yet?
        </p>
      </div>
    </Frame>
  )
}

function CertificateVisual() {
  return (
    <Frame>
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 80 90" className="h-[78px] w-[70px]">
          <defs>
            <linearGradient id="cert-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#3D5AF5" />
              <stop offset="1" stopColor="#6E4CF5" />
            </linearGradient>
          </defs>
          <path
            d="M40 4 74 24v42L40 86 6 66V24z"
            fill="none"
            stroke="url(#cert-ring)"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <path
            d="m26 46 10 10 19-21"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-ink"
          />
        </svg>
        <div className="flex flex-col gap-1.5">
          <p className="text-[13px] font-semibold text-ink">Front-End Web Development</p>
          <p className="text-[11px] text-success">Verified · Open Badges 3.0</p>
          <div className="flex gap-1.5 text-[10px] text-ink-muted">
            <span className="rounded-md border border-line px-2 py-0.5">SFIA PROG 2</span>
            <span className="rounded-md border border-line px-2 py-0.5">MDN: CSS layout</span>
          </div>
        </div>
      </div>
    </Frame>
  )
}

const features: { title: string; body: string; visual: React.ReactNode; soon?: boolean }[] = [
  {
    title: 'Lessons you can poke at',
    body: 'Change a value and the page changes. You understand flexbox by pushing it around, not by reading about it.',
    visual: <LabVisual />,
  },
  {
    title: 'Code that’s checked as you write',
    body: 'Write the code and the checks tell you straight away what works and what to fix, right in your browser.',
    visual: <ChecksVisual />,
  },
  {
    title: 'Start on your phone',
    body: 'Modules 1 and 2 work fully in your phone’s browser, with a symbol bar for typing code. A laptop helps from Module 4.',
    visual: <PhoneVisual />,
  },
  {
    title: 'Offline, for real',
    body: 'Open a lesson on Wi-Fi and it stays on your device, so you can keep going on the bus, at work, or when the network takes a break.',
    visual: <OfflineVisual />,
  },
  {
    title: 'A tutor in the lesson',
    body: 'Stuck? Ask about the step you’re on. It gives hints first, so you still do the thinking.',
    visual: <TutorVisual />,
    soon: true,
  },
  {
    title: 'Certificates anyone can check',
    body: 'Each one will list exactly which skills you showed, so anyone can click through and see how.',
    visual: <CertificateVisual />,
    soon: true,
  },
]

export function Features() {
  const { features: copy } = landing
  return (
    <Section labelledBy="features-title">
      <Container className="flex flex-col gap-8 ph:gap-12">
        <SectionHeading id="features-title" title={copy.title} intro={copy.intro} accentTone="ux" />
        <ul className="grid grid-cols-1 gap-4 ph:gap-6 tab:grid-cols-2 wide:grid-cols-3">
          {features.map((f) => (
            <li
              key={f.title}
              className="flex flex-col gap-5 rounded-3xl border border-line p-5 surface ph:p-6"
            >
              {f.visual}
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-[21px] leading-7 font-bold text-ink">{f.title}</h3>
                  {f.soon && <Pill tone="soon">Coming soon</Pill>}
                </div>
                <p className="text-sm leading-[22px] text-ink-muted">{f.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
