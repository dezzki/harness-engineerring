**Task 1** — Foundation (empty repo → shell)
Prompt:
Create a study dashboard web app in this folder.
Plain HTML, CSS, and JavaScript only — no frameworks, no libraries, no build tools.

What it needs now:
- index.html: a header with the app name, a section with an input to connect a
  GitHub repo (owner/repo format) and a Connect button, and a friendly empty
  state message below
- styles.css: design tokens as CSS variables (colors, spacing, fonts), clean
  modern layout
- src/app.js: clicking Connect with an empty input shows a small inline warning;
  any non-empty input just logs to console for now (real connection comes later)
- README.md: what the app is and how to run it
- Commit Changes to the github repo already connected

Read Verification.md first and treat it as the definition of done.
When finished, state DONE or NOT DONE, then list what you checked.

**Task 2** — GitHub connection (the core feature)
Prompt:
Wire up the GitHub connection in the study dashboard. Use fetch and the public
GitHub API — still no libraries.

- Typing owner/name and clicking Connect shows a repo card: full name,
  description, stars, forks, open issues, main language, and the last commit
  date shown as relative time ("2 days ago")
- Show a loading indicator while fetching
- Repo doesn't exist → friendly error message; page must never crash or blank out
- Remember the last connected repo — still there after page refresh
- Follow Verification.md. State DONE or NOT DONE with what you verified.

**Task 3** — Complete dashboard layout
Prompt:
Expand the single repo card into a full dashboard layout for the connected repo.
Three panels:

1. Recent activity — last 10 commits: message, author, relative time
2. Contributors — top 5 with avatar, username, commit count
3. Repo overview — created date, default branch, open vs closed issue ratio

Rules:
- A repo with zero commits or zero contributors must show a clean "nothing here"
  message, not an empty box or a crash
- Cache panel data in localStorage so a refresh renders instantly, and add a
  Refresh button that force-refetches
- Follow Verification.md. State DONE or NOT DONE with what you verified.

**Task 4** — Study tools (data-heavy)
Prompt:
Add study planning tools to the dashboard:

- A "Study tasks" panel: add a task with a title and optional due date,
  mark it done, delete it
- Each task shows the connected repo's name; tasks must persist in localStorage
  and work even when no repo is connected
- Sorting: overdue tasks first, then soonest due date; done tasks sink to bottom
- A filter box that narrows tasks by text as I type
- Empty title or nonsense dates → polite inline warning, nothing saved
- Follow Verification.md. State DONE or NOT DONE with what you verified.
Niches: overdue date comparison, midnight/timezone edge cases, persistence without repo, live filtering.
Task 5 — Product-level polish
Prompt:
Final pass — make this feel like a real product:

- Dark/light theme toggle: saved preference, defaults to system preference,
  no flash of wrong theme on load
- Accessibility: full keyboard navigation, visible focus styles, aria-labels
  on icon-only buttons, proper contrast in both themes
- Responsive down to phone width
- Every failure mode handled: no internet, GitHub rate limit hit ("try again
  later" message), corrupted localStorage (app recovers with defaults)
- Update README with a feature list and how-to-run
- Follow Verification.md. State DONE or NOT DONE with what you verified.