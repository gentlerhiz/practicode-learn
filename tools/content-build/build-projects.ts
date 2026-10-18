// Compiles every project (MDX) in a folder into project packs (JSON), checks each one against the project
// format (docs/curriculum/project-format.md), and writes:
//   <out>/<id>.json                       what the app downloads (no solution)
//   <out>/../project-solutions/<id>.json  the model solution, for the code checks and reviewers only
//   <catalogue>                           one entry per project, for the app's projects table
// Usage: node tools/content-build/build-projects.ts --in <projects> --out <packs> --catalogue <file>
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
import { PackError } from '../../src/lib/lessons/schema.ts'
import { parseProjectPack, type ProjectEntry, type ProjectFile } from '../../src/lib/projects/schema.ts'
import { LessonError } from './build.ts'

const PACK_BUDGET = 150 * 1024
const PREFIX: Record<string, string> = { 'front-end-web-development': 'fe' }
const ALLOWED = ['Brief', 'Must', 'Nice', 'Check', 'Review', 'Solution']

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

const mdx = unified().use(remarkParse).use(remarkMdx).use(remarkFrontmatter).use(remarkGfm)
const md = unified().use(remarkParse).use(remarkGfm)
const isJsx = (n: MdNode) => n.type === 'mdxJsxFlowElement' || n.type === 'mdxJsxTextElement'
const html = (nodes: MdNode[]) => toHtml(toHast({ type: 'root', children: nodes } as never)).trim()
const inline = (nodes: MdNode[]) =>
  toHtml(toHast({ type: 'paragraph', children: nodes } as never))
    .trim()
    .replace(/^<p>|<\/p>$/g, '')
const items = (node: MdNode) => {
  const list = (node.children ?? []).find((c) => c.type === 'list')
  return (list?.children ?? []).map((li) => inline(li.children?.[0]?.children ?? []))
}

function projectFile(file: string) {
  const errors: string[] = []
  const where = path.relative(process.cwd(), file)
  const fail = (node: MdNode | null | undefined, msg: string) =>
    errors.push(`${where}:${node?.position?.start?.line ?? '?'}  ${msg}`)
  const tree = mdx.parse(fs.readFileSync(file, 'utf8')) as unknown as MdNode
  const top = tree.children ?? []

  const fmNode = top.find((n) => n.type === 'yaml')
  let fm: Record<string, unknown> = {}
  try {
    fm = fmNode ? (YAML.parse(fmNode.value ?? '') ?? {}) : {}
  } catch (e) {
    fail(fmNode, `Frontmatter isn't valid YAML: ${e instanceof Error ? e.message.split('\n')[0] : e}`)
  }
  for (const k of ['id', 'title', 'description', 'track', 'module', 'client', 'minutes', 'version'])
    if (fm[k] === undefined) fail(fmNode, `Frontmatter is missing ${k}.`)

  // The file is projects/<track>/<NN>-<slug>.mdx, and its id is <prefix>-p<NN>.
  const base = path.basename(file, '.mdx')
  const number = /^(\d{2})-([a-z0-9-]+)$/.exec(base)
  if (!number) fail(null, 'Name the file <NN>-<slug>.mdx, where NN is the module number.')
  const slug = number?.[2] ?? base
  const track = String(fm.track ?? '')
  const expectedId = `${PREFIX[track] ?? '??'}-p${number?.[1] ?? '00'}`
  if (fm.id !== expectedId) fail(fmNode, `id should be ${expectedId}, from the track and the file name.`)
  if (Number(fm.module) !== Number(number?.[1]))
    fail(fmNode, `module should be ${Number(number?.[1])}, as in the file name.`)
  if (path.basename(path.dirname(file)) !== track)
    fail(fmNode, `The file should be in a folder named ${track}.`)

  for (const n of top) {
    if (isJsx(n) && !ALLOWED.includes(n.name ?? '')) fail(n, `<${n.name}> isn't part of the project format.`)
    if (n.type === 'paragraph' || n.type === 'heading' || n.type === 'list')
      fail(n, 'Put the brief inside <Brief>. Only code blocks and project elements go at the top level.')
  }
  const one = (name: string) => {
    const found = top.filter((n) => isJsx(n) && n.name === name)
    if (found.length > 1) fail(found[1], `Use one <${name}>.`)
    return found[0]
  }
  const codeFiles = (nodes: MdNode[]): ProjectFile[] =>
    nodes
      .filter((c) => c.type === 'code')
      .map((c) => {
        const title = /title="([^"]+)"/.exec(c.meta ?? '')?.[1]
        if (!title) fail(c, 'Every code block needs a file name, for example ```html title="index.html"')
        return {
          name: title ?? '',
          lang: c.lang ?? 'text',
          code: c.value ?? '',
          ...(/\breadonly\b/.test(c.meta ?? '') ? { readonly: true as const } : {}),
        }
      })

  const brief = one('Brief')
  if (!brief) fail(null, 'A project needs a <Brief>.')
  const must = one('Must')
  if (!must) fail(null, 'A project needs <Must>: a bullet list of what the client needs.')
  const nice = one('Nice')
  const review = one('Review')
  if (!review)
    fail(null, 'A project needs <Review>: a bullet list of questions for the learner about their work.')
  const solution = one('Solution')
  if (!solution) fail(null, 'A project needs a <Solution>, so its checks can be tested.')
  const files = codeFiles(top)
  if (!files.some((f) => !f.readonly))
    fail(null, 'A project needs at least one starter file the learner can edit.')
  const checks = top
    .filter((n) => isJsx(n) && n.name === 'Check')
    .map((n) => {
      const name = n.attributes?.find((a) => a.name === 'name')?.value
      const code = (n.children ?? []).find((c) => c.type === 'code')
      if (typeof name !== 'string' || !code) fail(n, 'Every <Check> needs a name and a ```js block.')
      const parsed = md.parse(typeof name === 'string' ? name : '') as unknown as MdNode
      return { name: inline(parsed.children?.[0]?.children ?? []), code: code?.value ?? '' }
    })
  if (!checks.length) fail(null, 'A project needs at least one <Check>.')

  const pack = {
    schema: 1 as const,
    id: String(fm.id ?? ''),
    slug,
    version: Number(fm.version),
    title: String(fm.title ?? ''),
    description: String(fm.description ?? ''),
    track,
    module: Number(fm.module),
    free: fm.free === true,
    client: String(fm.client ?? ''),
    minutes: Number(fm.minutes),
    needsSite: fm.needsSite === true,
    brief: brief ? html(brief.children ?? []) : '',
    must: must ? items(must) : [],
    nice: nice ? items(nice) : [],
    files,
    checks,
    review: review ? items(review).map((q) => q.replace(/<[^>]+>/g, '')) : [],
  }
  if (!errors.length) {
    try {
      parseProjectPack(pack)
    } catch (e) {
      if (!(e instanceof PackError)) throw e
      fail(null, `The pack doesn't match the project format:\n    ${e.message.replaceAll('\n', '\n    ')}`)
    }
  }
  return { pack, solution: solution ? codeFiles(solution.children ?? []) : [], errors }
}

/** Builds every project under `input`. Throws a LessonError listing every problem if any project fails. */
export function buildProjects({
  input,
  out,
  catalogue,
  quiet = false,
}: {
  input: string
  out: string
  catalogue: string
  quiet?: boolean
}) {
  const inDir = path.resolve(input)
  const outDir = path.resolve(out)
  const solutionsDir = path.join(outDir, '..', 'project-solutions')
  for (const dir of [outDir, solutionsDir]) {
    if (inDir === dir || inDir.startsWith(dir + path.sep))
      throw new Error(`Refusing to build into ${dir}: it contains the projects.`)
  }
  const files: string[] = []
  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name)
      if (e.isDirectory()) walk(p)
      else if (p.endsWith('.mdx')) files.push(p)
    }
  }
  if (fs.existsSync(inDir)) walk(inDir)
  fs.rmSync(outDir, { recursive: true, force: true })
  fs.rmSync(solutionsDir, { recursive: true, force: true })
  fs.mkdirSync(outDir, { recursive: true })
  fs.mkdirSync(solutionsDir, { recursive: true })

  const entries: ProjectEntry[] = []
  const errors: string[] = []
  for (const f of files.sort()) {
    const { pack, solution, errors: e } = projectFile(f)
    errors.push(...e)
    const json = JSON.stringify(pack)
    const size = zlib.gzipSync(json).length
    if (size > PACK_BUDGET) errors.push(`${path.relative(process.cwd(), f)}  pack is over the 150 KB budget`)
    fs.writeFileSync(path.join(outDir, `${pack.id}.json`), json)
    fs.writeFileSync(path.join(solutionsDir, `${pack.id}.json`), JSON.stringify(solution))
    entries.push({
      id: pack.id,
      version: pack.version,
      title: pack.title,
      slug: pack.slug,
      description: pack.description,
      track: pack.track,
      module: pack.module,
      free: pack.free,
      checks: pack.checks.length,
      needsSite: pack.needsSite,
      bytes: size,
      hash: crypto.createHash('sha256').update(json).digest('hex').slice(0, 12),
    })
    if (!quiet)
      console.log(`${e.length ? '✗' : '✓'} ${pack.id}  ${pack.title}  ·  ${pack.checks.length} checks`)
  }
  fs.mkdirSync(path.dirname(path.resolve(catalogue)), { recursive: true })
  fs.writeFileSync(catalogue, `${JSON.stringify(entries, null, 2)}\n`)
  if (errors.length) throw new LessonError(errors)
  if (!quiet) console.log(`\nBuilt ${entries.length} project${entries.length === 1 ? '' : 's'}.`)
  return entries
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({
    options: { in: { type: 'string' }, out: { type: 'string' }, catalogue: { type: 'string' } },
  })
  if (!values.in || !values.out || !values.catalogue) {
    console.error(
      'Usage: node tools/content-build/build-projects.ts --in <projects> --out <packs> --catalogue <file>',
    )
    process.exit(2)
  }
  try {
    buildProjects({ input: values.in, out: values.out, catalogue: values.catalogue })
  } catch (e) {
    if (!(e instanceof LessonError)) throw e
    console.error(`\n${e.message}`)
    process.exit(1)
  }
}
