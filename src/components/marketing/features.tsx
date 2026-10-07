import { Check, Target } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { landing } from '@/content/landing'
import { SectionHeading } from './section-heading'

const stage = 'h-[200px] rounded-[18px] border border-divider bg-sunken'
const chip = 'rounded-lg border border-line px-2 py-1 text-ink-muted'

function Poke() {
  return (
    <div aria-hidden="true" className={`${stage} flex flex-col items-center justify-center gap-4 px-5`}>
      <div className="flex h-[72px] w-full items-center justify-between rounded-xl border-[1.5px] border-dashed border-line-strong px-3">
        <span className="size-11 rounded-[10px] bg-[#4d6bff]" />
        <span className="size-11 rounded-[10px] bg-[#6f86ff]" />
        <span className="size-11 rounded-[10px] bg-[#a9b7ff]" />
      </div>
      <div className="flex gap-1.5 font-mono text-[11px]">
        <span className={chip}>start</span>
        <span className={chip}>center</span>
        <span className="rounded-lg border border-[#4d6bff] bg-[rgba(77,107,255,0.18)] px-2 py-1 text-ink">space-between</span>
      </div>
    </div>
  )
}

function Review() {
  return (
    <div aria-hidden="true" className={`${stage} relative overflow-hidden`}>
      <div className="absolute top-10 left-1/2 -ml-[114px] h-[118px] w-[228px] -rotate-5 rounded-[14px] bg-[rgba(47,230,176,0.18)]" />
      <div className="absolute top-[30px] left-1/2 -ml-[120px] flex w-[240px] flex-col gap-3 rounded-[14px] border border-[#2fe6b0]/50 bg-[var(--pc-control)] p-4">
        <p className="text-[13px] leading-[19px] text-ink">
          When is the <span className="text-da-text">median</span> a fairer summary than the average?
        </p>
        <div className="flex gap-1.5 text-[11px]">
          <span className="rounded-full border border-line-control px-3 py-1 text-ink-muted">Again</span>
          <span className="rounded-full bg-success-fill px-3 py-1 font-semibold text-on-success">Good</span>
          <span className="rounded-full border border-line-control px-3 py-1 text-ink-muted">Easy</span>
        </div>
      </div>
      <p className="absolute inset-x-0 bottom-3.5 text-center text-xs text-ink-subtle">5 cards due · about 4 min</p>
    </div>
  )
}

function Offline() {
  return (
    <div aria-hidden="true" className={`${stage} flex items-end justify-center overflow-hidden`}>
      <div className="surface flex h-[176px] w-[190px] flex-col gap-3 rounded-t-3xl border-[1.5px] border-b-0 border-[var(--pc-line-strong)] px-4 pt-4 text-[11px] text-ink">
        <span className="h-1 w-10 self-center rounded-sm bg-line" />
        <div className="flex justify-between gap-2">
          <span>Module 6 · Flexbox</span>
          <span className="shrink-0 text-da-text">1.1 MB ✓</span>
        </div>
        <div className="flex justify-between gap-2">
          <span>Module 7 · Grid and responsive design</span>
          <span className="shrink-0 text-da-text">0.7 MB ✓</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="flex justify-between">
            <span>Module 8 · JavaScript</span>
            <span className="text-ink-muted">60%</span>
          </span>
          <span className="block h-1 overflow-hidden rounded-sm bg-meter">
            <span className="block h-1 w-[60%] bg-[#4d6bff]" />
          </span>
        </div>
      </div>
    </div>
  )
}

function Checks() {
  const done = ['Cleans and splits the messages', 'Trains on the training set only']
  const tick = (
    <span className="flex size-[18px] shrink-0 items-center justify-center rounded-md bg-ai text-white">
      <Check size={12} strokeWidth={3} />
    </span>
  )
  return (
    <div aria-hidden="true" className={`${stage} flex flex-col justify-center gap-3 px-6 text-[13px] text-ink`}>
      <div className="flex justify-between gap-2 text-xs">
        <span className="text-ai-text">Spam filter project</span>
        <span className="text-ink-muted">3 of 4 checks</span>
      </div>
      {done.map((line) => (
        <div key={line} className="flex items-center gap-3">
          {tick}
          {line}
        </div>
      ))}
      <div className="flex items-center gap-3">
        {tick}
        <span>
          91% on new messages <span className="text-ink-subtle">(target 85%)</span>
        </span>
      </div>
      <div className="flex items-center gap-3 text-ink-subtle">
        <span className="block size-[18px] shrink-0 rounded-md border-[1.5px] border-line-strong" />
        Explains one message it got wrong
      </div>
    </div>
  )
}

function SkillMap() {
  const dot = 'absolute block size-3 rounded-full'
  const label = 'absolute text-[11px] whitespace-nowrap'
  return (
    <div aria-hidden="true" className={`${stage} relative overflow-hidden`}>
      <p className="absolute top-3.5 left-4 text-xs text-ux-text">UI/UX Product Design</p>
      <span className="absolute top-1/2 left-1/2 -mt-20 -ml-[88px] block size-[176px] rounded-full border border-line" />
      <span className="absolute top-1/2 left-1/2 -mt-12 -ml-14 block size-28 rounded-full border border-line" />
      <span className="absolute top-1/2 left-1/2 -mt-[18px] -ml-[26px] flex size-[52px] items-center justify-center rounded-full border border-[#f0407f]/60 bg-[rgba(240,64,127,0.16)] text-ux-text">
        <Target size={22} strokeWidth={1.85} />
      </span>
      <span className={`${dot} top-[52px] left-[calc(50%+40px)] bg-[#f0407f]`} />
      <span className={`${dot} top-24 left-[calc(50%-76px)] bg-[#f0407f]`} />
      <span className={`${dot} top-[146px] left-[calc(50%+24px)] bg-[#f0407f]/55`} />
      <span className={`${dot} top-[170px] left-[calc(50%-40px)] border-[1.5px] border-[#f0407f]`} />
      <span className={`${label} top-[46px] left-[calc(50%+58px)] text-ux-text`}>User research</span>
      <span className={`${label} top-[91px] right-[calc(50%+82px)] text-ux-text`}>Prototyping</span>
      <span className={`${label} top-[143px] left-[calc(50%+42px)] text-ux-text`}>Usability testing</span>
      <span className={`${label} top-[167px] right-[calc(50%+46px)] text-ink-subtle`}>Accessibility</span>
    </div>
  )
}

function Certificate() {
  return (
    <div aria-hidden="true" className={`${stage} flex items-center justify-center gap-4 px-5`}>
      <svg viewBox="0 0 100 100" className="size-[92px] shrink-0">
        <defs>
          <linearGradient id="feature-badge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4D6BFF" />
            <stop offset="0.5" stopColor="#7B5CFF" />
            <stop offset="1" stopColor="#F0407F" />
          </linearGradient>
        </defs>
        <polygon points="50,4 90,27 90,73 50,96 10,73 10,27" fill="var(--pc-control)" stroke="url(#feature-badge)" strokeWidth="4" />
        <path d="m34 51 11 11 22-24" fill="none" stroke="var(--pc-text)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold text-ink">Front-End Web Development</p>
        <p className="text-[11px] text-da-text">Verified · Open Badges 3.0</p>
        <div className="flex flex-wrap gap-1 text-[10px]">
          <span className="rounded-md border border-line px-2 py-1 text-ink-muted">SFIA PROG 2</span>
          <span className="rounded-md border border-line px-2 py-1 text-ink-muted">MDN: CSS layout</span>
        </div>
      </div>
    </div>
  )
}

const cards = [
  { Art: Poke, title: 'Lessons you can poke at', body: 'Change a value and the diagram moves. You understand flexbox by pushing it around, not by reading about it.' },
  { Art: Review, title: 'A daily review that sticks', body: 'Four minutes a day. It brings back what you’re about to forget, right before you forget it.' },
  { Art: Offline, title: 'Offline, for real', body: 'Save a module on Wi-Fi and keep going on the bus, at work, or when the network decides to take a break.' },
  { Art: Checks, title: 'Projects that check themselves', body: 'Build a spam filter and the checks tell you straight away whether it holds up on messages it has never seen.' },
  { Art: SkillMap, title: 'A skill map you can trust', body: 'Progress is measured against ISO 9241-210 and SFIA, not against how many minutes you sat there.' },
  { Art: Certificate, title: 'Certificates anyone can check', body: 'Add them to LinkedIn. Anyone can click through and see exactly which skills you showed, and how.' },
]

/** "Everything you need to actually finish": the canvas's six feature cards. */
export function Features() {
  const copy = landing.features
  return (
    <Section labelledBy="features-title">
      <Container className="flex flex-col gap-8 ph:gap-12">
        <SectionHeading id="features-title" title={copy.title} intro={copy.intro} accentTone="ux" />
        <div className="grid grid-cols-1 gap-4 ph:gap-6 tab:grid-cols-3">
          {cards.map(({ Art, title, body }) => (
            <article key={title} className="surface flex flex-col gap-5 rounded-3xl border border-line p-6">
              <Art />
              <div>
                <h3 className="font-display text-[21px] font-bold text-ink">{title}</h3>
                <p className="mt-1.5 text-sm leading-[22px] text-ink-muted">{body}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  )
}
