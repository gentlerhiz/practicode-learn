'use client'
import type { Route } from 'next'
import { LessonComplete } from '@/components/lesson/lesson-complete'

/** PrismTryDone with the canvas's sample lesson; ?learner shows the signed-in version. */
export function DonePreview({ learner }: { learner: boolean }) {
  return (
    <LessonComplete
      eyebrow="Front-End · Module 1 · Lesson 1"
      lessonNumber={1}
      lead="You now know what really happens when you open a website. Most people never find out."
      minutes={9}
      points={[
        'Your browser asks a server for every page you open',
        'The server sends back HTML, CSS and JavaScript',
        'Your browser turns that code into the page you see',
      ]}
      nextLesson={{ href: '/learn/samples/every-step' as Route, title: 'URLs, domains and DNS', lesson: 2, minutes: 10 }}
      isGuest={!learner}
      lessonPath="/learn/front-end-web-development/how-the-web-works"
      onRestart={() => {}}
    />
  )
}
