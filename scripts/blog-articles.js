/**
 * audiobookvalue.com - SEO Article Matrix Generator
 *
 * Generates three types of indexable articles:
 *   1. One review per book: /blog/<slug>-review.html
 *   2. Six comparisons:    /blog/<a>-vs-<b>.html
 *   3. Five how-to guides: /blog/how-to-<topic>.html
 *
 * Pure template + structured data, no API required.
 * Usage: node scripts/blog-articles.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BOOKS_PATH = path.join(ROOT, "books.json");
const BLOG_DIR = path.join(ROOT, "blog");
const TAG = "yuanyuan07-20";

function escapeHtml(str) {
  return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return String(num || 0);
}

function stars(rating) {
  const full = Math.floor(rating || 0);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

function hours(b) {
  return (b.durationMinutes / 60).toFixed(1);
}

function affiliate(asin) {
  return "https://www.amazon.com/dp/" + asin + "?tag=" + TAG + "&ref_=as_li_ss_tl";
}

const BEST_OF = [
  ["best-fantasy-audiobooks", "Best Fantasy Audiobooks"],
  ["best-litrpg-audiobooks", "Best LitRPG Audiobooks"],
  ["best-audiobooks-over-20-hours", "Best Audiobooks Over 20 Hours"],
  ["best-dark-romance-audiobooks", "Best Dark Romance Audiobooks"],
  ["best-self-improvement-audiobooks", "Best Self-Improvement Audiobooks"],
  ["best-mystery-thriller-audiobooks", "Best Mystery & Thriller Audiobooks"]
];

const COMPARISONS = [
  { a: "project-hail-mary-andy-weir", b: "the-martian-andy-weir" },
  { a: "fourth-wing-yarros", b: "a-court-of-thorns-and-roses-maas" },
  { a: "dungeon-crawler-carl-dinniman", b: "he-who-fights-with-monsters-13-shirtaloon" },
  { a: "atomic-habits-james-clear", b: "deep-work-cal-newport" },
  { a: "red-rising-pierce-brown", b: "will-of-the-many-islington" },
  { a: "verity-colleen-hoover", b: "one-by-one-mcfadden" }
];

const HOW_TOS = [
  {
    slug: "how-to-get-a-free-30-day-audible-trial",
    title: "How to Get a Free 30-Day Audible Trial",
    intro: "A free Audible trial gives you one credit, access to exclusive content, and the ability to keep your first audiobook even if you cancel. Here is how to start.",
    steps: [
      "Click any Audible link on audiobookvalue.com to open Amazon with your free-trial offer.",
      "Sign in or create a free Amazon account.",
      "Choose the 30-day free trial plan (no charge today).",
      "Download the Audible app on your phone, tablet, or computer.",
      "Use your free credit to claim a high-rated audiobook and start listening."
    ]
  },
  {
    slug: "how-to-use-audible-credits-wisely",
    title: "How to Use Audible Credits Wisely",
    intro: "One Audible credit can buy any audiobook regardless of price, so the smartest use is a long, high-rated book you will actually finish.",
    steps: [
      "Check the rating and listener count before spending a credit.",
      "Prioritize audiobooks over 10 hours to maximize value.",
      "Browse our best-of lists for proven high-value picks.",
      "Keep the audiobook even if you cancel, so choose something you want to own.",
      "Save your credit for a title you cannot get free with the trial or Plus catalog."
    ]
  },
  {
    slug: "how-to-choose-the-best-audiobook-for-one-credit",
    title: "How to Choose the Best Audiobook for One Credit",
    intro: "Choosing the best audiobook for a single credit means balancing rating, length, narrator, and your listening time.",
    steps: [
      "Decide how many hours of listening you need this month.",
      "Filter by rating (4.5+ is a strong baseline) and runtime.",
      "Read our reviews for narrator quality and pacing.",
      "Pick a genre you actually finish; a shorter favorite beats a long slog.",
      "Use the trial first so your credit is not spent before you know if you like the book."
    ]
  },
  {
    slug: "how-to-listen-to-audiobooks-on-any-device",
    title: "How to Listen to Audiobooks on Any Device",
    intro: "You can listen to your Audible library on iPhone, Android, Kindle, PC, Mac, and smart speakers.",
    steps: [
      "Install the Audible app from your device store.",
      "Sign in with the same Amazon account used for the trial.",
      "Download audiobooks for offline listening before a trip.",
      "Use the web player at audible.com for computers without an app.",
      "Sync progress across devices so you can switch seamlessly."
    ]
  },
  {
    slug: "how-to-cancel-audible-after-free-trial",
    title: "How to Cancel Audible After the Free Trial",
    intro: "You can cancel Audible during the trial and still keep any audiobooks claimed with your free credit.",
    steps: [
      "Sign in at audible.com and open Account Details.",
      "Under Membership, choose Cancel Membership.",
      "Confirm the cancellation; you keep trial credits and purchases.",
      "Your membership ends at the current billing cycle with no further charge.",
      "If you change your mind later, you can resubscribe and rejoin the trial terms available at that time."
    ]
  }
];

function pageHead(title, description, slug, jsonLd) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)} | AudibleCreditOptimizer</title>
<meta name="description" content="${escapeHtml(description)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://audiobookvalue.com/blog/${slug}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:type" content="article">
<meta property="og:url" content="https://audiobookvalue.com/blog/${slug}">
<link rel="stylesheet" href="../css/style.css">
<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
</script>
</head>
<body>`;
}

function pageFoot() {
  return `<footer class="site-footer">
  <p>© 2026 <a href="https://audiobookvalue.com">AudibleCreditOptimizer</a> — audiobookvalue.com</p>
  <p style="margin-top:8px"><a href="/">Home</a> | <a href="/blog">Blog</a> | <a href="/sitemap.xml">Sitemap</a></p>
</footer>
</body>
</html>`;
}

function header() {
  return `<header class="site-header">
  <div class="header-inner">
    <div>
      <div class="site-title"><a href="/">🎧 <span>Audible</span>CreditOptimizer</a></div>
      <div class="site-tagline">audiobookvalue.com</div>
    </div>
  </div>
</header>`;
}

function relatedLinks(book) {
  const same = books
    .filter((b) => b.asin !== book.asin && b.categories.some((c) => book.categories.includes(c)))
    .slice(0, 4);
  return `<h2>Related Audiobooks</h2><ul class="blog-links">${same.map((b) => '<li><a href="/audiobooks/' + b.slug + '">' + escapeHtml(b.title) + "</a></li>").join("\n")}</ul>`;
}

function bestOfLinks() {
  return `<h2>More Best-of Lists</h2><ul class="blog-links">${BEST_OF.map(([s, t]) => '<li><a href="/' + s + '">' + escapeHtml(t) + "</a></li>").join("\n")}</ul>`;
}

function prosCons(book) {
  const pros = ["High listener rating of " + book.rating + "/5"];
  if (book.durationMinutes >= 600) pros.push("Long runtime: " + book.duration + ", strong value per credit");
  else pros.push("Quick listen: " + book.duration);
  if (book.narrator) pros.push("Narrated by " + book.narrator);
  if ((book.tags || []).includes("series")) pros.push("Part of a series you can continue");
  if (book.listPrice <= 10) pros.push("Low list price for a no-risk trial pick");

  const cons = [];
  if (book.durationMinutes < 360) cons.push("Short runtime: " + book.duration);
  if (book.rating < 4.5) cons.push("Rating below 4.5: " + book.rating + "/5");
  if (book.needsReview) cons.push("Listener data still being verified");
  if (cons.length === 0) cons.push("Very few complaints based on rating and runtime");
  return `<h2>Pros & Cons</h2><h3>Pros</h3><ul class="blog-links">${pros.map((p) => "<li>" + escapeHtml(p) + "</li>").join("\n")}</ul><h3>Cons</h3><ul class="blog-links">${cons.map((c) => "<li>" + escapeHtml(c) + "</li>").join("\n")}</ul>`;
}

function quickFacts(book) {
  return `<h2>Quick Facts</h2>
<table class="review-table">
  <tr><th>Author</th><td>${escapeHtml(book.author)}</td></tr>
  <tr><th>Narrator</th><td>${escapeHtml(book.narrator || "N/A")}</td></tr>
  <tr><th>Rating</th><td>${book.rating}/5 (${formatNumber(book.ratingCount)} ratings)</td></tr>
  <tr><th>Duration</th><td>${book.duration} (${hours(book)} hours)</td></tr>
  <tr><th>Categories</th><td>${escapeHtml(book.categories.join(", "))}</td></tr>
  <tr><th>List Price</th><td>${book.listPrice > 0 ? "$" + book.listPrice.toFixed(2) : "Free with Plus"}</td></tr>
</table>`;
}

function generateReview(book) {
  const slug = book.slug + "-review";
  const title = book.title + " by " + book.author + " - Audiobook Review";
  const desc = "Read our review of " + book.title + " by " + book.author + ": " + book.rating + "/5 stars, " + hours(book) + " hours, narrated by " + (book.narrator || "the author") + ".";
  const q = book.questions || {};
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Book",
      "name": book.title,
      "author": book.author,
      "audioFormat": "Audiobook",
      "duration": "PT" + book.durationMinutes + "M"
    },
    "reviewRating": { "@type": "Rating", "ratingValue": book.rating, "bestRating": "5", "ratingCount": book.ratingCount },
    "author": { "@type": "Organization", "name": "AudibleCreditOptimizer" }
  };
  const questions = [
    ["What is this audiobook?", q.q1],
    ["Who is it for?", q.q2],
    ["When should you listen?", q.q3],
    ["What makes it different?", q.q4],
    ["Can you start today?", q.q5]
  ].filter(([, a]) => a).map(([t, a]) => `<h2>${escapeHtml(t)}</h2><p>${escapeHtml(a)}</p>`).join("\n");

  return pageHead(title, desc, slug, jsonLd) + header() + `
<main class="book-detail">
  <h1>${escapeHtml(title)}</h1>
  <p class="author"><a href="/blog">Blog Index</a> · <a href="/audiobooks/${book.slug}">View Audiobook Page</a></p>
  ${quickFacts(book)}
  <h2>Overview</h2><p>${escapeHtml(book.description)}</p>
  ${questions}
  ${prosCons(book)}
  <div style="text-align:center;margin-top:24px;padding:20px;background:#fef3c7;border-radius:8px">
    <p style="margin-bottom:12px">Get ${escapeHtml(book.title)} free with a 30-day Audible trial.</p>
    <a href="${affiliate(book.asin)}" class="detail-cta" target="_blank" rel="nofollow sponsored">Start Free Trial & Download</a>
  </div>
  ${relatedLinks(book)}
  ${bestOfLinks()}
</main>` + pageFoot();
}

function generateComparison(a, b) {
  const slug = a.slug + "-vs-" + b.slug;
  const title = a.title + " vs " + b.title + " - Which Audiobook Should You Pick?";
  const desc = "Compare " + a.title + " and " + b.title + " by rating, runtime, narrator, and value to decide which audiobook to spend a credit on.";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "author": { "@type": "Organization", "name": "AudibleCreditOptimizer" }
  };
  const pickText = (a.rating >= b.rating ? a.title : b.title) + " wins on rating (" + Math.max(a.rating, b.rating) + "/5), while " + (a.durationMinutes >= b.durationMinutes ? a.title : b.title) + " gives more listening time (" + Math.max(hours(a), hours(b)) + "h).";
  return pageHead(title, desc, slug, jsonLd) + header() + `
<main class="book-detail">
  <h1>${escapeHtml(title)}</h1>
  <p class="author"><a href="/blog">Blog Index</a></p>
  <h2>Comparison Table</h2>
  <table class="review-table">
    <tr><th></th><th><a href="/audiobooks/${a.slug}">${escapeHtml(a.title)}</a></th><th><a href="/audiobooks/${b.slug}">${escapeHtml(b.title)}</a></th></tr>
    <tr><td>Author</td><td>${escapeHtml(a.author)}</td><td>${escapeHtml(b.author)}</td></tr>
    <tr><td>Narrator</td><td>${escapeHtml(a.narrator || "N/A")}</td><td>${escapeHtml(b.narrator || "N/A")}</td></tr>
    <tr><td>Rating</td><td>${a.rating}/5</td><td>${b.rating}/5</td></tr>
    <tr><td>Duration</td><td>${a.duration}</td><td>${b.duration}</td></tr>
    <tr><td>Categories</td><td>${escapeHtml(a.categories.join(", "))}</td><td>${escapeHtml(b.categories.join(", "))}</td></tr>
    <tr><td>List Price</td><td>${a.listPrice > 0 ? "$" + a.listPrice.toFixed(2) : "Free"}</td><td>${b.listPrice > 0 ? "$" + b.listPrice.toFixed(2) : "Free"}</td></tr>
  </table>
  <h2>Which Should You Pick?</h2><p>${escapeHtml(pickText)} Read the full reviews: <a href="/blog/${a.slug}-review">${escapeHtml(a.title)}</a> and <a href="/blog/${b.slug}-review">${escapeHtml(b.title)}</a>.</p>
  <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:20px">
    <a href="${affiliate(a.asin)}" class="detail-cta" target="_blank" rel="nofollow sponsored">Try ${escapeHtml(a.title)}</a>
    <a href="${affiliate(b.asin)}" class="detail-cta" target="_blank" rel="nofollow sponsored">Try ${escapeHtml(b.title)}</a>
  </div>
  ${bestOfLinks()}
</main>` + pageFoot();
}

function generateHowTo(how) {
  const title = how.title;
  const desc = how.intro;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "description": desc,
    "step": how.steps.map((s) => ({ "@type": "HowToStep", "text": s }))
  };
  const steps = how.steps.map((s, i) => `<li><strong>Step ${i + 1}:</strong> ${escapeHtml(s)}</li>`).join("\n");
  return pageHead(title, desc, how.slug, jsonLd) + header() + `
<main class="book-detail">
  <h1>${escapeHtml(title)}</h1>
  <p class="author"><a href="/blog">Blog Index</a></p>
  <p>${escapeHtml(desc)}</p>
  <ol class="blog-links">${steps}</ol>
  <div style="text-align:center;margin-top:24px;padding:20px;background:#fef3c7;border-radius:8px">
    <p style="margin-bottom:12px">Start a free 30-day Audible trial and keep your first audiobook.</p>
    <a href="https://www.amazon.com/gp/audible/ref=audible_affiliate?tag=${TAG}&linkCode=il2" class="detail-cta" target="_blank" rel="nofollow sponsored">Start Free Trial</a>
  </div>
  ${bestOfLinks()}
</main>` + pageFoot();
}

let books = [];

function main() {
  books = JSON.parse(fs.readFileSync(BOOKS_PATH, "utf-8")).books || [];
  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });
  const bySlug = new Map(books.map((b) => [b.slug, b]));

  let reviews = 0;
  for (const book of books) {
    fs.writeFileSync(path.join(BLOG_DIR, book.slug + "-review.html"), generateReview(book), "utf-8");
    reviews++;
  }

  let comparisons = 0;
  for (const pair of COMPARISONS) {
    const a = bySlug.get(pair.a);
    const b = bySlug.get(pair.b);
    if (!a || !b) continue;
    fs.writeFileSync(path.join(BLOG_DIR, a.slug + "-vs-" + b.slug + ".html"), generateComparison(a, b), "utf-8");
    comparisons++;
  }

  let howtos = 0;
  for (const how of HOW_TOS) {
    fs.writeFileSync(path.join(BLOG_DIR, how.slug + ".html"), generateHowTo(how), "utf-8");
    howtos++;
  }

  console.log("Generated " + reviews + " reviews, " + comparisons + " comparisons, " + howtos + " how-to articles.");
}

main();
