# DESIGN/docs/ui.md

> Component-level UI specifications. Every component is described with its
> structure, states, and behavior. Tokens referenced here are defined in
> `visual-system.md`. This is the **single source of truth** for how each
> component is built and behaves.

Legend: each component lists **Structure** (markup), **Style** (token-backed
rules), **States**, and **Rules** (non-negotiable).

---

## 1. Skip link

- **Structure:** first element in `<body>`, anchors to `#main`.
- **Style:** visually hidden by default; on `:focus` becomes a visible pill at
  top-left using the accent background and white text.
- **States:** default (hidden), focus (visible), hover.
- **Rules:** must be the first focusable element; must not be announced
  without focus.

## 2. Reading bar

- **Structure:** fixed element at the very top of the viewport, `aria-hidden`,
  not interactive.
- **Style:** 3px tall, full-width, accent gradient
  (`--accent` → `--accent-2`), `transform-origin: left`, `scaleX(0)` by
  default. `visibility` hidden except on article views.
- **Behavior:** JS sets `scaleX(progress)` on scroll, where
  `progress = scrollTop / (scrollHeight - viewportHeight)`.
- **Rules:** only visible on article views; updates must be transform-only;
  disabled for reduced motion.

## 3. Site nav

- **Structure:** fixed `<header class="site-nav">` > inner container >
  brand link + toggle button + `<nav>` menu.
- **Style:** 48px tall; translucent surface (`--nav-bg`) with
  `backdrop-filter: saturate(180%) blur(20px)`; no border at top of page; a
  hairline bottom border (`--border`) when `.is-scrolled`.
- **Brand:** small mark (gradient rounded square glyph) + wordmark; text is
  `--text-primary`, weight 600.
- **Menu (desktop):** inline links right-aligned, 14px, `--text-secondary`;
  hover → `--text-primary`; active route → `--text-primary` + accent underline.
- **Menu (mobile < 734px):** dropdown panel below the nav, same blur surface,
  stacked large links (17px, full-height tap rows), border bottom.
- **States:** default, hover, focus-visible ring, `.is-scrolled`, mobile open
  (`body.nav-open`).
- **Rules:** toggle uses `aria-expanded`/`aria-controls`; Escape closes the
  menu; link clicks close it; `prefers-reduced-motion` disables the panel
  transition.

## 4. Nav toggle (mobile hamburger)

- **Structure:** `<button>` with `aria-expanded`, `aria-controls`, and an
  accessible label ("Open menu" / "Close menu"); three `span` bars.
- **Behavior:** bars morph into an X when open.
- **States:** default, hover, active, focus-visible, open.
- **Rules:** hidden ≥ 734px; target ≥ 44×44px; label must switch with state.

## 5. Buttons (`.btn`)

Two variants, both pill-shaped:

- **Primary (`.btn-primary`):** `--accent` background, white text; hover →
  `--accent-hover`; active slightly darker.
- **Secondary (`.btn-secondary`):** transparent background, 1px
  `--border-strong` border, `--text-primary` text; hover → `--bg-tint`.
- **Structure:** inline-flex, centered, `gap: 6px`, padding
  `12px 22px`, radius `--radius-pill`, font 17px/1.2.
- **States:** default, hover, active (press), focus-visible (ring), disabled
  (reduced opacity, no pointer events).
- **Rules:** never both variants with identical copy side-by-side when one is
  clearly primary; keep touch target ≥ 44px on touch devices.

## 6. Hero

- **Structure:** `<section class="hero">` → eyebrow pill, `h1` headline
  (with an optional gradient `<span class="grad">`), supporting paragraph,
  actions row.
- **Style:** centered; padding `clamp(80px, 14vh, 140px)` top /
  `clamp(64px, 10vh, 110px)` bottom; copy column capped (`~720px`);
  headline uses `--font-display`, size per visual system, `-0.025em` tracking,
  weight 600, line-height ~1.06.
- **Gradient span:** `linear-gradient(90deg, --accent, --accent-2)` clipped to
  text; graceful fallback (solid accent) when `background-clip: text` is
  unsupported.
- **Eyebrow:** 13px, weight 600, `--text-secondary`, hairline border pill with
  an accent dot.
- **Rules:** one headline, one supporting line, at most two actions. The hero
  animates in via the reveal system.

## 7. Section head

- **Structure:** `<header class="section-head">` → `h2.section-title` +
  `p.section-sub`.
- **Style:** centered; title `clamp(28px, 4vw, 40px)`, `-0.02em` tracking;
  sub 17px `--text-secondary`, `margin-top: 8px`.
- **Rules:** every content section on the list view uses this pattern.

## 8. Note card (`.card`)

- **Structure:** `<article class="card">` → optional tag row, `h3.card-title`
  containing the stretched link, `p.card-excerpt`, `div.card-meta`.
- **Style:** `--bg-elevated`; 1px `--border`; radius `--radius-md`; padding
  `clamp(20px, 3vw, 28px)`; flex column with `gap: 12px`; meta row pushed to
  the bottom via `margin-top: auto`.
- **States / hover:** translateY(-3px), `--shadow-md`, border → `--border-strong`;
  title link color → `--accent` on card hover; transition 350ms `--ease`.
- **Card meta:** 13px `--text-secondary`; a hairline top border separates it.
- **Excerpt:** 15px, `--text-secondary`, line-height 1.55, clamped to 3 lines.
- **Stretched link:** `a.card-link::after` covers the whole card so the card is
  one focusable target.
- **Rules:** excerpt must derive per `ARCHITECTURE.md`; tags render as pills
  (see below); cards reveal with a staggered `--d` delay.

## 9. Tags

- **Structure:** `<ul class="tags" aria-label="Tags">` > `<li class="tag">`.
- **Style:** 12px, `--text-secondary` on `--bg-tint`, radius `--radius-pill`,
  padding `4px 10px`, `gap: 6px`, wrap allowed.
- **Rules:** only render when the post has tags; not interactive.

## 10. Article view

- **Structure:** `<article class="article">` → header (back link, `h1`, meta
  line, tags), prose body, footer (back-to-notes button).
- **Style:** content column capped at 720px, centered; generous top/bottom
  padding per spacing scale.
- **Back link:** 14px `--text-tertiary`, arrow prefix; hover → `--text-primary`.
- **Meta line:** 14px `--text-tertiary`, separates date and reading time with
  a middle dot.
- **Rules:** back navigation preserved via `#/`; title, meta, and tags all
  animate in with the reveal system.

## 11. Prose (`.prose`)

Markdown rendering target. Spec in detail:

- **Body:** 18px / 1.7, `--text-primary`; paragraphs `margin: 0 0 1.25em`.
- **Headings:** `h2` `clamp(24px, 3vw, 30px)` `-0.015em`, 2em top margin;
  `h3` 21px, 1.8em top margin. Headings are not links.
- **Links:** `--link`, underlined with `text-underline-offset: 3px`; hover →
  `--link-hover`.
- **Lists:** 1.25em bottom margin, left padding ~1.4em; markers in
  `--text-tertiary`; items `0.4em` apart. Ordered lists keep numeric markers.
- **Blockquote:** left 3px rule in `--border-strong`, `--text-secondary`, left
  padding 20px, `1.6em` vertical margin. No italic, no background box.
- **Inline code:** `ui-monospace` stack, `0.88em`, `--bg-tint` + hairline
  border, `6px` radius, `2px 6px` padding.
- **Code block:** `pre` in `--bg-tint` with hairline border, radius
  `--radius-md`, `18px 20px` padding, 13.5px/1.6, `overflow-x: auto`; inner
  `code` inherits (no background/border/padding).
- **Horizontal rule:** 1px `--border`, `2.5em` vertical margin, no shading.
- **Images:** `max-width: 100%`, radius `--radius-sm`, lazy-loaded, alt text
  required.
- **Rules:** content must be escaped before rendering; prose itself never
  contains navigation.

## 12. Skeleton states

- **Structure:** `.card.skeleton-card` shells mirroring the real card layout.
- **Style:** `.skeleton-line` blocks: 14px base height, radius 6px, shimmer
  gradient (`--bg-tint` → `--bg-tint-2`), `background-size: 200%`, animated
  `shimmer` 1.4s loop.
- **Article skeleton:** back-link bar, title bar, meta bar, then 5–6 body
  lines at varied widths.
- **Rules:** skeleton sizes must match final content geometry to avoid layout
  shift; shimmer disabled under reduced motion; `aria-hidden="true"`.

## 13. Status / empty / error

- **Structure:** `.status` section with `h2` + `p` + optional action.
- **Style:** centered, generous padding; heading `--text-primary`; copy
  `--text-secondary`.
- **Error state:** explains *what* failed and *how* to recover. For a total
  load failure: message about serving over HTTP plus a "Try again" primary
  button wired to reload.
- **Not-found state:** heading + link back to all notes.
- **Rules:** every state must include a path forward; announcements go through
  the polite live region.

## 14. Footer

- **Structure:** `<footer class="site-footer">` → top row (brand + footer
  nav) and legal row (copyright, back-to-top).
- **Style:** `--bg-tint` background, 1px `--border` top; inner padding per
  spacing scale; links 14px `--text-secondary` (hover → `--text-primary`);
  legal text 12px `--text-secondary`, separated by a hairline border.
- **Back to top:** text link with arrow glyph; smooth-scrolls; disabled under
  reduced motion.
- **Rules:** footer nav mirrors primary nav destinations; nothing in the footer
  is decorative or empty.

## 15. Live region (screen readers)

- **Structure:** visually-hidden `<p id="status" aria-live="polite">`.
- **Rules:** only meaningful state changes (loaded, failed, retrying) are
  written here; routine renders are not announced.