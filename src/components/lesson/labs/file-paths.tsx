'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

// Mama Nkechi's website folder. Folders end in a slash.
const TREE = [
  'index.html',
  'about.html',
  'images/',
  'images/jollof.jpg',
  'images/logo.png',
  'menu/',
  'menu/drinks.html',
  'menu/soups.html',
] as const
const ROOT = 'mama-nkechi'

type Move = { text: string }
type Resolution = { from: string; path: string; target: string; found: boolean; moves: Move[] }

/** Follows a path the way a browser does: from the folder of the page that holds the link. */
export function resolvePath(from: string, path: string): Resolution {
  const moves: Move[] = []
  let at: string[]
  if (path.startsWith('/')) {
    at = []
    moves.push({ text: `Start at the top of the site, ${ROOT}/, because the path starts with /` })
  } else {
    at = from.split('/').slice(0, -1)
    moves.push({
      text: `Start in ${at.length ? at.join('/') + '/' : ROOT + '/'}, the folder that holds ${from}`,
    })
  }
  const parts = path.replace(/^\//, '').split('/').filter(Boolean)
  parts.forEach((part, i) => {
    const last = i === parts.length - 1
    if (part === '..') {
      if (at.length) {
        at.pop()
        moves.push({ text: `.. goes up one folder, to ${at.length ? at.join('/') + '/' : ROOT + '/'}` })
      } else moves.push({ text: `.. at the top of the site goes nowhere: you stay in ${ROOT}/` })
    } else if (part === '.') {
      moves.push({ text: '. means the folder you are already in' })
    } else if (last) {
      at.push(part)
      moves.push({ text: `Look for the file ${part} there` })
    } else {
      at.push(part)
      moves.push({ text: `Go into the folder ${part}/` })
    }
  })
  const target = at.join('/')
  return { from, path, target, found: (TREE as readonly string[]).includes(target), moves }
}

/**
 * Explore lab: a link's path, followed through the site's folders. The value is "page → path" (or just a
 * path, from index.html), for example "menu/drinks.html → ../images/jollof.jpg".
 */
export function FilePaths({ value = '' }: LabProps) {
  const [fromPart, pathPart] = value.includes('→')
    ? value.split('→').map((s) => s.trim())
    : ['index.html', value.trim()]
  const r = resolvePath(fromPart || 'index.html', pathPart || '')
  const fromDir = r.from.split('/').slice(0, -1).join('/')

  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-xl border border-line bg-row px-3 py-2 font-mono text-[13px] text-ink">
        <span className="text-ink-muted">In {r.from}: </span>
        {`href="${r.path}"`}
      </p>
      <ul
        aria-label={`The ${ROOT} folder`}
        className="rounded-xl border border-line bg-row p-3 font-mono text-[13px] leading-7"
      >
        <li className={cn('px-1', fromDir === '' && 'text-fe-text')}>{ROOT}/</li>
        {TREE.map((item) => {
          const name = item.replace(/\/$/, '').split('/').pop()
          const depth = item.replace(/\/$/, '').split('/').length
          const isFolder = item.endsWith('/')
          const isFrom = item === r.from
          const isTarget = item === r.target && r.found
          return (
            <li
              key={item}
              style={{ paddingLeft: depth * 18 }}
              className={cn(
                'flex items-center gap-2 rounded-md px-1',
                isTarget && 'bg-success/15 font-semibold text-ink',
                isFrom && 'outline-2 -outline-offset-2 outline-fe',
              )}
            >
              <span aria-hidden="true">{isFolder ? '📁' : '📄'}</span>
              {name}
              {isFolder ? '/' : ''}
              {isFrom && <span className="font-sans text-[11px] text-fe-text">the page with the link</span>}
              {isTarget && <span className="font-sans text-[11px] text-success">✓ found</span>}
            </li>
          )
        })}
      </ul>
      <ol
        aria-label="How the browser follows the path"
        className="flex flex-col gap-1 text-[13px] text-ink-soft"
      >
        {r.moves.map((m, i) => (
          <li key={i}>
            {i + 1}. {m.text}
          </li>
        ))}
      </ol>
      <p
        aria-live="polite"
        className={cn(
          'rounded-xl border p-3 text-sm font-semibold',
          r.found ? 'border-success text-success' : 'border-error text-error',
        )}
      >
        {r.found
          ? `✓ Found: ${ROOT}/${r.target}`
          : `✕ There is no ${ROOT}/${r.target || '(nothing)'}, so the browser gets 404 Not Found.`}
      </p>
    </div>
  )
}
