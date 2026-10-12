// Gives Pro to a learner by hand, or takes a hand-given Pro away, until Paystack subscriptions do it.
// Dev by default (.env.local); add --prod for production (.env.prod, see docs/operations/deployment.md).
//
//   npm run pro -- grant you@example.com [--prod]
//   npm run pro -- revoke you@example.com [--prod]
//   npm run pro -- list [--prod]
import { existsSync, readFileSync } from 'node:fs'
import { parseEnv } from 'node:util'
import { createClient } from '@supabase/supabase-js'

const args = process.argv.slice(2)
const prodMode = args.includes('--prod')
const [action, email] = args.filter((a) => a !== '--prod')

const read = (file) => (existsSync(file) ? parseEnv(readFileSync(file, 'utf8')) : {})
const env = prodMode ? read('.env.prod') : read('.env.local')
const url = prodMode
  ? `https://${env.PROD_PROJECT_REF || 'kafoztmgrqstkwzdlyin'}.supabase.co`
  : env.NEXT_PUBLIC_SUPABASE_URL
const key = prodMode ? env.PROD_SUPABASE_SECRET_KEY : env.SUPABASE_SECRET_KEY

if (!['grant', 'revoke', 'list'].includes(action) || (action !== 'list' && !email?.includes('@'))) {
  console.error('Usage: npm run pro -- <grant <email> | revoke <email> | list> [--prod]')
  process.exit(2)
}
if (!url || !key) {
  console.error(
    prodMode
      ? 'Add PROD_SUPABASE_SECRET_KEY to .env.prod first (see docs/operations/deployment.md#going-live).'
      : 'Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY to .env.local first.',
  )
  process.exit(2)
}

const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
console.log(`${prodMode ? 'Production' : 'Dev'}: ${url}`)

/** Every account, a page at a time (the admin API has no search by email). */
async function allUsers() {
  const users = []
  for (let page = 1; ; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw error
    users.push(...data.users)
    if (data.users.length < 1000) return users
  }
}

async function findUser(address) {
  const wanted = address.trim().toLowerCase()
  const user = (await allUsers()).find((u) => u.email?.toLowerCase() === wanted)
  if (!user) {
    console.error(`No account uses ${address}. Sign up with it first.`)
    process.exit(1)
  }
  return user
}

if (action === 'list') {
  const { data, error } = await db
    .from('memberships')
    .select('learner_id, source, status, billing, current_period_end')
  if (error) throw error
  const byId = new Map((await allUsers()).map((u) => [u.id, u.email]))
  if (!data.length) console.log('Nobody has Pro yet.')
  for (const m of data) {
    const until = m.current_period_end ? `until ${m.current_period_end.slice(0, 10)}` : 'no end date'
    console.log(`${byId.get(m.learner_id) ?? m.learner_id}: ${m.source}, ${m.status}, ${until}`)
  }
} else if (action === 'grant') {
  const user = await findUser(email)
  const { error } = await db.from('memberships').upsert({
    learner_id: user.id,
    source: 'granted',
    status: 'active',
    billing: null,
    current_period_end: null,
    updated_at: new Date().toISOString(),
  })
  if (error) {
    // The profile only exists once the email address is confirmed.
    console.error(`Could not give ${email} Pro: ${error.message}`)
    process.exit(1)
  }
  console.log(`✓ ${email} has Pro, with no end date.`)
} else {
  const user = await findUser(email)
  const { data, error } = await db
    .from('memberships')
    .delete()
    .eq('learner_id', user.id)
    .eq('source', 'granted')
    .select('learner_id')
  if (error) throw error
  console.log(
    data.length ? `✓ ${email} is back on Free.` : `${email} had no hand-given Pro, so nothing changed.`,
  )
}
