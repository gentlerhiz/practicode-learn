import 'server-only'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

export type CurrentUser = { id: string; email: string | null; name: string | null; isAdmin: boolean }

/** The signed-in learner, verified with getClaims, or a redirect to log in. Cached per request. */
export const requireUser = cache(async (): Promise<CurrentUser> => {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims
  if (!claims?.sub) redirect('/login')
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, role')
    .eq('id', claims.sub)
    .maybeSingle()
  return {
    id: claims.sub,
    email: typeof claims.email === 'string' ? claims.email : null,
    name: profile?.display_name ?? null,
    isAdmin: profile?.role === 'admin',
  }
})
