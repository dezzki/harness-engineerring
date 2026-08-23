const GITHUB_API_BASE = 'https://api.github.com/repos';
const STORAGE_KEY = 'studydash:last-repo';
const REQUEST_TIMEOUT_MS = 12000;

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
const emptyState = document.getElementById('empty-state');
const repoCard = document.getElementById('repo-card');
const repoLink = document.getElementById('repo-link');
const repoLanguage = document.getElementById('repo-language');
const repoDescription = document.getElementById('repo-description');
const repoStars = document.getElementById('repo-stars');
const repoForks = document.getElementById('repo-forks');
const repoIssues = document.getElementById('repo-issues');
const repoLastCommit = document.getElementById('repo-last-commit');

const numberFormat = new Intl.NumberFormat();
let isLoading = false;

class ApiError extends Error {
  constructor(status) {
    super(String(status));
    this.status = status;
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
}

function repoApiUrl(slug) {
  const [owner, name] = slug.split('/');
  return `${GITHUB_API_BASE}/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: controller.signal,
    });
    if (!response.ok) throw new ApiError(response.status);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
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

async function fetchLastCommitDate(slug) {
  try {
    const commits = await fetchJson(`${repoApiUrl(slug)}/commits?per_page=1`);
    const latest = Array.isArray(commits) ? commits[0] : null;
    return latest?.commit?.committer?.date ?? latest?.commit?.author?.date ?? null;
  } catch {
    return null;
  }
}

function renderRepo(data, lastCommitDate) {
  repoLink.textContent = data.full_name;
  repoLink.href = data.html_url;

  if (data.language) {
    repoLanguage.textContent = data.language;
    repoLanguage.hidden = false;
  } else {
    repoLanguage.hidden = true;
  }

  repoDescription.textContent = data.description || 'No description provided.';
  repoStars.textContent = numberFormat.format(data.stargazers_count ?? 0);
  repoForks.textContent = numberFormat.format(data.forks_count ?? 0);
  repoIssues.textContent = numberFormat.format(data.open_issues_count ?? 0);
  repoLastCommit.textContent = lastCommitDate ? relativeTime(lastCommitDate) : 'unknown';

  emptyState.hidden = true;
  repoCard.hidden = false;
}

function saveLastRepo(slug) {
  try {
    localStorage.setItem(STORAGE_KEY, slug);
  } catch {}
}

function getSavedRepo() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

async function connectToRepo(slug) {
  setLoading(true);
  setStatus('loading', `Connecting to ${slug}…`);
  try {
    const data = await fetchJson(repoApiUrl(slug));
    const lastCommitDate = await fetchLastCommitDate(slug);
    renderRepo(data, lastCommitDate);
    saveLastRepo(data.full_name);
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

repoInput.addEventListener('input', hideWarning);

const savedSlug = getSavedRepo();
if (savedSlug && parseRepoInput(savedSlug)) {
  repoInput.value = savedSlug;
  connectToRepo(savedSlug);
}
