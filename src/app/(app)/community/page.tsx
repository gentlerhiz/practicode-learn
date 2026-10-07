import type { Metadata } from 'next'
import { CommunityView } from '@/components/app/community/community-view'
import { AppPage } from '@/components/app/shell/app-shell'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Community',
  description: 'The PractiCode Learn community.',
  path: '/community',
  noindex: true,
})

/** PrismCommunity. The forum hasn't launched, so the list is empty and says so. */
export default function CommunityPage() {
  return (
    <AppPage>
      <CommunityView threads={[]} open={false} />
    </AppPage>
  )
}
