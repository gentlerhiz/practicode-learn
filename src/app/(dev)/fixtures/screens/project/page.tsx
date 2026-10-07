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

/** PrismProject with the canvas's sample: Mama Nkechi's navigation bar, three checks passed, two to fix. */
export default function ProjectPreview() {
  requirePreviews()
  return (
    <Workspace
      data={{
        title: 'Navigation bar and menu cards',
        track: 'Front-End',
        module: 6,
        saved: 'Saved 2 min ago',
        brief:
          'Mama Nkechi runs a small restaurant in Enugu. Most of her customers find her on their phones, so the page has to look right on a small screen first.',
        askedBy: 'What she asked for',
        asks: [
          'Her logo and links in one bar, and her dishes as cards with an order button',
          'Easy to read in bright sunlight',
          'Loads quickly on a slow connection',
        ],
        checks: [
          { id: 'land', name: 'Uses header, nav, main and footer', pass: true },
          { id: 'flex', name: 'Navigation laid out with Flexbox', pass: true },
          { id: 'alt', name: 'Every image has alt text', pass: true },
          {
            id: 'fit',
            name: 'Fits a 320px screen without sideways scrolling',
            pass: false,
            detail: 'The .menu has a fixed width of 360px, so on the smallest phones the page scrolls sideways.',
            where: 'styles.css, line 10',
            lines: [10],
            why: 'Phones can be as narrow as 320px, but your menu insists on 360px. What could you use instead of width so the menu is never wider than the screen? Have a look at max-width, or let the links wrap onto two lines.',
          },
          {
            id: 'contrast',
            name: 'Text contrast meets WCAG AA',
            pass: false,
            detail: 'White text on #FF8A3D has a contrast ratio of 2.3 : 1. Normal-size text needs at least 4.5 : 1, which matters in bright sunlight.',
            where: 'styles.css, lines 18 to 19',
            lines: [18, 19],
            why: 'Light text on a light orange is hard to read outdoors. You can keep the orange and switch the text to a very dark brown, or keep white text and pick a much deeper orange. Try a contrast checker on both.',
          },
        ],
        checksNote: 'Pass all five checks to submit. Your instructor sees the same checks when they review your work.',
        files: [
          { name: 'index.html', lang: 'html', code: HTML },
          { name: 'styles.css', lang: 'css', code: CSS },
        ],
        editable: false,
        backHref: '/fixtures/screens/projects' as Route,
      }}
    />
  )
}
