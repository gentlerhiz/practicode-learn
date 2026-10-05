import { describe, expect, it } from 'vitest'
import { highlight } from './highlight'

describe('highlight', () => {
  it('marks the whole line that holds {{value}}, with the value in place', () => {
    const lines = highlight('.nav {\n  align-items: {{value}};\n}', 'css', 'center').split('\n')
    expect(lines[1]).toMatch(/^<mark>.*center.*<\/mark>$/)
    expect(lines[0]).not.toContain('<mark>')
    expect(lines[2]).not.toContain('<mark>')
  })

  it('keeps CSS comments and selectors whole, even on the marked line', () => {
    const html = highlight('/* the menu */\n.nav { gap: {{value}}; }', 'css', '12px')
    expect(html).toContain('<span class="c-com">/* the menu */</span>')
    expect(html).toContain('<mark><span class="c-sel">.nav</span> {')
    expect(html).toContain('<span class="c-val">12px</span>')
  })

  it('colours HTML tags and attributes', () => {
    expect(highlight('<p class="sign">Open</p>', 'html')).toContain(
      '&lt;<span class="c-tag">p</span> <span class="c-attr">class</span>=<span class="c-str">&quot;sign&quot;</span>&gt;',
    )
  })

  it('escapes code, so it can never become markup', () => {
    const html = highlight('<img src=x onerror=alert(1)>', 'html')
    expect(html).not.toContain('<img')
    expect(highlight('a { content: "<b>"; }', 'css')).not.toContain('<b>')
  })

  it('leaves code without a value unmarked', () => {
    expect(highlight('.a { color: red; }', 'css')).not.toContain('<mark>')
  })
})
