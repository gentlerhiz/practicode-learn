'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type TreeNode = { id: string; label: string; depth: number; text?: boolean }

// The quiz page from Module 10, as the browser's tree of nodes.
const TREE: TreeNode[] = [
  { id: 'document', label: 'document', depth: 0 },
  { id: 'html', label: 'html', depth: 1 },
  { id: 'head', label: 'head', depth: 2 },
  { id: 'body', label: 'body', depth: 2 },
  { id: 'h1', label: 'h1', depth: 3 },
  { id: 'h1-text', label: '“Quick quiz”', depth: 4, text: true },
  { id: 'p', label: 'p#score', depth: 3 },
  { id: 'p-text', label: '“Score: 0”', depth: 4, text: true },
  { id: 'ul', label: 'ul', depth: 3 },
  { id: 'li1', label: 'li', depth: 4 },
  { id: 'button1', label: 'button', depth: 5 },
  { id: 'button1-text', label: '“Abuja”', depth: 6, text: true },
  { id: 'li2', label: 'li', depth: 4 },
  { id: 'button2', label: 'button', depth: 5 },
  { id: 'button2-text', label: '“Lagos”', depth: 6, text: true },
]

// A click on the Abuja button travels up through these, from the button to the document.
const PATH = ['button1', 'li1', 'ul', 'body', 'html', 'document']

const DIAGRAM = [
  {
    hot: ['document'],
    say: 'The DOM tree of the quiz page. document is the root, and every other node hangs below it.',
    code: 'document',
  },
  {
    hot: ['h1', 'p', 'ul', 'li1', 'li2', 'button1', 'button2'],
    say: 'Each tag is an element node. Tags inside another tag are its children: the buttons are inside list items, inside the ul.',
    code: "document.querySelector('ul')",
  },
  {
    hot: ['h1-text', 'p-text', 'button1-text', 'button2-text'],
    texts: true,
    say: 'The words are nodes too: text nodes, inside their elements.',
    code: 'score.textContent',
  },
  {
    hot: ['p', 'p-text'],
    texts: true,
    changed: true,
    say: 'JavaScript changed the text node inside p#score, and the page updated straight away to say Score: 1.',
    code: "score.textContent = 'Score: 1'",
  },
]

// Explore: which element the click listener is on.
const LISTENERS: [RegExp, string][] = [
  [/button/i, 'button1'],
  [/^li/i, 'li1'],
  [/ul|list/i, 'ul'],
  [/body/i, 'body'],
  [/h1|heading/i, 'h1'],
]

function Page({ score, pressed }: { score: number; pressed?: boolean }) {
  return (
    <div className="rounded-lg bg-white p-3 text-[#15122a]">
      <p className="text-[15px] font-bold">Quick quiz</p>
      <p className="mt-1 text-[12px]">Score: {score}</p>
      <p className="mt-2 text-[11px] text-[#5d5972]">What’s the capital of Nigeria?</p>
      <div className="mt-1.5 flex flex-col gap-1.5">
        {['Abuja', 'Lagos'].map((answer, i) => (
          <span
            key={answer}
            className={cn(
              'rounded-md border px-2 py-1 text-[12px]',
              pressed && i === 0 ? 'border-fe bg-fe text-white' : 'border-[#b8b3c9]',
            )}
          >
            {answer}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * The quiz page as a tree of nodes. As a Diagram (4 states) it tours the tree and a change made by
 * JavaScript; as an Explore lab, the value names where a click listener sits, and a click on the Abuja
 * button travels up the tree past it, or never reaches it.
 */
export function DomTree({ state, value }: LabProps) {
  const bubbling = value !== undefined
  const at = Math.min(Math.max(state ?? 0, 0), DIAGRAM.length - 1)
  const tour = DIAGRAM[at]!
  const listener = bubbling ? (LISTENERS.find(([re]) => re.test(value))?.[1] ?? 'ul') : null
  const hears = listener ? PATH.includes(listener) : false
  const hot = bubbling ? PATH : tour.hot
  const showTexts = !bubbling && Boolean(tour.texts)
  const nodes = TREE.filter((n) => showTexts || !n.text)
  const listenerLabel = TREE.find((n) => n.id === listener)?.label ?? ''
  const say = bubbling
    ? hears
      ? `The click starts at the Abuja button and travels up through its parents. On the way it passes the ${listenerLabel}, so the ${listenerLabel}’s listener runs.`
      : `The click travels up from the Abuja button through its parents. The ${listenerLabel} isn’t one of them, so its listener never hears the click.`
    : tour.say
  const code = bubbling ? `${listenerLabel === 'p#score' ? 'score' : listenerLabel}.addEventListener('click', …)` : tour.code

  return (
    <figure className="m-0">
      <div role="img" aria-label={say} className="grid gap-3 rounded-xl border border-line-subtle bg-row p-4 tab:grid-cols-[1fr_190px]">
        <ol aria-hidden="true" className="m-0 list-none p-0 font-mono text-[12px] leading-[22px]">
          {nodes.map((n) => {
            const isHot = hot.includes(n.id)
            const isListener = n.id === listener
            const label = n.id === 'p-text' && !bubbling && tour.changed ? '“Score: 1”' : n.label
            return (
              <li key={n.id} className="flex items-center gap-1.5" style={{ paddingLeft: n.depth * 14 }}>
                {n.depth > 0 && <span className="text-ink-subtle">└</span>}
                <span
                  className={cn(
                    'rounded px-1.5 motion-safe:transition-colors motion-safe:duration-250',
                    n.text ? 'italic' : 'font-semibold',
                    isHot ? 'bg-fe text-white' : n.text ? 'text-ink-muted' : 'text-ink-soft',
                    isListener && !hears && 'outline-2 outline-offset-1 outline-ink-subtle outline-dashed',
                  )}
                >
                  {label}
                </span>
                {bubbling && n.id === 'button1' && <span className="text-[11px] text-fe-text">click starts here</span>}
                {bubbling && isHot && n.id !== 'button1' && <span className="text-[11px] text-ink-subtle">↑</span>}
                {isListener && (
                  <span className={cn('text-[11px] font-semibold', hears ? 'text-fe-text' : 'text-ink-muted')}>
                    {hears ? '← listener runs' : '← listener never hears it'}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
        <Page score={!bubbling && tour.changed ? 1 : 0} pressed={bubbling} />
      </div>
      <p className="mt-2.5 font-mono text-[13px] text-ink-muted">{code}</p>
      <figcaption className="sr-only">{say}</figcaption>
    </figure>
  )
}
