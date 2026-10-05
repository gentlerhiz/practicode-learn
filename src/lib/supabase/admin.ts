import 'server-only'
import { createClient as createSupabase } from '@supabase/supabase-js'
import { publicEnv } from '@/lib/env'
import { serverEnv } from '@/lib/server-env'
import type { Database } from '@/types/database'

/** Supabase with the secret key: bypasses row-level security, so only trusted server code uses it. */
export const createAdminClient = () =>
  createSupabase<Database>(publicEnv.NEXT_PUBLIC_SUPABASE_URL!, serverEnv().SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
