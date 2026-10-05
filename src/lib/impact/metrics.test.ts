import { describe, expect, it } from 'vitest'
import { formatMetric } from './metrics'

describe('formatMetric', () => {
  it('says plainly when there is not enough data, instead of showing 0', () => {
    expect(formatMetric(null, '%')).toBe('Not enough data yet')
    expect(formatMetric(undefined, '')).toBe('Not enough data yet')
  })
  it('shows real zeros, thousands separators and units', () => {
    expect(formatMetric(0, '')).toBe('0')
    expect(formatMetric(12345, '')).toBe('12,345')
    expect(formatMetric(12.5, '%')).toBe('12.5%')
    expect(formatMetric(3.5, 'h')).toBe('3.5 h')
  })
})
