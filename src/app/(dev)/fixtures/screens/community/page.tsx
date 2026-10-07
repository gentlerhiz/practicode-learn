import type { Metadata, Route } from 'next'
import { CommunityView, type Thread } from '@/components/app/community/community-view'
import { AppPage, AppShell } from '@/components/app/shell/app-shell'
import { requirePreviews } from '@/lib/fixtures/gate'
import { SAMPLE_USER } from '@/lib/fixtures/samples'

export const metadata: Metadata = { title: 'Community preview', robots: { index: false, follow: false } }

const here = '/fixtures/screens/community' as Route
const THREADS: Thread[] = [
  { track: 'fe', initials: 'KO', title: 'Why does my flex item ignore the width I gave it?', replies: '4 replies', when: '20 min ago', answer: 'Answered', href: here },
  { track: 'da', initials: 'AM', title: 'Power Query: how do I turn month columns into rows?', replies: '6 replies', when: '1 hour ago', answer: 'Answered by a mentor', href: here },
  { track: 'fe', initials: 'FN', title: 'Feedback on my recipe page, please?', replies: '9 replies', when: '3 hours ago', href: here },
  { track: 'ai', initials: 'BS', title: 'Is 91% accuracy good for a spam filter?', replies: '3 replies', when: 'Yesterday', answer: 'Answered', href: here },
  { track: 'ux', initials: 'ZE', title: 'How do you find people to interview when you have no budget?', replies: '12 replies', when: 'Yesterday', href: here },
  { track: 'fe', initials: 'DI', title: 'Study buddy for Module 6? Evenings, West Africa time', replies: '5 replies', when: '2 days ago', href: here },
]

/** PrismCommunity with the canvas's sample threads. */
export default function CommunityPreview() {
  requirePreviews()
  return (
    <AppShell user={SAMPLE_USER} search={[]}>
      <AppPage>
        <CommunityView threads={THREADS} open />
      </AppPage>
    </AppShell>
  )
}
