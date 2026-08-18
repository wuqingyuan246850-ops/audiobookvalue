/**
 * audiobookvalue.com - Automatic Blog Post Generator
 *
 * Detects daily changes (new books, on-sale toggles, price drops) and
 * generates one template article per day under /blog. No OpenAI API needed.
 *
 * Usage: node scripts/blog-post.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BOOKS_PATH = path.join(ROOT, "books.json");
const BLOG_DIR = path.join(ROOT, "blog");
const STATE_PATH = path.join(ROOT, "scripts", "blog-state.json");
const TAG = "yuanyuan07-20";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function escapeHtml(str) {
  return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function affiliateLink(asin) {
  return "https://www.amazon.com/dp/" + asin + "?tag=" + TAG + "&ref_=as_li_ss_tl";
}

function loadState() {
  if (fs.existsSync(STATE_PATH)) return JSON.parse(fs.readFileSync(STATE_PATH, "utf-8"));
  return { lastDate: "", seenAsins: [], priceMap: {}, onSaleMap: {}, changesToday: { newAsins: [], onSaleAsins: [], priceDropAsins: [], removedAsins: [] } };
}

function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

function articleSlug(date) {
  return date + "-audiobook-deals";
}

function bookCard(book) {
  const durationHrs = (book.durationMinutes / 60).toFixed(1);
  return `<div class="book-card">
    <div class="book-card-inner">
      <img class="book-cover" src="${book.coverUrl}" alt="${escapeHtml(book.title)}" loading="lazy" onerror="this.src='/images/placeholder.svg'">
      <div class="book-info">
        <a href="/audiobooks/${book.slug}" class="book-title">${escapeHtml(book.title)}</a>
        <div class="book-author">by ${escapeHtml(book.author)}</div>
        <div class="book-meta">
          <div class="book-rating"><span class="stars">${"★".repeat(Math.floor(book.rating))}${"☆".repeat(5 - Math.floor(book.rating))}</span><span>${book.rating}</span></div>
          <div class="book-duration">${durationHrs}h (${book.duration})</div>
        </div>
        <div class="book-price-info">
          ${book.onSale ? '<span class="on-sale">ON SALE</span>' : ""}
          ${book.audiblePrice === 0 ? '<span class="price-free">Free with Trial</span>' : ""}
          ${book.listPrice > 0 ? '<span class="price-list">$' + book.listPrice.toFixed(2) + "</span>" : ""}
        </div>
      </div>
    </div>
    <a href="${affiliateLink(book.asin)}" class="book-cta" target="_blank" rel="nofollow sponsored">Start Free Trial & Get This Book</a>
  </div>`;
}

const BEST_OF_PAGES = [
  ["best-fantasy-audiobooks", "Best Fantasy Audiobooks"],
  ["best-litrpg-audiobooks", "Best LitRPG Audiobooks"],
  ["best-audiobooks-over-20-hours", "Best Audiobooks Over 20 Hours"],
  ["best-dark-romance-audiobooks", "Best Dark Romance Audiobooks"],
  ["best-self-improvement-audiobooks", "Best Self-Improvement Audiobooks"],
  ["best-mystery-thriller-audiobooks", "Best Mystery & Thriller Audiobooks"]
];

function generateArticle(date, changes, booksByAsin) {
  const slug = articleSlug(date);
  const title = "New Audiobook Deals & Discoveries - " + date;

  const newBooks = (changes.newAsins || []).map((a) => booksByAsin.get(a)).filter(Boolean);
  const onSaleBooks = (changes.onSaleAsins || []).map((a) => booksByAsin.get(a)).filter(Boolean);
  const priceDropBooks = (changes.priceDropAsins || []).map((a) => booksByAsin.get(a)).filter(Boolean);

  const newSection = newBooks.length
    ? `<h2>New Audiobooks Added</h2><div class="book-grid">${newBooks.map(bookCard).join("\n")}</div>`
    : "";
  const saleSection = onSaleBooks.length
    ? `<h2>On Sale Now</h2><div class="book-grid">${onSaleBooks.map(bookCard).join("\n")}</div>`
    : "";
  const dropSection = priceDropBooks.length
    ? `<h2>Price Drops Worth a Credit</h2><div class="book-grid">${priceDropBooks.map(bookCard).join("\n")}</div>`
    : "";
  const removedNote = changes.removedAsins && changes.removedAsins.length
    ? `<p>${changes.removedAsins.length} titles were removed because they are no longer available on Amazon.</p>`
    : "";

  const editorPicks = `<h2>Editor Picks</h2><ul class="blog-links">
    ${BEST_OF_PAGES.map(([s, t]) => '<li><a href="/' + s + '">' + escapeHtml(t) + "</a></li>").join("\n")}
  </ul>`;

  const intro = "Every day we check thousands of Audible audiobooks for new releases, price drops, and the best value per credit. Here is what changed today at audiobookvalue.com.";

  const body = [intro, newSection, saleSection, dropSection, removedNote, editorPicks].filter(Boolean).join("\n");
  const bodyText = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)} | AudibleCreditOptimizer</title>
<meta name="description" content="Today's new audiobook releases, price drops, and deals. ${newBooks.length} new titles added, ${onSaleBooks.length} on sale.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://audiobookvalue.com/blog/${slug}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:type" content="article">
<meta property="og:url" content="https://audiobookvalue.com/blog/${slug}">
<link rel="stylesheet" href="../css/style.css">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": ${JSON.stringify(title)},
  "datePublished": "${date}",
  "dateModified": "${date}",
  "author": { "@type": "Organization", "name": "AudibleCreditOptimizer" },
  "publisher": { "@type": "Organization", "name": "AudibleCreditOptimizer" },
  "mainEntityOfPage": "https://audiobookvalue.com/blog/${slug}",
  "articleBody": ${JSON.stringify(bodyText)}
}
</script>
</head>
<body>
<header class="site-header">
  <div class="header-inner">
    <div>
      <div class="site-title"><a href="/">🎧 <span>Audible</span>CreditOptimizer</a></div>
      <div class="site-tagline">audiobookvalue.com</div>
    </div>
  </div>
</header>
<main class="book-detail">
  <h1>${escapeHtml(title)}</h1>
  <p class="author">Published ${date} · <a href="/blog">Blog Index</a></p>
  <p>${escapeHtml(intro)}</p>
${body}
  <p style="margin-top:24px;font-size:.8rem;color:#6b7280">As an Amazon Associate we earn from qualifying purchases. When you sign up for a free trial through our links, we may earn a commission.</p>
</main>
<footer class="site-footer">
  <p>© 2026 <a href="https://audiobookvalue.com">AudibleCreditOptimizer</a> — audiobookvalue.com</p>
  <p style="margin-top:8px"><a href="/">Home</a> | <a href="/blog">Blog</a> | <a href="/sitemap.xml">Sitemap</a></p>
</footer>
</body>
</html>`;
}

function main() {
  const books = JSON.parse(fs.readFileSync(BOOKS_PATH, "utf-8")).books || [];
  const booksByAsin = new Map(books.map((b) => [b.asin, b]));
  const currentAsins = new Set(books.map((b) => b.asin));
  const now = today();
  const state = loadState();
  const isFirstRun = !state.lastDate;

  if (state.lastDate !== now) {
    state.lastDate = now;
    state.changesToday = { newAsins: [], onSaleAsins: [], priceDropAsins: [], removedAsins: [] };
  }
  state.priceMap = state.priceMap || {};
  state.onSaleMap = state.onSaleMap || {};
  state.seenAsins = state.seenAsins || [];

  const seen = new Set(state.seenAsins);
  const newAsins = books.filter((b) => !seen.has(b.asin)).map((b) => b.asin);
  const removedAsins = state.seenAsins.filter((a) => !currentAsins.has(a));
  const onSaleAsins = books.filter((b) => state.onSaleMap[b.asin] !== !!b.onSale).map((b) => b.asin);
  const priceDropAsins = books.filter((b) => state.priceMap[b.asin] != null && b.listPrice > 0 && b.listPrice < state.priceMap[b.asin]).map((b) => b.asin);

  state.changesToday.newAsins = Array.from(new Set(state.changesToday.newAsins.concat(newAsins)));
  state.changesToday.onSaleAsins = Array.from(new Set(state.changesToday.onSaleAsins.concat(onSaleAsins)));
  state.changesToday.priceDropAsins = Array.from(new Set(state.changesToday.priceDropAsins.concat(priceDropAsins)));
  state.changesToday.removedAsins = removedAsins;

  state.seenAsins = Array.from(currentAsins);
  state.priceMap = Object.fromEntries(books.map((b) => [b.asin, b.listPrice || 0]));
  state.onSaleMap = Object.fromEntries(books.map((b) => [b.asin, !!b.onSale]));
  saveState(state);

  const changed = newAsins.length || onSaleAsins.length || priceDropAsins.length || removedAsins.length;
  if (isFirstRun) {
    console.log("Baseline initialized (" + books.length + " books); no blog post today.");
    return;
  }
  if (!changed) {
    console.log("No changes; no blog post today.");
    return;
  }

  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });
  const file = path.join(BLOG_DIR, articleSlug(now) + ".html");
  fs.writeFileSync(file, generateArticle(now, state.changesToday, booksByAsin), "utf-8");
  console.log("Blog post generated: blog/" + articleSlug(now) + ".html");
}

main();
