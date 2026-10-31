// Read by the app and directly by the content tools, so: explicit .ts extensions, erasable syntax only.
import type { LessonTest } from '../lessons/schema.ts'
import { engineFor } from '../runner/engines.ts'

/**
 * The checks every project gets on top of its brief's own: no serious accessibility problems (axe, the
 * engine behind the browser extension), and no sideways scrolling on a phone, a tablet or a laptop.
 * Each one runs in the learner's browser, like lesson tests, so it costs nothing to run.
 */
export const SCREENS = [
  { width: 320, height: 640, label: 'a phone' },
  { width: 768, height: 900, label: 'a tablet' },
  { width: 1280, height: 800, label: 'a laptop' },
] as const

/** The accessibility check, which needs axe (axe-core's axe.min.js) loaded as a helper script. */
export const accessibilityCheck: LessonTest = {
  name: 'No serious accessibility problems (axe)',
  code: `assert(window.axe, 'The accessibility checker didn’t load. Run the checks again.');
const result = await window.axe.run(
  { exclude: [['pcl-console'], ['pcl-inbox']] },
  { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }, resultTypes: ['violations'] },
);
const serious = result.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
assert(
  !serious.length,
  serious
    .slice(0, 3)
    .map((v) => \`\${v.help}: \${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(', ')}\`)
    .join('. ') + (serious.length > 3 ? \`. And \${serious.length - 3} more.\` : '.'),
);`,
}

/** The screen-size check, run once at each of SCREENS' widths. */
export const screenCheck = (screen: (typeof SCREENS)[number]): LessonTest => ({
  name: `Fits ${screen.label} (${screen.width}px wide)`,
  code: `const wide = document.documentElement.scrollWidth;
const culprit = [...document.body.querySelectorAll('*')].find((el) => el.getBoundingClientRect().right > innerWidth + 1);
assert(
  wide <= innerWidth + 1,
  \`At ${screen.width}px wide, the page is \${wide}px wide, so it scrolls sideways.\` +
    (culprit ? \` The first thing too wide is <\${culprit.tagName.toLowerCase()}\${culprit.className ? ' class="' + culprit.className + '"' : ''}>.\` : ''),
);`,
})

export type CheckResult = { name: string; pass: boolean; message?: string }

/**
 * A project that's a program (Python or SQL) rather than a page: it has no page to check for accessibility
 * or screen sizes, so it gets runsCheck instead.
 */
export const isProgram = (files: { lang: string }[]) => engineFor(files) !== null

/** The built-in check for a program: it runs to the end without an error. */
export const runsCheck: LessonTest = {
  name: 'Runs without errors',
  code: `assert(!window.__pclError, 'It stopped with an error: ' + window.__pclError + ' Fix that, then run the checks again.');`,
}

/** Every check a project has, in the order the workspace lists them. */
export const allCheckNames = (brief: { name: string }[], program = false) => [
  ...brief.map((c) => c.name),
  ...(program ? [runsCheck.name] : [accessibilityCheck.name, ...SCREENS.map((s) => screenCheck(s).name)]),
]
