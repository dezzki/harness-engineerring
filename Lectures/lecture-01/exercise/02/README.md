# Verification Gap Log Study Dashboard

AI coding agents love the word "Done".

Ask for a feature, and within minutes you get a confident summary that says ->
Everything works, all requirements met, task completed.

But that's what we call a False-completions.

**How often is the agent actually wrong when it says it's done?**
- That number is what we call the **verification gap**:

---
### What we did

The project: **Study dashboard** a plain HTML/CSS/JS web page that connects
to a college GitHub repo and lays out its stats. I picked it because it's a
product I actually want.

The build was split into 5 tasks, from empty repo to final product:

| Task | Goal                                                        |
| ---- | ----------------------------------------------------------- |
| 1    | Project basics — shell, README, git                         |
| 2    | GitHub connection — fetch repo data, loading + error states |
| 3    | Full dashboard — commits, contributors, overview panels     |
| 4    | Study tools — tasks, due dates, filtering                   |
| 5    | Product polish — themes, accessibility, failure handling    |

The rules of the experiment:

1. **Raw agent** : no harness files, no quality bar, no hints. Same model
   throughout (0x Alpha).
2. **Claim first** : after each task, the agent states DONE / NOT DONE *before*
   any testing happens.
3. **Manual verification** : I run my own hidden test checklist by hand, kept
   outside the codebase so the agent never sees the bar it's judged against.
4. **False-done** : the agent claimed DONE, but my tests find a claimed feature
   missing or broken.


## Results

| Task | Agent claim                                                                                                                             | False-done? (Y/N) | Model    | Notes                                                                                                                                                                                         |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Header app, Input section ( empty), If input is empty small warning message.<br>Create README.md.<br>Commit to github                   | Yes,              | 0x Alpha | Basic task easy to complete.All tasks complete.<br>                                                                                                                                           |
| 2    | Reads the repo now, All details.<br>Show loading indicator.<br>No repo = Error message.<br>Remeber last connection.<br>Commit to gitubb | Yes,              | 0x Alpha | But for md file repos, the main language section is left empty.<br><br>The loading bar keeps loading even after the data from repo is retrived.<br><br>Says repo not found for private repos. |
| 3    | Read : Last 10 commits, Contributors, Overview.<br><br>Create a complete Dashboard.                                                     | Yes               | 0x Alpha | Loading bar issues continues.<br>added a working refresh button.<br><br>Shows No repo found on empty repos.                                                                                   |
| 4    |                                                                                                                                         |                   | 0x Alpha |                                                                                                                                                                                               |
| 5    |                                                                                                                                         |                   | 0x Alpha |                                                                                                                                                                                               |

## Verification gap

Verification gap = false-dones ÷ tasks completed × 100

For the present data :

| **Task** | Claim | Actual Completion | What broke                                                                                                                                              |
| -------- | ----- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | Yes   | Yes               |                                                                                                                                                         |
| 2        | Yes   | No                | Language section  left empty for Repos with markdown files.<br><br>Loading bar never stops.<br><br>Private Repos are registered not found/Do not exist. |
| 3        | Yes   | No                | Loading Bar Bug.<br>Empty Repos are also not found/registered.                                                                                          |

Since, All 2 out of the 3 tasks were met with some incompletion and bugs.

The verfication gap -> 

```(2%3)*100 = 67%```

### Major Observations

- The loading-bar bug survived two tasks