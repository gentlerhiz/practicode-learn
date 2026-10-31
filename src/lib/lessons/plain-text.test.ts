import { describe, expect, it } from 'vitest'
import { plainText } from './plain-text'

describe('plainText', () => {
  it('drops tags and decodes named, decimal and hex entities', () => {
    expect(plainText('<code>&#x3C;&#x3C;&#x3C; HEAD</code>')).toBe('<<< HEAD')
    expect(plainText('<code>&#x26;&#x26;</code> and &amp; &quot;x&quot; &#39;y&#39;')).toBe(
      `&& and & "x" 'y'`,
    )
  })

  it('leaves unknown entities alone', () => {
    expect(plainText('&madeup; &#0;')).toBe('&madeup; &#0;')
  })
})
