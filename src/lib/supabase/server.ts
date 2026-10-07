import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { publicEnv } from '@/lib/env'
import type { Database } from '@/types/database'
import { SESSION_ONLY_COOKIE, applyPersistence } from './persistence'

/**
 * Supabase as the signed-in learner (publishable key + session cookie), for Server Components and actions.
 * `sessionOnly` overrides the learner's saved choice, for the log-in that sets it.
 */
export async function createClient({ sessionOnly }: { sessionOnly?: boolean } = {}) {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL!,
    publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => {
          const temporary = sessionOnly ?? cookieStore.get(SESSION_ONLY_COOKIE)?.value === '1'
          try {
            list.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, applyPersistence(options, temporary)),
            )
          } catch {
            // Server Components can't set cookies; the proxy refreshes the session instead.
          }
        },
      },
    },
  )
}
