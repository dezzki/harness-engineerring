const GITHUB_API_BASE = 'https://api.github.com/repos';
const STORAGE_KEY = 'studydash:last-repo';
const CACHE_PREFIX = 'studydash:cache:';
const REQUEST_TIMEOUT_MS = 12000;
const COMMIT_LIMIT = 10;
const CONTRIBUTOR_LIMIT = 5;

const RELATIVE_UNITS = [
  ['year', 31536000],
  ['month', 2592000],
  ['week', 604800],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
];

const form = document.getElementById('connect-form');
const repoInput = document.getElementById('repo-input');
const warning = document.getElementById('connect-warning');
const statusElement = document.getElementById('connect-status');
const statusText = document.getElementById('connect-status-text');
const connectButton = document.getElementById('connect-btn');
const refreshButton = document.getElementById('refresh-btn');
const emptyState = document.getElementById('empty-state');
const dashboard = document.getElementById('dashboard');
const repoLink = document.getElementById('repo-link');
const repoLanguage = document.getElementById('repo-language');
const repoDescription = document.getElementById('repo-description');
const commitsList = document.getElementById('commits-list');
const commitsEmpty = document.getElementById('commits-empty');
const contributorsList = document.getElementById('contributors-list');
const contributorsEmpty = document.getElementById('contributors-empty');
const statCreated = document.getElementById('stat-created');
const statBranch = document.getElementById('stat-branch');
const statLastCommit = document.getElementById('stat-last-commit');
const statStars = document.getElementById('stat-stars');
const statForks = document.getElementById('stat-forks');
const ratioText = document.getElementById('ratio-text');
const ratioOpen = document.getElementById('ratio-open');
const ratioClosed = document.getElementById('ratio-closed');
const ratioBar = document.getElementById('ratio-bar');
const ratioOpenSegment = document.getElementById('ratio-open-segment');
const ratioClosedSegment = document.getElementById('ratio-closed-segment');
const ratioEmpty = document.getElementById('ratio-empty');

const numberFormat = new Intl.NumberFormat();
const dateFormat = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});
let isLoading = false;
let currentSlug = null;

class ApiError extends Error {
  constructor(status) {
    super(String(status));
    this.status = status;
  }
}

class PartialError extends Error {
  constructor() {
    super('Panel data unavailable');
  }
}

function parseRepoInput(rawValue) {
  const parts = rawValue
    .trim()
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length !== 2) return null;
  return `${parts[0]}/${parts[1]}`;
}

function showWarning() {
  warning.hidden = false;
}

function hideWarning() {
  warning.hidden = true;
}

function setStatus(kind, message) {
  statusText.textContent = message;
  statusElement.classList.toggle('is-loading', kind === 'loading');
  statusElement.classList.toggle('is-error', kind === 'error');
  statusElement.hidden = false;
}

function clearStatus() {
  statusElement.hidden = true;
  statusText.textContent = '';
}

function setLoading(next) {
  isLoading = next;
  connectButton.disabled = next;
  refreshButton.disabled = next || !currentSlug;
}

function repoApiUrl(slug) {
  const [owner, name] = slug.split('/');
  return `${GITHUB_API_BASE}/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchJson(url) {
  const response = await fetchWithTimeout(url);
  if (!response.ok) throw new ApiError(response.status);
  return response.json();
}

function errorMessageFor(error) {
  if (error instanceof ApiError) {
    if (error.status === 404) {
      return 'Repository not found. Double-check the owner/name and try again.';
    }
    if (error.status === 403 || error.status === 429) {
      return 'GitHub API limit reached. Please wait a while and try again.';
    }
  }
  if (error instanceof PartialError) {
    return 'Could not load all dashboard data. Press Refresh to try again.';
  }
  if (error && error.name === 'AbortError') {
    return 'The request timed out. Check your connection and try again.';
  }
  return 'Could not reach GitHub. Check your connection and try again.';
}

function relativeTime(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'unknown';
  const elapsedSeconds = Math.round((Date.now() - date.getTime()) / 1000);
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  for (const [unit, secondsInUnit] of RELATIVE_UNITS) {
    if (Math.abs(elapsedSeconds) >= secondsInUnit) {
      return formatter.format(-Math.round(elapsedSeconds / secondsInUnit), unit);
    }
  }
  return 'just now';
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'unknown';
  return dateFormat.format(date);
}

function loadCache(slug) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + slug);
    if (!raw) return null;
    const snapshot = JSON.parse(raw);
    if (!snapshot || typeof snapshot !== 'object' || !snapshot.repo) return null;
    return snapshot;
  } catch {
    return null;
  }
}

function saveCache(slug, snapshot) {
  try {
    localStorage.setItem(
      CACHE_PREFIX + slug,
      JSON.stringify({ ...snapshot, fetchedAt: new Date().toISOString() })
    );
  } catch {}
}

function getSavedRepo() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveLastRepo(slug) {
  try {
    localStorage.setItem(STORAGE_KEY, slug);
  } catch {}
}

function pickRepoFields(data) {
  return {
    fullName: data.full_name,
    htmlUrl: data.html_url,
    description: data.description ?? '',
    language: data.language ?? null,
    createdAt: data.created_at ?? null,
    defaultBranch: data.default_branch ?? null,
    stargazersCount: data.stargazers_count ?? 0,
    forksCount: data.forks_count ?? 0,
    openIssuesCount: data.open_issues_count ?? 0,
  };
}

async function fetchCommitsSafe(slug) {
  try {
    const commits = await fetchJson(`${repoApiUrl(slug)}/commits?per_page=${COMMIT_LIMIT}`);
    return (Array.isArray(commits) ? commits : []).map((entry) => ({
      message: String(entry?.commit?.message ?? '').split('\n')[0].trim(),
      authorName: entry?.author?.login ?? entry?.commit?.author?.name ?? 'Unknown',
      authorLogin: entry?.author?.login ?? null,
      avatarUrl: entry?.author?.avatar_url ?? null,
      date: entry?.commit?.committer?.date ?? entry?.commit?.author?.date ?? null,
    }));
  } catch {
    return null;
  }
}

async function fetchContributorsSafe(slug) {
  try {
    const contributors = await fetchJson(
      `${repoApiUrl(slug)}/contributors?per_page=${CONTRIBUTOR_LIMIT}`
    );
    return (Array.isArray(contributors) ? contributors : [])
      .slice(0, CONTRIBUTOR_LIMIT)
      .map((entry) => ({
        login: entry?.login ?? 'Unknown',
        avatarUrl: entry?.avatar_url ?? null,
        contributions: entry?.contributions ?? 0,
      }));
  } catch {
    return null;
  }
}

async function fetchClosedIssuesCount(slug) {
  const response = await fetchWithTimeout(
    `${repoApiUrl(slug)}/issues?state=closed&per_page=1`
  );
  if (!response.ok) throw new ApiError(response.status);
  const items = await response.json();
  const linkHeader = response.headers.get('Link');
  if (linkHeader) {
    const lastPage = linkHeader.match(/page=(\d+)>;\s*rel="last"/);
    if (lastPage) return Number(lastPage[1]);
  }
  return Array.isArray(items) ? items.length : 0;
}

async function fetchClosedIssuesSafe(slug) {
  try {
    return await fetchClosedIssuesCount(slug);
  } catch {
    return null;
  }
}

function buildAvatar(login, avatarUrl) {
  if (avatarUrl) {
    const image = document.createElement('img');
    image.className = 'avatar';
    image.src = avatarUrl;
    image.alt = '';
    image.loading = 'lazy';
    return image;
  }
  const fallback = document.createElement('span');
  fallback.className = 'avatar avatar-fallback';
  fallback.setAttribute('aria-hidden', 'true');
  fallback.textContent = (login || '?').charAt(0).toUpperCase();
  return fallback;
}

function buildCommitItem(commit) {
  const item = document.createElement('li');
  item.className = 'commit-item';
  item.appendChild(buildAvatar(commit.authorLogin ?? commit.authorName, commit.avatarUrl));

  const body = document.createElement('div');
  body.className = 'commit-body';

  const message = document.createElement('p');
  message.className = 'commit-message';
  message.textContent = commit.message || '(no commit message)';
  message.title = commit.message;

  const meta = document.createElement('p');
  meta.className = 'commit-meta';
  meta.textContent = commit.date
    ? `${commit.authorName} · ${relativeTime(commit.date)}`
    : commit.authorName;

  body.appendChild(message);
  body.appendChild(meta);
  item.appendChild(body);
  return item;
}

function buildContributorItem(contributor) {
  const item = document.createElement('li');
  item.className = 'contributor-item';
  item.appendChild(buildAvatar(contributor.login, contributor.avatarUrl));

  const login = document.createElement('span');
  login.className = 'contributor-login';
  login.textContent = contributor.login;

  const count = document.createElement('span');
  count.className = 'contributor-count';
  count.textContent =
    contributor.contributions === 1
      ? '1 commit'
      : `${numberFormat.format(contributor.contributions ?? 0)} commits`;

  item.appendChild(login);
  item.appendChild(count);
  return item;
}

function renderCommits(commits) {
  commitsList.replaceChildren();
  const isEmpty = commits.length === 0;
  commitsList.hidden = isEmpty;
  commitsEmpty.hidden = !isEmpty;
  for (const commit of commits) {
    commitsList.appendChild(buildCommitItem(commit));
  }
}

function renderContributors(contributors) {
  contributorsList.replaceChildren();
  const isEmpty = contributors.length === 0;
  contributorsList.hidden = isEmpty;
  contributorsEmpty.hidden = !isEmpty;
  for (const contributor of contributors) {
    contributorsList.appendChild(buildContributorItem(contributor));
  }
}

function renderIssueRatio(openCount, closedCount) {
  ratioOpen.textContent = numberFormat.format(openCount);
  ratioClosed.textContent = numberFormat.format(closedCount);
  const total = openCount + closedCount;
  const hasIssues = total > 0;
  ratioText.hidden = !hasIssues;
  ratioBar.hidden = !hasIssues;
  ratioEmpty.hidden = hasIssues;
  if (!hasIssues) return;
  const openShare = Math.min(Math.max(Math.round((openCount / total) * 100), 0), 100);
  ratioOpenSegment.style.width = `${openShare}%`;
  ratioClosedSegment.style.width = `${100 - openShare}%`;
  ratioBar.setAttribute(
    'aria-label',
    `Issues: ${numberFormat.format(openCount)} open, ${numberFormat.format(closedCount)} closed`
  );
}

function renderOverview(repo, commits, closedIssues) {
  statCreated.textContent = formatDate(repo.createdAt);
  statBranch.textContent = repo.defaultBranch || 'unknown';
  statStars.textContent = numberFormat.format(repo.stargazersCount ?? 0);
  statForks.textContent = numberFormat.format(repo.forksCount ?? 0);

  const latestCommitDate = commits.find((commit) => commit.date)?.date;
  statLastCommit.textContent = latestCommitDate
    ? relativeTime(latestCommitDate)
    : 'unknown';

  renderIssueRatio(repo.openIssuesCount ?? 0, closedIssues);
}

function renderDashboard(snapshot) {
  const repo = snapshot.repo ?? {};
  const commits = Array.isArray(snapshot.commits) ? snapshot.commits : [];
  const contributors = Array.isArray(snapshot.contributors)
    ? snapshot.contributors
    : [];
  const closedIssues = Number.isFinite(snapshot.closedIssues)
    ? snapshot.closedIssues
    : 0;

  currentSlug = repo.fullName;

  repoLink.textContent = repo.fullName ?? '';
  repoLink.href = repo.htmlUrl || '#';
  repoDescription.textContent = repo.description || 'No description provided.';

  if (repo.language) {
    repoLanguage.textContent = repo.language;
    repoLanguage.hidden = false;
  } else {
    repoLanguage.hidden = true;
  }

  renderOverview(repo, commits, closedIssues);
  renderCommits(commits);
  renderContributors(contributors);

  emptyState.hidden = true;
  dashboard.hidden = false;
}

async function connectToRepo(slug, options = {}) {
  const force = Boolean(options.force);
  setLoading(true);

  const cachedSnapshot = force ? null : loadCache(slug);
  if (cachedSnapshot) {
    renderDashboard(cachedSnapshot);
    clearStatus();
    setLoading(false);
    return;
  }

  setStatus('loading', `${force ? 'Refreshing' : 'Connecting to'} ${slug}…`);
  try {
    const repoData = await fetchJson(repoApiUrl(slug));
    const [commits, contributors, closedIssues] = await Promise.all([
      fetchCommitsSafe(slug),
      fetchContributorsSafe(slug),
      fetchClosedIssuesSafe(slug),
    ]);
    if (commits === null || contributors === null || closedIssues === null) {
      throw new PartialError();
    }

    const snapshot = {
      repo: pickRepoFields(repoData),
      commits,
      contributors,
      closedIssues,
    };
    renderDashboard(snapshot);
    saveLastRepo(repoData.full_name);
    saveCache(repoData.full_name, snapshot);
    clearStatus();
  } catch (error) {
    setStatus('error', errorMessageFor(error));
  } finally {
    setLoading(false);
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (isLoading) return;

  const slug = parseRepoInput(repoInput.value);
  if (!slug) {
    showWarning();
    repoInput.focus();
    return;
  }

  hideWarning();
  connectToRepo(slug);
});

refreshButton.addEventListener('click', () => {
  if (!isLoading && currentSlug) {
    connectToRepo(currentSlug, { force: true });
  }
});

repoInput.addEventListener('input', hideWarning);

const savedSlug = getSavedRepo();
if (savedSlug && parseRepoInput(savedSlug)) {
  repoInput.value = savedSlug;
  connectToRepo(savedSlug);
}
