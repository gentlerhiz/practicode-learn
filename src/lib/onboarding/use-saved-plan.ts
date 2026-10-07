'use client'

import { useSyncExternalStore } from 'react'
import { DEFAULT_PLAN, PLAN_STORAGE_KEY, parsePlan, type LearningPlan } from './plan'

const listeners = new Set<() => void>()

function read(): string | null {
  try {
    return localStorage.getItem(PLAN_STORAGE_KEY)
  } catch {
    return null
  }
}

/** Saves the plan in this browser until sign-up stores it with the account. */
export function savePlan(plan: LearningPlan) {
  try {
    localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plan))
  } catch {
    // Private windows can refuse storage; the default plan still works.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

/** The plan saved in onboarding, or the default. The server renders the default. */
export function useSavedPlan(): LearningPlan {
  const raw = useSyncExternalStore(subscribe, read, () => null)
  return raw ? parsePlan(raw) : DEFAULT_PLAN
}
