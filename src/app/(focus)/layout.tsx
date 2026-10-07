import { SkipLink } from '@/components/ui/skip-link'
import { requireUser } from '@/lib/auth/require-user'

/**
 * Signed-in pages that take the whole screen with their own slim header (PrismProject, PrismReview,
 * PrismModuleCheck, PrismCheckout): no sidebar, so the learner can concentrate.
 */
export default async function FocusLayout({ children }: { children: React.ReactNode }) {
  await requireUser()
  return (
    <>
      <SkipLink />
      <div id="main">{children}</div>
    </>
  )
}
