import 'server-only'
import { z } from 'zod'

const ServerEnv = z.object({
  SUPABASE_SECRET_KEY: z.string().min(20),
  REVALIDATE_SECRET: z.string().min(32),
  CRON_SECRET: z.string().min(32),
})
type ServerEnv = z.infer<typeof ServerEnv>

function read<K extends keyof ServerEnv>(key: K): ServerEnv[K] {
  const result = ServerEnv.shape[key].safeParse(process.env[key])
  if (!result.success) throw new Error(`${key} is missing or too short. Set it in .env.local or in Vercel.`)
  return result.data
}

/**
 * Server-only secrets, each read and checked when it is used. Pages that never need a secret build
 * without it, and one missing secret only breaks the feature that needs it (sign-in doesn't depend on
 * the cron secret).
 */
export function serverEnv(): ServerEnv {
  return {
    get SUPABASE_SECRET_KEY() {
      return read('SUPABASE_SECRET_KEY')
    },
    get REVALIDATE_SECRET() {
      return read('REVALIDATE_SECRET')
    },
    get CRON_SECRET() {
      return read('CRON_SECRET')
    },
  }
}
