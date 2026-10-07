/** The "Open Gmail" button on check-email pages, for the providers most learners use. */
const providers: { domains: string[]; label: string; href: `https://${string}` }[] = [
  { domains: ['gmail.com', 'googlemail.com'], label: 'Open Gmail', href: 'https://mail.google.com' },
  { domains: ['outlook.com', 'hotmail.com', 'live.com', 'msn.com'], label: 'Open Outlook', href: 'https://outlook.live.com/mail/' },
  { domains: ['yahoo.com', 'yahoo.co.uk', 'ymail.com'], label: 'Open Yahoo Mail', href: 'https://mail.yahoo.com' },
  { domains: ['icloud.com', 'me.com', 'mac.com'], label: 'Open iCloud Mail', href: 'https://www.icloud.com/mail' },
  { domains: ['proton.me', 'protonmail.com'], label: 'Open Proton Mail', href: 'https://mail.proton.me' },
]

export function mailProvider(email: string | undefined) {
  const domain = email?.split('@')[1]?.toLowerCase()
  return providers.find((p) => domain && p.domains.includes(domain))
}
