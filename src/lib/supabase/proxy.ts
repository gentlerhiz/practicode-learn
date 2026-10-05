import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

/**
 * Refreshes the session cookie and verifies it with getClaims (never trust getSession on the server).
 * `extra` request headers (the CSP nonce) are passed on to the page. Without Supabase settings, as on
 * a deployment that hasn't been given them yet, everyone is simply signed out.
 */
export async function updateSession(request: NextRequest, extra: Record<string, string>) {
  const build = () => {
    const headers = new Headers(request.headers)
    for (const [k, v] of Object.entries(extra)) headers.set(k, v)
    return NextResponse.next({ request: { headers } })
  }
  let response = build()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return { response, userId: null }

  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value))
        response = build()
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })
  const { data } = await supabase.auth.getClaims()
  return { response, userId: (data?.claims?.sub as string | undefined) ?? null }
}
