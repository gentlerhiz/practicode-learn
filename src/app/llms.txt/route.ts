import { publicPages } from '@/lib/seo/pages'
import { absoluteUrl, site } from '@/lib/site'

export const dynamic = 'force-static'

/** A plain-text summary for AI assistants and crawlers (https://llmstxt.org). */
export function GET() {
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    'PractiCode Learn is an interactive learning platform from PractiCode Academy. Lessons are short, hands-on and video-free: learners predict, run, change and build real code in the browser. Courses open now: IT Fundamentals, Front-End Web Development, Back-End Web Development, Introduction to Cybersecurity, Python Programming, and SQL and Databases, all listed at /courses.',
    '',
    '## Pages',
    '',
    ...publicPages.map((page) => `- [${page.title}](${absoluteUrl(page.path)}): ${page.description}`),
    '',
    '## Contact',
    '',
    `- Email: ${site.email}`,
    '- PractiCode Academy: https://practicode.tech',
    '',
  ]
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
