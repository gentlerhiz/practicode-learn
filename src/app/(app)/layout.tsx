import { AppShell } from '@/components/layout/app-shell'
import { requireUser } from '@/lib/auth/require-user'

/** Signed-in pages. The proxy already sends signed-out visitors to log in; this checks again. */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()
  return <AppShell user={{ name: user.name, isAdmin: user.isAdmin }}>{children}</AppShell>
}
