// Lists issued certificates, or revokes one. Revoking keeps the record, so its page says it was revoked
// and when, instead of disappearing. Dev by default (.env.local), which runs the live site for now.
//
//   npm run certificates -- list
//   npm run certificates -- revoke PCL-FE-XXXX-XXXX
import { existsSync, readFileSync } from 'node:fs'
import { parseEnv } from 'node:util'
import { createClient } from '@supabase/supabase-js'

const [action, code] = process.argv.slice(2)
const env = existsSync('.env.local') ? parseEnv(readFileSync('.env.local', 'utf8')) : {}
if (
  !['list', 'revoke'].includes(action) ||
  (action === 'revoke' && !/^PCL-[A-Z]{2}-[0-9A-Z]{4}-[0-9A-Z]{4}$/.test(code ?? ''))
) {
  console.error('Usage: npm run certificates -- <list | revoke PCL-FE-XXXX-XXXX>')
  process.exit(2)
}
if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SECRET_KEY) {
  console.error('Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY to .env.local first.')
  process.exit(2)
}

const bucket = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
}).storage.from('certificates')

async function read(path) {
  const { data, error } = await bucket.download(path)
  if (error) return null
  return JSON.parse(await data.text())
}

if (action === 'list') {
  const { data, error } = await bucket.list('records', { limit: 1000 })
  if (error && !/not found/i.test(error.message)) throw error
  const records = await Promise.all((data ?? []).map((f) => read(`records/${f.name}`)))
  for (const r of records.filter(Boolean).sort((a, b) => a.issuedAt.localeCompare(b.issuedAt)))
    console.log(
      `${r.code}  ${r.issuedAt.slice(0, 10)}  ${r.revokedAt ? `revoked ${r.revokedAt.slice(0, 10)}` : 'active'}  ${r.name}`,
    )
  if (!records.length) console.log('No certificates yet.')
} else {
  const record = await read(`records/${code}.json`)
  if (!record) {
    console.error(`No certificate has the code ${code}.`)
    process.exit(1)
  }
  if (record.revokedAt) {
    console.log(`${code} was already revoked on ${record.revokedAt.slice(0, 10)}.`)
  } else {
    record.revokedAt = new Date().toISOString()
    const body = new Blob([JSON.stringify(record)], { type: 'application/json' })
    const { error } = await bucket.upload(`records/${code}.json`, body, {
      upsert: true,
      contentType: 'application/json',
    })
    if (error) throw error
    console.log(`Revoked ${code} (${record.name}). Its page now says so.`)
  }
}
