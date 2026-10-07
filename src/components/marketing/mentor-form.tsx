'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { Field, Input } from '@/components/ui'
import { buttonClasses } from '@/components/ui/button'
import { inputClasses } from '@/components/ui/field'
import { Glyph } from '@/components/ui/glyph'
import { cn } from '@/lib/cn'

const COURSES = ['Front-End', 'Data Analysis', 'UI/UX Design', 'AI & ML']
const FORMATS = ['Online', 'In person, Ibadan']
// PractiCode Academy's WhatsApp line (brand facts).
const WHATSAPP = '2349030578667'

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
              'press h-10 cursor-pointer rounded-full border px-4 text-sm font-medium',
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
 * "Ask about the next cohort" (PrismMentor). It sends the enquiry to PractiCode Academy on WhatsApp,
 * which the Academy already answers, so nothing is lost before an inbox exists in the app.
 */
export function MentorForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [course, setCourse] = useState(COURSES[0]!)
  const [format, setFormat] = useState(FORMATS[0]!)
  const [question, setQuestion] = useState('')
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-4">
        <span className="flex size-[52px] items-center justify-center rounded-2xl bg-[rgba(47,230,176,0.16)] text-success">
          <Glyph name="check" size={24} strokeWidth={2.2} />
        </span>
        <h2 className="font-display text-[26px] font-extrabold tracking-[-0.02em] text-ink">Thanks, we’ve got it</h2>
        <p className="text-[15px] leading-6 text-ink-muted">
          Your message is ready in WhatsApp. Send it there, and someone from PractiCode Academy will reply within 2 working days with
          the next intake dates.
        </p>
        <Link href={'/onboarding' as Route} className={buttonClasses({}, 'h-12 px-6')}>
          Keep Learning
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-[26px] font-extrabold tracking-[-0.02em] text-ink">Ask about the next cohort</h2>
        <p className="text-[15px] leading-6 text-ink-muted">We’ll send intake dates and answer your questions. No commitment.</p>
      </div>
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          const text = [
            `Hello PractiCode Academy, I'd like to ask about the next Mentor cohort.`,
            `Name: ${name || 'not given'}`,
            `Phone: ${phone || 'not given'}`,
            `Course: ${course}`,
            `Joining: ${format}`,
            question ? `Question: ${question}` : '',
          ]
            .filter(Boolean)
            .join('\n')
          window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
          setSent(true)
        }}
      >
        <Field id="mentor-name" label="Your name">
          <Input id="mentor-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field id="mentor-phone" label="WhatsApp or phone number">
          <Input id="mentor-phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>
        <Pills label="Course" options={COURSES} value={course} onChange={setCourse} />
        <Pills label="How would you like to join?" options={FORMATS} value={format} onChange={setFormat} />
        <Field id="mentor-q" label="Anything you want to ask? (optional)">
          <textarea
            id="mentor-q"
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="For example, class times or payment in instalments."
            className={cn(inputClasses, 'h-auto py-3')}
          />
        </Field>
        <button type="submit" className={buttonClasses({ size: 'form' }, 'w-full')}>
          Send My Question
        </button>
        <p className="text-[13px] text-ink-subtle">This opens WhatsApp with your message ready to send.</p>
      </form>
    </>
  )
}
