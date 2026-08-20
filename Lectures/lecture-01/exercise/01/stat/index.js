const NOTES = [
  "notes/blog-1.md",
  "notes/blog-2.md",
  "notes/blog-3.md"
];

document.documentElement.classList.add("js");

const list = document.getElementById("blog-list");
const skeleton = list.querySelector(".skeleton");
const empty = document.getElementById("blog-empty");

/* ---------- Helpers ---------- */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(text) {
  const codes = [];
  let out = escapeHtml(text);

  out = out.replace(/`([^`]+)`/g, (match, code) => {
    codes.push(code);
    return `\u0000${codes.length - 1}\u0000`;
  });

  out = out.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");

  out = out.replace(/\u0000(\d+)\u0000/g, (match, i) => `<code>${codes[Number(i)]}</code>`);

  return out;
}

function renderMarkdown(src) {
  const lines = src.replace(/\r/g, "").split("\n");
  let html = "";
  let listType = null;
  let i = 0;

  const closeList = () => {
    if (listType) {
      html += `</${listType}>`;
      listType = null;
    }
  };

  const isBlockStart = (line) =>
    /^```/.test(line) ||
    /^\s*#{1,6}\s/.test(line) ||
    /^\s*>\s?/.test(line) ||
    /^\s*[-*]\s/.test(line) ||
    /^\s*\d+\.\s/.test(line) ||
    /^\s*-{3,}\s*$/.test(line);

  while (i < lines.length) {
    const line = lines[i];

    if (/^```/.test(line)) {
      closeList();
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      html += `<pre><code>${escapeHtml(buf.join("\n"))}</code></pre>`;
      continue;
    }

    if (/^\s*-{3,}\s*$/.test(line)) {
      closeList();
      html += "<hr>";
      i++;
      continue;
    }

    const heading = line.match(/^\s*(#{1,6})\s+(.*)$/);
    if (heading) {
      closeList();
      const level = Math.min(heading[1].length, 4);
      html += `<h${level}>${inline(heading[2])}</h${level}>`;
      i++;
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      closeList();
      const buf = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      html += `<blockquote>${buf.map((l) => inline(l)).join("<br>")}</blockquote>`;
      continue;
    }

    const ulItem = line.match(/^\s*[-*]\s+(.*)$/);
    if (ulItem) {
      if (listType !== "ul") {
        closeList();
        html += "<ul>";
        listType = "ul";
      }
      html += `<li>${inline(ulItem[1])}</li>`;
      i++;
      continue;
    }

    const olItem = line.match(/^\s*\d+\.\s+(.*)$/);
    if (olItem) {
      if (listType !== "ol") {
        closeList();
        html += "<ol>";
        listType = "ol";
      }
      html += `<li>${inline(olItem[1])}</li>`;
      i++;
      continue;
    }

    if (/^\s*$/.test(line)) {
      closeList();
      i++;
      continue;
    }

    closeList();
    const buf = [];
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !isBlockStart(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    html += `<p>${buf.map((l) => inline(l)).join(" ")}</p>`;
  }

  closeList();
  return html;
}

function parseFrontMatter(src) {
  if (!/^---\s*$/.test(src.split("\n")[0])) {
    return { body: src, meta: {} };
  }

  const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return { body: src, meta: {} };
  }

  const meta = {};
  const body = src.slice(match[0].length);
  let current = null;

  for (const raw of match[1].split(/\r?\n/)) {
    const kv = raw.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) {
      current = kv[1];
      meta[current] = kv[2].replace(/^["']|["']$/g, "").trim();
    } else if (current === "tags" && /^\s*-\s*/.test(raw)) {
      meta.tags = (Array.isArray(meta.tags) ? meta.tags : []).concat(
        raw.replace(/^\s*-\s*/, "").trim()
      );
    }
  }

  return { body, meta };
}

function formatDate(iso) {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function readingTime(text) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function buildCard(post, index) {
  const article = document.createElement("article");
  article.className = "post";
  article.setAttribute("data-reveal", "");
  article.style.setProperty("--d", `${index * 130}ms`);

  const meta = [];
  if (post.date) {
    meta.push(`<time datetime="${post.iso}">${post.date}</time>`);
  }
  meta.push(`${post.mins} min read`);
  if (post.tags.length) {
    meta.push(
      `<span class="tags">${post.tags
        .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
        .join("")}</span>`
    );
  }

  article.innerHTML = `
    <h2 class="post-title">${escapeHtml(post.title)}</h2>
    <div class="post-meta">${meta
      .map((m) => `<span>${m}</span>`)
      .join('<span class="dot" aria-hidden="true">&middot;</span>')}</div>
    <div class="post-body">${post.html}</div>`;

  return article;
}

/* ---------- Scroll reveal ---------- */

function initReveal() {
  const targets = document.querySelectorAll("[data-reveal]:not(.is-revealed)");

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ---------- Load notes ---------- */

async function loadNotes() {
  const posts = [];

  for (const path of NOTES) {
    try {
      const res = await fetch(path);
      if (!res.ok) continue;
      const text = await res.text();

      const parsed = parseFrontMatter(text);
      let body = parsed.body;
      let title = parsed.meta.title;

      if (!title) {
        const firstLine = body.split("\n").find((line) => line.trim());
        const heading = body.match(/^\s*#\s+(.+)$/m);
        if (heading) {
          title = heading[1].trim();
          body = body.replace(/^\s*#\s+.+$/m, "");
        } else {
          title = (firstLine || path).replace(/^#{1,6}\s*/, "");
        }
      }

      const tags = parsed.meta.tags
        ? Array.isArray(parsed.meta.tags)
          ? parsed.meta.tags
          : [parsed.meta.tags]
        : [];

      posts.push({
        title,
        iso: parsed.meta.date || "",
        date: parsed.meta.date ? formatDate(parsed.meta.date) : "",
        tags,
        mins: readingTime(text),
        html: renderMarkdown(body)
      });
    } catch (err) {
      console.error(`Failed to load ${path}`, err);
    }
  }

  skeleton.remove();

  if (!posts.length) {
    empty.hidden = false;
    return;
  }

  const fragment = document.createDocumentFragment();
  posts.forEach((post, index) => fragment.appendChild(buildCard(post, index)));
  list.appendChild(fragment);

  initReveal();
}

initReveal();
loadNotes();