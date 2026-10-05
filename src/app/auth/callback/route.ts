import { NextResponse, type NextRequest } from 'next/server'
import { recordCountry } from '@/lib/auth/country'
import { safeRedirect } from '@/lib/auth/redirect'
import { createClient } from '@/lib/supabase/server'

/** Google sends learners back here with a one-time code, which becomes a session. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const next = safeRedirect(searchParams.get('next'))
  const code = searchParams.get('code')
  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
      await recordCountry(data.user.id)
      return NextResponse.redirect(new URL(next, origin))
    }
  }
  return NextResponse.redirect(new URL(`/login?error=link&next=${encodeURIComponent(next)}`, origin))
}
