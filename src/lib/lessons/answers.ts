// Typed answers (the lesson format's Type step). Node runs this file in the content tools too, so it
// uses only erasable syntax and no imports.

/**
 * Trims, collapses spaces, straightens quotes and drops a final full stop, so "cd  .." and "cd .." agree.
 * A dot after a space, a slash or another dot is part of a command (git add ., cd ..), not a full stop.
 */
export function normaliseAnswer(answer: string, caseSensitive = false): string {
  const plain = answer
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/([^.\s/])\.$/, '$1')
    .trim()
  return caseSensitive ? plain : plain.toLowerCase()
}

/** True when `answer` is one of the accepted answers. */
export function acceptsAnswer(answer: string, accept: readonly string[], caseSensitive = false): boolean {
  const given = normaliseAnswer(answer, caseSensitive)
  return given !== '' && accept.some((a) => normaliseAnswer(a, caseSensitive) === given)
}
