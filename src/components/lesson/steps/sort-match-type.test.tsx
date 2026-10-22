import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import { parsePack } from '@/lib/lessons/schema'
import { LessonPlayer } from '../player/player'

const hints = ['a', 'b', 'c']
const pack = parsePack({
  schema: 1,
  id: 'zz-01-02',
  slug: 'sort-match-type',
  description:
    'A test lesson with one sort step, one match step and one typed answer, used by the player tests to check marking and feedback.',
  version: 1,
  title: 'Sort, match and type',
  track: 'samples',
  module: 1,
  lesson: 2,
  minutes: 5,
  free: true,
  outcomes: ['zz.sample.read'],
  prerequisites: [],
  steps: [
    {
      type: 'sort',
      stage: 'investigate',
      body: '<p>Sort these.</p>',
      groups: ['Input', 'Output'],
      items: [
        { html: 'Keyboard', group: 0, feedback: 'Keys go in.' },
        { html: 'Speaker', group: 1, feedback: 'Sound comes out.' },
        { html: 'Microphone', group: 0, feedback: 'Your voice goes in.' },
      ],
      hints,
    },
    {
      type: 'match',
      stage: 'investigate',
      body: '<p>Match these.</p>',
      pairs: [
        { term: 'CPU', match: 'Follows instructions', feedback: 'The CPU does the work.' },
        { term: 'RAM', match: 'Holds work in progress', feedback: 'RAM is the desk.' },
        { term: 'SSD', match: 'Keeps files with the power off', feedback: 'The SSD is the cupboard.' },
      ],
      hints,
    },
    {
      type: 'type',
      stage: 'apply',
      body: '<p>Type the command.</p>',
      accept: ['cd ..'],
      mono: true,
      correct: 'Up one folder.',
      wrong: 'Two dots mean the folder above.',
      misses: [{ answers: ['cd'], feedback: 'cd on its own goes home.' }],
      hints,
    },
    { type: 'recap', stage: 'recap', points: ['One', 'Two'], cards: [{ front: 'F', back: 'B' }] },
  ],
})

const play = (startAt: number) =>
  render(<LessonPlayer pack={pack} startAt={startAt} onEvent={() => {}} onFinish={() => {}} />)

it('a sort marks each item and says why a wrong one belongs elsewhere', async () => {
  play(0)
  const next = screen.getByRole('button', { name: 'Continue' })
  const check = screen.getByRole('button', { name: 'Check My Groups' })
  expect(check).toBeDisabled()
  const pick = (item: string, group: string) =>
    userEvent.click(within(screen.getByRole('group', { name: `${item}: which group?` })).getByRole('radio', { name: new RegExp(group) }))
  await pick('Keyboard', 'Input')
  await pick('Speaker', 'Input')
  await pick('Microphone', 'Input')
  await userEvent.click(check)
  expect(screen.getByText(/2 of 3 are in the right group/)).toBeVisible()
  expect(screen.getByText('Sound comes out.')).toBeVisible()
  expect(next).toBeDisabled()
  await pick('Speaker', 'Output')
  await userEvent.click(screen.getByRole('button', { name: 'Check My Groups' }))
  expect(screen.getByText(/Every item is in the right group/)).toBeVisible()
  expect(next).toBeEnabled()
})

it('a match pairs the chosen term with the tapped match', async () => {
  play(1)
  const next = screen.getByRole('button', { name: 'Continue' })
  // The first term is chosen to start with; pairing moves on to the next free term.
  await userEvent.click(screen.getByRole('button', { name: /^Holds work in progress\./ }))
  await userEvent.click(screen.getByRole('button', { name: /^Follows instructions\./ }))
  await userEvent.click(screen.getByRole('button', { name: /^Keeps files with the power off\./ }))
  await userEvent.click(screen.getByRole('button', { name: 'Check My Pairs' }))
  expect(screen.getByText(/1 of 3 pairs match/)).toBeVisible()
  expect(next).toBeDisabled()
  await userEvent.click(screen.getByRole('button', { name: /^CPU,/ }))
  await userEvent.click(screen.getByRole('button', { name: /^Follows instructions\./ }))
  await userEvent.click(screen.getByRole('button', { name: /^RAM,/ }))
  await userEvent.click(screen.getByRole('button', { name: /^Holds work in progress\./ }))
  await userEvent.click(screen.getByRole('button', { name: 'Check My Pairs' }))
  expect(screen.getByText(/Every pair matches/)).toBeVisible()
  expect(next).toBeEnabled()
})

it('a typed answer gives targeted feedback for a known mistake, and accepts extra spaces', async () => {
  play(2)
  const next = screen.getByRole('button', { name: 'Continue' })
  const box = screen.getByRole('textbox', { name: 'Your answer' })
  await userEvent.type(box, 'cd{Enter}')
  expect(screen.getByText(/cd on its own goes home/)).toBeVisible()
  expect(next).toBeDisabled()
  await userEvent.clear(box)
  await userEvent.type(box, '  cd   ..  {Enter}')
  expect(screen.getByText(/Up one folder/)).toBeVisible()
  expect(next).toBeEnabled()
})
