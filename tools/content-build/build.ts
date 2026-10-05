// Compiles every lesson (MDX) in a folder into lesson packs (JSON), checks each one against the lesson
// format (docs/curriculum/lesson-format.md), and writes:
//   <out>/<id>.json             what the app downloads (no solutions)
//   <out>/../solutions/<id>.json model solutions, for the code checks and reviewers only
//   <catalogue>                  one entry per lesson, for the app's catalogue table
// Usage: node tools/content-build/build.ts --in <lessons> --out <packs> --catalogue <file>
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import zlib from 'node:zlib'
import { toHtml } from 'hast-util-to-html'
import { toHast } from 'mdast-util-to-hast'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import YAML from 'yaml'
import { LAB_NAMES } from '../../src/lib/lessons/labs.ts'
import { PackError, parsePack, STAGES, type LessonFile } from '../../src/lib/lessons/schema.ts'
import type { CatalogueEntry } from '../../src/lib/lessons/types.ts'

export const SCHEMA = 1
const PACK_BUDGET = 150 * 1024 // compressed bytes
const EXPLAIN_WORDS = 80
const INTERACTIVE = ['predict', 'question', 'explore', 'order', 'code']
const LABS: readonly string[] = LAB_NAMES
const STAGE_NAMES: readonly string[] = STAGES

type MdNode = {
  type: string
  name?: string | null
  value?: string
  lang?: string | null
  meta?: string | null
  children?: MdNode[]
  attributes?: { type: string; name?: string; value?: unknown }[]
  position?: { start?: { line?: number } }
}
type Step = Record<string, unknown> & { type: string }
type Solutions = Record<number, LessonFile[]>

export class LessonError extends Error {
  problems: string[]
  constructor(problems: string[]) {
    super(`${problems.length} problem${problems.length > 1 ? 's' : ''}:\n  ${problems.join('\n  ')}`)
    this.problems = problems
  }
}

const mdx = unified().use(remarkParse).use(remarkMdx).use(remarkFrontmatter).use(remarkGfm)
const md = unified().use(remarkParse).use(remarkGfm)

const BLOCK = ['paragraph', 'code', 'list', 'heading', 'blockquote', 'thematicBreak', 'table']
// Inline content is wrapped in a paragraph and unwrapped again, because a root adds line breaks
// between its children, which would show up as spaces before punctuation.
const html = (nodes: MdNode[]): string => {
  if (nodes.some((n) => BLOCK.includes(n.type))) {
    return toHtml(toHast({ type: 'root', children: nodes } as never)).trim()
  }
  return toHtml(toHast({ type: 'paragraph', children: nodes } as never))
    .trim()
    .replace(/^<p>|<\/p>$/g, '')
}
const inline = (s: string): string => {
  const tree = md.parse(s) as unknown as MdNode
  const children = tree.children ?? []
  const only = children.length === 1 && children[0]?.type === 'paragraph'
  return html(only ? (children[0]?.children ?? []) : children)
}
const text = (nodes: MdNode[]): string =>
  nodes.map((n) => (n.value ?? '') + (n.children ? text(n.children) : '')).join('')
const isJsx = (n: MdNode) => n.type === 'mdxJsxFlowElement' || n.type === 'mdxJsxTextElement'
const isBlank = (n: MdNode) => n.type === 'text' && !n.value?.trim()

// Consecutive one-line elements (<Option>, <Hint>, <Item>…) parse as a paragraph of inline JSX.
// Lift them out so every element inside a step is a direct child, whether or not blank lines separate them.
function liftInlineElements(node: MdNode) {
  if (!node.children) return
  node.children = node.children.flatMap((c) => {
    const kids = c.children ?? []
    if (c.type === 'paragraph' && kids.some(isJsx) && kids.every((x) => isJsx(x) || isBlank(x))) {
      return kids.filter(isJsx).map((x) => ({ ...x, type: 'mdxJsxFlowElement' }))
    }
    return [c]
  })
  node.children.forEach(liftInlineElements)
}

function lessonFile(file: string) {
  const errors: string[] = []
  const where = path.relative(process.cwd(), file)
  const fail = (node: MdNode | null | undefined, msg: string) =>
    errors.push(`${where}:${node?.position?.start?.line ?? '?'}  ${msg}`)
  const tree = mdx.parse(fs.readFileSync(file, 'utf8')) as unknown as MdNode
  liftInlineElements(tree)
  const children = (node: MdNode) => node.children ?? []

  const attrs = (node: MdNode) => {
    const out: Record<string, string | true> = {}
    for (const a of node.attributes ?? []) {
      if (a.type !== 'mdxJsxAttribute' || !a.name) {
        fail(node, `<${node.name}> uses a {…} spread. Use plain attributes.`)
        continue
      }
      if (a.value && typeof a.value === 'object') {
        fail(node, `<${node.name} ${a.name}={…}> uses an expression. Use a quoted string.`)
        continue
      }
      out[a.name] = a.value === null || a.value === undefined ? true : String(a.value)
    }
    return out
  }
  const str = (v: string | true | undefined) => (typeof v === 'string' ? v : undefined)
  const kids = (node: MdNode, name: string) => children(node).filter((c) => isJsx(c) && c.name === name)
  const prose = (node: MdNode) => children(node).filter((c) => !isJsx(c) && c.type !== 'code' && !isBlank(c))
  const files = (nodes: MdNode[]): LessonFile[] =>
    nodes
      .filter((c) => c.type === 'code')
      .map((c) => {
        const title = /title="([^"]+)"/.exec(c.meta ?? '')?.[1]
        if (!title)
          fail(c, 'Every code block in a step needs a file name, for example ```css title="styles.css"')
        return {
          name: title ?? '',
          lang: c.lang ?? 'text',
          code: c.value ?? '',
          ...(/\breadonly\b/.test(c.meta ?? '') ? { readonly: true as const } : {}),
        }
      })
  const only = (node: MdNode, allowed: string[]) => {
    for (const c of children(node)) {
      if (isJsx(c) && !allowed.includes(c.name ?? ''))
        fail(c, `<${c.name}> isn't allowed inside <${node.name}>.`)
    }
  }
  const hints = (node: MdNode) => {
    const h = kids(node, 'Hint').map((x) => html(children(x)))
    if (h.length !== 3) fail(node, `<${node.name}> needs exactly 3 hints (it has ${h.length}).`)
    return h
  }
  const options = (node: MdNode) => {
    const opts = kids(node, 'Option').map((o) => {
      const a = attrs(o)
      if (!a.id) fail(o, '<Option> needs an id.')
      if (!a.feedback)
        fail(o, `Option ${a.id} needs feedback. Every answer, right or wrong, explains itself.`)
      const feedback = str(a.feedback)
      const value = str(a.value)
      return {
        id: str(a.id) ?? '',
        html: html(children(o)),
        correct: a.correct === true,
        feedback: feedback ? inline(feedback) : '',
        ...(value !== undefined ? { value } : {}),
      }
    })
    if (opts.length < 2) fail(node, `<${node.name}> needs at least 2 options.`)
    if (!opts.some((o) => o.correct))
      fail(node, `<${node.name}> has no correct option. Mark one with the correct attribute.`)
    if (new Set(opts.map((o) => o.id)).size !== opts.length)
      fail(node, `<${node.name}> has two options with the same id.`)
    return opts
  }
  const reveal = (node: MdNode) => {
    const r = kids(node, 'Reveal')[0]
    return r ? { reveal: html(children(r)) } : {}
  }
  const ask = (node: MdNode) => {
    const q = kids(node, 'Ask')[0]
    return q ? html(children(q)) : null
  }

  const fmNode = children(tree).find((n) => n.type === 'yaml')
  let fm: Record<string, unknown> = {}
  try {
    fm = fmNode ? (YAML.parse(fmNode.value ?? '') ?? {}) : {}
  } catch (e) {
    const reason = e instanceof Error ? e.message.split('\n')[0] : String(e)
    fail(fmNode, `Frontmatter isn't valid YAML: ${reason}. Put text that contains a colon in quotes.`)
  }
  if (!fmNode) fail(null, 'Missing frontmatter.')
  for (const k of [
    'id',
    'title',
    'description',
    'track',
    'module',
    'lesson',
    'minutes',
    'version',
    'outcomes',
  ]) {
    if (fm[k] === undefined) fail(fmNode, `Frontmatter is missing ${k}.`)
  }
  const id = String(fm.id ?? '')
  const outcomes = Array.isArray(fm.outcomes) ? fm.outcomes.map(String) : []
  if (!/^[a-z]{2}-\d{2}-\d{2}$/.test(id)) fail(fmNode, `id "${id}" should look like fe-06-04.`)
  const [, mm, ll] = /-(\d{2})-(\d{2})$/.exec(id) ?? []
  if (Number(mm) !== fm.module || Number(ll) !== fm.lesson) {
    fail(fmNode, `id ${id} doesn't match module ${fm.module}, lesson ${fm.lesson}.`)
  }
  const folder = path.basename(path.dirname(file)).slice(0, 2)
  const base = path.basename(file).slice(0, 2)
  if (Number(folder) !== fm.module || Number(base) !== fm.lesson) {
    fail(fmNode, `File is in the wrong place for module ${fm.module}, lesson ${fm.lesson}.`)
  }
  const slug = path.basename(file, '.mdx').replace(/^\d{2}-/, '')
  if (!/^[a-z0-9-]+$/.test(slug))
    fail(fmNode, `The file name gives the slug "${slug}". Use lowercase words and hyphens.`)
  const description = typeof fm.description === 'string' ? fm.description.trim() : ''
  if (fm.description !== undefined && (description.length < 120 || description.length > 160)) {
    fail(
      fmNode,
      `description should be 120 to 160 characters, for search results (it has ${description.length}).`,
    )
  }
  const minutes = Number(fm.minutes)
  if (!(minutes >= 5 && minutes <= 20)) fail(fmNode, 'minutes should be between 5 and 20.')
  if (!outcomes.length) fail(fmNode, 'List at least one outcome.')

  const steps: Step[] = []
  const solutions: Solutions = {}
  const assessed = new Set<string>()
  children(tree).forEach((node) => {
    if (node.type === 'yaml' || isBlank(node)) return
    if (!isJsx(node)) {
      fail(node, 'Text outside a step. Put it inside <Explain> or another step.')
      return
    }
    const a = attrs(node)
    const type = (node.name ?? '').toLowerCase()
    const i = steps.length
    const stage = str(a.stage)
    if (type !== 'recap') {
      if (!stage) fail(node, `<${node.name}> needs a stage (${STAGE_NAMES.join(', ')}).`)
      else if (!STAGE_NAMES.includes(stage))
        fail(node, `Unknown stage "${stage}". Use one of: ${STAGE_NAMES.join(', ')}.`)
    }
    const assesses = (str(a.assesses) ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    for (const o of assesses) {
      if (!outcomes.includes(o)) fail(node, `Assesses "${o}", which isn't in the frontmatter outcomes.`)
      assessed.add(o)
    }
    const common = { type, stage: stage ?? 'recap', ...(assesses.length ? { assesses } : {}) }
    switch (node.name) {
      case 'Explain': {
        only(node, [])
        const body = children(node).filter((c) => !isBlank(c))
        const words = text(body.filter((c) => c.type !== 'code'))
          .split(/\s+/)
          .filter(Boolean).length
        if (words > EXPLAIN_WORDS)
          fail(node, `Explain steps are at most ${EXPLAIN_WORDS} words (this one has ${words}).`)
        steps.push({ ...common, body: html(body) })
        break
      }
      case 'Predict':
      case 'Question': {
        only(node, ['Option', 'Hint', 'Reveal'])
        const f = files(children(node))
        if (a.run && !f.length) fail(node, 'A Predict step with run needs code to run.')
        if (a.run && a.live)
          fail(node, 'A step is either run (predict, then run) or live (try each option), not both.')
        const opts = options(node)
        if (a.live) {
          if (!f.some((x) => x.code.includes('{{value}}')))
            fail(node, 'A live step needs {{value}} in its code, where each option is tried.')
          if (opts.some((o) => o.value == null))
            fail(node, 'In a live step, every <Option> needs a value to try in the preview.')
        }
        steps.push({
          ...common,
          body: html(prose(node)),
          ...(f.length ? { files: f } : {}),
          ...(a.run ? { run: true } : {}),
          ...(a.live ? { live: true } : {}),
          options: opts,
          hints: hints(node),
          ...reveal(node),
        })
        break
      }
      case 'Explore': {
        only(node, ['Option', 'Hint', 'Reveal', 'Ask'])
        const values = (str(a.values) ?? '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
        const control = str(a.control)
        const lab = str(a.lab)
        if (!control || values.length < 2) fail(node, '<Explore> needs a control and at least 2 values.')
        if (lab && !LABS.includes(lab)) fail(node, `Unknown lab "${lab}". Known labs: ${LABS.join(', ')}.`)
        const f = files(children(node))
        if (!lab && !f.some((x) => x.code.includes('{{value}}')))
          fail(node, 'An <Explore> without a lab needs {{value}} in its code.')
        if (!ask(node)) fail(node, '<Explore> needs an <Ask> with the question.')
        steps.push({
          ...common,
          body: html(prose(node)),
          ...(lab ? { lab } : {}),
          control: control ?? '',
          values,
          ...(f.length ? { files: f } : {}),
          ask: ask(node) ?? '',
          options: options(node),
          hints: hints(node),
          ...reveal(node),
        })
        break
      }
      case 'Diagram': {
        only(node, ['State'])
        const lab = str(a.lab) ?? ''
        if (!LABS.includes(lab)) fail(node, `Unknown lab "${lab}". Known labs: ${LABS.join(', ')}.`)
        const states = kids(node, 'State').map((s) => {
          const title = str(attrs(s).title)
          if (!title) fail(s, 'Every <State> needs a title.')
          return { title: title ?? '', html: html(children(s)) }
        })
        if (states.length < 2) fail(node, 'A diagram needs at least 2 states.')
        steps.push({ ...common, body: html(prose(node)), lab, states })
        break
      }
      case 'Order': {
        only(node, ['Item', 'Hint'])
        const items = kids(node, 'Item').map((x) => html(children(x)))
        if (items.length < 3) fail(node, 'An order step needs at least 3 items.')
        const wrong = str(a.wrong)
        if (!wrong) fail(node, '<Order> needs wrong="…" feedback for a wrong order.')
        steps.push({
          ...common,
          body: html(prose(node)),
          items,
          wrong: wrong ? inline(wrong) : '',
          hints: hints(node),
        })
        break
      }
      case 'Code': {
        only(node, ['Test', 'Hint', 'Solution'])
        if (!['modify', 'make'].includes(stage ?? '')) fail(node, 'A code step is a modify or make stage.')
        const f = files(children(node))
        if (!f.some((x) => !x.readonly))
          fail(node, 'A code step needs at least one file the learner can edit.')
        const tests = kids(node, 'Test').map((t) => {
          const code = children(t).find((c) => c.type === 'code')
          const name = str(attrs(t).name)
          if (!name || !code) fail(t, 'Every <Test> needs a name and a ```js block.')
          return { name: inline(name ?? ''), code: code?.value ?? '' }
        })
        if (!tests.length) fail(node, 'A code step needs at least one test.')
        const solution = kids(node, 'Solution')[0]
        if (!solution) fail(node, 'A code step needs a <Solution>, so the tests can be checked against it.')
        else solutions[i] = files(children(solution))
        steps.push({ ...common, body: html(prose(node)), files: f, tests, hints: hints(node) })
        break
      }
      case 'Recap': {
        only(node, ['Card'])
        const list = children(node).find((c) => c.type === 'list')
        const points = list ? children(list).map((li) => html(children(li)[0]?.children ?? [])) : []
        if (points.length < 2 || points.length > 4)
          fail(node, 'A recap has 2 to 4 key points, as a bullet list.')
        const cards = kids(node, 'Card').map((c) => {
          const { front, back } = attrs(c)
          if (!str(front) || !str(back)) fail(c, 'Every <Card> needs front and back.')
          return { front: inline(str(front) ?? ''), back: inline(str(back) ?? '') }
        })
        if (!cards.length) fail(node, 'A recap needs at least one review <Card>.')
        steps.push({ type: 'recap', stage: 'recap', points, cards })
        break
      }
      default:
        fail(node, `Unknown step <${node.name}>.`)
    }
  })

  if (steps.at(-1)?.type !== 'recap') fail(null, 'A lesson ends with a <Recap>.')
  const interactive = steps.filter((s) => INTERACTIVE.includes(s.type)).length
  if (3 * interactive < 2 * steps.length) {
    fail(null, `At least two-thirds of steps must be interactive (${interactive} of ${steps.length}).`)
  }
  for (const o of outcomes) {
    if (!assessed.has(o))
      fail(null, `Outcome ${o} is never assessed. Add assesses="${o}" to a step that checks it.`)
  }

  const pack = {
    schema: SCHEMA,
    id,
    slug,
    description,
    version: fm.version,
    title: fm.title,
    track: fm.track,
    module: fm.module,
    lesson: fm.lesson,
    minutes: fm.minutes,
    free: fm.free === true,
    outcomes,
    prerequisites: Array.isArray(fm.prerequisites) ? fm.prerequisites.map(String) : [],
    steps,
  }
  // The last word: the app accepts only packs that match its schema, so check with the same code.
  if (!errors.length) {
    try {
      parsePack(pack)
    } catch (e) {
      if (!(e instanceof PackError)) throw e
      fail(null, `The pack doesn't match the lesson format:\n    ${e.message.replaceAll('\n', '\n    ')}`)
    }
  }
  return { pack, solutions, errors }
}

/** Builds every lesson under `input`. Throws a LessonError listing every problem if any lesson fails. */
export function build({
  input,
  out,
  catalogue: catalogueFile,
  quiet = false,
}: {
  input: string
  out: string
  catalogue: string
  quiet?: boolean
}): CatalogueEntry[] {
  const inDir = path.resolve(input)
  const outDir = path.resolve(out)
  const solutionsDir = path.join(outDir, '..', 'solutions')
  // The output folders are emptied first, so they must never contain the lessons themselves.
  for (const dir of [outDir, solutionsDir]) {
    if (inDir === dir || inDir.startsWith(dir + path.sep)) {
      throw new Error(`Refusing to build into ${dir}: it contains the lessons.`)
    }
  }
  const files: string[] = []
  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name)
      if (e.isDirectory()) walk(p)
      else if (p.endsWith('.mdx')) files.push(p)
    }
  }
  walk(inDir)
  fs.rmSync(outDir, { recursive: true, force: true })
  fs.rmSync(solutionsDir, { recursive: true, force: true })
  fs.mkdirSync(outDir, { recursive: true })
  fs.mkdirSync(solutionsDir, { recursive: true })

  const catalogue: CatalogueEntry[] = []
  const errors: string[] = []
  const seen = new Map<string, string>()
  for (const f of files.sort()) {
    const { pack, solutions, errors: e } = lessonFile(f)
    errors.push(...e)
    const where = path.relative(process.cwd(), f)
    if (seen.has(pack.id)) errors.push(`${where}  id ${pack.id} is also used by ${seen.get(pack.id)}`)
    seen.set(pack.id, where)
    const json = JSON.stringify(pack)
    const size = zlib.gzipSync(json).length
    if (size > PACK_BUDGET)
      errors.push(`${where}  pack is ${(size / 1024).toFixed(1)} KB compressed, over the 150 KB budget`)
    fs.writeFileSync(path.join(outDir, `${pack.id}.json`), json)
    fs.writeFileSync(path.join(solutionsDir, `${pack.id}.json`), JSON.stringify(solutions))
    const hash = crypto.createHash('sha256').update(json).digest('hex').slice(0, 12)
    catalogue.push({
      id: pack.id,
      version: Number(pack.version),
      title: String(pack.title),
      slug: pack.slug,
      description: pack.description,
      track: String(pack.track),
      module: Number(pack.module),
      lesson: Number(pack.lesson),
      minutes: Number(pack.minutes),
      free: pack.free,
      steps: pack.steps.length,
      bytes: size,
      hash,
    })
    if (!quiet) {
      console.log(
        `${e.length ? '✗' : '✓'} ${pack.id}  ${pack.title}  ·  ${pack.steps.length} steps  ·  ${(size / 1024).toFixed(1)} KB compressed`,
      )
    }
  }
  fs.mkdirSync(path.dirname(path.resolve(catalogueFile)), { recursive: true })
  fs.writeFileSync(catalogueFile, `${JSON.stringify(catalogue, null, 2)}\n`)
  if (errors.length) throw new LessonError(errors)
  if (!quiet) console.log(`\nBuilt ${catalogue.length} lesson${catalogue.length === 1 ? '' : 's'}.`)
  return catalogue
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({
    options: { in: { type: 'string' }, out: { type: 'string' }, catalogue: { type: 'string' } },
  })
  if (!values.in || !values.out || !values.catalogue) {
    console.error('Usage: node tools/content-build/build.ts --in <lessons> --out <packs> --catalogue <file>')
    process.exit(2)
  }
  try {
    build({ input: values.in, out: values.out, catalogue: values.catalogue })
  } catch (e) {
    if (!(e instanceof LessonError)) throw e
    console.error(`\n${e.message}`)
    process.exit(1)
  }
}
