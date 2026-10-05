import { afterEach, expect, it, vi } from 'vitest'
import RunnerFixturePage from './page'

afterEach(() => vi.unstubAllEnvs())

it('answers 404 in any build made without PCL_FIXTURES, so deployments never show it', () => {
  vi.stubEnv('PCL_FIXTURES', '')
  expect(() => RunnerFixturePage()).toThrow(/NEXT_HTTP_ERROR_FALLBACK;404/)
})

it('renders for the test server', () => {
  vi.stubEnv('PCL_FIXTURES', '1')
  expect(RunnerFixturePage()).toBeTruthy()
})
