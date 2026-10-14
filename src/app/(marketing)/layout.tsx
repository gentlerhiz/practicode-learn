import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { HomeBanner } from '@/components/marketing/home-banner'
import { ScrollToTop } from '@/components/marketing/scroll-to-top'
import { SkipLink } from '@/components/ui/skip-link'

export default function MarketingLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <SkipLink />
      <HomeBanner />
      <SiteHeader />
      {/* The hero and demo glows are wider than a phone; clip them sideways so the page never is. */}
      <main id="main" className="overflow-x-clip">
        {children}
      </main>
      <SiteFooter />
      <ScrollToTop />
    </>
  )
}
