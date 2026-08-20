# ARCHITECTURE.md

> How the system is structured, how data flows, and why key decisions were
> made. Read this before modifying any behavior.

## 1. Overview

This is a **zero-build static site**. The browser does all the work:

- `index.html` is the page shell (semantic landmarks, nav, footer, mount point).
- `index.js` fetches Markdown files from `notes/`, parses them, and renders
  views into the `#view` mount point.
- `styles.css` provides the full visual system (design tokens + components).
- `notes/*.md` are the content source; they are never generated or modified
  at runtime.

There is no server, no database, no package manifest, and no external asset.

## 2. Directory structure

```text
index.html         Page shell: skip link, nav, reading bar, #view, footer
styles.css         Design tokens (CSS custom properties) + all component styles
index.js           Application logic: data loading, markdown pipeline, routing, views
notes/
  blog-1.md        Post source (Markdown, may include front matter)
  blog-2.md
  blog-3.md
AGENT.md           Agent working rules (entry point)
ARCHITECTURE.md    This file
RULES.md           Hard rules: coding, design, UX, a11y, perf, verification
DESIGN/            Design documentation (core.md, docs/{ui,ux,visual-system}.md)
```

## 3. Component breakdown

### 3.1 Page shell (`index.html`)

Static landmarks, styled by `styles.css`:

| Component | Role |
|---|---|
| Skip link | First tab stop; jumps to `#main` |
| Reading bar | Fixed 3px progress indicator, shown only on article views |
| Site nav | Fixed header, backdrop blur, brand + menu links, mobile toggle |
| `#view` | Mount point; the router replaces its contents per route |
| Footer | Brand, footer links, legal line, back-to-top control |
| `#status` | Screen-reader-only live region for load/error announcements |

### 3.2 Markdown pipeline (`index.js`)

Data flow for one note:

```text
notes/blog-N.md
      │  fetch(path)
      ▼
   text string
      │  parseFrontmatter()
      ▼
   { meta, body }        meta: title, date, description, tags (from YAML front matter)
      │  renderBlocks() + renderInline()
      ▼
   { meta, html, body, words }
      │
      ▼
   state.posts[]         in-memory post model
```

Pipeline responsibilities:

- **Fetch:** resolve each path in the `NOTES` constant; skip failures without
  aborting the batch.
- **Front matter:** parse a leading `---` block into `meta`. Support scalar
  values and `- item` lists (e.g. `tags`).
- **Inline render:** escape all HTML first (XSS-safe), then process code
  spans, links, images, bold, italic.
- **Block render:** headings, horizontal rules, fenced code blocks,
  blockquotes, unordered/ordered lists, paragraphs.
- **Derived fields:** title (front matter → first `#` heading → first line),
  excerpt (front matter `description` → first paragraph), reading time
  (words / 200, minimum 1), post `id` (filename without `.md`).

### 3.3 Router & views

Hash-based routing (no server config required):

| Hash | View |
|---|---|
| `#/` or empty | List view: hero + notes grid |
| `#/notes/<id>` | Article view for a single post |
| `#notes` (no slash) | Anchor to the notes section; ignored by router |

Router behavior:

- Re-renders **only when the target view changes**, so anchors like `#notes`
  and `#top` do not reset the page.
- Preserves deep links and back/forward navigation via the `hashchange` event.
- Updates `document.title` per view and resets scroll on view change.

### 3.4 Theming

- All visual values are CSS custom properties defined on `:root` (light) and
  overridden under `@media (prefers-color-scheme: dark)`.
- The page follows the OS color scheme. No manual toggle (system-first, like
  Apple).
- Theme-affected values include background, text, borders, accent, focus ring,
  nav surface, and shadows.

### 3.5 Interaction layer

- **Reveal animation:** elements with `.reveal` fade/rise into view via an
  `IntersectionObserver` that adds `.in-view`. Disabled for
  `prefers-reduced-motion: reduce` (both CSS and JS guard it).
- **Nav state:** `is-scrolled` class toggled by a rAF-throttled scroll
  listener (passive).
- **Mobile menu:** `body.nav-open` toggles a dropdown panel; `aria-expanded`
  tracks state; Escape and link clicks close it.
- **Reading bar:** `transform: scaleX(p)` updated on scroll; only visible on
  article views.
- **Back to top:** smooth-scrolls via `window.scrollTo`, disabled under
  reduced motion.

## 4. Dependencies

- Runtime: **none**. Vanilla DOM APIs only.
- Dev/verification: a local static server (any) and `node` (for `node --check`).
- Content: `notes/*.md` authored by hand.

## 5. Performance characteristics

- No render-blocking external requests; fonts come from the system stack.
- All JS is small, vanilla, and loaded with `defer`.
- Scroll handlers are passive and rAF-throttled.
- Card grids and long article bodies rely on browser layout only (no heavy
  repaint loops); reveal animations touch `opacity`/`transform` only.
- Skeleton loading states replace content instantly; no flash of unstyled
  content beyond the initial paint.

## 6. Accessibility architecture

- Semantic landmarks: `header`, `nav`, `main`, `article`, `footer`.
- Skip link as first focusable element.
- `aria-live="polite"` status region for load/error messages.
- Mobile menu exposes `aria-expanded` / `aria-controls`.
- Cards use stretched links so the whole card is one accessible target.
- `:focus-visible` ring on all interactive elements.
- `prefers-reduced-motion` disables transitions, animations, and smooth scroll.
- Color contrast targets in `DESIGN/docs/visual-system.md`; do not lower them.

## 7. Key decisions & rationale

| Decision | Rationale |
|---|---|
| Zero dependencies / no build | Matches project constraints; instant deploy anywhere; no supply-chain risk |
| System font stack | Apple-like typography without network cost or layout shift |
| Hash routing | Deep-linkable articles with no server rewrite rules |
| Vanilla markdown parser | Renders notes safely (escaping) without a library; full control over output |
| CSS custom properties + dark mode media query | Consistent tokens, cheap theming, OS-first behavior |
| Reveal via IntersectionObserver | Cheap, scroll-linked polish that respects reduced motion |
| Escape-all-input-first rendering | XSS-safe by construction; content files are untrusted input |

## 8. Extension guides

### Add a new note

1. Add `notes/blog-N.md` (optionally with front matter: `title`, `date`,
   `description`, `tags`).
2. Append the path to the `NOTES` constant in `index.js`.
3. Verify the list view shows a card and the article view renders.

### Add a front-matter field

1. Parse it in the front matter parser in `index.js`.
2. Surface it in the card and/or article templates.
3. Document the field in `DESIGN/docs/ui.md` and update `ARCHITECTURE.md` if
   it changes the data model.

### Add a page/section

1. Add a hash route branch in the router.
2. Render a view into `#view` following the existing view templates.
3. Wire the nav link; ensure focus/scroll behavior matches existing views.

### Change the visual language

1. Edit tokens in `styles.css` only (do not hardcode values in components).
2. Keep both light and dark themes consistent.
3. Update `DESIGN/docs/visual-system.md` so the docs stay truthful.

## 9. Known constraints

- Requires an HTTP static server (`fetch()` fails over `file://`).
- Markdown renderer intentionally supports a pragmatic subset (no tables,
  no definition lists, no nested lists, no inline HTML) — extend it before
  content needs those features.
- The blog renders all content client-side; it is not SEO-optimized beyond
  metadata and semantics. If SEO becomes a goal, reconsider server-side
  rendering or prerendering before growing features.