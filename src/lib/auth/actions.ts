'use server'
import type { Route } from 'next'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { site } from '@/lib/site'
import { createClient } from '@/lib/supabase/server'
import { SESSION_ONLY_COOKIE } from '@/lib/supabase/persistence'
import { parsePlan } from '@/lib/onboarding/plan'
import { recordCountry } from './country'
import { trustedOrigin } from './origin'
import { PASSWORD_MAX, PASSWORD_MIN, passwordProblems } from './password'
import { PHONE_SIGNIN } from './phone'
import { safeRedirect } from './redirect'

type Field = 'name' | 'email' | 'password' | 'confirm' | 'phone' | 'code'

export type AuthFormState = {
  error?: string
  /** A calm message that isn't an error, such as "Sent again". */
  notice?: string
  fieldErrors?: Partial<Record<Field, string>>
  values?: { name?: string; email?: string; phone?: string }
  /** Log-in found an account that hasn't confirmed its email yet. */
  unconfirmed?: string
  sent?: boolean
  done?: boolean
}

const text = (formData: FormData, key: string) => {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}
// Passwords are never trimmed: spaces are allowed and count.
const raw = (formData: FormData, key: string) => {
  const value = formData.get(key)
  return typeof value === 'string' ? value : ''
}

const TRY_AGAIN = 'Something went wrong. Reload the page and try again.'
const TOO_MANY = 'Too many attempts. Wait a minute and try again.'

const email = z.email({ error: 'Enter a valid email address' }).max(254)
const password = z
  .string()
  .min(PASSWORD_MIN, { error: `Use at least ${PASSWORD_MIN} characters` })
  .max(PASSWORD_MAX, { error: `Keep it under ${PASSWORD_MAX} characters` })

function firstErrors(issues: z.core.$ZodIssue[]): AuthFormState['fieldErrors'] {
  const errors: AuthFormState['fieldErrors'] = {}
  for (const issue of issues) {
    const field = issue.path[0] as Field
    errors[field] ??= issue.message
  }
  return errors
}

async function origin() {
  return trustedOrigin((await headers()).get('origin'), site.url)
}

const SignUp = z.object({
  name: z.string().min(1, { error: 'Tell us what to call you' }).max(80, { error: 'Keep your name under 80 characters' }),
  email,
  password,
  weekly: z.literal('on').optional(),
  plan: z.string().max(200).optional(),
  next: z.string().max(2048).optional(),
})

/** Creates the account and emails a confirmation link. Nothing here reveals whether an email is registered. */
export async function signUp(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const input = {
    name: text(formData, 'name'),
    email: text(formData, 'email').toLowerCase(),
    password: raw(formData, 'password'),
    weekly: text(formData, 'weekly') || undefined,
    plan: text(formData, 'plan') || undefined,
    next: text(formData, 'next') || undefined,
  }
  const values = { name: input.name, email: input.email }
  const parsed = SignUp.safeParse(input)
  if (!parsed.success) return { fieldErrors: firstErrors(parsed.error.issues), values }
  const { name, weekly, plan, next } = parsed.data
  if (passwordProblems(parsed.data.password, { email: parsed.data.email, name }).includes('personal')) {
    return { fieldErrors: { password: 'Don’t use your name or email in your password' }, values }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${await origin()}/auth/confirm?next=${encodeURIComponent(safeRedirect(next))}`,
      data: { full_name: name, weekly_email: Boolean(weekly), plan: parsePlan(plan) },
    },
  })
  if (error) {
    if (error.status === 429) return { error: TOO_MANY, values }
    if (error.code === 'weak_password') return { fieldErrors: { password: 'Choose a longer password' }, values }
    return { error: 'We couldn’t create your account. Check your details and try again.', values }
  }
  // With email confirmation on (it is), there's no session until the link is opened.
  if (data.session && data.user) {
    await recordCountry(data.user.id)
    redirect(safeRedirect(next))
  }
  // No session until the 6-digit code from the email is entered on the next screen.
  redirect(codeScreen(parsed.data.email, next))
}

/** The Enter-code screen for an email address, keeping where to go afterwards. */
const codeScreen = (address: string, next?: string) =>
  `/verify?email=${encodeURIComponent(address)}${next ? `&next=${encodeURIComponent(next)}` : ''}` as Route

/** Checks the 6-digit code from the sign-up email. A right code confirms the address and signs them in. */
export async function verifyEmailCode(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = EmailCode.safeParse({
    email: text(formData, 'email').toLowerCase(),
    code: text(formData, 'code').replace(/\s/g, ''),
    next: text(formData, 'next') || undefined,
  })
  if (!parsed.success) {
    const code = parsed.error.issues.find((issue) => issue.path[0] === 'code')
    return code ? { fieldErrors: { code: code.message } } : { error: 'This page has lost your email. Go back and sign up again.' }
  }
  const supabase = await createClient()
  const { data, error } = await supabase.auth.verifyOtp({ email: parsed.data.email, token: parsed.data.code, type: 'email' })
  if (error || !data.user) {
    return { fieldErrors: { code: error?.status === 429 ? TOO_MANY : 'That code didn’t work. Check it, or send a new one.' } }
  }
  await recordCountry(data.user.id)
  redirect(safeRedirect(parsed.data.next))
}

const LogIn = z.object({
  email,
  password: z.string().min(1, { error: 'Enter your password' }).max(PASSWORD_MAX),
  keep: z.literal('on').optional(),
  next: z.string().max(2048).optional(),
})

/** Email and password. Unticking "Keep me logged in" makes the session end with the browser. */
export async function logIn(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const input = {
    email: text(formData, 'email').toLowerCase(),
    password: raw(formData, 'password'),
    keep: text(formData, 'keep') || undefined,
    next: text(formData, 'next') || undefined,
  }
  const values = { email: input.email }
  const parsed = LogIn.safeParse(input)
  if (!parsed.success) return { fieldErrors: firstErrors(parsed.error.issues), values }

  const sessionOnly = !parsed.data.keep
  const cookieStore = await cookies()
  if (sessionOnly) {
    cookieStore.set(SESSION_ONLY_COOKIE, '1', { path: '/', sameSite: 'lax', secure: process.env.NODE_ENV === 'production' })
  } else {
    cookieStore.delete(SESSION_ONLY_COOKIE)
  }
  const supabase = await createClient({ sessionOnly })
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })
  if (error || !data.user) {
    if (error?.status === 429) return { error: TOO_MANY, values }
    if (error?.code === 'email_not_confirmed') {
      return { unconfirmed: parsed.data.email, error: 'Confirm your email first, with the 6-digit code we emailed you.', values }
    }
    return { error: 'That email and password don’t match. Check them, or reset your password.', values }
  }
  await recordCountry(data.user.id)
  redirect(safeRedirect(parsed.data.next))
}

const Phone = z.object({
  phone: z.string().regex(/^\d{7,12}$/, { error: 'Enter your phone number' }),
})

/** Phone sign-in needs an SMS provider. Until one is set up it says so, rather than failing quietly. */
export async function sendPhoneCode(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const phone = text(formData, 'phone').replace(/[\s()-]/g, '').replace(/^0/, '')
  const values = { phone: text(formData, 'phone') }
  const parsed = Phone.safeParse({ phone })
  if (!parsed.success) return { fieldErrors: firstErrors(parsed.error.issues), values }
  if (!PHONE_SIGNIN) {
    return { error: 'Phone sign-in is coming soon. Use your email or Google for now.', values }
  }
  const full = `+234${parsed.data.phone}`
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({ phone: full })
  if (error) return { error: error.status === 429 ? TOO_MANY : 'We couldn’t send a code to that number.', values }
  redirect(`/verify?phone=${encodeURIComponent(full)}` as Route)
}

const EmailCode = z.object({
  email,
  code: z.string().regex(/^\d{6}$/, { error: 'Enter the 6-digit code' }),
  next: z.string().max(2048).optional(),
})

const PhoneCode = z.object({
  phone: z.string().regex(/^\+\d{8,15}$/),
  code: z.string().regex(/^\d{6}$/, { error: 'Enter the 6-digit code' }),
  next: z.string().max(2048).optional(),
})

export async function verifyPhoneCode(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = PhoneCode.safeParse({
    phone: text(formData, 'phone'),
    code: text(formData, 'code').replace(/\s/g, ''),
    next: text(formData, 'next') || undefined,
  })
  if (!parsed.success) {
    const code = parsed.error.issues.find((issue) => issue.path[0] === 'code')
    return code ? { fieldErrors: { code: code.message } } : { error: 'This page has lost your number. Go back and try again.' }
  }
  const supabase = await createClient()
  const { data, error } = await supabase.auth.verifyOtp({ phone: parsed.data.phone, token: parsed.data.code, type: 'sms' })
  if (error || !data.user) {
    return { fieldErrors: { code: error?.status === 429 ? TOO_MANY : 'That code didn’t work. Check it, or send a new one.' } }
  }
  await recordCountry(data.user.id)
  redirect(safeRedirect(parsed.data.next))
}

/** Sends the confirmation email (with a new code) again: the Enter-code screen, and log-in for an unconfirmed account. */
export async function resendConfirmation(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = email.safeParse(text(formData, 'email').toLowerCase())
  if (!parsed.success) return { error: 'Go back and enter your email again.' }
  const supabase = await createClient()
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: parsed.data,
    options: { emailRedirectTo: `${await origin()}/auth/confirm` },
  })
  if (error) return { error: error.status === 429 ? TOO_MANY : 'We couldn’t send it. Try again in a minute.' }
  // From log-in, an unconfirmed learner goes straight to the Enter-code screen.
  if (text(formData, 'then') === 'verify') redirect(codeScreen(parsed.data, text(formData, 'next') || undefined))
  return { sent: true, notice: 'We sent a new code. It can take a minute.' }
}

/** Emails a reset link. The answer is the same whether or not the email has an account. */
export async function sendPasswordReset(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const value = text(formData, 'email').toLowerCase()
  const parsed = email.safeParse(value)
  if (!parsed.success) return { fieldErrors: { email: 'Enter a valid email address' }, values: { email: value } }
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${await origin()}/auth/confirm?next=/new-password`,
  })
  if (error?.status === 429) return { error: TOO_MANY, values: { email: value } }
  return { sent: true, values: { email: parsed.data } }
}

const NewPassword = z.object({ password, confirm: z.string() })

/** Saves a new password for the learner signed in by the reset link, then signs out their other devices. */
export async function setNewPassword(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = NewPassword.safeParse({ password: raw(formData, 'password'), confirm: raw(formData, 'confirm') })
  if (!parsed.success) return { fieldErrors: firstErrors(parsed.error.issues) }
  if (parsed.data.password !== parsed.data.confirm) return { fieldErrors: { confirm: 'The two passwords don’t match' } }

  const supabase = await createClient()
  const { data: claims } = await supabase.auth.getClaims()
  if (!claims?.claims?.sub) return { error: 'Your reset link has expired. Ask for a new one.' }
  const person = {
    email: typeof claims.claims.email === 'string' ? claims.claims.email : undefined,
    name: typeof claims.claims.user_metadata?.full_name === 'string' ? claims.claims.user_metadata.full_name : undefined,
  }
  if (passwordProblems(parsed.data.password, person).includes('personal')) {
    return { fieldErrors: { password: 'Don’t use your name or email in your password' } }
  }
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })
  if (error) {
    if (error.code === 'same_password') return { fieldErrors: { password: 'Choose a password you haven’t used here before' } }
    return { error: error.status === 429 ? TOO_MANY : TRY_AGAIN }
  }
  await supabase.auth.signOut({ scope: 'others' })
  return { done: true }
}

/** Starts Google sign-in. Supabase sends the learner back to /auth/callback on the address they're using. */
export async function signInWithGoogle(formData: FormData): Promise<void> {
  const destination = safeRedirect(text(formData, 'next') || null)
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${await origin()}/auth/callback?next=${encodeURIComponent(destination)}` },
  })
  if (error || !data.url) redirect(`/login?error=google&next=${encodeURIComponent(destination)}` as Route)
  redirect(data.url as Route)
}
