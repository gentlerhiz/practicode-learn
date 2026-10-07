import { Suspense } from 'react'
import { AccountDeletedNotice } from '@/components/marketing/account-deleted-notice'
import { JsonLd } from '@/components/seo/json-ld'
import { Comparison } from '@/components/marketing/comparison'
import { Faq } from '@/components/marketing/faq'
import { Features } from '@/components/marketing/features'
import { FounderQuote } from '@/components/marketing/founder-quote'
import { Hero } from '@/components/marketing/hero'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { ClosingBand, MentorBand, PricingSection } from '@/components/marketing/landing-bands'
import { SiteAssistant } from '@/components/marketing/site-assistant'
import { Stats } from '@/components/marketing/stats'
import { ToolsStrip } from '@/components/marketing/tools-strip'
import { TrackCards } from '@/components/marketing/track-cards'
import { TutorShowcase } from '@/components/marketing/tutor-showcase'
import { faq } from '@/content/faq'
import { faqLd } from '@/lib/seo/jsonld'
import { metaFor } from '@/lib/seo/pages'

export const metadata = metaFor('/')

// Section order follows the canvas (PrismLanding), top to bottom.
export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <AccountDeletedNotice />
      </Suspense>
      <Hero />
      <ToolsStrip />
      <TrackCards />
      <Stats />
      <Features />
      <HowItWorks />
      <TutorShowcase />
      <FounderQuote />
      <Comparison />
      <MentorBand />
      <PricingSection />
      <Faq />
      <ClosingBand />
      <SiteAssistant />
      <JsonLd data={faqLd(faq)} />
    </>
  )
}
