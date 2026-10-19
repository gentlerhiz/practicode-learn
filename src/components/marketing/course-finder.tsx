'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useId, useState } from 'react'
import { TrackIcon } from '@/components/learn/track-icon'
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

export type FinderCourse = Pick<
  CatalogueCourse,
  'slug' | 'title' | 'subject' | 'level' | 'modules' | 'hours' | 'summary' | 'alignment' | 'status'
> & { tone: TrackTone; subjectLabel: string; prerequisites: string[] }

const chip =
  'press inline-flex h-10 cursor-pointer items-center rounded-full border px-4 text-sm font-medium transition-colors'
const chipOff = 'border-line-control text-ink-soft hover:border-line-strong hover:bg-hover'
const chipOn = 'border-transparent bg-primary text-on-primary'

function CourseCard({ course }: { course: FinderCourse }) {
  const look = toneClass[course.tone]
  const live = course.status === 'live'
  const meta = [
    course.level,
    course.modules && `${course.modules} modules`,
    course.hours && `about ${course.hours} hours`,
  ]
    .filter(Boolean)
    .join(' · ')
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-[14px] text-white',
            look.fill,
          )}
        >
          <TrackIcon track={course.tone} size={22} />
        </span>
        {live ? (
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-on-primary">
            Module 1 free
          </span>
        ) : (
          <span className="rounded-full border border-line-control bg-row px-3 py-1 text-xs font-medium text-ink-muted">
            Coming soon
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <p className={cn('text-[13px] font-semibold', look.text)}>{course.subjectLabel}</p>
        <h3 className="font-display text-xl leading-7 font-bold tracking-[-0.015em] text-ink">
          {course.title}
        </h3>
        <p className="text-[15px] leading-6 text-ink-muted">{course.summary}</p>
      </div>
      <div className="mt-auto flex flex-col gap-1.5 border-t border-line-subtle pt-4 text-[13px]">
        <p className="text-ink-soft">{meta}</p>
        <p className="text-ink-subtle">{course.alignment}</p>
        {course.prerequisites.length > 0 && (
          <p className="text-ink-subtle">Take first: {course.prerequisites.join(' and ')}</p>
        )}
        {live && (
          <p className={cn('mt-1 inline-flex items-center gap-1.5 font-semibold', look.text)}>
            See the Course
            <Icon as={ArrowRight} size={14} />
          </p>
        )}
      </div>
    </>
  )
  const frame = 'flex h-full flex-col gap-5 rounded-[26px] border border-line p-6 surface'
  const wash = { background: `linear-gradient(170deg, rgba(${look.rgb},0.13), var(--pc-sheet) 45%)` }
  return live ? (
    <Link
      href={`/courses/${course.slug}` as Route}
      className={cn(frame, 'press transition-colors hover:border-line-strong')}
      style={wash}
    >
      {body}
    </Link>
  ) : (
    <div className={frame} style={wash}>
      {body}
    </div>
  )
}

/**
 * The catalogue with a search box and filters. Every card is in the page's HTML, so it all shows without
 * JavaScript; the filters hide the cards that don't match.
 */
export function CourseFinder({ courses }: { courses: FinderCourse[] }) {
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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5 rounded-[26px] border border-line p-5 surface ph:p-6">
        <div className="flex flex-col gap-2">
          <label htmlFor={searchId} className="text-sm font-medium text-ink">
            Search courses
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try “security”, “data” or “web”"
            className="h-12 rounded-2xl border border-line-control bg-control px-4 text-base text-ink placeholder:text-ink-subtle focus:border-line-strong focus:outline-none"
          />
        </div>
        <div role="group" aria-label="Subject" className="flex flex-wrap gap-2">
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
              <span
                aria-hidden="true"
                className={cn('mr-2 size-2.5 rounded-[3px]', toneClass[s.tone].fill)}
              />
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div role="group" aria-label="Level" className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={level === null}
              onClick={() => setLevel(null)}
              className={cn(chip, level === null ? chipOn : chipOff)}
            >
              Any level
            </button>
            {LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={level === l}
                onClick={() => setLevel(level === l ? null : l)}
                className={cn(chip, level === l ? chipOn : chipOff)}
              >
                {l}
              </button>
            ))}
          </div>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-ink">
            <input
              type="checkbox"
              checked={openOnly}
              onChange={(e) => setOpenOnly(e.target.checked)}
              className="size-[18px] accent-[var(--pc-primary)]"
            />
            Open now
          </label>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-4 min-[700px]:grid-cols-2 min-[1100px]:grid-cols-3 ph:gap-6">
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
