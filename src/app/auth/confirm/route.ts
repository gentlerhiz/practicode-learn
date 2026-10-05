import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { recordCountry } from '@/lib/auth/country'
import { safeRedirect } from '@/lib/auth/redirect'
import { createClient } from '@/lib/supabase/server'

const LinkType = z.enum(['email', 'signup', 'magiclink'])

/** The link in the sign-in email lands here. It works on any device, unlike a browser-bound code. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const next = safeRedirect(searchParams.get('next'))
  const tokenHash = searchParams.get('token_hash')
  const type = LinkType.safeParse(searchParams.get('type'))
  if (tokenHash && type.success) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type.data })
    if (!error && data.user) {
      await recordCountry(data.user.id)
      return NextResponse.redirect(new URL(next, origin))
    }
  }
  return NextResponse.redirect(new URL(`/login?error=link&next=${encodeURIComponent(next)}`, origin))
}
