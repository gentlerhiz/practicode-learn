const PREVIEW = /^https:\/\/practicode-learn-[a-z0-9-]+-idrisaloma120-3188s-projects\.vercel\.app$/

/**
 * The origin to send a learner back to after Google: the one they're on, if it's this computer, a
 * preview of this project or the site itself. Supabase checks the same list (supabase/config.toml).
 */
export function trustedOrigin(candidate: string | null, siteUrl: string): string {
  if (!candidate) return siteUrl
  let url: URL
  try {
    url = new URL(candidate)
  } catch {
    return siteUrl
  }
  const origin = url.origin
  const local = url.protocol === 'http:' && url.hostname === 'localhost'
  return local || origin === new URL(siteUrl).origin || PREVIEW.test(origin) ? origin : siteUrl
}
