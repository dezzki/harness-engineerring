const NOTES = [
  "notes/blog-1.md",
  "notes/blog-2.md",
  "notes/blog-3.md"
];

async function loadNotes() {
  const list = document.getElementById("blog-list");
  for (const path of NOTES) {
    const res = await fetch(path);
    if (!res.ok) continue;
    const text = await res.text();
    const title = text.split("\n").find(line => line.trim()) || path;
    const article = document.createElement("article");
    article.innerHTML = `<h2>${title}</h2><pre>${text}</pre>`;
    list.appendChild(article);
  }
}

loadNotes();