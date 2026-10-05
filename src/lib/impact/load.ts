import 'server-only'
import { requireUser } from '@/lib/auth/require-user'
import { createClient } from '@/lib/supabase/server'
import type { ImpactSummary } from './metrics'

export type ImpactData = {
  summary: ImpactSummary
  countries: { country_code: string; learners: number; active_learners_28d: number }[]
  snapshots: { month: string; metrics: ImpactSummary }[]
}

/**
 * The live figures, the countries table and the saved monthly snapshots, read as the signed-in admin
 * (the database refuses anyone else). Returns null for non-admins so callers can answer "not found".
 */
export async function loadImpact(): Promise<ImpactData | null> {
  const user = await requireUser()
  if (!user.isAdmin) return null
  const supabase = await createClient()
  const [summary, countries, snapshots] = await Promise.all([
    supabase.rpc('impact_summary'),
    supabase.rpc('impact_countries'),
    supabase.from('impact_snapshots').select('month, metrics').order('month', { ascending: false }).limit(24),
  ])
  if (summary.error || countries.error || snapshots.error) {
    throw new Error('Could not load the impact figures')
  }
  return {
    summary: summary.data as ImpactSummary,
    countries: countries.data,
    snapshots: snapshots.data.map((s) => ({ month: s.month, metrics: s.metrics as ImpactSummary })),
  }
}
