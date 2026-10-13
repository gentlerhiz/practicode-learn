import 'server-only'
import { serverEnv } from '@/lib/server-env'

export type Turn = { role: 'user' | 'assistant'; content: string }

/** The model behind the tutor. Groq's free plan allows 1,000 requests and 200,000 tokens a day. */
export const TUTOR_MODEL = 'openai/gpt-oss-120b'

/** The provider is busy or over its limit: give the question back and ask the learner to try again. */
export class TutorUnavailable extends Error {
  override name = 'TutorUnavailable'
}

/**
 * Asks the model through Groq's OpenAI-compatible API. Kept behind this one function so the provider can
 * change without touching the route or the panel (ADR 0006).
 */
export async function askModel(messages: { role: 'system' | 'user' | 'assistant'; content: string }[]): Promise<string> {
  let response: Response
  try {
    response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${serverEnv().GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: TUTOR_MODEL,
        messages,
        reasoning_effort: 'low',
        temperature: 0.3,
        max_completion_tokens: 800,
      }),
      signal: AbortSignal.timeout(25_000),
    })
  } catch (error) {
    throw new TutorUnavailable(`The AI provider didn't answer: ${(error as Error).message}`)
  }
  if (!response.ok) throw new TutorUnavailable(`The AI provider said ${response.status}: ${(await response.text()).slice(0, 300)}`)
  const json = (await response.json()) as { choices?: { message?: { content?: string } }[] }
  const answer = json.choices?.[0]?.message?.content?.trim()
  if (!answer) throw new TutorUnavailable('The AI provider sent an empty answer.')
  return answer
}
