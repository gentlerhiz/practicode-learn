import { NextResponse, type NextRequest } from 'next/server'
import { buildCsp, themeScriptHash } from '@/lib/security/csp'

/**
 * Runs for dynamic routes only (see config.matcher). Gives each response a fresh CSP nonce, which
 * Next.js reads from the request header and adds to its own scripts. Session refresh joins in Task 10.
 */
export async function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const csp = buildCsp({
    mode: 'nonce',
    nonce,
    dev: process.env.NODE_ENV === 'development',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    themeScriptHash: themeScriptHash(),
  })
  const headers = new Headers(request.headers)
  headers.set('x-nonce', nonce)
  headers.set('Content-Security-Policy', csp)
  const response = NextResponse.next({ request: { headers } })
  response.headers.set('Content-Security-Policy', csp)
  return response
}

export const config = {
  matcher: [
    {
      source: '/(home|settings|admin|login|signup|verify|auth)/:path*',
      missing: [{ type: 'header', key: 'next-router-prefetch' }],
    },
    '/(home|settings|admin|login|signup|verify)',
  ],
}
