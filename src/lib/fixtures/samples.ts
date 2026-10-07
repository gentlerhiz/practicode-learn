import type { Route } from 'next'
import type { DashboardData } from '@/components/app/dashboard/types'
import type { ShellUser } from '@/components/app/shell/app-shell'

/** The canvas's sample learner, Tolu Adebayo, part-way through the Front-End track (PrismDashboard). */
export const SAMPLE_USER: ShellUser = {
  name: 'Tolu Adebayo',
  email: 'tolu.adebayo@gmail.com',
  isAdmin: false,
  status: 'Pro trial · 5 days left',
  trialDaysLeft: 5,
  reviewDue: 5,
}

const MODULES: [string, 'm' | 'p' | 't'][] = [
  ['How the web works', 'm'], ['HTML', 'm'], ['Toolkit and Git', 'm'], ['CSS basics', 'm'], ['Type and images', 'm'],
  ['Flexbox', 'p'], ['Grid and responsive', 't'], ['JavaScript', 't'], ['Thinking in JS', 't'], ['DOM and events', 't'],
  ['APIs and data', 't'], ['Team Git and tools', 't'], ['Accessibility', 't'], ['Design for devs', 't'], ['Ship it', 't'],
]

export const SAMPLE_DASHBOARD: DashboardData = {
  firstName: 'Tolu',
  trialDaysLeft: 5,
  intro: { text: 'You stopped halfway through Flexbox.', accent: 'About 8 minutes to finish it.' },
  resume: {
    eyebrow: 'Front-End · Module 6 · Lesson 4',
    title: 'Aligning items with Flexbox',
    detail: 'Step 4 of 9 · about 8 min left',
    modulePct: 43,
    href: '/fixtures/screens/lesson' as Route,
    action: 'Jump Back In',
    visual: { label: 'align-items', value: 'center' },
  },
  week: {
    days: ['fe', 'fe', 'missed', 'da', 'today', 'later', 'later'],
    count: 3,
    goal: 5,
    note: 'Two more days and you’ve hit your goal. Missing a day doesn’t reset anything.',
  },
  review: { due: 5, minutes: 4, card: { before: 'Which property controls spacing along the ', accent: 'main axis', after: '?' } },
  minutes: [
    { day: 'Mon', fe: 14, da: 0 },
    { day: 'Tue', fe: 22, da: 0 },
    { day: 'Wed', fe: 0, da: 0 },
    { day: 'Thu', fe: 0, da: 18 },
    { day: 'Fri', fe: 9, da: 0 },
    { day: 'Sat', fe: 0, da: 0 },
    { day: 'Sun', fe: 0, da: 0 },
  ],
  project: {
    title: 'Navigation bar and menu cards',
    passed: 3,
    total: 5,
    checks: [
      { label: 'Header, nav, main and footer', ok: true },
      { label: 'Navigation laid out with Flexbox', ok: true },
      { label: 'Every image has alt text', ok: true },
      { label: 'Fits a 320px screen', ok: false },
      { label: 'Text contrast', ok: false },
    ],
    href: '/fixtures/screens/project' as Route,
  },
  path: {
    trackTitle: 'Front-End',
    mastered: 5,
    total: 15,
    nodes: MODULES.map(([name, s]) =>
      s === 'm' ? { name, state: 'mastered' } : s === 'p' ? { name, state: 'progress', pct: 43 } : { name, state: 'todo' },
    ),
    check: {
      title: 'Module 6 check',
      detail: '12 questions · pass with 80% to master Flexbox',
      href: '/fixtures/screens/module-check' as Route,
      action: 'Take the Check',
    },
  },
  tracks: [
    { id: 'fe', name: 'Front-End Web Development', note: '5 of 15', pct: 33, action: 'Continue', href: '/fixtures/screens/lesson' as Route },
    { id: 'da', name: 'Data Analysis', note: '1 of 11', pct: 9, action: 'Continue', href: '/fixtures/screens/projects' as Route },
    { id: 'ux', name: 'UI/UX Product Design', note: 'Not started', pct: 0, action: 'Try Free', href: '/#tracks' as Route },
    { id: 'ai', name: 'AI & Machine Learning', note: 'Not started', pct: 0, action: 'Try Free', href: '/#tracks' as Route },
  ],
}
