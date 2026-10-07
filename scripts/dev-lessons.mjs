// Runs `next dev` against the lessons published to the Supabase project in .env.local, instead of the
// bundled samples. The test suite keeps using the samples, so this only changes the dev server it starts.
// Usage: npm run dev:lessons [-- --port 3000]
import { spawn } from 'node:child_process'

const child = spawn(['npx next dev', ...process.argv.slice(2)].join(' '), {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NEXT_PUBLIC_CONTENT_SOURCE: 'supabase' },
})
child.on('exit', (code) => process.exit(code ?? 0))
