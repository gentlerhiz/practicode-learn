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
  'dom-tree',
  'branch-graph',
  'design-file',
  'lighthouse',
  'deploy-pipeline',
  // IT Fundamentals
  'device-check',
  'computer-parts',
  'computer-kinds',
  'computing-timeline',
  'binary-bits',
  'data-sizes',
  // Introduction to Cybersecurity
  'what-you-protect',
  'cia-triad',
  'threat-house',
  'attackers',
  'attack-paths',
  'risk-matrix',
] as const

export type LabName = (typeof LAB_NAMES)[number]
