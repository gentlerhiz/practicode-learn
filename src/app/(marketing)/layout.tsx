import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { HomeBanner } from '@/components/marketing/home-banner'
import { SkipLink } from '@/components/ui/skip-link'

export default function MarketingLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <SkipLink />
      <HomeBanner />
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  )
}
