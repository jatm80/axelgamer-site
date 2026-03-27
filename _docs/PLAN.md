# AxelGamer Look and Feel Uplift Plan

> **For Hermes:** Use the `subagent-driven-development` skill to implement this plan task-by-task. Use Coder for scoped implementation tasks and Reasoner for critique/accessibility/performance review before final commit.

**Goal:** Make AxelGamer feel more fun and entertaining for kids who love gaming while preserving the existing Hugo/static site architecture, SEO, accessibility, and performance.

**Architecture:** This is a CSS-first visual refresh with small Hugo template and JavaScript improvements only where they support the design or accessibility. Keep Hugo source under `src/`, content under `src/content/sections/`, and reuse the existing assets in `src/static/assets/`.

**Tech Stack:** Hugo static site, HTML templates, CSS, small vanilla JavaScript for the existing video modal.

---

## Recommended Direction

**Theme:** Playful Minecraft Arcade

Keep the current dark green gaming identity, but make it more energetic with:

- brighter green, cyan, gold, and orange accents
- blocky game-tile cards
- arcade-style CTA buttons
- playful badges and chips
- stronger video-first homepage presentation
- subtle CSS-only pixel, grid, and glow motifs
- minimal animation with `prefers-reduced-motion` support

The desired feeling is: **fun, bright, game-like, safe, and clear**.

Do **not** turn AxelGamer into a generic neon gamer template. The current site already has a useful foundation: Hugo, static deployment, videos, articles, dark gaming palette, and existing logo/assets. This should be a controlled visual uplift, not a full rebuild.

---

## Guardrails

### Preserve

- Hugo/static deployment model
- Hugo source under `src/`
- Markdown content under `src/content/sections/`
- existing videos and article URLs
- canonical tags, Open Graph, Twitter metadata, JSON-LD, sitemap, and robots behaviour
- real H1/H2 structure
- skip link and keyboard navigation
- YouTube modal lazy-loading behaviour
- existing AxelGamer green/dark brand identity

### Avoid

- new JavaScript frameworks
- heavy animation libraries
- particle/canvas backgrounds
- autoplaying decorative effects
- icon-only labels
- hiding meaningful text in images
- loading YouTube iframes for every card upfront
- low-contrast neon text
- large unoptimised assets
- redesigning the content model

---

## Implementation Plan

### Task 1: Baseline Build and Visual Check

**Objective:** Confirm the current site builds before making visual changes.

**Files:**

- No source changes expected.

**Steps:**

1. Check working tree:

   ```bash
   cd /opt/shared/axelgamer-site
   git status --short
   ```

2. Run Hugo build:

   ```bash
   hugo --source src --minify
   ```

3. Serve locally for visual baseline:

   ```bash
   hugo server --source src --bind 0.0.0.0 --port 1313 --disableFastRender
   ```

4. Review these pages:

   - `/`
   - `/posts/`
   - one post detail page
   - video modal on homepage

**Expected Result:** Hugo builds cleanly and the current site is understood before styling changes begin.

---

### Task 2: Refresh Design Tokens

**Objective:** Establish a more playful gaming design system without changing templates yet.

**Files:**

- Modify: `src/styles.css`

**Changes:**

- Keep dark base colours.
- Keep AxelGamer green as the primary brand colour.
- Add controlled accent colours:
  - cyan for links and video energy
  - gold/yellow for rewards and highlights
  - orange/pink sparingly for excitement
- Add reusable tokens for:
  - glow shadows
  - pixel/block borders
  - focus rings
  - card gradients
  - section accent colours

**Design Notes:**

- Keep text contrast WCAG AA.
- Do not apply bright colours everywhere.
- Use accents to guide attention, especially CTAs and video cards.

**Verification:**

```bash
hugo --source src --minify
```

---

### Task 3: Upgrade Header into a Game HUD

**Objective:** Make the header/navigation feel more playful while staying accessible and compact.

**Files:**

- Modify: `src/styles.css`
- Optional Modify: `src/layouts/partials/header.html`

**Changes:**

- Style nav links as small game HUD pills.
- Add hover and focus glow.
- Make logo and brand text pop more.
- Keep header sticky.
- Preserve readable text labels: Videos, Articles, About, YouTube.

**Risk Controls:**

- Header must not dominate phone screens.
- Nav must wrap safely on narrow screens.
- Focus states must be clearly visible.

**Verification:**

- Tab through nav links.
- Check around 390px, 720px, and desktop widths.

---

### Task 4: Upgrade Hero Section

**Objective:** Make the hero the main “wow” moment of the site.

**Files:**

- Modify: `src/layouts/partials/homepage/hero.html`
- Modify: `src/content/sections/homepage/hero.md` if copy changes are needed
- Modify: `src/styles.css`

**Changes:**

- Add or restore a short kid-friendly intro line if missing.
- Frame the existing `intro.gif` or `front.png` like a game card.
- Style the heading like a “level start” or adventure intro.
- Improve CTA buttons:
  - primary button: bright arcade button
  - secondary button: cyan/purple outline button
- Add subtle CSS decorations:
  - pixels
  - glow dots
  - blocky outlines

**Avoid:**

- Heavy animation.
- Making the GIF too large on mobile.
- Decorative elements that obscure text.

**Verification:**

- Homepage hero looks clear on mobile and desktop.
- CTAs are easy to tap.
- Build still passes.

---

### Task 5: Turn Cards into Game Tiles

**Objective:** Make videos, articles, resources, and about sections feel more fun and game-like.

**Files:**

- Modify: `src/styles.css`
- Optional Modify: `src/layouts/partials/homepage/videos.html`
- Optional Modify: `src/layouts/partials/homepage/articles.html`
- Optional Modify: `src/layouts/partials/homepage/resources.html`
- Optional Modify: `src/layouts/partials/homepage/about.html`
- Optional Modify: `src/layouts/posts/list.html`
- Optional Modify: `src/layouts/posts/single.html`

**Changes:**

- Restyle shared cards as game tiles.
- Add stronger thumbnail frames.
- Make category/game tags look like badges.
- Add per-section accent colours:
  - Videos: green/cyan
  - Articles: gold/orange
  - Resources: purple/cyan
  - About: green/pink
- Make article cards feel like guides, quests, or updates.

**Risk Controls:**

- Keep real text in HTML.
- Keep Hugo Markdown-driven content.
- Keep crawlable article and video links.
- Do not rely on JavaScript for card content.

**Verification:**

- `/` video cards render correctly.
- `/posts/` article cards render correctly.
- One post detail page renders correctly.

---

### Task 6: Improve Video Modal Polish and Accessibility

**Objective:** Make the video modal feel like an arcade screen and improve keyboard behaviour.

**Files:**

- Modify: `src/layouts/partials/video-modal.html`
- Modify: `src/script.js`
- Modify: `src/styles.css`

**Changes:**

- Style modal with a stronger game-screen frame.
- Improve close button visibility.
- Keep `youtube-nocookie.com` embed behaviour.
- Improve focus handling:
  - focus the close button when modal opens
  - return focus to clicked video button when modal closes
  - keep Escape-to-close behaviour

**Risk Controls:**

- Do not preload all YouTube iframes.
- Do not break backdrop close.
- Keep keyboard users supported.

**Verification:**

- Open a video from the homepage.
- Close with Escape.
- Close with the close button.
- Confirm focus returns to the original video button.

---

### Task 7: Add Lightweight Micro-Interactions

**Objective:** Add polish without performance or accessibility regressions.

**Files:**

- Modify: `src/styles.css`
- Optional Modify: `src/script.js`

**Changes:**

- Button lift on hover.
- Card glow on hover/focus.
- Slight thumbnail scale on hover.
- Strong visible keyboard focus.
- Add reduced-motion support:

  ```css
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
  }
  ```

**Avoid:**

- Particle systems.
- Confetti.
- Animated cursors.
- Canvas backgrounds.
- Hover-only cues as the only interaction affordance.

**Verification:**

- Hover and focus states work.
- Site remains usable without motion.

---

### Task 8: Mobile Polish Pass

**Objective:** Ensure the refreshed design works well for kids on phones and tablets.

**Files:**

- Modify: `src/styles.css`

**Checks:**

- 390px mobile width
- 720px tablet-ish width
- 1024px layout transition
- nav wrapping
- hero stacking
- CTA tap targets
- card spacing
- modal sizing

**Acceptance:**

On mobile, users should quickly understand:

- who AxelGamer is
- what videos are available
- where to watch
- where articles live

---

### Task 9: SEO, Accessibility, and Performance Verification

**Objective:** Prove the uplift did not break important site behaviour.

**Files:**

- Review: `src/layouts/partials/head.html`
- Review: `src/layouts/partials/header.html`
- Review: `src/layouts/posts/single.html`
- Review: `src/styles.css`
- Review: `src/script.js`

**Commands:**

```bash
cd /opt/shared/axelgamer-site
hugo --source src --minify
```

Serve locally:

```bash
hugo server --source src --bind 0.0.0.0 --port 1313 --disableFastRender
```

Smoke checks:

```bash
curl -I http://localhost:1313/
curl -I http://localhost:1313/posts/
curl -s http://localhost:1313/ | grep -E "og:title|canonical|styles.css|script.js"
curl -s http://localhost:1313/posts/ | grep -E "Articles|Read article"
```

Docker check if needed:

```bash
docker build -t axelgamer-site:test .
docker run --rm -p 1313:1313 axelgamer-site:test
```

Manual checks:

- Keyboard tab through header, CTAs, video cards, and modal.
- Open video modal and close with Escape.
- Check mobile widths around 390px, 720px, and 1024px.
- Confirm animations respect reduced-motion preference.
- Confirm these assets still load:
  - `/assets/logo-no-bg.png`
  - `/assets/intro.gif`
  - `/assets/og-cover.jpg`

---

## Acceptance Criteria

The uplift is successful if:

- site feels more fun and kid-friendly
- AxelGamer’s existing green/dark identity is still recognisable
- videos remain the star of the homepage
- articles still render cleanly
- mobile layout is clean
- keyboard navigation works
- video modal works with Escape and focus handling
- no heavy JavaScript/frameworks are added
- Hugo/static deployment model stays intact
- SEO metadata and post URLs stay intact
- performance does not materially regress

---

## Review Notes from Coder and Reasoner

### Coder Summary

- The site is well suited to a CSS-first uplift.
- Main styling is concentrated in `src/styles.css`.
- Current JavaScript only handles the YouTube modal.
- Existing Hugo partials are simple and can support small template improvements.
- Existing assets should be reused before adding new ones.

### Reasoner Summary

- The idea is sound, but the biggest risk is becoming a noisy, slow, generic gamer skin.
- A constrained playful refresh is safer than a broad redesign.
- Accessibility, mobile layout, SEO, and performance must be explicit gates.
- Videos and articles should remain the star; decoration should support discovery, not replace content.

---

## Recommended Execution Approach

Use a branch and implement in small commits:

1. design tokens
2. header and hero
3. cards and sections
4. modal and accessibility
5. responsive polish and verification

After implementation, request Reasoner review before merging or releasing.
