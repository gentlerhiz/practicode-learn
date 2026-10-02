# UI designs

High-fidelity, interactive designs for PractiCode Learn v1. They follow the [UX principles](../docs/design/ux-principles.md). The [design system](../docs/design/design-system.md) will be updated to match whichever direction is chosen.

**Live canvas:** https://claude.ai/artifact/7JGtvdSBs74EVYrGr1ZijS
*(Private until it is shared from the canvas's Share menu.)*

## Shortlist: three visual directions

The canvas has one page per direction. Each page has:

- a **landing page** at desktop (1440 px) and phone (390 px) width
- a **learner dashboard** at the same two widths

Canvas frames max out at 8,000 px, so each phone landing page is shown in two frames, part 1 and part 2. To scroll a whole page in one go, open a desktop frame in full view.

| # | Direction | Look | Type | Strengths | Watch-outs |
|---|---|---|---|---|---|
| 1 | **Atlas Night** | Black with violet glows and aqua accents; bento cards with mini UI; comparison table; stat cards (inspired by searchatlas.com) | Poppins, tight tracking | Premium, "serious tech" feel; strong for investors and global audiences | One accent family, so the four tracks don't have their own identity |
| 2 | **Spectrum** | White with four vivid track colours (blue, green, pink, violet) and floating cards; very little yellow | Bricolage Grotesque + Poppins | Playful and energetic; each track is instantly recognisable | Light and busy; less "premium" than the dark options |
| 3 | **Prism** | Atlas Night's dark canvas and structure, lit by Spectrum's four track colours: aurora glows, glowing headline pills, glass floating cards, a neon PRIMM ring | Bricolage Grotesque + Poppins | Combines the premium dark look with track colour-coding; the most distinctive of the three | Dark pages use more battery on LCD phones; the colour system needs careful contrast discipline (already applied) |

### What's interactive
- **Pricing:** currency (₦, GH₵, KSh, £, US$) and monthly or yearly billing, in all three directions
- **Hero prediction question:** Atlas Night and Prism ("A lesson that talks back")
- **Tweaks panel:** CTA colour (Atlas Night: yellow or aqua; Prism: white or yellow) and default currency
- **Links:** landing pages link to their own dashboards

### Feedback applied (2 October 2026)
- No shadows or glows on yellow buttons.
- No "Made by PractiCode Academy, Ibadan" style badges. Hero pills and footers use neutral, standard copy instead.

### Contrast rules used in the dark directions
- Body text `#A9A6BC` or lighter on near-black (at least 8:1).
- Track colours as **text** use light tints (`#8EA2FF`, `#4BE3A8`, `#FF7DB0`, `#B9A2FF`), all 8:1 or better.
- Track colours as **fills behind white text** use deeper shades (`#3D5AF5`, `#0A7D5C`, `#D9306F`, `#6E4CF5`), all 4.5:1 or better.
- Aqua and green fills always carry dark text.

## Next steps after a direction is chosen
1. Restyle the **lesson player** in that direction. The earlier lesson player design lives in git history at commit `a220965`.
2. Update the [design system](../docs/design/design-system.md) and [brand config](../brand/brand.config.json) with the chosen tokens, fonts and rules.
3. Run a usability test with 5 learners on low-end Android phones.

## Source

[canvas/](canvas/) holds the design source: `.dc.html` artboards and `canvas.json`. These render inside the design canvas runtime, not as standalone pages, and will be rebuilt as React components during implementation.

## Earlier explorations

Four other directions were explored and set aside on 2 October 2026: Current (Paper & Ink), Adire, Simple and the first lesson player. Their source is preserved in git history at commit `a220965`.
