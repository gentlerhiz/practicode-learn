'use client'
import { createBrowserClient } from '@supabase/ssr'
import { supabasePublishableKey, supabaseUrl } from '@/lib/public-config'
import type { Database } from '@/types/database'

export const createClient = () => createBrowserClient<Database>(supabaseUrl!, supabasePublishableKey!)
