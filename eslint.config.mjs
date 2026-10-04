import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // Defaults from eslint-config-next
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Generated or not ours to lint
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    'content/samples/packs/**',
    'design/**',
    'tools/content-build/preview/**',
    '.superpowers/**',
  ]),
])

export default eslintConfig
