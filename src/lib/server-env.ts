import 'server-only'
import { z } from 'zod'

const ServerEnv = z.object({
  SUPABASE_SECRET_KEY: z.string().min(20),
  REVALIDATE_SECRET: z.string().min(32),
  CRON_SECRET: z.string().min(32),
})

let cached: z.infer<typeof ServerEnv> | undefined
// Read lazily, so pages that never need secrets build without them.
export function serverEnv() {
  cached ??= ServerEnv.parse(process.env)
  return cached
}
