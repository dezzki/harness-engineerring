# StudyDash

A study dashboard for tracking the GitHub repositories you learn from — all in one place.

This is an early foundation build: plain HTML, CSS, and JavaScript only. No frameworks, no libraries, no build tools.

## Current features

- Header with the app name and tagline
- Input to connect a GitHub repository (`owner/repo` format) with a Connect button
- Inline warning when Connect is clicked with an empty input
- Friendly empty state before any repo is connected
- Responsive layout that works on phone-width screens

Real GitHub connections come in a later step.

## How to run

1. Open a terminal in this folder (`Code/`)
2. Run:

   ```sh
   python3 -m http.server 8000
   ```

3. Open <http://localhost:8000> in your browser

Alternatively, you can simply open `index.html` directly in a browser.

## Project structure

```
Code/
├── index.html    # Page structure: header, connect section, empty state
├── styles.css    # Design tokens (CSS variables) + layout
├── src/
│   └── app.js    # Connect button behavior
└── README.md
```
