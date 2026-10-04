import { describe, expect, it } from 'vitest'
import { resolveTheme, parsePreference } from './theme'

describe('theme', () => {
  it('follows the device by default', () => {
    expect(resolveTheme(parsePreference(null), true)).toBe('light')
    expect(resolveTheme(parsePreference(null), false)).toBe('dark')
  })
  it('honours an explicit choice whatever the device says', () => {
    expect(resolveTheme('dark', true)).toBe('dark')
    expect(resolveTheme('light', false)).toBe('light')
  })
  it('ignores garbage in storage', () => {
    expect(parsePreference('purple')).toBe('system')
  })
})
