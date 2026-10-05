/**
 * Public settings for browser code, as plain values (Next.js inlines NEXT_PUBLIC_* at build time).
 * They are validated with Zod in src/lib/env.ts, which every build imports on the server, so a bad value
 * still fails the build; browsers don't download Zod (about 90 KB) to check them again.
 */
const set = (value: string | undefined) => (value?.trim() ? value : undefined)

export const supabaseUrl = set(process.env.NEXT_PUBLIC_SUPABASE_URL)
export const supabasePublishableKey = set(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
/** False on a deployment that hasn't been given Supabase settings yet. */
export const supabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey)
