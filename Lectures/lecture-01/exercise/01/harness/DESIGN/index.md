# DESIGN/index.md

> Map of the design documentation. Read this first, then follow the reading
> order below for any design task.

## Reading order

For any design or UI/UX task, read in this order:

1. **`core.md`** — philosophy, the reference bar (apple.com first), principles,
   and the definition of production quality.
2. **`docs/visual-system.md`** — the tokens: type, color, spacing, radii,
   elevation, motion, breakpoints. This is what you code against.
3. **`docs/ui.md`** — component-level specifications and their states.
4. **`docs/ux.md`** — flows, interaction standards, microcopy, and the UX
   review checklist.

## Files

| File | Contents |
|---|---|
| `core.md` | Design philosophy, principles, reference bar, anti-patterns |
| `docs/visual-system.md` | Tokens and scales (single source of truth) |
| `docs/ui.md` | Component specs, states, and rules |
| `docs/ux.md` | Flows, motion standards, responsive behavior, microcopy |

## Conventions

- Values in `visual-system.md` are implemented as CSS custom properties in
  `styles.css`. If you add a value, add the token and document it here.
- `ui.md` is the single way to build each component. New components must be
  documented before shipping.
- `ux.md` carries the review checklist; run it before declaring design work
  complete.
- All design work must hold in both light and dark themes and under
  `prefers-reduced-motion: reduce`.

## The bar

Every screen is measured against **apple.com** (primary) and top-tier product
sites (Linear, Stripe, Vercel) as described in `core.md`. If a screen would
not survive that comparison, it is not done.