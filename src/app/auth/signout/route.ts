import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_ONLY_COOKIE } from '@/lib/supabase/persistence'
import { createClient } from '@/lib/supabase/server'

/** POST only, so a link or an image can't sign anyone out. 303 turns the POST into a GET of the home page. */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  const response = NextResponse.redirect(new URL('/', request.nextUrl.origin), 303)
  response.cookies.delete(SESSION_ONLY_COOKIE)
  return response
}
