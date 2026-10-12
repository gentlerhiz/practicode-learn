'use client'
import type { Route } from 'next'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { LogoIcon } from '@/components/layout/logo'
import { Button, Card, LinkButton, Spinner } from '@/components/ui'
import type { LessonPack } from '@/lib/lessons/schema'
import type { NextLesson } from './lesson-complete'
import { LessonShell } from './lesson-shell'

type State = { kind: 'checking' | 'guest' | 'locked' | 'error' } | { kind: 'ready'; pack: LessonPack }

const SIGNED_IN = /(?:^|;\s*)sb-[^=]+-auth-token(?:\.\d+)?=/

/**
 * A Pro lesson page. The page itself is static and public, so it holds no lesson: once in the browser, it
 * asks /api/lessons/<id>, which hands the pack only to a signed-in Pro member, and then plays it.
 */
export function ProLesson({
  lessonId,
  title,
  description,
  eyebrow,
  lessonPath,
  trackLabel,
  lessonMeta,
  trackHref,
  nextLesson,
}: {
  lessonId: string
  title: string
  description: string
  eyebrow: string
  lessonPath: string
  trackLabel: string
  lessonMeta: string
  trackHref: Route
  nextLesson?: NextLesson
}) {
  const [state, setState] = useState<State>({ kind: 'checking' })

  const open = useCallback(async () => {
    // Without a session cookie the answer is always "sign in", so there's nothing to ask.
    if (!SIGNED_IN.test(document.cookie)) return setState({ kind: 'guest' })
    setState({ kind: 'checking' })
    try {
      const res = await fetch(`/api/lessons/${lessonId}`, { cache: 'no-store' })
      if (res.status === 401) return setState({ kind: 'guest' })
      if (res.status === 403) return setState({ kind: 'locked' })
      if (!res.ok) return setState({ kind: 'error' })
      setState({ kind: 'ready', pack: (await res.json()) as LessonPack })
    } catch {
      setState({ kind: 'error' })
    }
  }, [lessonId])

  useEffect(() => {
    queueMicrotask(() => void open())
  }, [open])

  if (state.kind === 'ready') {
    return (
      <LessonShell
        pack={state.pack}
        lessonPath={lessonPath}
        trackLabel={trackLabel}
        lessonMeta={lessonMeta}
        trackHref={trackHref}
        eyebrow={eyebrow}
        nextLesson={nextLesson}
        onlineOnly
      />
    )
  }

  return (
    <>
      <header className="border-b border-line">
        <div className="mx-auto flex h-[72px] w-full max-w-5xl items-center justify-between gap-4 px-4 ph:px-6">
          <Link href="/" prefetch={false} aria-label="PractiCode Learn home" className="flex">
            <LogoIcon />
          </Link>
          <LinkButton href={trackHref} prefetch={false} variant="secondary" size="sm">
            Exit Lesson
          </LinkButton>
        </div>
      </header>
      <main id="main" className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pt-8 pb-16 ph:px-6">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-fe-text">{eyebrow} · Pro</p>
          <h1 className="font-display text-[30px] leading-9 font-bold tracking-[-0.02em] text-ink ph:text-[40px] ph:leading-[46px]">
            {title}
          </h1>
          <p className="text-base leading-[26px] text-ink-soft">{description}</p>
        </div>
        <Card padding="lg" className="flex flex-col items-start gap-4" aria-live="polite">
          {state.kind === 'checking' && (
            <p className="flex items-center gap-3 text-base leading-[26px] text-ink-soft">
              <Spinner size={18} />
              This lesson is part of Pro. Opening it for you…
            </p>
          )}
          {state.kind === 'guest' && (
            <>
              <p className="text-base leading-[26px] text-ink-soft">
                This lesson is part of Pro. If you have Pro, log in to open it.
              </p>
              <LinkButton href={`/login?next=${encodeURIComponent(lessonPath)}` as Route} prefetch={false}>
                Log In
              </LinkButton>
            </>
          )}
          {state.kind === 'locked' && (
            <>
              <p className="text-base leading-[26px] text-ink-soft">
                This lesson is part of Pro, which opens to everyone soon. Module 1 stays free in the meantime.
              </p>
              <LinkButton href={'/pricing' as Route} prefetch={false} variant="secondary">
                See Plans
              </LinkButton>
            </>
          )}
          {state.kind === 'error' && (
            <>
              <p className="text-base leading-[26px] text-ink-soft">
                This lesson couldn’t load. Check your connection, then try again.
              </p>
              <Button type="button" onClick={() => void open()}>
                Try Again
              </Button>
            </>
          )}
        </Card>
      </main>
    </>
  )
}
