# DESIGN/docs/visual-system.md

> The tokenized visual system. All values below are implemented as CSS custom
> properties in `styles.css`. **Do not hardcode these values in components.**
> When a value changes, change the token and update this document together.

## 1. Typography

**Font stacks** (system-first; no webfonts, no network):

- `--font-ui`: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- `--font-display`: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif`
- `--font-mono`: `ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace`

**Type scale** (fluid where noted; all sizes in rem unless stated):

| Role | Size | Weight | Line-height | Tracking | Usage |
|---|---|---|---|---|---|
| Hero title | `clamp(2.75rem, 7vw, 4.75rem)` | 600 | 1.06 | -0.025em | List-view headline |
| Section title | `clamp(1.75rem, 4vw, 2.5rem)` | 600 | 1.15 | -0.02em | `h2` section heads |
| Article title | `clamp(2rem, 5vw, 2.75rem)` | 600 | 1.12 | -0.02em | Article `h1` |
| Prose `h2` | `clamp(1.5rem, 3vw, 1.875rem)` | 600 | 1.2 | -0.015em | In-article headings |
| Prose `h3` | 1.3125rem | 600 | 1.25 | -0.01em | In-article subheads |
| Card title | `clamp(1.375rem, 3vw, 1.75rem)` | 600 | 1.25 | -0.015em | Note cards |
| Body (prose) | 1.125rem | 400 | 1.7 | 0 | Article paragraphs |
| Body (UI) | 1.0625rem | 400 | 1.5 | 0 | Base text, paragraphs |
| Sub copy | 1.0625rem | 400 | 1.5 | 0 | Hero sub, section sub |
| Excerpt | 0.9375rem | 400 | 1.55 | 0 | Card excerpts |
| Small / meta | 0.8125rem | 400 | 1.4 | 0 | Card meta, footer legal |
| Micro | 0.75rem | 500 | 1.4 | 0.01em | Tags |
| Eyebrow | 0.8125rem | 600 | 1.3 | 0.02em | Hero eyebrow |
| Nav link | 0.875rem | 400 | 1.3 | 0 | Nav (mobile: 1.0625rem) |

Rules:

- Weights outside `{400, 500, 600}` are not used. 600 reads as "semibold" in
  SF Pro; reserve it for display and emphasis.
- Negative tracking scales with size (larger type, tighter tracking).
- Never use `letter-spacing` wider than 0.02em except `uppercase` micro-labels,
  which are avoided by default.

## 2. Color

### Light theme

| Token | Value | Usage | Contrast on `--bg` |
|---|---|---|---|
| `--bg` | `#ffffff` | Page background | — |
| `--bg-elevated` | `#ffffff` | Cards, surfaces on tint | — |
| `--bg-tint` | `#f5f5f7` | Skeleton, code, chips, footer bg | — |
| `--bg-tint-2` | `#ebebed` | Shimmer highlight | — |
| `--text-primary` | `#1d1d1f` | Headlines, body | 17.4:1 |
| `--text-secondary` | `#6e6e73` | Sub copy, meta, excerpts | 5.1:1 |
| `--text-tertiary` | `#86868b` | Decorative only (never essential small text) | 3.7:1 |
| `--link` | `#0066cc` | Inline links | 6.2:1 |
| `--link-hover` | `#0071e3` | Link hover | 4.9:1 |
| `--accent` | `#0071e3` | Primary buttons, focus | 4.9:1 |
| `--accent-hover` | `#0077ed` | Button hover | — |
| `--accent-2` | `#2997ff` | Gradient partner, reading bar | — |
| `--focus` | `#0071e3` | Focus ring | — |
| `--border` | `rgba(0,0,0,0.08)` | Hairlines | — |
| `--border-strong` | `rgba(0,0,0,0.14)` | Buttons, emphasized borders | — |
| `--nav-bg` | `rgba(255,255,255,0.72)` | Nav surface (blur) | — |

### Dark theme (under `prefers-color-scheme: dark`)

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#000000` | Page background |
| `--bg-elevated` | `#111113` | Cards, surfaces |
| `--bg-tint` | `#1d1d1f` | Skeleton, code, chips, footer bg |
| `--bg-tint-2` | `#2c2c2e` | Shimmer highlight |
| `--text-primary` | `#f5f5f7` | Headlines, body |
| `--text-secondary` | `#a1a1a6` | Sub copy, meta, excerpts |
| `--text-tertiary` | `#86868b` | Decorative only |
| `--link` | `#2997ff` | Inline links |
| `--link-hover` | `#66bbff` | Link hover |
| `--accent` | `#2997ff` | Primary buttons, focus |
| `--accent-hover` | `#4db3ff` | Button hover |
| `--accent-2` | `#0071e3` | Gradient partner, reading bar |
| `--focus` | `#2997ff` | Focus ring |
| `--border` | `rgba(255,255,255,0.12)` | Hairlines |
| `--border-strong` | `rgba(255,255,255,0.22)` | Buttons, emphasized borders |
| `--nav-bg` | `rgba(0,0,0,0.72)` | Nav surface (blur) |

Rules:

- Neutral greys dominate; the single blue accent family is the only chromatic
  identity.
- `--text-tertiary` must never carry essential information (WCAG AA floor for
  small text is 4.5:1).
- Gradient text (hero span) is `linear-gradient(90deg, --accent, --accent-2)`.
- Selected text: `--accent` background, white foreground.
- Text links are underlined inline; nav and card links are not.

## 3. Spacing scale

Base unit 4px. Tokens: `--space-1..8` = `4, 8, 12, 16, 24, 32, 48, 64px`,
plus `--space-10` = `80px` and `--space-12` = `96px`.

| Context | Value |
|---|---|
| Page gutters | `clamp(20px, 5vw, 44px)` |
| Section vertical padding | `clamp(48px, 7vw, 96px)` |
| Hero vertical padding | `clamp(80px, 14vh, 140px)` top / `clamp(64px, 10vh, 110px)` bottom |
| Card padding | `clamp(20px, 3vw, 28px)` |
| Grid gap (cards) | 20px |
| Prose rhythm | Paragraph 1.25em; `h2` top 2em; `hr` 2.5em |
| Nav height | 48px |
| Button padding | 12px 22px |

## 4. Radii

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 12px | Images, inline code context |
| `--radius-md` | 18px | Cards, code blocks |
| `--radius-lg` | 28px | Large panels (rare) |
| `--radius-pill` | 999px | Buttons, tags, eyebrow, chips |

Rule: radii come from the scale only. Do not mix 8px and 18px corners within
one component.

## 5. Elevation (shadows)

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)` | Default card |
| `--shadow-md` | `0 4px 10px rgba(0,0,0,0.06), 0 16px 32px rgba(0,0,0,0.10)` | Card hover |
| Dark theme | Tint shadows toward black (`rgba(0,0,0,0.5)`) so they read on `#000` | Same usage |

## 6. Motion

| Token | Value |
|---|---|
| `--ease` | `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out feel) |
| Durations | Hover/active `150–200ms`; menus `250–350ms`; reveals `500–800ms`; card hover `350ms` |
| Reveal transform | translateY(16–24px) → 0, combined with opacity 0 → 1 |
| Card stagger | `--d` inline: `min(index, 5) * 70ms` |
| Reading bar | `transform: scaleX(progress)`, never layout properties |
| Scroll behaviors | `scroll-behavior: smooth` on `html`; disabled under reduced motion |

Rule: `prefers-reduced-motion: reduce` disables every transition, animation,
and smooth scroll. Content must be fully visible and usable with motion off.

## 7. Breakpoints and layout

| Breakpoint | Width | Behavior change |
|---|---|---|
| Mobile base | < 734px | Stacked cards, hamburger menu, tighter gutters |
| Tablet | ≥ 734px | Inline nav; roomier grid |
| Desktop | ≥ 1068px | Full padding scale; 2-column note grid |

Grid:

- Content column: `max-width: 980px`, centered.
- Nav inner: `max-width: 1024px`, centered.
- Article column: `max-width: 720px`, centered.
- Notes grid: `grid-template-columns: repeat(auto-fill, minmax(min(330px, 100%), 1fr))`
  with 20px gap → 1 column on phones, 2 on desktop.
- `scroll-padding-top` accounts for the fixed 48px nav on anchor jumps.

## 8. Layers (z-index)

| Layer | Value | Elements |
|---|---|---|
| Nav / menu | 50 | `.site-nav`, mobile panel |
| Reading bar | 60 | `.reading-bar` |
| Skip link | 100 | `.skip-link` |

## 9. Verification of the system

- Confirm every token used in components resolves to this document.
- Confirm both themes meet the contrast floors in section 2.
- Confirm the type scale is used by role, never improvised.
- Confirm motion durations and easings come from section 6.
- Confirm no component exceeds the two-column grid at desktop.