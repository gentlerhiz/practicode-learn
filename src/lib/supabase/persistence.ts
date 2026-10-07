/**
 * Set when a learner logs in with "Keep me logged in on this device" unticked. While it's there,
 * Supabase's session cookies are written without an expiry, so they end when the browser closes.
 */
export const SESSION_ONLY_COOKIE = 'pc-session-only'

type CookieOptions = { maxAge?: number; expires?: Date }

export function applyPersistence<T extends CookieOptions>(options: T | undefined, sessionOnly: boolean): T | undefined {
  // A removal (maxAge 0) has to stay a removal, or signing out would leave the cookie behind.
  if (!options || !sessionOnly || options.maxAge === 0) return options
  const rest = { ...options }
  delete rest.maxAge
  delete rest.expires
  return rest
}
