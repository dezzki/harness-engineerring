const form = document.getElementById('connect-form');
const repoInput = document.getElementById('repo-input');
const warning = document.getElementById('connect-warning');

function showWarning() {
  warning.hidden = false;
}

function hideWarning() {
  warning.hidden = true;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const repo = repoInput.value.trim();

  if (!repo) {
    showWarning();
    repoInput.focus();
    return;
  }

  hideWarning();
  console.log(`Connect requested for: ${repo}`);
});

repoInput.addEventListener('input', hideWarning);
