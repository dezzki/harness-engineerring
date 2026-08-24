# Verification Standards — Study Dashboard

This file defines "done" for every task.
The agent treats it as its quality bar while coding.
The owner runs these checks BY HAND after the agent claims completion.

## Run the app
1. Open a terminal in `Code/`
2. Run: `python3 -m http.server 8000`
3. Open: http://localhost:8000

---

## A. Always check (every task)
1. Page loads, not blank
2. Console (F12): no red errors on load OR while clicking around
3. Old features still work — nothing broke
4. Narrow (phone-width) window: layout not broken
5. No leftover debug stuff (`console.log`, half-done comments)

## B. UI & behavior (when the task changes what you see)
1. Every button/link does what it claims
2. Loading shows a spinner or text — never a silent freeze
3. Empty states have a message ("Nothing here yet"), not blank space
4. Errors show a friendly message — page never goes white
5. New parts match existing colors/fonts/spacing

## C. Data (when the task saves anything)
1. Refresh page → data is still there
2. Bad input → polite warning, nothing saved, no crash
3. Wipe storage (DevTools → Application → Local Storage → Clear) → app still works

## D. GitHub API (when the task talks to GitHub)
1. Real repo (try `facebook/react`) → correct data appears
2. Fake repo (`fake/nope-123`) → friendly error, no crash
3. While fetching → loading state is visible
4. Empty input → blocked politely
Note: free API ≈ 60 requests/hour — test slowly.

## E. Accessibility basics (when the task adds visible UI)
1. Every control reachable with Tab key
2. Icons/images have text labels (`alt` / `aria-label`)
3. Text readable: not tiny, not light-on-light

## F. Code hygiene (every task)
1. New code follows existing structure (`src/app.js`, etc.)
2. README updated if features/how-to-run changed
3. A git commit exists for the task

---

## Verdicts
- **PASS** — all applicable checks good
- **PARTIAL** — feature works, but some checks fail
- **FAIL** — feature broken or crashes

---

## Workflow for each task
1. Agent codes, treating this file as the definition of done.
2. Agent states DONE / NOT DONE first — before any checking.
3. Owner runs sections A–F (applicable ones).
4. State agent verdict after each task in Code/agent-verdict.md.