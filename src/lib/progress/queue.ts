import type { ProgressEvent, SendResult } from './types'

const MAX = 500
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000

/**
 * Progress events waiting to be sent, kept in storage so they survive reloads, being offline and being
 * signed out. Sends in order and stops at the first failure; the server ignores repeats by event id.
 */
export function createQueue(storage: Storage, key = 'pc-progress-v1') {
  const read = (): ProgressEvent[] => {
    try {
      const parsed: unknown = JSON.parse(storage.getItem(key) ?? '[]')
      return Array.isArray(parsed)
        ? (parsed as ProgressEvent[]).filter((e) => Date.now() - Date.parse(e.occurredAt) < MAX_AGE_MS)
        : []
    } catch {
      return []
    }
  }
  const write = (list: ProgressEvent[]) => {
    try {
      storage.setItem(key, JSON.stringify(list.slice(-MAX)))
    } catch {
      // Storage full or blocked: the events stay only as long as this page is open.
    }
  }
  // Removes only what was sent, so events recorded during a send are kept.
  const remove = (sent: ProgressEvent[]) => {
    const ids = new Set(sent.map((e) => e.id))
    write(read().filter((e) => !ids.has(e.id)))
  }

  return {
    enqueue(e: ProgressEvent) {
      const list = read()
      if (!list.some((x) => x.id === e.id)) write([...list, e])
    },
    pending: read,
    async flush(send: (e: ProgressEvent) => Promise<SendResult>) {
      const list = read()
      let sent = 0
      for (const e of list) {
        const result = await send(e)
        if (result !== 'ok') {
          remove(list.slice(0, sent))
          return { sent, left: list.length - sent, needsAuth: result === 'auth' }
        }
        sent++
      }
      remove(list)
      return { sent, left: 0, needsAuth: false }
    },
  }
}
