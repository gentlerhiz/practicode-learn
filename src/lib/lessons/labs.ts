/** Interactive drawings built into the lesson player. A lesson can only name one of these. */
export const LAB_NAMES = [
  'request-journey',
  'page-load',
  'flex-axes',
  'url-anatomy',
  'http-exchange',
  'file-paths',
  'screen-reader',
  'link-preview',
  'editor-tour',
  'terminal',
  'git-flow',
  'devtools',
] as const

export type LabName = (typeof LAB_NAMES)[number]
