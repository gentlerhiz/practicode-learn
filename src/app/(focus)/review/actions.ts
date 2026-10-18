'use server'

import { z } from 'zod'
import { rate } from '@/lib/review/schedule'
import { createClient } from '@/lib/supabase/server'

const Input = z.object({
  cardId: z.string().regex(/^[a-z]{2}-\d{2}-\d{2}:[0-9a-f]{8}$/),
  rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
})

/** Records one rating: schedules the card's next review with FSRS, and logs it. */
export async function rateCard(input: { cardId: string; rating: number }): Promise<{ ok: boolean }> {
  const parsed = Input.safeParse(input)
  if (!parsed.success) return { ok: false }
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const learner = data?.claims?.sub
  if (!learner) return { ok: false }

  const { data: current } = await supabase
    .from('review_cards')
    .select(
      'due, stability, difficulty, elapsed_days, scheduled_days, learning_steps, reps, lapses, state, last_review',
    )
    .eq('card_id', parsed.data.cardId)
    .maybeSingle()
  const next = rate(current, parsed.data.rating)
  const saved = await supabase
    .from('review_cards')
    .upsert({ learner_id: learner, card_id: parsed.data.cardId, ...next })
  if (saved.error) return { ok: false }
  await supabase
    .from('review_log')
    .insert({ learner_id: learner, card_id: parsed.data.cardId, rating: parsed.data.rating })
  return { ok: true }
}
