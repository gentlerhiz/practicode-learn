'use client'
import { useRef, useState } from 'react'
import { PreviewFrame, type PreviewFrameHandle } from '@/components/lesson/preview-frame'
import { Button, Heading } from '@/components/ui'
import type { LessonFile, LessonTest } from '@/lib/lessons/schema'
import type { TestResult } from '@/lib/runner/protocol'

type Fixture = { id: string; label: string; files: LessonFile[]; tests?: LessonTest[] }

const FIXTURES: Fixture[] = [
  {
    id: 'passing',
    label: 'Passing tests',
    files: [
      { name: 'index.html', lang: 'html', code: '<p class="note">Hello</p>' },
      { name: 'styles.css', lang: 'css', code: '.note { color: rgb(232, 121, 47); }' },
    ],
    tests: [
      { name: 'The note is there', code: "assert($('.note'), 'No note.')" },
      {
        name: 'The note is orange',
        code: "assert(css('.note', 'color') === 'rgb(232, 121, 47)', 'Not orange.')",
      },
    ],
  },
  {
    // Breaks the timers the test harness needs, so the tests never report and the timeout answers.
    id: 'throwing',
    label: 'Code that breaks the page',
    files: [
      {
        name: 'script.js',
        lang: 'js',
        code: "window.setTimeout = function () { throw new Error('Broken on purpose') }\nthrow new Error('Broken on purpose')",
      },
    ],
    tests: [{ name: 'Never runs', code: 'assert(true)' }],
  },
  {
    id: 'isolation',
    label: 'Isolation',
    files: [{ name: 'index.html', lang: 'html', code: '<p>Isolated</p>' }],
    tests: [
      { name: 'origin: null', code: "assert(String(window.origin) === 'null', 'origin: ' + window.origin)" },
      {
        name: 'Cookies are out of reach',
        code: "var readable = false\ntry { readable = document.cookie !== '' } catch (e) {}\nassert(!readable, 'Cookies were readable.')",
      },
      {
        name: 'Storage is out of reach',
        code: "var reachable = true\ntry { localStorage.getItem('x') } catch (e) { reachable = false }\nassert(!reachable, 'Storage was reachable.')",
      },
    ],
  },
  {
    id: 'preview',
    label: 'A preview without tests',
    files: [{ name: 'index.html', lang: 'html', code: '<h2>Just a preview</h2>' }],
  },
]

function FixtureFrame({ fixture }: { fixture: Fixture }) {
  const frame = useRef<PreviewFrameHandle>(null)
  const [results, setResults] = useState<TestResult[] | null>(null)
  const passed = results?.filter((r) => r.pass).length ?? 0
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <Heading level={2} size="md">
          {fixture.label}
        </Heading>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setResults(null)
            frame.current?.run()
          }}
        >
          Run Again
        </Button>
      </div>
      <PreviewFrame
        ref={frame}
        files={fixture.files}
        tests={fixture.tests}
        onResults={setResults}
        label={`${fixture.label}: preview`}
      />
      {fixture.tests && (
        <div data-testid={`${fixture.id}-results`} aria-live="polite" className="text-sm text-ink-soft">
          {results ? (
            <>
              <p>
                {passed} of {results.length} passed
              </p>
              <ul>
                {results.map((r) => (
                  <li key={r.name}>
                    {r.pass ? '✓' : '✗'} {r.name}
                    {r.message ? `: ${r.message}` : ''}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>Running…</p>
          )}
        </div>
      )}
    </section>
  )
}

export function RunnerFixtures() {
  return (
    <main id="main" className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-10">
      <Heading level={1} size="lg">
        Runner fixtures
      </Heading>
      {FIXTURES.map((f) => (
        <FixtureFrame key={f.id} fixture={f} />
      ))}
    </main>
  )
}
