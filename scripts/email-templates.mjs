// Writes the sign-in emails in supabase/templates from one Prism (dark) layout, so they always match.
// Run `node scripts/email-templates.mjs` after changing this file, then `npm run auth:push` to send them
// to Supabase. Email clients ignore most modern CSS, so everything is inline, laid out with tables,
// and every colour has a solid fallback. Images load from the live site, which every client can reach.
import { writeFileSync } from 'node:fs'

const SITE = 'https://learn.practicode.tech'
const C = {
  page: '#07060D',
  card: '#0F0D1B',
  line: '#2A2540',
  divider: '#221E36',
  ink: '#FFFFFF',
  soft: '#DCD9EA',
  muted: '#A9A6BC',
  subtle: '#8B88A0',
  link: '#8EA2FF',
  chipBg: '#1A1D45',
  chipLine: '#2F3A8F',
}
const SANS = "Poppins, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
const DISPLAY = "'Bricolage Grotesque', Poppins, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

const esc = (s) => s.replace(/&/g, '&amp;')

/** The button: a table, so it keeps its shape in Outlook. */
const button = (href, label) => `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 24px">
  <tr>
    <td bgcolor="#FFFFFF" style="border-radius: 999px; background: #FFFFFF">
      <a href="${esc(href)}" target="_blank" style="display: inline-block; padding: 15px 30px; font-family: ${SANS}; font-size: 16px; font-weight: 600; line-height: 20px; color: #07060D; text-decoration: none; border-radius: 999px">${label}</a>
    </td>
  </tr>
</table>`

const p = (html, extra = '') =>
  `<p style="margin: 0 0 16px; font-family: ${SANS}; font-size: 16px; line-height: 26px; color: ${C.soft}${extra}">${html}</p>`

function layout({ title, preheader, chip, heading, body, href, action, after = '' }) {
  return `<!doctype html>
<html lang="en-GB" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${title}</title>
<!-- Made by scripts/email-templates.mjs. Edit that file, not this one. -->
</head>
<body style="margin: 0; padding: 0; background: ${C.page}; -webkit-text-size-adjust: 100%">
<div style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: ${C.page}">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.page}" style="background: ${C.page}">
  <tr>
    <td align="center" style="padding: 40px 16px 48px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px">

        <tr>
          <td style="padding: 0 4px 24px">
            <a href="${SITE}" target="_blank" style="text-decoration: none">
              <img src="${SITE}/icons/icon-192.png" width="36" height="36" alt="" style="display: inline-block; width: 36px; height: 36px; border: 0; border-radius: 9px; vertical-align: middle">
              <span style="display: inline-block; margin-left: 10px; vertical-align: middle; font-family: ${SANS}; font-size: 18px; line-height: 36px; color: ${C.ink}">Practi<strong>Code</strong> Learn</span>
            </a>
          </td>
        </tr>

        <tr>
          <td bgcolor="${C.card}" style="background: ${C.card}; border: 1px solid ${C.line}; border-radius: 24px; overflow: hidden">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td height="4" bgcolor="#5B63FF" style="height: 4px; line-height: 4px; font-size: 0; background: #5B63FF; background-image: linear-gradient(90deg, #4D6BFF, #7B5CFF)">&nbsp;</td>
              </tr>
              <tr>
                <td style="padding: 36px 32px 32px">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 20px">
                    <tr>
                      <td bgcolor="${C.chipBg}" style="background: ${C.chipBg}; border: 1px solid ${C.chipLine}; border-radius: 999px; padding: 4px 12px; font-family: ${SANS}; font-size: 12px; font-weight: 600; line-height: 18px; color: ${C.link}">${chip}</td>
                    </tr>
                  </table>
                  <h1 style="margin: 0 0 16px; font-family: ${DISPLAY}; font-size: 30px; line-height: 36px; font-weight: 800; letter-spacing: -0.02em; color: ${C.ink}">${heading}</h1>
                  ${body}
                  ${button(href, action)}
                  ${after}
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr><td height="1" bgcolor="${C.divider}" style="height: 1px; line-height: 1px; font-size: 0; background: ${C.divider}">&nbsp;</td></tr>
                  </table>
                  <p style="margin: 20px 0 6px; font-family: ${SANS}; font-size: 13px; line-height: 20px; color: ${C.muted}">Button not working? Copy this link into your browser:</p>
                  <p style="margin: 0; font-family: Menlo, Consolas, 'Courier New', monospace; font-size: 12px; line-height: 18px; word-break: break-all"><a href="${esc(href)}" target="_blank" style="color: ${C.link}; text-decoration: underline">${esc(href)}</a></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td align="center" style="padding: 28px 16px 0; font-family: ${SANS}; font-size: 13px; line-height: 20px; color: ${C.subtle}">
            <p style="margin: 0 0 10px">Questions? Reply to this email or write to <a href="mailto:practicodeacademy@gmail.com" style="color: ${C.soft}; text-decoration: underline">practicodeacademy@gmail.com</a>.</p>
            <p style="margin: 0">PractiCode Learn · Practicode Consult Limited<br>7B Oba Olagbegi, Old Bodija, Ibadan, Nigeria</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>
`
}

const note = (html) =>
  `<p style="margin: 0 0 24px; font-family: ${SANS}; font-size: 14px; line-height: 22px; color: ${C.muted}">${html}</p>`

/** The first lesson, as a small card: what the new learner gets once they confirm. */
const firstLesson = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 24px">
  <tr>
    <td bgcolor="#141130" style="background: #141130; border: 1px solid ${C.line}; border-radius: 16px; padding: 16px 18px">
      <p style="margin: 0 0 4px; font-family: ${SANS}; font-size: 12px; line-height: 18px; color: ${C.link}">Front-End · Module 1 · Lesson 1 · Free</p>
      <p style="margin: 0; font-family: ${SANS}; font-size: 15px; line-height: 22px; font-weight: 600; color: ${C.ink}">What happens when you open a website</p>
      <p style="margin: 2px 0 0; font-family: ${SANS}; font-size: 13px; line-height: 20px; color: ${C.muted}">About 10 minutes. You’ll guess before you’re told.</p>
    </td>
  </tr>
</table>`

const templates = {
  confirmation: layout({
    title: 'Confirm your email',
    preheader: 'One tap and your first lesson is ready.',
    chip: 'Welcome',
    heading: 'Confirm your email',
    body: p('Thanks for joining PractiCode Learn. Tap the button to confirm it’s really you, and your first lesson is ready when you are.'),
    href: '{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup',
    action: 'Confirm My Email',
    after: firstLesson + note('The link works for 30 minutes. If you didn’t sign up, ignore this email and no account is made.'),
  }),
  recovery: layout({
    title: 'Reset your password',
    preheader: 'Choose a new password. The link works for 30 minutes.',
    chip: 'Password reset',
    heading: 'Reset your password',
    body: p('Someone asked to reset the password for <strong style="color: #FFFFFF; font-weight: 600">{{ .Email }}</strong>. Tap the button to choose a new one.'),
    href: '{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/new-password',
    action: 'Choose a New Password',
    after: note('The link works for 30 minutes. If you didn’t ask for this, ignore this email: your password stays the same.'),
  }),
  email_change: layout({
    title: 'Confirm your new email',
    preheader: 'Confirm the new email address for your PractiCode Learn account.',
    chip: 'Email change',
    heading: 'Confirm your new email',
    body: p('You asked to change the email on your PractiCode Learn account from <strong style="color: #FFFFFF; font-weight: 600">{{ .Email }}</strong> to <strong style="color: #FFFFFF; font-weight: 600">{{ .NewEmail }}</strong>. Confirm it, and we’ll use the new one from now on.'),
    href: '{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email_change&next=/settings',
    action: 'Confirm New Email',
    after: note('The link works for 30 minutes. If you didn’t ask for this, ignore this email and your email stays the same.'),
  }),
}

for (const [name, html] of Object.entries(templates)) {
  writeFileSync(`supabase/templates/${name}.html`, html)
  console.log(`✓ supabase/templates/${name}.html`)
}
