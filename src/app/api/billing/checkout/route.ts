import { z } from 'zod'
import { startCheckout } from '@/lib/billing/paystack'
import { createClient } from '@/lib/supabase/server'

const Choice = z.object({ billing: z.enum(['monthly', 'yearly']), method: z.enum(['card', 'bank', 'ussd']) })

const back = (origin: string, query: string) => Response.redirect(`${origin}/checkout?${query}`, 303)

/** The checkout form posts here; the learner is sent on to Paystack's own payment page. */
export async function POST(request: Request) {
  const origin = new URL(request.url).origin
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims
  if (!claims?.sub) return Response.redirect(`${origin}/login?next=%2Fcheckout`, 303)
  if (typeof claims.email !== 'string') return back(origin, 'error=email')

  const form = await request.formData().catch(() => null)
  const choice = Choice.safeParse({ billing: form?.get('billing'), method: form?.get('method') })
  if (!choice.success) return back(origin, 'error=choice')

  try {
    const url = await startCheckout({
      email: claims.email,
      learnerId: claims.sub,
      billing: choice.data.billing,
      method: choice.data.method,
      callbackUrl: `${origin}/checkout/confirmed`,
    })
    return Response.redirect(url, 303)
  } catch (error) {
    console.error('Checkout could not start', error)
    return back(origin, 'error=start')
  }
}
