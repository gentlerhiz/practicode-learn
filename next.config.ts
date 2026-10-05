import type { NextConfig } from 'next'
import { buildCsp, themeScriptHash } from './src/lib/security/csp'
import { DYNAMIC_PATHS, runnerHeaders, securityHeaders } from './src/lib/security/headers'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
  experimental: { sri: { algorithm: 'sha256' } },

  async headers() {
    const staticCsp = buildCsp({
      mode: 'static',
      dev: process.env.NODE_ENV === 'development',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      themeScriptHash: themeScriptHash(),
    })
    const dynamic = DYNAMIC_PATHS.map((p) => p.slice(1)).join('|')
    return [
      { source: '/:path*', headers: securityHeaders },
      // Dynamic routes get a per-request nonce CSP from src/proxy.ts instead. The exclusion matches whole
      // path segments, so /homework or /authors still get this policy; String.raw keeps the \. escape.
      {
        source: String.raw`/((?!(?:${dynamic})(?:/|$)|runner\.html$).*)`,
        headers: [{ key: 'Content-Security-Policy', value: staticCsp }],
      },
      { source: '/runner.html', headers: runnerHeaders },
      // Browsers check for a new service worker on every visit, so updates reach learners straight away.
      { source: '/sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache' }] },
    ]
  },
}

export default nextConfig
