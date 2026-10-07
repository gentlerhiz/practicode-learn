'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { Field, Input } from '@/components/ui'
import { buttonClasses } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { inputClasses } from '@/components/ui/field'
import { Glyph } from '@/components/ui/glyph'
import { cn } from '@/lib/cn'

const TRACKS = ['Front-End', 'Data Analysis', 'UI/UX Design', 'AI & ML']
const HOURS = ['Under 2', '2 to 5', 'More than 5']

function Pills({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-ink">{label}</p>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={o === value}
            onClick={() => onChange(o)}
            className={cn(
              'press h-10 cursor-pointer rounded-full border px-4 text-sm',
              o === value ? 'border-primary bg-primary text-on-primary' : 'border-line-control text-ink-soft hover:border-line-strong hover:bg-hover',
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * PrismScholarship's application. It's sent by email to the scholarship team (from the learner's own
 * email app), so the answers reach a person straight away and are never stored on this site.
 */
export function ScholarshipForm() {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [track, setTrack] = useState(TRACKS[0]!)
  const [hours, setHours] = useState(HOURS[1]!)
  const [why, setWhy] = useState('')
  const [goal, setGoal] = useState('')
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-6">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-[rgba(47,230,176,0.16)] text-success">
          <Glyph name="check" size={28} strokeWidth={2.2} />
        </span>
        <h2 className="font-display text-[28px] leading-[34px] font-extrabold text-ink">Application ready to send</h2>
        <p className="text-base leading-[26px] text-ink-muted">
          Thank you{name ? `, ${name.split(' ')[0]}` : ''}. Your email app has your application ready: send it, and a person will read it
          and reply within 10 working days. Keep learning in the meantime. Your progress carries over.
        </p>
        <Link href={'/onboarding' as Route} className={buttonClasses({ size: 'form' }, 'px-8')}>
          Keep Learning
        </Link>
      </div>
    )
  }

  return (
    <>
      <h2 className="font-display text-2xl font-extrabold text-ink">Your application</h2>
      <form
        className="flex flex-col gap-5"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          if (!name.trim() || !contact.trim() || !why.trim()) return setError('Fill in your name, how to reach you, and what’s making it hard to pay.')
          if (!agree) return setError('Tick the box so we can use your answers to decide.')
          setError('')
          const body = [
            `Name: ${name}`,
            `Email or phone: ${contact}`,
            `Track: ${track}`,
            `Hours a week: ${hours}`,
            '',
            `What's making it hard to pay right now?`,
            why,
            '',
            `What will I do with these skills?`,
            goal || '(not answered)',
          ].join('\n')
          window.location.href = `mailto:practicodeacademy@gmail.com?subject=${encodeURIComponent('Scholarship application')}&body=${encodeURIComponent(body)}`
          setSent(true)
        }}
      >
        <Field id="sch-name" label="Your name">
          <Input id="sch-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field id="sch-contact" label="Email or phone">
          <Input id="sch-contact" autoComplete="email" value={contact} onChange={(e) => setContact(e.target.value)} />
        </Field>
        <Pills label="Which track do you want to finish?" options={TRACKS} value={track} onChange={setTrack} />
        <Pills label="Hours a week you can learn" options={HOURS} value={hours} onChange={setHours} />
        <Field id="sch-why" label="What’s making it hard to pay right now?" hint="Only the scholarship team reads this.">
          <textarea
            id="sch-why"
            rows={5}
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            placeholder="A few sentences is plenty."
            aria-describedby="sch-why-hint"
            className={cn(inputClasses, 'h-auto resize-y py-3 leading-6')}
          />
        </Field>
        <Field id="sch-goal" label="What will you do with these skills?">
          <textarea
            id="sch-goal"
            rows={3}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="For example, get a first tech job or build a site for my business."
            className={cn(inputClasses, 'h-auto resize-y py-3 leading-6')}
          />
        </Field>
        <Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)}>
          I agree that PractiCode can use these answers only to decide on my scholarship.
        </Checkbox>
        {error && (
          <p role="alert" className="text-sm text-error">
            {error}
          </p>
        )}
        <button type="submit" className={buttonClasses({ size: 'form' }, 'w-full')}>
          Send My Application
        </button>
      </form>
    </>
  )
}
