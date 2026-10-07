/** Passwords: at least 8 characters (Supabase is set to the same), at most 72 (bcrypt's limit). */
export const PASSWORD_MIN = 8
export const PASSWORD_MAX = 72

export type Strength = { bars: 0 | 1 | 2 | 3 | 4; label: string; tone: 'none' | 'bad' | 'fair' | 'good' }

/** The meter under a new password. Length counts most: a short phrase beats random symbols. */
export function passwordStrength(password: string): Strength {
  if (!password) return { bars: 0, label: '', tone: 'none' }
  if (password.length < PASSWORD_MIN) return { bars: 1, label: 'Too short', tone: 'bad' }
  const kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((re) => re.test(password)).length
  const score = 2 + (password.length >= 12 ? 1 : 0) + (password.length >= 16 || kinds >= 3 ? 1 : 0)
  if (score >= 4) return { bars: 4, label: 'Strong', tone: 'good' }
  if (score === 3) return { bars: 3, label: 'Strong enough', tone: 'good' }
  return { bars: 2, label: 'Okay', tone: 'fair' }
}

export type PasswordProblem = 'short' | 'long' | 'personal'

/** The rules a new password breaks: the server checks these, and the form shows them as a list. */
export function passwordProblems(password: string, person: { email?: string; name?: string }): PasswordProblem[] {
  const problems: PasswordProblem[] = []
  if (password.length < PASSWORD_MIN) problems.push('short')
  if (password.length > PASSWORD_MAX) problems.push('long')
  const lower = password.toLowerCase()
  const personal = [person.email?.split('@')[0], ...(person.name?.split(/\s+/) ?? [])]
    .map((part) => part?.toLowerCase().trim() ?? '')
    .filter((part) => part.length >= 3)
  if (personal.some((part) => lower.includes(part))) problems.push('personal')
  return problems
}
