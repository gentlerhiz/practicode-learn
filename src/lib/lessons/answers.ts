// Typed answers (the lesson format's Type step). Node runs this file in the content tools too, so it
// uses only erasable syntax and no imports.

/** Trims, collapses spaces, straightens quotes and drops a final full stop, so "cd  .." and "cd .." agree. */
export function normaliseAnswer(answer: string, caseSensitive = false): string {
  const plain = answer
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\.$/, '')
    .trim()
  return caseSensitive ? plain : plain.toLowerCase()
}

/** True when `answer` is one of the accepted answers. */
export function acceptsAnswer(answer: string, accept: readonly string[], caseSensitive = false): boolean {
  const given = normaliseAnswer(answer, caseSensitive)
  return given !== '' && accept.some((a) => normaliseAnswer(a, caseSensitive) === given)
}
