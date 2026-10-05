/** One learning event, recorded on the device and sent to record_progress() when possible. */
export type ProgressEvent = {
  /** Generated on the device, so a retried send is recognised and changes nothing. */
  id: string
  lessonId: string
  lessonVersion: number
  verb: 'lesson_started' | 'lesson_completed'
  occurredAt: string
  stepsDone: number
  /** Active seconds since the previous event for this lesson (see createActiveTimer). */
  activeSeconds: number
  attempts: Record<string, number>
  offline: boolean
}

export type SendResult = 'ok' | 'retry' | 'auth'
