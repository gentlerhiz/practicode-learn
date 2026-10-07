import { describe, expect, it } from 'vitest'
import { passwordProblems, passwordStrength } from './password'

describe('passwordStrength', () => {
  it('matches the canvas examples', () => {
    expect(passwordStrength('flexbox-is-fun')).toEqual({ bars: 3, label: 'Strong enough', tone: 'good' })
    expect(passwordStrength('jollof-and-flexbox')).toEqual({ bars: 4, label: 'Strong', tone: 'good' })
  })

  it('calls anything under 8 characters too short', () => {
    expect(passwordStrength('abc')).toEqual({ bars: 1, label: 'Too short', tone: 'bad' })
  })

  it('says nothing before the learner types', () => {
    expect(passwordStrength('')).toEqual({ bars: 0, label: '', tone: 'none' })
  })

  it('rates a plain 8-character password as okay', () => {
    expect(passwordStrength('sunshine')).toEqual({ bars: 2, label: 'Okay', tone: 'fair' })
  })
})

describe('passwordProblems', () => {
  it('passes a good password', () => {
    expect(passwordProblems('jollof-and-flexbox', { email: 'tolu@example.com', name: 'Tolu Adebayo' })).toEqual([])
  })

  it('lists each rule a password breaks', () => {
    expect(passwordProblems('tolu12', { email: 'tolu@example.com' })).toEqual(['short', 'personal'])
  })

  it('checks the name as well as the email', () => {
    expect(passwordProblems('adebayo-rocks', { name: 'Tolu Adebayo' })).toEqual(['personal'])
  })
})
