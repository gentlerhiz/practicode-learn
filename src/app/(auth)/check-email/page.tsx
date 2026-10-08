import type { Route } from 'next'
import { redirect } from 'next/navigation'

/**
 * Sign-up now confirms with the 6-digit code in the email, on the Enter-code screen. This address
 * stays so older links and bookmarks still land somewhere useful.
 */
export default async function CheckEmailPage({ searchParams }: PageProps<'/check-email'>) {
  const { email } = await searchParams
  redirect((typeof email === 'string' ? `/verify?email=${encodeURIComponent(email)}` : '/signup') as Route)
}
