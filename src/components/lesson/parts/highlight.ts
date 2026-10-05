const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * Light syntax colouring for lesson code, as HTML. Everything is escaped first, so lesson code can never
 * become markup. The line that holds {{value}} is marked as a whole, so the mark never cuts across the
 * colouring. Ported from the review preview the founder approved.
 */
export function highlight(code: string, lang: string, value?: string | null): string {
  const marked = new Set<number>()
  let lines = code.split('\n')
  if (value != null) {
    lines = lines.map((line, i) => {
      if (!line.includes('{{value}}')) return line
      marked.add(i)
      return line.split('{{value}}').join(value)
    })
  }
  let html = escape(lines.join('\n'))
  if (lang === 'css') {
    html = html
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="c-com">$1</span>')
      .replace(/^([^{}\n<]+?)(\s*)\{/gm, '<span class="c-sel">$1</span>$2{')
      .replace(
        /([a-z-]+)(\s*:\s*)([^;{}\n<]+)(;)/g,
        '<span class="c-prop">$1</span>$2<span class="c-val">$3</span>$4',
      )
  } else if (lang === 'html') {
    html = html.replace(
      /(&lt;\/?)([a-z0-9-]+)((?:\s+[a-z-]+(?:=&quot;[^&]*?&quot;)?)*)(\s*\/?&gt;)/gi,
      (_m, open: string, tag: string, attrs: string, close: string) =>
        `${open}<span class="c-tag">${tag}</span>${attrs.replace(
          /([a-z-]+)=(&quot;[^&]*?&quot;)/gi,
          '<span class="c-attr">$1</span>=<span class="c-str">$2</span>',
        )}${close}`,
    )
  }
  return html
    .split('\n')
    .map((line, i) => (marked.has(i) ? `<mark>${line}</mark>` : line))
    .join('\n')
}
