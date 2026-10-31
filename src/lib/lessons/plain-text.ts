const NAMED: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

/**
 * Lesson HTML as plain text, for labels and prompts: tags dropped and entities decoded. The content build
 * writes some characters as hex entities (`&#x3C;` for <, `&#x26;` for &), so a label built from raw HTML
 * would be read aloud as codes.
 */
export const plainText = (html: string) =>
  html.replace(/<[^>]+>/g, '').replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
    if (code[0] !== '#') return NAMED[code.toLowerCase()] ?? entity
    const n = code[1] === 'x' || code[1] === 'X' ? parseInt(code.slice(2), 16) : Number(code.slice(1))
    return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : entity
  })
