import { z } from 'zod'
import { loadModuleNotes } from '@/lib/notes/load'
import { notesPdf } from '@/lib/notes/pdf'

const Params = z.object({
  track: z.string().regex(/^[a-z0-9-]{1,60}$/),
  module: z.coerce.number().int().min(1).max(99),
})

/**
 * A module's notes as an A4 PDF, drawn from its published lessons on each request, so the notes always
 * match the lessons. Module 1's are free; the rest are for Pro members, and signed-out or free learners are
 * sent to sign in or to Pro.
 */
export async function GET(request: Request, { params }: RouteContext<'/learn/[track]/notes/[module]'>) {
  const parsed = Params.safeParse(await params)
  if (!parsed.success) return new Response('There are no notes here.', { status: 404 })
  const { track, module } = parsed.data
  const origin = new URL(request.url).origin

  let result: Awaited<ReturnType<typeof loadModuleNotes>>
  try {
    result = await loadModuleNotes(track, module)
  } catch (error) {
    console.error(`Notes for ${track} module ${module} could not be loaded`, error)
    return new Response('The notes couldn’t be made just now. Try again in a minute.', { status: 502 })
  }
  if (result.kind === 'missing')
    return new Response('There are no notes for this module yet.', { status: 404 })
  if (result.kind === 'sign-in') {
    const next = encodeURIComponent(`/learn/${track}/notes/${module}`)
    return Response.redirect(`${origin}/login?next=${next}`, 303)
  }
  if (result.kind === 'pro') return Response.redirect(`${origin}/pricing`, 303)

  const pdf = await notesPdf(result.notes)
  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="PractiCode-Learn-${track}-module-${module}-notes.pdf"`,
      // Never shared caches: the response can carry the learner's refreshed session cookie. Pro notes are
      // for one member, so nothing keeps a copy at all.
      'Cache-Control': result.free ? 'private, max-age=300' : 'private, no-store',
      'X-Robots-Tag': 'noindex',
    },
  })
}
