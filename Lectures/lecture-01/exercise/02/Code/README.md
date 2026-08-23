# StudyDash

A study dashboard for tracking the GitHub repositories you learn from — all in one place.

Plain HTML, CSS, and JavaScript only. No frameworks, no libraries, no build tools.

## Current features

- Connect a GitHub repository (`owner/repo` format) via the public GitHub REST API
- Repo card showing full name, description, stars, forks, open issues, main language,
  and the last commit date as relative time (e.g. "2 days ago")
- Loading spinner while fetching
- Friendly error messages for unknown repos, API rate limits, timeouts, and network problems
- Remembers the last connected repo in `localStorage` — it is restored after a page refresh
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
  60 requests per hour per IP address. Each connect uses 2 requests
  (repo details + last commit). Test slowly.
- To forget the saved repo, clear site data in your browser
  (DevTools → Application → Local Storage → Clear).

## Project structure

```
Code/
├── index.html    # Page structure: header, connect section, empty state, repo card
├── styles.css    # Design tokens (CSS variables) + layout + loading/error states
├── src/
│   └── app.js    # Input validation, GitHub API fetch, rendering, persistence
└── README.md
```
