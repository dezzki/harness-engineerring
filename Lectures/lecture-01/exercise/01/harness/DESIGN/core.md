# DESIGN/core.md

> The core visual and design philosophy of this project. Every pixel in this
> product should be explainable by this document. Read this before any design
> work, then read the supporting docs in `docs/`.

## 1. The reference bar

The **primary design reference is apple.com** — its layout language, interaction
quality, typographic discipline, and visual hierarchy. We do **not** copy its
content, product imagery, or marketing copy. We study how it *thinks* and
translate that discipline to a personal blog.

Secondary references for interaction and polish: **Linear**, **Stripe**,
**Vercel**, **Basecamp**. The bar is: *"does this look like a senior team built
it, or like an AI generated a demo?"*

## 2. Design philosophy

Three principles govern everything. They are adapted from Apple's design
values and enforced through the specs in `docs/`.

### Clarity

- One message per screen. The hero says one thing; a card says one thing.
- Text is legible, hierarchical, and never decorative.
- Complexity is pushed away from the user: real errors are explained in plain
  language, empty states are calm, transitions are invisible until needed.
- Prefer plain language over jargon in UI copy (the blog's *content* may be
  technical; the *interface* must not be).

### Deference

- The interface recedes; the content leads. UI chrome is quiet: thin borders,
  muted text, generous whitespace.
- Motion supports understanding — it never draws attention to itself.
- Typography does the heavy lifting. Color is used sparingly and only where
  it adds meaning (links, actions, selected states).

### Depth

- Layering is real but subtle: cards lift on hover, the nav blurs content
  behind it, the reading bar tracks progress.
- Depth communicates hierarchy and state without being showy. Elevation and
  shadows are tokenized and restrained.

## 3. What "Apple-like" means concretely here

| Apple trait | Translation to this project |
|---|---|
| System typography (SF Pro) | Native system font stack; no webfont cost, instant render |
| Immaculate spacing rhythm | Tokenized spacing scale; generous section padding; consistent gutters |
| Big, tight display type | Hero headline with negative tracking, high contrast, fluid `clamp()` sizing |
| Quiet, blur-backed nav | Fixed 48px nav, `backdrop-filter` blur, subtle border on scroll |
| Restrained accent color | One accent family (blue) for links/actions; neutrals do the rest |
| Pill buttons | Rounded-full primary/secondary buttons with clear hover states |
| Card tiles on neutral backgrounds | Rounded cards, hairline borders, soft shadows, whole-card targets |
| OS-native theming | Dark mode follows `prefers-color-scheme`; no manual toggle |
| Motion that informs | 300–800ms reveals, cheap properties, fully disabled under reduced motion |
| Progress that reassures | Skeleton states, explicit error/empty states with paths forward |

## 4. Principles in practice

### 4.1 Hierarchy first

- Type scale, weight, and whitespace — not color — establish order.
- Page order on the list view: eyebrow → one hero headline → one line of
  supporting copy → actions → the notes grid.
- On an article: back link → title → meta line → prose. Nothing competes.

### 4.2 Generosity

- Whitespace is a feature. Sections breathe; cards have room; prose has line
  height that makes reading effortless.
- Never shrink spacing to "fit more". If content overflows, reduce content.

### 4.3 Consistency

- One token set, two themes. Same radius, same easing, same spacing everywhere.
- Every component in `docs/ui.md` is the single way to build that thing.
- If a pattern would require a new component, document it before shipping it.

### 4.4 Quality over quantity

- Fewer, better elements. No marquee effects, no confetti, no gratuitous
  gradients, no generic "template" aesthetics.
- Every interactive element has hover, focus, active, and disabled thinking.

## 5. The premium bar (definition of "production")

A screen is production-quality when:

1. Nothing is misaligned, overlapped, or clipped at any supported width.
2. Every state exists: loading, empty, error, success, hover, focus, active.
3. Typography hierarchy is obvious at a glance, even squinted.
4. Motion is 100ms shorter than you think is needed and always reducible.
5. Both themes are equally finished.
6. It would not embarrass a senior frontend engineer in a code review.

## 6. Anti-patterns (never)

- **Center-everything text walls** — mixing alignment thoughtfully, not dumping
  everything centered.
- **Color as the only differentiator** — hierarchy must survive in grayscale.
- **Boxy, cramped, border-happy layouts** — prefer whitespace and hairline
  borders over heavy rules.
- **Rotating carousels, autoplay, marquees, confetti.**
- **Generic placeholder looks** — "Bootstrap default", "just a blog with
  cards", clip-art icons, random emoji.
- **Motion without purpose** — bounce, slide, or fade added for its own sake.
- **Dark mode as an afterthought** — a washed-out dark theme fails the bar.

## 7. Voice and tone

- The interface speaks calmly, briefly, and specifically.
- Human, not corporate: "Give your agents a real harness." over "Welcome to
  our platform."
- Error copy explains what happened and what to do next, in one breath.
- No exclamation points in UI copy. No emoji in the interface.