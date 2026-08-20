# DESIGN/docs/ux.md

> User experience design: who uses this site, the flows they move through, and
> the interaction/motion standards that make those flows feel premium.

## 1. Users and their jobs

| User | Primary job |
|---|---|
| First-time visitor | Understand what this blog is about in under 10 seconds; find the writing |
| Returning reader | Get to a specific post or back to reading without friction |
| Deep-linker / sharer | Open a shared article URL and read it directly |
| Screen-reader / keyboard user | Navigate and read with the same quality as a mouse user |
| Reduced-motion user | Read without being subjected to motion |

Design so that every job is complete on the first visit, without instructions.

## 2. Core flows

### 2.1 Landing (list view)

```text
Load → nav + hero appear → skeleton cards → posts fade in
     → scroll to Notes grid → choose a card
```

- The hero states the site's purpose in one headline.
- The notes grid answers "what's here?" immediately.
- Skeleton prevents layout jump and communicates that content is arriving.

### 2.2 Reading (article view)

```text
Click card (or open #/notes/<id>) → article renders, scroll to top
     → read prose → "Back to all notes" or browser Back
```

- Reading bar shows progress for long posts.
- Back navigation works via the in-page link and the browser Back button.
- The URL is shareable and reload-safe.

### 2.3 Error / recovery

```text
Load fails → clear message + cause hint + "Try again"
Unknown post → "Not found" + link home
```

- Never a blank screen. Never an unexplained spinner.
- Error copy names the cause (e.g. opening from `file://`) and the fix.

## 3. Interaction and motion standards

- **Purpose:** motion marks change of state (content arrived, view changed,
  menu opened). It never decorates.
- **Reveals:** content rises 16–24px and fades in over 500–800ms with the
  project easing; cards stagger by ~70ms up to a small cap so the grid reads
  as one wave, not a cascade.
- **Hover:** within 150–200ms — buttons shift color; cards lift 3px with a
  soft shadow; links change color.
- **Press:** immediate, slight darken/scale-down; released cleanly.
- **Menu:** the mobile menu drops in with a 250–350ms fade + translate; Escape
  or a link click closes it.
- **Scroll:** reading bar tracks progress via `transform`; nav gains a hairline
  border after ~8px of scroll.
- **Reduced motion:** all of the above collapse to instant state changes. The
  design must still be readable and navigable at that instant.

## 4. Responsive behavior

Breakpoints follow the visual system:

| Range | Behavior |
|---|---|
| < 734px (phone) | Single-column cards; hero copy tightened; hamburger menu; touch targets ≥ 44px |
| ≥ 734px (tablet) | Inline nav; more breathing room; cards may reach 2 columns as width allows |
| ≥ 1068px (desktop) | Full padding scale; 2-column note grid; wider type scale via `clamp` |

Rules:

- No horizontal scroll at any width (check 320px).
- Fluid type scales with the viewport, never jumps abruptly.
- Cards keep a legible minimum width; never crowd 3 columns onto a small screen.
- The article column stays ~720px so line lengths stay comfortable.

## 5. Feedback and states

Every async and interactive moment has a defined state:

| Moment | State |
|---|---|
| Fetching notes | Skeleton cards; polite live-region message "Loading notes…" |
| Notes ready | Cards animate in; live region "Notes loaded." |
| One note missing | Other notes still render; no visible break |
| All notes missing | Error card with cause + retry |
| Unknown route | Not-found card with link home |
| Menu opened | Panel + `aria-expanded="true"` |
| Menu closed | Panel removed; `aria-expanded="false"` |
| Back to top | Smooth scroll (or instant under reduced motion) |

## 6. Microcopy guidelines

- **Be specific:** "Couldn't load the notes" not "Error". Include the likely
  cause when it helps: "This page needs a local server; `file://` blocks
  fetching."
- **Be calm:** no exclamation marks, no ALL CAPS, no emoji.
- **Be brief:** one headline, one sentence, one action max per state.
- **Voice:** the interface sounds like the author — direct, technical but
  plain. The site hero ("Give your agents a real harness.") sets the register.

## 7. Accessibility behaviors (UX view)

- Focus order == visual order. The skip link is first, then nav, then main.
- Opening an article moves focus logically (scroll reset + heading is the
  first focusable content); view swaps are announced only through the status
  live region.
- The stretched-link card pattern means one tab stop per card with meaningful
  link text (the title), never "read more" repeated.
- The mobile menu is operable with mouse, touch, and keyboard; state is
  reflected in `aria-expanded`.
- Text remains legible and reflows at 200% and 400% zoom; no content is
  clipped by fixed-height containers.

## 8. Design-review checklist (UX pass)

1. Can a first-time visitor state the site's purpose in one sentence?
2. Can every flow complete without a mouse?
3. Does every async state explain itself?
4. Is every interactive element's hover/focus/active state distinct?
5. Does nothing animate under `prefers-reduced-motion`?
6. Is the page free of horizontal scroll from 320px up?
7. Would a shared article URL work for someone who never visited the home
   page?