'use server'
import type { Route } from 'next'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { absoluteUrl } from '@/lib/site'
import { createClient } from '@/lib/supabase/server'
import { recordCountry } from './country'
import { safeRedirect } from './redirect'

export type AuthFormState = {
  error?: string
  fieldErrors?: Partial<Record<'name' | 'email' | 'terms' | 'code', string>>
  values?: { name?: string; email?: string; terms?: boolean }
}

const text = (formData: FormData, key: string) => {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

const SendCode = z.object({
  mode: z.enum(['login', 'signup']),
  email: z.email({ error: 'Enter a valid email address' }),
  name: z.string().max(80, { error: 'Keep your name under 80 characters' }).optional(),
  terms: z.literal('on').optional(),
  next: z.string().max(2048).optional(),
  resend: z.literal('1').optional(),
})

/** Emails a 6-digit sign-in code (and a link). Sign-up creates the account; log-in never does. */
export async function sendSignInCode(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const input = {
    mode: text(formData, 'mode'),
    email: text(formData, 'email').toLowerCase(),
    name: text(formData, 'name') || undefined,
    terms: text(formData, 'terms') || undefined,
    next: text(formData, 'next') || undefined,
    resend: text(formData, 'resend') || undefined,
  }
  // Returned with errors so the form keeps what the learner typed (React resets forms after an action).
  const values = { name: input.name, email: input.email, terms: input.terms === 'on' }
  const parsed = SendCode.safeParse(input)
  if (!parsed.success) {
    const fieldErrors: AuthFormState['fieldErrors'] = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0]
      if (field === 'name' || field === 'email' || field === 'terms') fieldErrors[field] ??= issue.message
    }
    return Object.keys(fieldErrors).length
      ? { fieldErrors, values }
      : { error: 'Something went wrong. Reload the page and try again.', values }
  }
  const { mode, email, name, terms, next, resend } = parsed.data
  if (mode === 'signup' && !terms) {
    return { fieldErrors: { terms: 'Agree to the Terms and Privacy Policy to create your account' }, values }
  }

  const destination = safeRedirect(next)
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: mode === 'signup',
      emailRedirectTo: absoluteUrl(`/auth/confirm?next=${encodeURIComponent(destination)}`),
      data: mode === 'signup' && name ? { full_name: name } : undefined,
    },
  })
  if (error) {
    return {
      error:
        error.status === 429
          ? 'Too many attempts. Wait a minute and try again.'
          : 'We couldn’t send the code. Check the address and try again.',
      values,
    }
  }
  const query = new URLSearchParams({ email, next: destination, ...(resend ? { resent: '1' } : {}) })
  redirect(`/verify?${query}` as Route)
}

const VerifyCode = z.object({
  email: z.email(),
  // We set 6 digits (supabase/config.toml), but Supabase allows 6 to 10; accepting them all means a
  // settings drift can't lock everyone out.
  code: z.string().regex(/^\d{6,10}$/, { error: 'Enter the code from the email' }),
  next: z.string().max(2048).optional(),
})

/** Checks the emailed code, records the learner's country once, then continues to where they were going. */
export async function verifySignInCode(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = VerifyCode.safeParse({
    email: text(formData, 'email').toLowerCase(),
    code: text(formData, 'code').replace(/\s/g, ''),
    next: text(formData, 'next') || undefined,
  })
  if (!parsed.success) {
    const codeIssue = parsed.error.issues.find((issue) => issue.path[0] === 'code')
    return codeIssue
      ? { fieldErrors: { code: codeIssue.message } }
      : { error: 'This page has lost your email address. Go back and ask for a new code.' }
  }
  const { email, code, next } = parsed.data
  const supabase = await createClient()
  const { data, error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' })
  if (error || !data.user) {
    return {
      fieldErrors: {
        code:
          error?.status === 429
            ? 'Too many attempts. Wait a minute and try again.'
            : 'That code didn’t work. Check it, or send a new one.',
      },
    }
  }
  await recordCountry(data.user.id)
  redirect(safeRedirect(next))
}

/** Starts Google sign-in. Supabase sends the learner back to /auth/callback. */
export async function signInWithGoogle(formData: FormData): Promise<void> {
  const destination = safeRedirect(text(formData, 'next') || null)
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: absoluteUrl(`/auth/callback?next=${encodeURIComponent(destination)}`) },
  })
  if (error || !data.url) redirect(`/login?error=google&next=${encodeURIComponent(destination)}` as Route)
  redirect(data.url as Route)
}
