# RULES.md

> Strict, enforceable standards for this project. **These rules are not
> suggestions.** If a task requires violating a rule, stop and flag it instead
> of proceeding.

---

## 1. Coding rules

1. **No third-party code.** No frameworks, libraries, CDNs, web fonts, icons
   packs, or remote assets. Vanilla HTML/CSS/JS only.
2. **No build step.** The project must run by serving this directory with any
   static file server. Nothing may depend on `npm install`, bundlers, or
   transpilers.
3. **Semantic HTML.** Use the element that means the thing: `header`, `nav`,
   `main`, `article`, `section`, `footer`, `ul/ol/li`, `blockquote`,
   `pre/code`, `time`, `figure`. No div-soup for structure.
4. **Separation of concerns.** No inline `style=""` in HTML (except
   CSS-custom-property hooks such as `--d`), no `onclick` handlers, no
   JavaScript embedded in markup.
5. **Escape all injected content.** Any string derived from note files or
   user input must be HTML-escaped before being inserted via `innerHTML`.
   The renderer must escape content before applying Markdown transforms.
6. **No inline comments in code** unless a task explicitly requests them.
   If used, keep them terse and purposeful.
7. **Defensive JavaScript.** Guard against missing DOM nodes, failed
   `fetch()` calls, and malformed Markdown. A failed note must not break the
   batch or the page.
8. **Match existing style.** Follow the naming, formatting, and structural
   conventions already in the file you are editing.
9. **No dead code.** No unused variables, unused CSS selectors, orphaned
   functions, or debug logs left in the tree.
10. **One source of truth for tokens.** All colors, typography, spacing,
    radii, and motion live as CSS custom properties in `styles.css`. Never
    hardcode magic values in components or markup.

---

## 2. Design rules

1. **Design-first reference:** the UI must follow the design language of
   **apple.com** as the primary template (see `DESIGN/core.md` and
   `DESIGN/docs/*`). "Apple-like" is a floor, not a ceiling.
2. **Use the token system.** Pull from `DESIGN/docs/visual-system.md`. Do not
   introduce new colors, fonts, sizes, or easings without adding them as
   tokens and documenting them.
3. **Both themes.** Any visual change must be specified and verified for both
   light and dark themes.
4. **Restraint.** Fewer, bolder elements beat many small ones. Generous
   whitespace is a feature. Avoid decorative clutter, gradients-on-everything,
   and gratuitous animation.
5. **Visual hierarchy.** One clear hero message per screen; type, weight, and
   spacing (not color alone) should establish order.
6. **Consistent radii and elevation.** Cards, buttons, and panels share the
   tokenized corner radii and shadow scale.
7. **Responsive by design.** Every layout must be designed mobile-first and
   verified at the breakpoints in the visual system.

---

## 3. UX rules

1. **State every async moment.** Loading, empty, error, and success states must
   be visibly and accessibly handled. Never leave a screen frozen on
   "Loading…" or blank.
2. **No dead ends.** Every error state offers a way forward (e.g. retry,
   back to all notes). Every view is reachable by navigation and by URL.
3. **Preserve context.** Clicking anchors (`#notes`, `#top`) must not reset the
   view or scroll position unexpectedly.
4. **Feedback in ≤ 200ms.** Hover, focus, press, and selection states give
   immediate visual feedback; motion finishes within the durations in the
   motion spec.
5. **Touch targets ≥ 44px** for interactive elements on touch devices.
6. **Microcopy is design.** Error and empty messages are human, specific, and
   calm. No "Error 500" or "Something went wrong" without guidance.
7. **URL is truth.** The address bar reflects the current view; back/forward
   and reload behave correctly.

---

## 4. Accessibility rules

1. **WCAG 2.2 AA is the minimum.** Do not ship anything below AA.
2. **Contrast floors:** body text ≥ 4.5:1; large text (≥ 24px / 19px bold)
   ≥ 3:1. Verify the tokens in the visual system before use.
3. **Keyboard complete.** Every action is reachable and operable by keyboard.
   Focus order follows visual order. No keyboard traps.
4. **Visible focus.** All interactive elements show a clear `:focus-visible`
   indicator. Never remove outlines without a visible replacement.
5. **Semantic landmarks and labels.** `main`, `nav`, `header`, `footer`;
   icons and icon buttons have accessible names; `aria-expanded` /
   `aria-controls` used for the mobile menu.
6. **Screen-reader announcements.** Use a polite live region for load and
   error state changes. Do not announce routine renders.
7. **Reduced motion.** `prefers-reduced-motion: reduce` must disable
   transitions, animations, and smooth scrolling (CSS and any JS-driven
   motion). Content still appears; it simply does not animate.
8. **Stretched link pattern.** Cards with a single main action make the whole
   card a single focusable target with a clear link text.
9. **Skip link** is present and is the first focusable element.
10. **No motion-only information.** Nothing critical is conveyed by motion,
    color alone, or hover-only states.

---

## 5. Performance rules

1. **Zero external requests.** The page must load with no network requests
   beyond its own files. No font, icon, or analytics requests.
2. **Keep JS small.** Vanilla, defensive, and focused. Do not add features
   that grow the bundle without a stated reason.
3. **Throttle scroll-driven work.** Scroll listeners are passive and
   rAF-throttled; reading-bar updates use `transform` only.
4. **Animate cheap properties.** Only `opacity`, `transform`, and GPU-friendly
   properties for motion. No layout-thrashing animations.
5. **No layout shift.** Reserve space for dynamic content (skeleton states);
   fonts are system fonts so there is no FOIT/FOUT.
6. **Progressive first paint.** Render shell + skeleton immediately; hydrate
   content as data arrives.
7. **Targets:** initial HTML/CSS/JS well under ~100KB total; no LCP element
   below the fold; no CLS > 0.1.

---

## 6. Content rules

1. `notes/*.md` are source content. Do not rewrite them unless explicitly
   asked.
2. The renderer must support the full Markdown subset actually used in the
   notes: headings, paragraphs, bold, italic, inline code, fenced code blocks,
   links, images, unordered/ordered lists, blockquotes, horizontal rules, and
   YAML front matter (`title`, `date`, `description`, `tags`).
3. Rendering must degrade gracefully on unsupported syntax (no broken
   layout, no unescaped HTML).
4. Post metadata surfaces consistently: title, date, excerpt, reading time,
   and tags use the same derivation rules documented in `ARCHITECTURE.md`.

---

## 7. Verification rules

**A task is not done until all of the following pass.**

### 7.1 Automated / CLI checks

1. `node --check index.js` — passes (repeat for any other `.js` file changed).
2. Serve the directory: `python3 -m http.server` (or equivalent) and load the
   page over `http://localhost`.
3. If a linter/formatter is introduced later, it must pass on changed files.

### 7.2 Manual browser checks

Run through the full flow in a browser at mobile and desktop widths:

1. Loads without console errors (watch Network, Console, and Security tabs).
2. Skeleton shows while loading; posts appear when ready.
3. List view: hero, notes grid, each card shows title, excerpt, meta.
4. Card click / `#/notes/<id>` deep link opens the article view.
5. Back button returns to the list; forward returns to the article.
6. `#notes` and `#top` anchors scroll without resetting the view.
7. Mobile menu opens/closes via toggle, link, and Escape; `aria-expanded`
   updates.
8. Reading bar appears on article views and tracks scroll; hidden on list.
9. Both themes (light and dark) render correctly and match the tokens.
10. Keyboard-only pass: Tab through every control, activate with Enter/Space.
11. Skip link is visible on first Tab and jumps to content.
12. Focus ring is visible on every interactive element.
13. Resize from 320px to 1600px: no horizontal overflow, no broken grids.
14. Reduced-motion enabled: no animation, everything still visible/usable.
15. Viewport zoom to 200% and 400%: content remains legible and usable.
16. If any note is renamed or removed, remaining notes still load; a fully
    empty set shows the error state with a retry path.

### 7.3 Quality bar

1. Re-read `DESIGN/core.md` and `DESIGN/docs/*` before reviewing.
2. Visually compare against **apple.com** and at least one other top-tier
   production site (e.g. Linear, Stripe, Vercel). Note concrete gaps.
3. Check: typography hierarchy, spacing rhythm, alignment, motion quality,
   hover/focus states, responsiveness, and consistency of the two themes.
4. Fix anything that looks amateur, unfinished, or inconsistent.
5. Re-run the checklist above.
6. Only then declare the task complete.

---

## 8. Non-negotiable invariants

- **Never** introduce a dependency, build step, or remote asset.
- **Never** ship unescaped dynamic content into the DOM.
- **Never** break keyboard, focus, or screen-reader support for a visual gain.
- **Never** ship a state that has no feedback (loading/error/empty).
- **Never** declare completion without running section 7.