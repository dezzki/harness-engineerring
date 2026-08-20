# AGENT.md

> The primary entry point for any coding agent working in this repository.
> Read this first. Read it in full. Re-read it before committing work.

## Purpose

This document tells you **how to work on this project**. It is a map, not an
encyclopedia. If a question is not answered here, consult the other harness
files in this order:

1. `RULES.md` — hard constraints and standards. Never violate these.
2. `ARCHITECTURE.md` — how the system is built and why.
3. `DESIGN/index.md` — the design documentation map.
4. `DESIGN/core.md` — the visual/design philosophy.
5. `DESIGN/docs/*.md` — detailed UI, UX, and visual-system specs.

## Project at a glance

- **What it is:** a small, static blog about harness engineering that loads
  Markdown notes from `notes/` and renders them in the browser.
- **Stack:** plain HTML, CSS, and vanilla JavaScript. No frameworks, no build
  step, no package manager, no server-side code, no external assets.
- **How it runs:** served as static files over HTTP (e.g. `python3 -m http.server`).
  It will **not** work from `file://` because it uses `fetch()`.
- **Working directory:** `index.html`, `styles.css`, `index.js`, `notes/*.md`,
  plus this harness (`AGENT.md`, `ARCHITECTURE.md`, `RULES.md`, `DESIGN/`).

## Repository map

```text
AGENT.md                       This file — how to work on the project
ARCHITECTURE.md                System structure, data flow, decisions
RULES.md                       Strict rules for coding, design, UX, a11y, perf
DESIGN/
  index.md                     Design doc map & reading order
  core.md                      Core design philosophy & principles
  docs/
    ui.md                      Component-level UI specifications
    ux.md                      UX flows, interaction, microcopy
    visual-system.md           Tokens: type, color, spacing, motion, breakpoints
index.html                     Entry document & page shell
styles.css                     All styling (design tokens + components)
index.js                       Application logic (load, parse, render, route)
notes/                         Markdown source posts (blog-1.md …)
```

## How to work on this project

Follow this workflow on every task. Do not skip steps.

### 1. Understand before changing

- Read this file, then `ARCHITECTURE.md`, then `RULES.md`.
- Read every file your change touches, plus the files around it.
- If the task is design-related, read `DESIGN/index.md` first and follow the
  reading order it defines.
- Never modify `notes/*.md` unless the task explicitly says content changes.

### 2. Plan

- State the problem and your intended approach before writing code.
- Prefer the smallest change that satisfies the task without breaking the
  existing behavior.
- If a change would violate a rule in `RULES.md`, stop and reconsider.

### 3. Implement

- Follow the coding rules in `RULES.md`.
- Match the existing code style exactly (naming, formatting, structure).
- Keep the implementation dependency-free and offline-friendly.
- Do not add comments to code unless the task requires it. Keep any comments
  terse and purposeful.

### 4. Verify (mandatory)

Never report a task as done before verification. At minimum:

1. Syntax-check JavaScript: `node --check index.js` (and any other `.js` files).
2. Serve and open the page in a browser; exercise every interaction.
3. Run the full verification checklist in `RULES.md` → *Verification rules*.
4. Visually compare against the design bar in `DESIGN/core.md` (Apple.com as
   primary reference). Fix anything that looks unfinished or below production
   quality, then re-verify.

## Primary tasks you will be asked to do

- **Rebuild / refine the UI** to a premium, Apple-like standard (see `DESIGN/`).
- **Improve the Markdown renderer** in `index.js` (or a `lib/` module) without
  introducing dependencies.
- **Add responsive, accessible, performant behavior** to the page shell.
- **Extend the content model** (e.g. new metadata fields, tags, dates) by
  parsing note front matter.
- **Document** design decisions in the harness files when they change.

## Hard constraints (do not break)

- No third-party libraries, frameworks, CDN links, web fonts, or remote assets.
  System font stacks only.
- No build step, no bundler, no package.json requirements. The site must work
  by serving the directory with any static file server.
- Keep the page functional with JavaScript enabled; provide a graceful
  `<noscript>` fallback and clear loading/error states.
- Never change `notes/*.md` content unless asked.
- Never commit secrets. There are none expected here.

## Do / Don't

**Do**

- Preserve existing functionality unless the task explicitly requires change.
- Prefer semantic HTML, native accessibility, and CSS over JS hacks.
- Use the design tokens defined in `DESIGN/docs/visual-system.md`; do not
  invent ad-hoc colors, fonts, or spacings.
- Keep JavaScript small, readable, and defensive (guard against missing DOM
  nodes, failed fetches, malformed Markdown).
- Test on at least one mobile width and one desktop width.

**Don't**

- Don't add dependencies "to make it easier" — solve it with vanilla JS/CSS.
- Don't inline styles or embed JavaScript in HTML; keep behavior and
  presentation out of markup.
- Don't ship dead code, unused CSS, or leftover debug statements.
- Don't "improve" unrelated parts of the page while doing a focused task.
- Don't claim completion without running the verification checklist.

## Definition of done

A task is done when:

- The behavior works in a browser over a static server.
- `node --check` passes on all changed JavaScript.
- The verification checklist in `RULES.md` passes.
- The result meets the quality bar in `DESIGN/core.md` (feels like a real
  production site, not a demo).
- No code was changed outside the scope of the task.