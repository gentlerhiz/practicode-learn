/**
 * Plan prices by currency, from the canvas (docs/product/business-model.md). Payments aren't live yet:
 * these are the planned prices, and checkout says so until it can take money.
 */
export const CURRENCIES = {
  NGN: { label: '₦ NGN', sym: '₦', monthly: 6500, yearly: 59000, mentor: '₦80,000', mentorPeriod: 'per course', mentorNote: 'Three months, online or in person' },
  GHS: { label: 'GH₵', sym: 'GH₵ ', monthly: 85, yearly: 790, mentor: 'Ask us', mentorPeriod: '', mentorNote: 'Online cohorts, priced per intake' },
  KES: { label: 'KSh', sym: 'KSh ', monthly: 950, yearly: 8900, mentor: 'Ask us', mentorPeriod: '', mentorNote: 'Online cohorts, priced per intake' },
  GBP: { label: '£ GBP', sym: '£', monthly: 9, yearly: 79, mentor: 'Ask us', mentorPeriod: '', mentorNote: 'Online cohorts, priced per intake' },
  USD: { label: '$ USD', sym: 'US$', monthly: 12, yearly: 99, mentor: 'Ask us', mentorPeriod: '', mentorNote: 'Online cohorts, priced per intake' },
} as const

export type Currency = keyof typeof CURRENCIES

const fmt = (n: number) => n.toLocaleString('en-US')

/** Prices as the plan cards show them, for one currency and billing period. */
export function planPrices(code: Currency, yearly: boolean) {
  const p = CURRENCIES[code]
  const save = Math.round((1 - p.yearly / (p.monthly * 12)) * 100)
  return {
    save,
    free: `${p.sym}0`,
    pro: `${p.sym}${fmt(yearly ? p.yearly : p.monthly)}`,
    proPeriod: yearly ? '/year' : '/month',
    proNote: yearly ? `About ${p.sym}${fmt(Math.round(p.yearly / 12))} a month, billed yearly` : 'Billed monthly. Cancel anytime.',
    mentor: p.mentor,
    mentorPeriod: p.mentorPeriod,
    mentorNote: p.mentorNote,
  }
}

export const PLAN_FEATURES = {
  free: ['Module 1 of every track', 'Daily review', 'AI tutor, 5 questions a day', 'Community forum'],
  pro: [
    'Every module in every track',
    'AI tutor, 50 questions a day',
    'Projects with automatic checks',
    'Verified certificates',
    'Download any module',
    'PL-300 exam prep',
  ],
  mentor: ['Everything in Pro', 'Weekly live classes', 'An instructor reviews your projects'],
}
