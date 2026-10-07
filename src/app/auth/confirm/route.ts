import type { Route } from 'next'
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { recordCountry } from '@/lib/auth/country'
import { safeRedirect } from '@/lib/auth/redirect'
import { createClient } from '@/lib/supabase/server'

const LinkType = z.enum(['signup', 'email', 'recovery', 'magiclink', 'email_change'])

/**
 * The links in our emails land here: confirming a new account, or resetting a password. They work
 * on any device, because the token is in the link rather than tied to the browser that asked.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const type = LinkType.safeParse(searchParams.get('type'))
  const recovery = type.success && type.data === 'recovery'
  const next = safeRedirect(searchParams.get('next'), recovery ? ('/new-password' as Route) : undefined)
  const tokenHash = searchParams.get('token_hash')
  if (tokenHash && type.success) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type.data })
    if (!error && data.user) {
      await recordCountry(data.user.id)
      return NextResponse.redirect(new URL(next, origin))
    }
  }
  const failed = recovery ? '/reset-password?error=link' : `/login?error=link&next=${encodeURIComponent(next)}`
  return NextResponse.redirect(new URL(failed, origin))
}
