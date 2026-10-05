import 'server-only'
import { headers } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Saves the country Vercel derives from the connection, once, at first sign-in. It never comes from
 * the client, and it never blocks sign-in: the impact figures can live without one country.
 */
export async function recordCountry(userId: string): Promise<void> {
  const country = (await headers()).get('x-vercel-ip-country')
  if (!country || !/^[A-Z]{2}$/.test(country)) return
  try {
    await createAdminClient()
      .from('profiles')
      .update({ country_code: country })
      .eq('id', userId)
      .is('country_code', null)
  } catch (error) {
    console.error('recordCountry failed', error)
  }
}
