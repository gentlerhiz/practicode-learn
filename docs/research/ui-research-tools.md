# UI research tools

*Reviewed October 2026. Check current pricing before buying.*

## Why look beyond Mobbin

Mobbin is a strong screenshot library, but:

- Its AI integration (MCP server) needs a paid plan. We confirmed this on 2 October 2026 when our research queries were refused on the free tier.
- It is strongest for consumer mobile apps. We also need web dashboards, landing pages, full user-flow recordings and research-backed UX evidence.

No single library is enough, so we use a **stack**.

## Recommended stack

| Tool | Use it for | Coverage | Price (check before buying) | Verdict |
|---|---|---|---|---|
| **[Refero](https://refero.design)** | Primary screen and flow library | 125,000–150,000+ screens and 6,000+ flows from web and iOS products (vendor figures); AI search; Figma plugin; **official MCP server** on Pro | Free tier is about 3% of the library; Pro about US$8–14/month; 40% student discount (reported) | **Best overall Mobbin alternative.** It covers web SaaS and dashboards well, and Claude can search it from this repo through MCP. |
| **[Page Flows](https://pageflows.com)** | Full user-flow **video** recordings: onboarding, checkout, upgrade | iOS, Android, web and email; filterable by industry, including Education | US$39/quarter or US$99/year; team US$199/year (from pageflows.com, Oct 2026) | **Best for flows.** Watch exactly how Duolingo or Coursera handle onboarding and paywalls. |
| [SaaS Pages](https://saaspages.xyz), [Land-book](https://land-book.com), [Lapa Ninja](https://www.lapa.ninja) | Landing page sections: hero, pricing, FAQ | Thousands of landing pages | Free | Good free supplements for marketing pages |
| [Figma Community](https://www.figma.com/community) | Design kits, wireframe kits, accessibility plugins | — | Free | Use the Stark or Able plugins for contrast checks |
| [Nielsen Norman Group](https://www.nngroup.com/articles/) | Research-backed UX guidelines | Thousands of articles | Free articles | **Evidence, not just inspiration** |
| [Baymard Institute](https://baymard.com) | Large-scale usability research, especially checkout and pricing pages | — | Paid | Use it for subscription and checkout flows |
| [Growth.Design](https://growth.design/case-studies) | Psychology-based UX case studies | — | Free | Good for onboarding and motivation |
| [Laws of UX](https://lawsofux.com) | Shared vocabulary for design reviews | — | Free | Team reference |

## Testing tools (research with real learners)

Inspiration galleries show what others built. Only learners show what works.

| Tool | Use |
|---|---|
| [Maze](https://maze.co) | Unmoderated prototype tests, connected to Figma |
| [Lyssna](https://www.lyssna.com) (formerly UsabilityHub) | First-click tests, preference tests, five-second tests |
| Video call plus screen share | Moderated sessions with learners in Nigeria, Ghana and Kenya, on their own phones |
| A real low-end Android phone | Throttled to "Slow 4G" in Chrome DevTools, and also tested on a genuinely weak signal |

## Our research process

1. **Collect.** Save relevant screens and flows from Refero and Page Flows to a shared board, tagged by pattern, for example *resume card*, *paywall* or *lesson feedback*.
2. **Tear down.** Sign up to each competitor and record the flows on screen. Annotate in FigJam what works, what doesn't and why.
3. **Design.** Sketch, then build hi-fi designs on the design canvas (see [design/](../../design/README.md)).
4. **Test.** Five learners per round (Nielsen, 2000), fix the problems found, then test again.
5. **Record.** Write findings into [competitive-analysis.md](competitive-analysis.md) or an ADR.

## Recommendation

Subscribe to **Refero Pro** first, because it has the broadest web coverage and MCP integration. Add **Page Flows yearly** when designing onboarding and upgrade flows. Use the free tools for everything else. The first round of usability testing costs nothing but time, and it is worth more than any subscription.
