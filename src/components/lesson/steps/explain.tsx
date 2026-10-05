import type { LessonStep } from '@/lib/lessons/schema'
import { Prose } from '../parts/prose'

export function ExplainStep({ step }: { step: Extract<LessonStep, { type: 'explain' }> }) {
  return <Prose html={step.body ?? ''} />
}
