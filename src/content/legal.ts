/**
 * Legal pages in plain language. Working draft: a lawyer reviews these before payments start
 * (docs/operations/launch-checklist.md). Keep them true to what the product does today, and update
 * `updated` whenever the substance changes.
 */

export type LegalDoc = {
  title: string
  updated: string
  summary: string[]
  sections: { heading: string; body: string[] }[]
}

export type LegalSlug = 'privacy' | 'terms' | 'accessibility'

const CONTACT = 'practicodeacademy@gmail.com'

export const legalDocs: Record<LegalSlug, LegalDoc> = {
  privacy: {
    title: 'Privacy notice',
    updated: '4 October 2026',
    summary: [
      'We collect only what we need to teach you and run your account.',
      'We never sell your data or use it for advertising.',
      'When accounts open, you can download or delete your data at any time from Settings.',
      'Our analytics don’t use cookies and can’t identify you.',
    ],
    sections: [
      {
        heading: 'Who we are',
        body: [
          `PractiCode Learn is run by Practicode Consult Limited, the company behind PractiCode Academy, at 7B Oba Olagbegi, Old Bodija, Ibadan, Nigeria. We decide how your data is used (we are the data controller). Contact us at ${CONTACT}.`,
        ],
      },
      {
        heading: 'What we collect',
        body: [
          'Account details: your email address, and your name if you add one. If you sign in with Google, we receive your name, email address and profile picture from Google.',
          'Your country, worked out once from your internet connection when you create an account. We store the country only, never your IP address or location.',
          'Your learning: which lessons and steps you complete, your answers, the code you submit for checks, and how long you spend learning. Progress is saved on your device first and sent to us when you are online.',
          'Visits to our pages: counted by Vercel Web Analytics, which uses no cookies and doesn’t identify you, and by Vercel Speed Insights, which measures how fast pages load.',
          'Emails you send us, if you write to us.',
        ],
      },
      {
        heading: 'Why we use it',
        body: [
          'To provide the service: your account, your progress, and picking up where you left off on any device. Our legal basis is our contract with you.',
          'To improve lessons and report our impact, using combined figures (for example, how many learners completed Module 1, by country). These reports never name or single out a learner. Our legal basis is our legitimate interest in running and improving an education service.',
          'To keep the service secure and prevent abuse. Our legal basis is our legitimate interest.',
        ],
      },
      {
        heading: 'Where your data is stored, and who helps us',
        body: [
          'Supabase stores our database, sign-in and lesson files in the European Union (Frankfurt, Germany).',
          'Vercel hosts the website and provides our cookieless analytics.',
          'Resend sends sign-in codes and account emails.',
          'Google provides sign-in, only if you choose “Continue with Google”.',
          'Each provider works under a data processing agreement. Where data leaves Nigeria, we rely on the transfer safeguards the Nigeria Data Protection Act 2023 and the GDPR require, such as standard contractual clauses.',
        ],
      },
      {
        heading: 'How long we keep it',
        body: [
          'We keep your account and learning records while your account is open. If you don’t sign in for 3 years, we email you, then delete the account.',
          'When you delete your account, we delete your personal data within 30 days. Combined figures that can’t identify you, such as monthly totals of lessons completed, are kept.',
          'Emails you send us are kept for up to 2 years.',
        ],
      },
      {
        heading: 'The AI tutor',
        body: [
          'The AI tutor isn’t available yet. Before it launches, we will update this notice to name the AI provider, explain what is sent to it, and confirm that your questions are never used to train AI models.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'You can see, correct, download or delete your data, and object to how we use it. When accounts open, download and deletion will be self-service in Settings. Until then, and for anything else, email us and we will reply within the time the law requires (usually one month).',
          'We follow the Nigeria Data Protection Act 2023, and the GDPR and UK GDPR for learners in Europe and the UK. You can complain to the Nigeria Data Protection Commission, or to your local data protection authority.',
        ],
      },
      {
        heading: 'Children',
        body: [
          'You need to be at least 13 to create an account. In some countries, learners under 16 need a parent’s permission.',
        ],
      },
    ],
  },

  terms: {
    title: 'Terms of use',
    updated: '4 October 2026',
    summary: [
      'Be kind, and do your own work on assessments.',
      'Lessons and the PractiCode name belong to us. Your projects and code belong to you.',
      'PractiCode Learn is free during the beta. There is nothing to pay.',
      'Certificates, when they arrive, show the skills you demonstrated. They are not a degree.',
    ],
    sections: [
      {
        heading: 'Your account',
        body: [
          'You need to be at least 13 to use PractiCode Learn. Keep your sign-in to yourself. You are responsible for what happens on your account.',
        ],
      },
      {
        heading: 'Using PractiCode Learn',
        body: [
          'Use it to learn. Don’t try to break, overload or get around the service’s security, don’t scrape or copy lessons in bulk, and don’t use it to harm anyone.',
          'Code you run in lessons runs in your own browser, in a sandbox. Don’t use it to attack other sites or people.',
        ],
      },
      {
        heading: 'Who owns what',
        body: [
          'The lessons, labs and the PractiCode name and logo belong to Practicode Consult Limited. The public syllabi are shared under CC BY-SA 4.0, and the platform’s source code under AGPL-3.0, as described in our repository.',
          'Your projects and the code you write belong to you.',
        ],
      },
      {
        heading: 'The beta',
        body: [
          'PractiCode Learn is in beta. Things will change, and we may occasionally reset a lesson or move features around. We will never take away progress you have made without telling you first.',
          'There is nothing to pay during the beta. When Pro launches, we will show the price in your currency before you pay, and these terms will be updated with how paying and cancelling work.',
        ],
      },
      {
        heading: 'Our responsibilities',
        body: [
          'We work hard to keep lessons accurate and the service running, but we can’t promise it will always be available or error-free. Nothing in these terms limits rights you have under consumer law.',
          'These terms are governed by the laws of the Federal Republic of Nigeria.',
        ],
      },
      {
        heading: 'Changes and questions',
        body: [
          `If we change these terms in a way that matters, we will tell you before the change applies. Questions: ${CONTACT}.`,
        ],
      },
    ],
  },

  accessibility: {
    title: 'Accessibility statement',
    updated: '4 October 2026',
    summary: [
      'Every part of PractiCode Learn should work for everyone, including people who use a screen reader, a keyboard, zoom or reduced motion.',
      'We aim to meet WCAG 2.2 at level AA, in light and dark mode, on small screens first.',
    ],
    sections: [
      {
        heading: 'What we do',
        body: [
          'Every page is checked automatically against WCAG 2.2 AA in both themes, at phone and desktop sizes, before each release.',
          'Animations stop when you turn on reduced motion in your device settings.',
          'Colour is never the only way we show something. Icons and words come with it.',
          'Pages work with a keyboard, with a visible focus outline and a “Skip to content” link.',
          'You can choose light or dark mode, or follow your device.',
        ],
      },
      {
        heading: 'What we know isn’t perfect yet',
        body: [
          'We haven’t yet completed a full manual audit with screen readers (TalkBack and NVDA). It is planned before the full launch, and we will publish what we find here.',
          'Some decorative illustrations are hidden from screen readers on purpose, because they repeat what the text already says.',
        ],
      },
      {
        heading: 'Tell us what isn’t working',
        body: [
          `If something gets in your way, email ${CONTACT}. We reply within 5 working days and tell you when it is fixed.`,
        ],
      },
    ],
  },
}

export const legalSlugs = Object.keys(legalDocs) as LegalSlug[]
