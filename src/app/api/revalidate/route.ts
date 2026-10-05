import { timingSafeEqual } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { serverEnv } from '@/lib/server-env'

const Body = z.object({ paths: z.array(z.string().regex(/^\/[a-z0-9\-/.]*$/)).max(200) })

/** The content pipeline sends `Authorization: Bearer <REVALIDATE_SECRET>`. Without a secret, nobody gets in. */
function authorised(header: string | null): boolean {
  let secret: string
  try {
    secret = serverEnv().REVALIDATE_SECRET
  } catch {
    return false
  }
  const expected = Buffer.from(`Bearer ${secret}`)
  const got = Buffer.from(header ?? '')
  return got.length === expected.length && timingSafeEqual(got, expected)
}

/** Rebuilds the pages that show newly published lessons (tools/content-build/publish.ts calls this). */
export async function POST(request: Request) {
  if (!authorised(request.headers.get('authorization'))) return new Response('Unauthorised', { status: 401 })
  let json: unknown
  try {
    json = await request.json()
  } catch {
    return new Response('Send JSON: { "paths": ["/learn/..."] }', { status: 400 })
  }
  const parsed = Body.safeParse(json)
  if (!parsed.success) return new Response('Paths must be paths on this site.', { status: 400 })
  for (const path of parsed.data.paths) revalidatePath(path)
  return Response.json({ revalidated: parsed.data.paths.length })
}
