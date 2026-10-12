import 'server-only'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

export type CurrentUser = {
  id: string
  email: string | null
  name: string | null
  isAdmin: boolean
  /** Has Pro right now, as the database decides it (public.is_pro). */
  isPro: boolean
  /** When the profile was created (the email was confirmed), as an ISO date. */
  joinedAt: string | null
  /** The plan chosen in onboarding, as saved in the account's metadata. */
  plan: unknown
  /** Two-letter country code, recorded once at sign-up. */
  country: string | null
  /** Settings saved with the account (weekly_email, currency). */
  prefs: { weeklyEmail: boolean; currency: string | null }
}

/** The signed-in learner, verified with getClaims, or a redirect to log in. Cached per request. */
export const requireUser = cache(async (): Promise<CurrentUser> => {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims
  if (!claims?.sub) redirect('/login')
  const meta = claims.user_metadata as { plan?: unknown; weekly_email?: unknown; currency?: unknown } | undefined
  const [{ data: profile }, { data: isPro }] = await Promise.all([
    supabase.from('profiles').select('display_name, role, created_at, country_code').eq('id', claims.sub).maybeSingle(),
    supabase.rpc('is_pro'),
  ])
  return {
    id: claims.sub,
    email: typeof claims.email === 'string' ? claims.email : null,
    name: profile?.display_name ?? null,
    isAdmin: profile?.role === 'admin',
    isPro: isPro === true,
    joinedAt: profile?.created_at ?? null,
    plan: meta?.plan ?? null,
    country: profile?.country_code ?? null,
    prefs: { weeklyEmail: meta?.weekly_email === true, currency: typeof meta?.currency === 'string' ? meta.currency : null },
  }
})
