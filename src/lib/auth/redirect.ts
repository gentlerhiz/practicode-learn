import type { Route } from 'next'

const BASE = 'https://learn.practicode.tech'

/** Where to send someone after sign-in. Only paths on this site; anything else gets the fallback. */
export function safeRedirect(next: string | null | undefined, fallback: Route = '/home' as Route): Route {
  if (!next) return fallback
  let decoded: string
  try {
    decoded = decodeURIComponent(next.trim())
  } catch {
    return fallback
  }
  // Only same-site paths: one leading slash, no backslashes, no protocol, no control characters.
  if (
    !decoded.startsWith('/') ||
    decoded.startsWith('//') ||
    decoded.includes('\\') ||
    /[\u0000-\u001f]/.test(decoded)
  ) {
    return fallback
  }
  const url = new URL(decoded, BASE)
  if (url.origin !== BASE) return fallback
  return `${url.pathname}${url.search}` as Route
}
