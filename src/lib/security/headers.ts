/** Routes that render per request (signed-in and sign-in pages). They get a nonce CSP from the proxy. */
export const DYNAMIC_PATHS = [
  '/home',
  '/settings',
  '/admin',
  '/login',
  '/signup',
  '/verify',
  '/auth',
] as const

export const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  // No X-Frame-Options: CSP frame-ancestors covers every browser Next.js 16 supports, and two
  // framing headers would conflict on the runner, which lesson pages frame.
]

// The runner is always sandboxed by its own CSP, so even opened directly it has an opaque origin.
export const runnerHeaders = [
  {
    key: 'Content-Security-Policy',
    value:
      "sandbox allow-scripts; default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; frame-ancestors 'self'",
  },
  { key: 'X-Robots-Tag', value: 'noindex' },
]
