'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useId, useState } from 'react'
import { CourseIcon } from '@/components/learn/track-icon'
import { Glyph } from '@/components/ui/glyph'
import { ArrowRight, Icon } from '@/components/ui/icon'
import {
  LEVELS,
  SUBJECTS,
  type CatalogueCourse,
  type Level,
  type Subject,
  type TrackTone,
} from '@/content/catalogue'
import { cn } from '@/lib/cn'
import { toneClass } from '@/lib/tone'
import { Illustration } from './course-illustration'

export type FinderCourse = Pick<
  CatalogueCourse,
  'slug' | 'code' | 'title' | 'subject' | 'level' | 'modules' | 'hours' | 'summary' | 'alignment' | 'status'
> & { tone: TrackTone; subjectLabel: string; prerequisites: string[] }

const chip =
  'press inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-[13px] font-medium whitespace-nowrap transition-colors'
const chipOff = 'border-line-control text-ink-soft hover:border-line-strong hover:bg-hover'
const chipOn = 'border-transparent bg-primary text-on-primary'

function CourseCard({ course }: { course: FinderCourse }) {
  const look = toneClass[course.tone]
  const live = course.status === 'live'
  const meta = [course.level, course.modules && `${course.modules} modules`, course.hours && `${course.hours} hours`]
    .filter(Boolean)
    .join(' · ')
  const body = (
    <>
      <div className="relative h-[132px] shrink-0 overflow-hidden" style={{ background: `var(--pc-card-${course.tone})` }}>
        <Illustration
          tone={course.tone}
          code={course.code}
          className="-right-3 -bottom-5 h-[128px] w-[154px] ph:-right-3 ph:-bottom-5 ph:h-[128px] ph:w-[154px]"
        />
        <div className="relative flex items-start justify-between gap-2 p-4">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/15 text-white">
            <CourseIcon code={course.code} tone={course.tone} size={20} />
          </span>
          {live ? (
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#15122a]">Module 1 free</span>
          ) : (
            <span className="rounded-full border border-white/40 bg-black/30 px-2.5 py-1 text-xs font-semibold text-white">
              Coming soon
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <p className={cn('text-xs font-semibold', look.text)}>{course.subjectLabel}</p>
        <h3 className="font-display text-lg leading-6 font-bold tracking-[-0.01em] text-ink">{course.title}</h3>
        <p className="text-[13px] text-ink-soft">{meta}</p>
        <p className="text-[13px] text-ink-subtle">{course.alignment}</p>
        {course.prerequisites.length > 0 && (
          <p className="text-[13px] text-ink-subtle">Take first: {course.prerequisites.join(' and ')}</p>
        )}
        {live && (
          <p className={cn('mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-semibold', look.text)}>
            See the Course
            <Icon as={ArrowRight} size={14} />
          </p>
        )}
      </div>
    </>
  )
  const frame = 'flex h-full flex-col overflow-hidden rounded-[22px] border border-line surface'
  return live ? (
    <Link href={`/courses/${course.slug}` as Route} className={cn(frame, 'press transition-colors hover:border-line-strong')}>
      {body}
    </Link>
  ) : (
    <div className={frame}>{body}</div>
  )
}

/**
 * The catalogue with a search box and filters. Every card is in the page's HTML, so it all shows without
 * JavaScript; the filters hide the cards that don't match.
 */
export function CourseFinder({
  courses,
  title,
  titleId,
}: {
  courses: FinderCourse[]
  title: string
  titleId: string
}) {
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState<Subject | null>(null)
  const [level, setLevel] = useState<Level | null>(null)
  const [openOnly, setOpenOnly] = useState(false)
  const searchId = useId()

  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  const matches = (c: FinderCourse) =>
    (!subject || c.subject === subject) &&
    (!level || c.level === level) &&
    (!openOnly || c.status === 'live') &&
    words.every((w) => `${c.title} ${c.summary} ${c.subjectLabel}`.toLowerCase().includes(w))
  const shown = courses.filter(matches)
  const filtered = Boolean(query || subject || level || openOnly)
  const clear = () => {
    setQuery('')
    setSubject(null)
    setLevel(null)
    setOpenOnly(false)
  }

  return (
    <div className="flex flex-col gap-6 ph:gap-8">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 ph:flex-row ph:items-center ph:justify-between">
          <h1
            id={titleId}
            className="font-display text-[36px] leading-[42px] font-extrabold tracking-[-0.035em] text-ink ph:text-[44px] ph:leading-[50px]"
          >
            {title}
          </h1>
          <div className="relative w-full ph:w-[340px]">
            <label htmlFor={searchId} className="sr-only">
              Search courses
            </label>
            <Glyph
              name="search"
              size={18}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-subtle"
            />
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses"
              className="h-11 w-full rounded-full border border-line-control bg-control pr-4 pl-11 text-[15px] text-ink placeholder:text-ink-subtle focus:border-line-strong focus:outline-none"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 border-b border-line-subtle pb-5 tab:flex-row tab:items-center tab:justify-between tab:gap-6">
          <div
            role="group"
            aria-label="Subject"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] ph:mx-0 ph:flex-wrap ph:overflow-visible ph:px-0"
          >
            <button
              type="button"
              aria-pressed={subject === null}
              onClick={() => setSubject(null)}
              className={cn(chip, subject === null ? chipOn : chipOff)}
            >
              All subjects
            </button>
            {SUBJECTS.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={subject === s.id}
                onClick={() => setSubject(subject === s.id ? null : s.id)}
                className={cn(chip, subject === s.id ? chipOn : chipOff)}
              >
                <span aria-hidden="true" className={cn('size-2 rounded-full', toneClass[s.tone].fill)} />
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="relative">
              <select
                aria-label="Level"
                value={level ?? ''}
                onChange={(e) => setLevel((e.target.value || null) as Level | null)}
                className={cn(chip, chipOff, 'appearance-none bg-control pr-9')}
              >
                <option value="">Any level</option>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <Glyph
                name="chevronDown"
                size={14}
                className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-ink-subtle"
              />
            </div>
            <label className={cn(chip, openOnly ? chipOn : chipOff)}>
              <input
                type="checkbox"
                checked={openOnly}
                onChange={(e) => setOpenOnly(e.target.checked)}
                className="size-4 accent-[var(--pc-primary)]"
              />
              Open now
            </label>
          </div>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 tab:grid-cols-3 wide:grid-cols-4 ph:gap-5">
        {courses.map((c) => (
          <li key={c.slug} hidden={!shown.includes(c)}>
            <CourseCard course={c} />
          </li>
        ))}
      </ul>
      <p
        aria-live="polite"
        className={cn('text-center text-[15px] text-ink-muted', shown.length && 'sr-only')}
      >
        {shown.length === 0 ? (
          <>
            No course matches that yet.{' '}
            <button
              type="button"
              onClick={clear}
              className="font-semibold text-ink underline underline-offset-2 hover:no-underline"
            >
              Clear the filters
            </button>
          </>
        ) : filtered ? (
          'The list now shows the courses that match.'
        ) : (
          ''
        )}
      </p>
    </div>
  )
}
