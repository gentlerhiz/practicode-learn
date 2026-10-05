import { readFileSync } from 'node:fs'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import { parsePack } from '@/lib/lessons/schema'
import { LessonPlayer } from '../player/player'

const pack = parsePack(JSON.parse(readFileSync('content/samples/packs/zz-01-01.json', 'utf8')))
const live = pack.steps.findIndex((s) => s.type === 'question' && s.live)
const plain = pack.steps.findIndex((s) => s.type === 'question' && !s.live)
const play = (startAt: number) =>
  render(<LessonPlayer pack={pack} startAt={startAt} onEvent={() => {}} onFinish={() => {}} />)

it('a live question shows each answer in the code as it is chosen', async () => {
  const { container } = play(live)
  expect(container.querySelector('mark')?.textContent).toContain('tap an answer to try it')
  await userEvent.click(screen.getByRole('radio', { name: 'center' }))
  expect(container.querySelector('mark')?.textContent).toContain('text-align: center;')
  await userEvent.click(screen.getByRole('radio', { name: 'right' }))
  expect(container.querySelector('mark')?.textContent).toContain('text-align: right;')
})

it('keeps Continue locked after a wrong answer, until the right one', async () => {
  play(plain)
  const next = screen.getByRole('button', { name: 'Continue' })
  expect(next).toBeDisabled()
  await userEvent.click(screen.getByRole('radio', { name: 'Add more text to the page' }))
  await userEvent.click(screen.getByRole('button', { name: 'Check My Answer' }))
  expect(next).toBeDisabled()
  expect(screen.getByText(/Not quite\./)).toBeVisible()
  await userEvent.click(screen.getByRole('radio', { name: 'Make the photo files smaller' }))
  await userEvent.click(screen.getByRole('button', { name: 'Check My Answer' }))
  expect(next).toBeEnabled()
})

it('announces feedback in a live region', async () => {
  play(plain)
  await userEvent.click(screen.getByRole('radio', { name: 'Make the photo files smaller' }))
  await userEvent.click(screen.getByRole('button', { name: 'Check My Answer' }))
  const verdict = screen.getByText(/Correct\./)
  expect(verdict.closest('[aria-live]')).toHaveAttribute('aria-live', 'polite')
  expect(verdict.closest('[aria-live]')).toHaveTextContent('Smaller files arrive sooner.')
})
