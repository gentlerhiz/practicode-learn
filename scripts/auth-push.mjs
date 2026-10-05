// Applies the sign-in settings in supabase/config.toml to the dev project. Run it yourself
// (npm run auth:push): it uses your own `supabase login`, shows each change and asks before writing.
// Only RESEND_SMTP_KEY is read from .env.local, for the SMTP password.
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { parseEnv } from 'node:util'

const DEV_PROJECT = 'ufdgednkiplkrfoaxllj'

const local = existsSync('.env.local') ? parseEnv(readFileSync('.env.local', 'utf8')) : {}
if (!local.RESEND_SMTP_KEY) {
  console.error('RESEND_SMTP_KEY is missing from .env.local, so the email settings would be incomplete.')
  process.exit(1)
}

const { status } = spawnSync(`npx --yes supabase@2.119.0 config push --project-ref ${DEV_PROJECT}`, {
  shell: true,
  stdio: 'inherit',
  env: { ...process.env, RESEND_SMTP_KEY: local.RESEND_SMTP_KEY },
})
process.exit(status ?? 1)
