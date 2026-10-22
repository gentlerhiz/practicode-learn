// How guessable a password is, judged the way attackers guess: leaked lists and common words first, then
// names and years, then trying every combination. Follows the NCSC and NIST advice that length beats
// complexity. Runs entirely on the learner's device; nothing is stored or sent.

export type Verdict = { level: 0 | 1 | 2 | 3 | 4; label: string; reasons: string[] }

// A few of the passwords that top every list of leaked passwords.
const LEAKED = ['password', '123456', '123456789', '12345678', 'qwerty', '111111', 'abc123', 'iloveyou', 'admin', 'welcome', 'letmein', 'monkey', 'dragon', 'football', 'sunshine', 'princess', 'password1', 'qwerty123', '000000', 'master']
const WORDS = ['password', 'sunshine', 'football', 'monkey', 'dragon', 'princess', 'welcome', 'summer', 'love', 'qwerty', 'admin', 'secret', 'baby', 'jesus', 'blessing', 'chelsea', 'arsenal']

const LABELS = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'] as const

export function judge(password: string): Verdict {
  const p = password
  const lower = p.toLowerCase()
  const reasons: string[] = []
  if (!p) return { level: 0, label: LABELS[0], reasons: ['Type a password to see how guessable it is.'] }

  if (LEAKED.includes(lower)) return { level: 0, label: LABELS[0], reasons: ['It’s in every list of leaked passwords. Attackers try these first, so it’s guessed instantly.'] }

  const words = p.split(/[\s\-_.]+/).filter((w) => /^[a-z]{3,}$/i.test(w))
  if (words.length >= 3 && p.length >= 16) {
    reasons.push(`${words.length} words and ${p.length} characters: long, and easy to remember.`)
    if (WORDS.some((w) => words.some((x) => x.toLowerCase() === w))) {
      reasons.push('One word is very common. Random, unconnected words are stronger.')
      return { level: 3, label: LABELS[3], reasons }
    }
    return { level: 4, label: LABELS[4], reasons }
  }

  const base = lower.replace(/[^a-z]/g, '')
  if (WORDS.some((w) => base.includes(w))) {
    reasons.push('It’s a common word with a capital, numbers or a symbol added. Attackers try those changes automatically, so it falls in seconds.')
    return { level: 0, label: LABELS[0], reasons }
  }
  if (/^[a-z]+((19|20)\d\d|\d{1,2})$/i.test(p)) {
    reasons.push('A name and a year, or a word and a number. Names and birth years are easy to find online and quick to guess.')
    return { level: 1, label: LABELS[1], reasons }
  }
  if (p.length < 8) {
    reasons.push(`Only ${p.length} characters. However many symbols it has, every combination that short can be tried quickly.`)
    return { level: 1, label: LABELS[1], reasons }
  }
  const kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z\d]/].filter((r) => r.test(p)).length
  if (p.length >= 14) {
    reasons.push(`${p.length} characters: long enough that trying every combination would take far too long.`)
    return { level: kinds >= 2 ? 4 : 3, label: LABELS[kinds >= 2 ? 4 : 3], reasons }
  }
  reasons.push(`${p.length} characters. Better, but longer is stronger: three random words is an easy way to get there.`)
  return { level: p.length >= 11 && kinds >= 3 ? 3 : 2, label: LABELS[p.length >= 11 && kinds >= 3 ? 3 : 2], reasons }
}
