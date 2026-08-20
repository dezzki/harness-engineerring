const NOTES = [
  "notes/blog-1.md",
  "notes/blog-2.md",
  "notes/blog-3.md"
];

const BRAND = "Harness Notes";

let posts = [];
let loaded = false;

const $ = (sel, root = document) => root.querySelector(sel);

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, ch => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[ch]));
}

function parseDate(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value).trim());
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDate(d) {
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function truncate(str, max) {
  if (str.length <= max) return str;
  const cut = str.slice(0, max);
  const i = cut.lastIndexOf(" ");
  return (i > max * 0.6 ? cut.slice(0, i) : cut).trimEnd() + "…";
}

function parseFrontmatter(text) {
  const meta = {};
  const lists = {};
  let body = text;
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (m) {
    body = text.slice(m[0].length);
    let key = null;
    for (const raw of m[1].split(/\r?\n/)) {
      const line = raw.trim();
      if (!line) continue;
      const kv = /^([A-Za-z-]+):\s*(.*)$/.exec(line);
      if (kv) {
        key = kv[1];
        const value = kv[2].trim();
        meta[key] = value;
        lists[key] = value ? [value] : [];
      } else if (key && /^-\s+/.test(line)) {
        (lists[key] = lists[key] || []).push(line.replace(/^-\s+/, "").trim());
      }
    }
    for (const k of Object.keys(lists)) {
      meta[k] = lists[k].length === 1 ? lists[k][0] : lists[k];
    }
  }
  return { meta, body };
}

function renderInline(text) {
  let html = escapeHtml(text);
  const codes = [];
  html = html.replace(/`([^`]+)`/g, (_, code) => {
    codes.push(code);
    return "\u0000C" + (codes.length - 1) + "\u0000";
  });
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  html = html.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');
  html = html.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" rel="noopener">$1</a>');
  html = html.replace(/\u0000C(\d+)\u0000/g, (_, i) => "<code>" + codes[Number(i)] + "</code>");
  return html;
}

function renderBlocks(body) {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let para = [];
  let i = 0;

  const flush = () => {
    if (para.length) {
      out.push("<p>" + para.map(l => renderInline(l.trim())).join(" ") + "</p>");
      para = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (/^\s*```/.test(line)) {
      flush();
      const buf = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      out.push("<pre><code>" + escapeHtml(buf.join("\n")) + "</code></pre>");
      continue;
    }

    const h = /^(#{1,3})\s+(.+)$/.exec(trimmed);
    if (h) {
      flush();
      const tag = "h" + h[1].length;
      out.push("<" + tag + ">" + renderInline(h[2]) + "</" + tag + ">");
      i++;
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
      flush();
      out.push("<hr>");
      i++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      flush();
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      out.push("<blockquote>" + buf.map(l => renderInline(l.trim())).join(" ") + "</blockquote>");
      continue;
    }

    const isUl = /^[-*]\s+/.test(trimmed);
    const isOl = /^\d+\.\s+/.test(trimmed);
    if (isUl || isOl) {
      flush();
      const tag = isUl ? "ul" : "ol";
      const re = isUl ? /^[-*]\s+(.+)$/ : /^\d+\.\s+(.+)$/;
      const items = [];
      while (i < lines.length) {
        const m = re.exec(lines[i].trim());
        if (!m) break;
        items.push("<li>" + renderInline(m[1]) + "</li>");
        i++;
      }
      out.push("<" + tag + ">" + items.join("") + "</" + tag + ">");
      continue;
    }

    if (!trimmed) {
      flush();
      i++;
      continue;
    }

    para.push(line);
    i++;
  }

  flush();
  return out.join("\n");
}

function derivePost(id, text) {
  const { meta, body } = parseFrontmatter(text);
  const trimmed = body.trim();

  let title = meta.title || "";
  if (!title) {
    const h = /^#\s+(.+)$/m.exec(trimmed);
    title = h ? h[1].trim() : (trimmed.split("\n").find(l => l.trim()) || id).trim();
  }

  let excerpt = meta.description || "";
  if (!excerpt) {
    const para = trimmed.split(/\n\s*\n/).map(p => p.trim()).find(p => p && !/^[-#>*`\d.]/.test(p));
    excerpt = para ? truncate(para.replace(/\n/g, " "), 160) : "";
  }

  const date = meta.date ? parseDate(meta.date) : null;
  const tags = Array.isArray(meta.tags) ? meta.tags : meta.tags ? [meta.tags] : [];
  const words = trimmed.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(words / 200));

  return {
    id,
    title,
    excerpt,
    date,
    tags,
    readingTime,
    html: renderBlocks(body)
  };
}

async function loadPosts() {
  setStatus("Loading notes…");
  const results = await Promise.all(NOTES.map(async path => {
    try {
      const res = await fetch(path);
      if (!res.ok) return null;
      const text = await res.text();
      const id = path.replace(/^.*\//, "").replace(/\.md$/, "");
      return derivePost(id, text);
    } catch {
      return null;
    }
  }));
  posts = results.filter(Boolean);
  loaded = true;
  return posts;
}

function parseRoute(hash) {
  const h = hash || "#/";
  if (h === "#/") return { name: "list" };
  const m = /^#\/notes\/([^/]+)$/.exec(h);
  if (m) return { name: "article", id: decodeURIComponent(m[1]) };
  return { name: "anchor" };
}

function tagsHtml(tags) {
  if (!tags.length) return "";
  return '<ul class="tags" aria-label="Tags">' + tags.map(t => `<li class="tag">${escapeHtml(t)}</li>`).join("") + "</ul>";
}

function metaLine(post) {
  const parts = [post.date ? formatDate(post.date) : null, `${post.readingTime} min read`].filter(Boolean);
  return parts.map((p, i) => i ? `<span class="meta-dot" aria-hidden="true">·</span>${p}` : p).join("");
}

function cardHtml(post, i) {
  return `
    <article class="card reveal" style="--d:${Math.min(i, 5) * 70}ms">
      ${tagsHtml(post.tags)}
      <h3 class="card-title"><a class="card-link" href="#/notes/${encodeURIComponent(post.id)}">${escapeHtml(post.title)}</a></h3>
      <p class="card-excerpt">${escapeHtml(post.excerpt)}</p>
      <div class="card-meta">${metaLine(post)}</div>
    </article>`;
}

function renderList(view) {
  const grid = posts.length ? posts.map(cardHtml).join("") : "";
  view.innerHTML = `
    <section class="view">
      <section class="hero">
        <div class="hero-inner">
          <span class="eyebrow reveal" style="--d:0ms">A personal notebook</span>
          <h1 class="reveal" style="--d:70ms">Notes on <span class="grad">harness engineering</span></h1>
          <p class="hero-sub reveal" style="--d:140ms">What I learn while making AI coding agents reliable — one harness, one failure, one fix at a time.</p>
          <div class="hero-actions reveal" style="--d:210ms">
            <a class="btn btn-primary" href="#notes">Read the notes</a>
          </div>
        </div>
      </section>
      <section class="section" id="notes">
        <div class="section-inner">
          <header class="section-head reveal" style="--d:280ms">
            <h2>Notes</h2>
            <p>Recent writing from the notebook.</p>
          </header>
          <div class="notes-grid">${grid}</div>
        </div>
      </section>
    </section>`;
  document.title = BRAND;
}

function renderArticle(view, post) {
  view.innerHTML = `
    <section class="view">
      <article class="article">
        <header class="article-head reveal">
          <a class="back-link" href="#/">← All notes</a>
          <h1>${escapeHtml(post.title)}</h1>
          <div class="article-meta">${metaLine(post)}</div>
          ${tagsHtml(post.tags)}
        </header>
        <div class="prose reveal" style="--d:70ms">${post.html}</div>
        <footer class="article-foot reveal" style="--d:140ms">
          <a class="btn btn-secondary" href="#/">Back to all notes</a>
        </footer>
      </article>
    </section>`;
  document.title = `${post.title} — ${BRAND}`;
}

function renderError(view) {
  if (!view) return;
  view.innerHTML = `
    <section class="view">
      <section class="status">
        <h2>Couldn't load the notes</h2>
        <p>This page needs a local server — opening it directly from the filesystem blocks fetching. Serve this folder over HTTP and try again.</p>
        <button class="btn btn-primary" type="button" id="retry">Try again</button>
      </section>
    </section>`;
  const retry = $("#retry", view);
  if (retry) retry.addEventListener("click", () => window.location.reload());
}

function renderNotFound(view) {
  view.innerHTML = `
    <section class="view">
      <section class="status">
        <h2>Note not found</h2>
        <p>That note isn't in this notebook. Head back to the full list.</p>
        <a class="btn btn-primary" href="#/">Back to all notes</a>
      </section>
    </section>`;
  document.title = `Note not found — ${BRAND}`;
}

function renderLoading(route) {
  const view = $("#view");
  if (!view) return;
  if (route.name === "article") {
    view.innerHTML = `
      <section class="view">
        <div class="article skeleton-article" aria-hidden="true">
          <div class="skeleton-line skeleton-back"></div>
          <div class="skeleton-line skeleton-headline"></div>
          <div class="skeleton-line skeleton-meta-line"></div>
          <div class="skeleton-lines">
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
          </div>
        </div>
      </section>`;
    return;
  }
  view.innerHTML = `
    <section class="view">
      <section class="hero">
        <div class="hero-inner">
          <span class="eyebrow">A personal notebook</span>
          <h1>Notes on <span class="grad">harness engineering</span></h1>
          <p class="hero-sub">What I learn while making AI coding agents reliable — one harness, one failure, one fix at a time.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#notes">Read the notes</a>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="section-inner">
          <header class="section-head">
            <h2>Notes</h2>
            <p>Recent writing from the notebook.</p>
          </header>
          <div class="notes-grid" aria-hidden="true">
            ${Array.from({ length: NOTES.length }, () => `
              <div class="card skeleton-card">
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-lines">
                  <div class="skeleton-line"></div>
                  <div class="skeleton-line"></div>
                  <div class="skeleton-line"></div>
                </div>
                <div class="skeleton-line skeleton-meta"></div>
              </div>`).join("")}
          </div>
        </div>
      </section>
    </section>`;
}

function updateNav(current) {
  document.querySelectorAll(".nav-links a, .footer-links a").forEach(a => {
    if (a.getAttribute("href") === current) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
}

function toggleReadingBar(active) {
  const bar = $(".reading-bar");
  if (!bar) return;
  bar.classList.toggle("visible", active);
  updateReadingBar(bar);
}

function updateReadingBar(bar) {
  const el = bar || $(".reading-bar");
  if (!el || !el.classList.contains("visible")) return;
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1;
  el.style.transform = `scaleX(${progress})`;
}

function setupReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const els = document.querySelectorAll(".reveal:not(.in-view)");
  if (!("IntersectionObserver" in window)) {
    els.forEach(el => el.classList.add("in-view"));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  els.forEach(el => io.observe(el));
}

function renderRoute(route) {
  const view = $("#view");
  if (!view) return;
  const post = route.name === "article" ? posts.find(p => p.id === route.id) : null;
  toggleReadingBar(!!post);
  updateNav(route.name === "list" ? "#/" : route.name === "article" ? `#/notes/${route.id}` : "#/");

  if (route.name === "list") {
    renderList(view);
    window.scrollTo(0, 0);
  } else if (route.name === "article") {
    if (post) renderArticle(view, post);
    else renderNotFound(view);
    window.scrollTo(0, 0);
  } else {
    renderList(view);
    if (location.hash === "#notes") {
      const target = document.getElementById("notes");
      if (target) target.scrollIntoView();
    }
  }
  setupReveal();
}

function setStatus(message) {
  const status = $("#status");
  if (status) status.textContent = message;
}

function setupInteractions() {
  const nav = $(".site-nav");
  if (nav) {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          nav.classList.toggle("is-scrolled", window.scrollY > 8);
          updateReadingBar();
          ticking = false;
        });
      }
    }, { passive: true });
  }

  const toggle = $(".nav-toggle");
  const menu = $("#site-menu");
  if (toggle && menu) {
    const closeMenu = restoreFocus => {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      if (restoreFocus) toggle.focus();
    };
    toggle.addEventListener("click", () => {
      const open = !document.body.classList.contains("nav-open");
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) closeMenu(true);
    });
    menu.addEventListener("click", e => {
      if (e.target.closest("a")) closeMenu(false);
    });
  }

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
}

function init() {
  setupInteractions();
  const route = parseRoute(location.hash);
  renderLoading(route);
  loadPosts().then(() => {
    if (!posts.length) {
      renderError($("#view"));
      setStatus("Couldn't load the notes.");
      return;
    }
    setStatus("Notes loaded.");
    renderRoute(parseRoute(location.hash));
  });
}

window.addEventListener("hashchange", () => {
  const route = parseRoute(location.hash);
  if (route.name === "anchor") return;
  if (loaded) renderRoute(route);
  else renderLoading(route);
});

init();