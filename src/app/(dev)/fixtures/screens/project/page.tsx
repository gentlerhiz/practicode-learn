import type { Metadata, Route } from 'next'
import { Workspace } from '@/components/app/projects/workspace'
import { requirePreviews } from '@/lib/fixtures/gate'

export const metadata: Metadata = { title: 'Project preview', robots: { index: false, follow: false } }

const HTML = `<header class="site-header">
  <nav class="menu">
    <a href="#food">Our food</a>
    <a href="#about">About us</a>
    <a href="#order">Order</a>
  </nav>
</header>
<main>
  <section class="hero">
    <h1>Mama Nkechi's Kitchen</h1>
    <p>Jollof, ofe onugbu and cold zobo, cooked fresh every day in Enugu.</p>
    <a class="btn" href="#order">Order Now</a>
  </section>
  <img src="jollof.jpg" alt="A plate of smoky party jollof" />
</main>`

const CSS = `body { margin: 0; font-family: system-ui, sans-serif; background: #FFF8EE; color: #2A1A0E; }
.site-header { padding: 9px 12px; border-bottom: 1px solid #F0E2CC; }
.hero { padding: 24px 16px; }
img { display: block; width: calc(100% - 32px); height: 120px; margin: 0 16px; border-radius: 14px; background: #D9622B; }
/* Navigation */
.menu {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  width: 360px;
}

.hero h1 {
  font-size: clamp(2rem, 8vw, 3.5rem);
}

.btn {
  background: #FF8A3D;
  color: #FFFFFF;
  padding: 14px 22px;
}`

const check = (name: string) => ({ name, code: 'assert(true)' })

/** PrismProject with the canvas's sample: Mama Nkechi's navigation bar, with two checks to fix. Saving fails here. */
export default function ProjectPreview() {
  requirePreviews()
  return (
    <Workspace
      data={{
        projectId: 'fe-p06',
        version: 1,
        title: 'Navigation bar and menu cards',
        track: 'Front-End',
        module: 6,
        client: 'Mama Nkechi’s Kitchen',
        brief:
          '<p>Mama Nkechi runs a small restaurant in Enugu. Most of her customers find her on their phones, so the page has to look right on a small screen first.</p>',
        must: [
          'Her logo and links in one bar, and her dishes as cards with an order button',
          'Easy to read in bright sunlight',
          'Loads quickly on a slow connection',
        ],
        nice: [],
        checks: [check('Uses header, nav, main and footer'), check('Navigation laid out with Flexbox')],
        checkNames: [
          'Uses header, nav, main and footer',
          'Navigation laid out with Flexbox',
          'No serious accessibility problems (axe)',
          'Fits a phone (320px wide)',
          'Fits a tablet (768px wide)',
          'Fits a laptop (1280px wide)',
        ],
        results: [
          { name: 'Uses header, nav, main and footer', pass: true },
          { name: 'Navigation laid out with Flexbox', pass: true },
          {
            name: 'No serious accessibility problems (axe)',
            pass: false,
            message: 'Elements must meet minimum color contrast ratio thresholds: .btn.',
          },
          {
            name: 'Fits a phone (320px wide)',
            pass: false,
            message:
              'At 320px wide, the page is 360px wide, so it scrolls sideways. The first thing too wide is <nav class="menu">.',
          },
          { name: 'Fits a tablet (768px wide)', pass: true },
          { name: 'Fits a laptop (1280px wide)', pass: true },
        ],
        review: ['I checked it on a real phone.'],
        needsSite: false,
        siteUrl: null,
        status: 'draft',
        savedAt: null,
        files: [
          { name: 'index.html', lang: 'html', code: HTML },
          { name: 'styles.css', lang: 'css', code: CSS },
        ],
        locked: null,
        backHref: '/fixtures/screens/projects' as Route,
      }}
    />
  )
}
