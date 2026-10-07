'use client'
import { createBrowserClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'
import { supabasePublishableKey, supabaseUrl } from '@/lib/public-config'
import type { Database } from '@/types/database'
import { SESSION_ONLY_COOKIE, applyPersistence } from './persistence'

/** Supabase in the browser. A token refresh here keeps the learner's "keep me logged in" choice. */
export const createClient = () =>
  createBrowserClient<Database>(supabaseUrl!, supabasePublishableKey!, {
    cookies: {
      getAll: () => parseCookieHeader(document.cookie).map(({ name, value }) => ({ name, value: value ?? '' })),
      setAll: (list) => {
        const sessionOnly = parseCookieHeader(document.cookie).some(
          (c) => c.name === SESSION_ONLY_COOKIE && c.value === '1',
        )
        list.forEach(({ name, value, options }) => {
          document.cookie = serializeCookieHeader(name, value, applyPersistence(options, sessionOnly) ?? {})
        })
      },
    },
  })
