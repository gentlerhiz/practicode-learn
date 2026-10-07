import { NextResponse, type NextRequest } from 'next/server'
import { buildCsp, themeScriptHash } from '@/lib/security/csp'
import { updateSession } from '@/lib/supabase/proxy'

const SIGNED_IN_ONLY = /^\/(home|my-tracks|review|projects|certificates|community|checks|checkout|settings|admin)(\/|$)/

/** True for pages only a signed-in learner can open (src/lib/security/headers.ts, SIGNED_IN_PATHS). */
export const isSignedInOnly = (pathname: string) => SIGNED_IN_ONLY.test(pathname)

/**
 * Runs for dynamic routes only (see config.matcher). Gives each response a fresh CSP nonce, which
 * Next.js reads from the request header and adds to its own scripts, refreshes the Supabase session,
 * and sends signed-out visitors from private pages to log in.
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
  const { response, userId } = await updateSession(request, {
    'x-nonce': nonce,
    'Content-Security-Policy': csp,
  })

  const { pathname, search } = request.nextUrl
  if (!userId && isSignedInOnly(pathname)) {
    const login = new URL('/login', request.url)
    login.searchParams.set('next', `${pathname}${search}`)
    return NextResponse.redirect(login)
  }

  response.headers.set('Content-Security-Policy', csp)
  return response
}

export const config = {
  matcher: [
    {
      source: '/(home|my-tracks|review|projects|certificates|community|checks|checkout|settings|admin|login|signup|verify|check-email|reset-password|new-password|onboarding|auth)/:path*',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
    '/(home|my-tracks|review|projects|certificates|community|checks|checkout|settings|admin|login|signup|verify|check-email|reset-password|new-password|onboarding|auth)',
  ],
}
