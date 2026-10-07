import { AppShell } from '@/components/app/shell/app-shell'
import { requireUser } from '@/lib/auth/require-user'
import { loadLearnerTrack, searchEntries } from '@/lib/learn/progress'
import { joinedLabel } from '@/lib/learn/stats'

/** Signed-in pages. The proxy already sends signed-out visitors to log in; this checks again. */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()
  const track = await loadLearnerTrack()
  return (
    <AppShell
      user={{ name: user.name, email: user.email, isAdmin: user.isAdmin, status: joinedLabel(user.joinedAt, new Date()) }}
      search={searchEntries(track)}
    >
      {children}
    </AppShell>
  )
}
