import { manageLink } from '@/lib/billing/paystack'
import { createClient } from '@/lib/supabase/server'

/** Settings links here: on to Paystack's page for this learner's subscription, to change card or cancel. */
export async function GET(request: Request) {
  const origin = new URL(request.url).origin
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims?.sub) return Response.redirect(`${origin}/login?next=%2Fsettings`, 303)
  const { data: membership } = await supabase
    .from('memberships')
    .select('provider_subscription')
    .eq('learner_id', data.claims.sub)
    .maybeSingle()
  if (!membership?.provider_subscription) return Response.redirect(`${origin}/settings?billing=none#set-plan`, 303)
  try {
    return Response.redirect(await manageLink(membership.provider_subscription), 303)
  } catch (error) {
    console.error('Paystack manage link failed', error)
    return Response.redirect(`${origin}/settings?billing=error#set-plan`, 303)
  }
}
