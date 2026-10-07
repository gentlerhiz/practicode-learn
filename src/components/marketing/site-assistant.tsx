'use client'

import { ArrowUp, MessageCircle, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { CURRENCIES, planPrices } from '@/content/pricing'
import { site } from '@/lib/site'

const ngn = CURRENCIES.NGN
const save = planPrices('NGN', true).save

/** The canvas's ready answers. Typed questions get an honest hand-off to a person. */
const ANSWERS = [
  {
    key: 'track',
    q: 'Which track should I start with?',
    a: "If you've never coded, Front-End Web Development is a friendly first step: you see your work in the browser from lesson one. If you already live in spreadsheets, Data Analysis builds on that. Still unsure? Module 1 of every track is free, so try two and keep the one you enjoy.",
  },
  {
    key: 'price',
    q: 'How much does Pro cost?',
    a: `Pro is ${ngn.sym}${ngn.monthly.toLocaleString('en-US')} a month, or ${ngn.sym}${ngn.yearly.toLocaleString('en-US')} a year, which saves you about ${save}%. It starts with a 7-day free trial and you can cancel in one click. If money is tight, you can apply for a scholarship too.`,
  },
  {
    key: 'phone',
    q: 'Can I learn on my phone?',
    a: "Mostly, yes. Lessons, reviews and the AI tutor work in your phone's browser, and you can save a module's lessons to keep going offline. Some modules need a computer, like Power BI work (Windows PC) or Figma design work, and each track tells you upfront what you'll need.",
  },
  {
    key: 'cert',
    q: 'Will employers recognise the certificate?',
    a: "It's a verifiable digital badge that lists the exact skills you showed, mapped to frameworks employers use, like SFIA. It isn't a degree, and we won't pretend it is. Anyone can click it to check it's real, and your projects do the rest of the talking.",
  },
]

const HAND_OFF = `Good question. I can help with tracks, prices, payments and how lessons work. For anything else, email ${site.email} and a person will reply.`

type Message = { from: 'learner' | 'bot'; text: string }

function Spark() {
  return (
    <span aria-hidden="true" className="flex size-[26px] shrink-0 items-center justify-center rounded-full text-ink">
      <svg viewBox="0 0 24 24" width={13} height={13} fill="currentColor">
        <path d="M11 2.5l2.1 5.9 5.9 2.1-5.9 2.1L11 18.5l-2.1-5.9L3 10.5l5.9-2.1z" />
        <path d="M19 14.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9z" />
      </svg>
    </span>
  )
}

const botBubble =
  'rounded-[6px_18px_18px_18px] border border-line bg-control px-4 py-3 text-sm leading-[22px] text-ink-soft'

/** PrismChatPhone: "Ask us anything", fixed to the corner of the landing page. */
export function SiteAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [asked, setAsked] = useState<string[]>([])
  const [draft, setDraft] = useState('')
  const opener = useRef<HTMLButtonElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const log = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    input.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight })
  }, [messages])

  const ask = (key: string) => {
    const answer = ANSWERS.find((a) => a.key === key)
    if (!answer) return
    setAsked((list) => [...list, key])
    setMessages((list) => [...list, { from: 'learner', text: answer.q }, { from: 'bot', text: answer.a }])
  }
  const send = () => {
    const text = draft.trim()
    if (!text) return
    setDraft('')
    setMessages((list) => [...list, { from: 'learner', text }, { from: 'bot', text: HAND_OFF }])
  }
  const close = () => {
    setOpen(false)
    opener.current?.focus()
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-4 ph:right-6 ph:bottom-6">
      {open && (
        <section
          role="dialog"
          aria-label="Ask PractiCode"
          className="flex h-[580px] max-h-[calc(100dvh-112px)] w-[min(384px,calc(100vw-32px))] flex-col overflow-hidden rounded-[26px] border border-line bg-row shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
        >
          <div className="flex items-center gap-3 bg-[linear-gradient(120deg,#2e3bc2_0%,#5a36e6_45%)] p-4 text-white">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white">
              <svg viewBox="-10.4 -9.06 20.8 18.12" className="h-[18px] w-5" aria-hidden="true">
                <g style={{ fill: '#FED606', stroke: '#FED606', strokeWidth: 0.32, strokeLinejoin: 'round' }}>
                  <polygon points="1.6,8.66 5,8.66 10,0 5,-8.66 -5,-8.66 -10,0 -5,8.66 -1,8.66 -3,5.196 -6,0 -3,-5.196 3,-5.196 6,0 3,5.196 -0.4,5.196" />
                  <polygon points="-2.8,0 -1.4,2.425 1.4,2.425 2.8,0 1.4,-2.425 -1.4,-2.425" />
                </g>
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold">Ask PractiCode</p>
              <p className="text-xs text-[#e9e4ff]">Quick answers about tracks, plans and lessons</p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close chat"
              className="press flex size-9 cursor-pointer items-center justify-center rounded-full bg-black/25 hover:bg-black/40"
            >
              <X aria-hidden="true" size={18} strokeWidth={1.85} />
            </button>
          </div>
          <div ref={log} aria-live="polite" className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            <div className="flex max-w-[92%] items-start gap-3">
              <Spark />
              <p className={botBubble}>
                Hi! I can help you pick a track, explain the plans, or tell you how lessons work. What would you like to know?
              </p>
            </div>
            {messages.map((m, i) =>
              m.from === 'learner' ? (
                <p
                  key={i}
                  className="max-w-[82%] self-end rounded-[18px_18px_6px_18px] bg-primary px-4 py-3 text-sm leading-[22px] text-on-primary"
                >
                  {m.text}
                </p>
              ) : (
                <div key={i} className="flex max-w-[92%] items-start gap-3">
                  <Spark />
                  <p className={botBubble}>{m.text}</p>
                </div>
              ),
            )}
            {ANSWERS.some((a) => !asked.includes(a.key)) && (
              <div className="flex flex-col items-end gap-2 pt-1">
                {ANSWERS.filter((a) => !asked.includes(a.key)).map((a) => (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() => ask(a.key)}
                    className="press min-h-[38px] cursor-pointer rounded-full border border-[var(--pc-line-strong)] px-4 py-2 text-right text-[13px] leading-5 text-ink hover:bg-hover"
                  >
                    {a.q}
                  </button>
                ))}
              </div>
            )}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              send()
            }}
            className="flex flex-col gap-2 border-t border-divider px-4 pt-3 pb-4"
          >
            <div className="flex items-center gap-3 rounded-full border border-line bg-sheet py-1 pr-1 pl-4">
              <label htmlFor="assistant-question" className="sr-only">
                Your question
              </label>
              <input
                ref={input}
                id="assistant-question"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Type your question…"
                className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-subtle"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!draft.trim()}
                className="press flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-on-primary disabled:cursor-default disabled:opacity-50"
              >
                <ArrowUp aria-hidden="true" size={17} strokeWidth={1.85} />
              </button>
            </div>
            <p className="text-center text-[11px] leading-4 text-ink-subtle">
              Answers can be wrong. Prefer a person?{' '}
              <a href={`mailto:${site.email}`} className="text-ink-soft underline underline-offset-2">
                Email us
              </a>
              .
            </p>
          </form>
        </section>
      )}
      {open ? (
        <button
          type="button"
          onClick={close}
          aria-label="Close chat"
          className="press flex size-14 cursor-pointer items-center justify-center rounded-full border border-line bg-control text-ink hover:bg-hover"
        >
          <X aria-hidden="true" size={22} strokeWidth={1.85} />
        </button>
      ) : (
        <button
          ref={opener}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open chat: ask PractiCode a question"
          className="press flex h-14 cursor-pointer items-center gap-3 rounded-full bg-[linear-gradient(120deg,#3d5af5_0%,#6e4cf5_50%)] px-2 text-[15px] font-semibold text-white shadow-[0_16px_40px_rgba(110,76,245,0.45)] hover:brightness-110 ph:pr-6"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-white text-[#6e4cf5]">
            <MessageCircle aria-hidden="true" size={20} strokeWidth={1.85} />
          </span>
          <span className="hidden ph:inline">Ask us anything</span>
        </button>
      )}
    </div>
  )
}

