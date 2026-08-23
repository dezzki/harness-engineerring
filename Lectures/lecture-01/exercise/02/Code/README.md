# StudyDash

A study dashboard for tracking the GitHub repositories you learn from — all in one place.

Plain HTML, CSS, and JavaScript only. No frameworks, no libraries, no build tools.

## Current features

- Connect a GitHub repository (`owner/repo` format) via the public GitHub REST API
- Dashboard with three panels:
  - **Recent activity** — last 10 commits (message, author, relative time)
  - **Contributors** — top 5 (avatar, username, commit count)
  - **Overview** — created date, default branch, last commit, stars, forks, and an
    open vs closed issue ratio bar
- Panel data is cached in `localStorage`, so a page refresh renders instantly
- Refresh button that force-refetches everything from GitHub
- Clean "nothing here" messages for repos with zero commits, zero contributors,
  or zero issues
- Loading spinner while fetching; friendly error messages for unknown repos,
  API rate limits, timeouts, and network problems
- Remembers the last connected repo across refreshes
- Inline warning when Connect is clicked with an empty or malformed input
- Friendly empty state before any repo is connected
- Responsive layout that works on phone-width screens

## How to run

1. Open a terminal in this folder (`Code/`)
2. Run:

   ```sh
   python3 -m http.server 8000
   ```

3. Open <http://localhost:8000> in your browser

Alternatively, you can simply open `index.html` directly in a browser.

## Notes

- The GitHub API is used without authentication, which allows about
  60 requests per hour per IP address. A fresh connect uses 4 requests
  (repo details, commits, contributors, closed-issue count). Cached loads
  use none. Test slowly.
- The open/closed ratio counts issues and pull requests together, matching
  how GitHub reports them on the repository object.
- To forget the saved repo or clear cached data, clear site data in your
  browser (DevTools → Application → Local Storage → Clear).

## Project structure

```
Code/
├── index.html    # Page structure: header, connect section, empty state, dashboard panels
├── styles.css    # Design tokens (CSS variables) + layout + loading/error states
├── src/
│   └── app.js    # Input validation, GitHub API fetch, rendering, caching, refresh
└── README.md
```
