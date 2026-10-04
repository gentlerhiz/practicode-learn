import { z } from 'zod'

const PublicEnv = z
  .object({
    NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
    NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(20).optional(),
    NEXT_PUBLIC_CONTENT_SOURCE: z.enum(['samples', 'supabase']).default('samples'),
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z.string().optional(),
    NEXT_PUBLIC_BING_SITE_VERIFICATION: z.string().optional(),
  })
  .superRefine((env, ctx) => {
    if (
      env.NEXT_PUBLIC_CONTENT_SOURCE === 'supabase' &&
      !(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
    ) {
      ctx.addIssue({
        code: 'custom',
        message:
          'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are required when content comes from Supabase',
      })
    }
  })

export type PublicEnv = z.infer<typeof PublicEnv>
export const parsePublicEnv = (source: Record<string, string | undefined>): PublicEnv => PublicEnv.parse(source)

// Each variable is named literally so Next.js can inline it into client bundles.
export const publicEnv = parsePublicEnv({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_CONTENT_SOURCE: process.env.NEXT_PUBLIC_CONTENT_SOURCE,
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  NEXT_PUBLIC_BING_SITE_VERIFICATION: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
})
