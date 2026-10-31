// Read by the app and directly by the content tools, so: explicit .ts extensions, erasable syntax only.
import { plainText } from '../lessons/plain-text.ts'
import type { LessonPack } from '../lessons/schema.ts'
import type { ProjectPack } from '../projects/schema.ts'

/**
 * Module notes: what a learner keeps after a module, drawn as a PDF (pdf.ts). Built only from the
 * published packs, so the notes always match the lessons: each lesson's recap points, the code it showed
 * and its review cards, then the module's project brief. Nothing here comes before a lesson: the
 * lessons teach by predicting first, so notes are for going back over what's been learned.
 */

/** A stretch of text in one style. */
export type Run = { text: string; code?: boolean; bold?: boolean }
/** A paragraph or list item: runs that wrap together. */
export type Para = Run[]
export type Snippet = { label: string; code: string }

export type NotesLesson = {
  /** Such as 2.3. */
  number: string
  title: string
  minutes: number
  description: string
  points: Para[]
  code: Snippet[]
  cards: { front: Para; back: Para }[]
}

export type NotesProject = {
  title: string
  client: string
  minutes: number
  brief: Para[]
  must: Para[]
  nice: Para[]
}

export type ModuleNotes = {
  course: string
  module: number
  title: string
  summary: string
  lessons: NotesLesson[]
  /** The syllabus's one line about the project. */
  projectLine: string | null
  /** The full brief, once the project is published. */
  project: NotesProject | null
}

export type NotesInput = {
  course: string
  module: { number: number; title: string; summary: string; project?: string }
  packs: LessonPack[]
  project?: ProjectPack | null
}

// Snippets longer than this are whole programs, not something to look back at on paper.
const MAX_LINES = 24
const MAX_SNIPPETS = 3

const LANGUAGES: Record<string, string> = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  html: 'HTML',
  css: 'CSS',
  py: 'Python',
  python: 'Python',
  sql: 'SQL',
  json: 'JSON',
  sh: 'Terminal',
  bash: 'Terminal',
  shell: 'Terminal',
  console: 'Terminal',
  text: 'Text',
}

const tidy = (text: string) => text.replace(/\s+/g, ' ')

/** One block of inline HTML as runs: <code> becomes code, <strong> and <b> become bold, other tags go. */
export function inlineRuns(html: string): Para {
  const runs: Para = []
  let code = 0
  let bold = 0
  for (const [token, close, tag] of html.matchAll(/<(\/?)([a-z0-9]+)[^>]*>|[^<]+|</gi)) {
    if (tag) {
      const step = close ? -1 : 1
      if (/^code$/i.test(tag)) code = Math.max(0, code + step)
      else if (/^(strong|b)$/i.test(tag)) bold = Math.max(0, bold + step)
      continue
    }
    const text = code ? plainText(token) : tidy(plainText(token))
    if (!text) continue
    const run: Run = { text, ...(code ? { code: true } : {}), ...(bold ? { bold: true } : {}) }
    const last = runs.at(-1)
    if (last && Boolean(last.code) === Boolean(run.code) && Boolean(last.bold) === Boolean(run.bold))
      last.text += text
    else runs.push(run)
  }
  // Trim the paragraph's ends, not the spaces between runs.
  if (runs[0]) runs[0].text = runs[0].text.replace(/^\s+/, '')
  const end = runs.at(-1)
  if (end) end.text = end.text.replace(/\s+$/, '')
  return runs.filter((r) => r.text)
}

/** Block HTML as paragraphs: each <p>, <li> and heading is one; code blocks are left to snippets. */
export function blockParas(html: string): Para[] {
  return html
    .replace(/<pre[\s\S]*?<\/pre>/gi, '')
    .split(/<\/?(?:p|li|ul|ol|h[1-6]|blockquote|div|br)\b[^>]*>/i)
    .map(inlineRuns)
    .filter((p) => p.length)
}

/** The code blocks in a step's text, with their language. */
function codeBlocks(html: string): Snippet[] {
  return [
    ...html.matchAll(
      /<pre[^>]*>\s*<code(?:\s+class="language-([a-z0-9]+)")?[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi,
    ),
  ].map(([, lang, body]) => ({
    label: LANGUAGES[lang ?? 'text'] ?? lang!.toUpperCase(),
    code: plainText(body!),
  }))
}

/** The code a lesson showed: code blocks in its text, and the files of its Run It predictions. */
function lessonCode(pack: LessonPack): Snippet[] {
  const found: Snippet[] = []
  for (const step of pack.steps) {
    if ('body' in step && step.body) found.push(...codeBlocks(step.body))
    if (step.type === 'predict' && step.run && step.files) {
      for (const f of step.files) found.push({ label: f.name, code: f.code })
    }
  }
  const seen = new Set<string>()
  return found
    .map((s) => ({ ...s, code: s.code.replace(/\t/g, '  ').replace(/\s+$/, '') }))
    .filter((s) => {
      const lines = s.code.split('\n').length
      if (!s.code || lines > MAX_LINES || seen.has(s.code)) return false
      seen.add(s.code)
      return true
    })
    .slice(0, MAX_SNIPPETS)
}

function lessonNotes(pack: LessonPack): NotesLesson {
  const recap = pack.steps.find((s) => s.type === 'recap')
  return {
    number: `${pack.module}.${pack.lesson}`,
    title: pack.title,
    minutes: pack.minutes,
    description: pack.description,
    points: recap?.type === 'recap' ? recap.points.map(inlineRuns) : [],
    code: lessonCode(pack),
    cards:
      recap?.type === 'recap'
        ? recap.cards.map((c) => ({ front: inlineRuns(c.front), back: inlineRuns(c.back) }))
        : [],
  }
}

/** The notes for one module, from its packs in lesson order. */
export function buildNotes(input: NotesInput): ModuleNotes {
  const p = input.project
  return {
    course: input.course,
    module: input.module.number,
    title: input.module.title,
    summary: input.module.summary,
    lessons: [...input.packs].sort((a, b) => a.lesson - b.lesson).map(lessonNotes),
    projectLine: input.module.project ?? null,
    project: p
      ? {
          title: p.title,
          client: p.client,
          minutes: p.minutes,
          brief: blockParas(p.brief),
          must: p.must.map(inlineRuns),
          nice: p.nice.map(inlineRuns),
        }
      : null,
  }
}
