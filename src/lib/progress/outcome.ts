import type { SendResult } from './types'

type RpcResponse = { status: number; error: { code?: string } | null }

/**
 * What to do after sending an event: done, wait for sign-in, retry later, or drop it because the server
 * will always refuse it (record_progress raises 22023 for invalid events).
 */
export function outcome({ status, error }: RpcResponse): SendResult | 'drop' {
  if (!error) return 'ok'
  if (error.code === '28000' || status === 401) return 'auth'
  if (error.code === '22023') return 'drop'
  return 'retry'
}
