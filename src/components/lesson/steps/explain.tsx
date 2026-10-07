import type { LessonStep } from '@/lib/lessons/schema'
import { StepGrid, StepHeading } from '../parts/step-layout'

export function ExplainStep({ step }: { step: Extract<LessonStep, { type: 'explain' }> }) {
  return <StepGrid top={<StepHeading stage={step.stage} body={step.body} />} />
}
