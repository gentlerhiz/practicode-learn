// Copies browser files the app serves from public/vendor, so they match the installed package versions:
// axe-core, which project checks run in the learner's browser. Runs before dev and build.
import { copyFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
mkdirSync('public/vendor', { recursive: true })
copyFileSync(require.resolve('axe-core/axe.min.js'), 'public/vendor/axe.min.js')
