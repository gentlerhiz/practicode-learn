// Sets up the production Supabase project, one step at a time. Each step reads .env.prod (git-ignored,
// and not a file Next.js loads, so local builds and tests never touch production). See
// docs/operations/deployment.md#going-live for the order and what goes in .env.prod.
//
//   npm run prod -- check            what production has now (read-only)
//   npm run prod -- migrate          list the database migrations production still needs (read-only)
//   npm run prod -- migrate --apply  apply them
//   npm run prod -- auth             push the sign-in settings and emails (uses your own `supabase login`)
//   npm run prod -- lessons          publish the built lessons from ../practicode-learn-content
import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { parseEnv } from 'node:util'
import { createClient } from '@supabase/supabase-js'

const SITE = 'https://learn.practicode.tech'
const CLI = 'npx --yes supabase@2.119.0'
const CONTENT = path.resolve('..', 'practicode-learn-content', 'dist')

const read = (file) => (existsSync(file) ? parseEnv(readFileSync(file, 'utf8')) : {})
const prod = read('.env.prod')
const ref = prod.PROD_PROJECT_REF || 'kafoztmgrqstkwzdlyin'
const url = `https://${ref}.supabase.co`

function need(...names) {
  const missing = names.filter((n) => !prod[n]?.trim())
  if (missing.length) {
    console.error(
      `Add ${missing.join(', ')} to .env.prod first (see docs/operations/deployment.md#going-live).`,
    )
    process.exit(2)
  }
}

const run = (command, options = {}) =>
  spawnSync(command, { shell: true, stdio: 'inherit', ...options }).status ?? 1

async function check() {
  console.log(`Production project: ${url}`)
  if (prod.PROD_SUPABASE_SECRET_KEY) {
    const db = createClient(url, prod.PROD_SUPABASE_SECRET_KEY, { auth: { persistSession: false } })
    const { data: rows, error } = await db.from('lessons').select('id').order('id')
    if (!error) {
      console.log(
        `✓ Database tables exist. Lessons published: ${rows.length} (${rows.map((r) => r.id).join(', ') || 'none'})`,
      )
    } else
      console.log(`✗ Can't read the lessons table (${error.message}): run "npm run prod -- migrate" first.`)
  } else console.log('· Skipped the database check: PROD_SUPABASE_SECRET_KEY is not in .env.prod.')

  const page = await fetch(SITE + '/login')
  const csp = page.headers.get('content-security-policy') ?? ''
  console.log(
    csp.includes(url)
      ? '✓ The live site is connected to this project.'
      : '✗ The live site has no Supabase settings yet: add them in Vercel, then redeploy.',
  )
  const lesson = await fetch(`${SITE}/learn/front-end-web-development/what-happens-when-you-open-a-website`)
  console.log(`${lesson.ok ? '✓' : '✗'} Module 1, Lesson 1 on the live site: ${lesson.status}`)
}

function migrate(apply) {
  need('PROD_DB_URL')
  // The connection string carries the password, so it goes to the CLI through the environment only.
  const flags = apply ? '' : ' --dry-run'
  // On Windows the command runs in cmd.exe, which spells a variable %NAME%.
  const variable = process.platform === 'win32' ? '%PROD_DB_URL%' : '$PROD_DB_URL'
  return run(`${CLI} db push --db-url "${variable}"${flags}`, {
    env: { ...process.env, PROD_DB_URL: prod.PROD_DB_URL },
  })
}

function auth() {
  const local = read('.env.local')
  const smtp = prod.RESEND_SMTP_KEY || local.RESEND_SMTP_KEY
  if (!smtp) {
    console.error('RESEND_SMTP_KEY is missing from .env.prod and .env.local, so emails could not be sent.')
    process.exit(2)
  }
  // The same settings and emails as dev, with production's own address as the only place to return to.
  const dir = mkdtempSync(path.join(tmpdir(), 'pcl-prod-auth-'))
  cpSync('supabase/templates', path.join(dir, 'supabase', 'templates'), { recursive: true })
  const config = readFileSync('supabase/config.toml', 'utf8')
    .replace(/^site_url = .*$/m, `site_url = "${SITE}"`)
    .replace(/^additional_redirect_urls = \[[\s\S]*?\]$/m, `additional_redirect_urls = ["${SITE}/**"]`)
  if (!config.includes(`site_url = "${SITE}"`) || config.includes('localhost')) {
    console.error('Could not set the production address in the sign-in settings. Nothing was pushed.')
    process.exit(1)
  }
  writeFileSync(path.join(dir, 'supabase', 'config.toml'), config)
  try {
    return run(`${CLI} config push --project-ref ${ref}`, {
      cwd: dir,
      env: { ...process.env, RESEND_SMTP_KEY: smtp },
    })
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

function lessons() {
  need('PROD_SUPABASE_SECRET_KEY')
  if (!existsSync(path.join(CONTENT, 'catalogue.json'))) {
    console.error(`No built lessons in ${CONTENT}. Run "npm run build" in practicode-learn-content first.`)
    process.exit(2)
  }
  const packs = path.join(CONTENT, 'packs')
  const catalogue = path.join(CONTENT, 'catalogue.json')
  // These values win over .env.local (which points at dev): Node never overrides a variable already set.
  return run(`node tools/content-build/publish.ts --packs "${packs}" --catalogue "${catalogue}"`, {
    env: { ...process.env, SUPABASE_URL: url, SUPABASE_SECRET_KEY: prod.PROD_SUPABASE_SECRET_KEY },
  })
}

const [step, flag] = process.argv.slice(2)
const steps = { check, migrate: () => migrate(flag === '--apply'), auth, lessons }
if (!steps[step]) {
  console.error('Usage: npm run prod -- <check | migrate [--apply] | auth | lessons>')
  process.exit(2)
}
const status = await steps[step]()
process.exit(typeof status === 'number' ? status : 0)
