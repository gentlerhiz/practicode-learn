import { JsonLd } from '@/components/seo/json-ld'
import { Comparison } from '@/components/marketing/comparison'
import { CtaBand } from '@/components/marketing/cta-band'
import { Faq } from '@/components/marketing/faq'
import { Features } from '@/components/marketing/features'
import { FounderQuote } from '@/components/marketing/founder-quote'
import { Hero } from '@/components/marketing/hero'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { Stats } from '@/components/marketing/stats'
import { ToolsStrip } from '@/components/marketing/tools-strip'
import { TrackCards } from '@/components/marketing/track-cards'
import { faq } from '@/content/faq'
import { faqLd } from '@/lib/seo/jsonld'
import { metaFor } from '@/lib/seo/pages'

export const metadata = metaFor('/')

// Section order follows the founder's canvas: tracks straight after the hero.
export default function Home() {
  return (
    <>
      <Hero />
      <ToolsStrip />
      <TrackCards />
      <Stats />
      <Features />
      <HowItWorks />
      <FounderQuote />
      <Comparison />
      <Faq />
      <CtaBand />
      <JsonLd data={faqLd(faq)} />
    </>
  )
}
