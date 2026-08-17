/**
 * audiobookvalue.com - Static Page Generator
 * 
 * Reads books.json and generates:
 * 1. Individual audiobook landing pages (/audiobooks/[slug].html)
 * 2. sitemap.xml
 * 
 * Usage: node scripts/generate.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TAG = "yuanyuan07-20";

// Load data
const data = JSON.parse(fs.readFileSync(path.join(ROOT, "books.json"), "utf-8"));
const { books, categories, site } = data;

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}

function buildAffiliateLink(asin) {
  return "https://www.amazon.com/dp/" + asin + "?tag=" + TAG + "&ref_=as_li_ss_tl";
}

// Best-of roundup definitions used to generate SEO listing pages.
const BEST_OF_PAGES = [
  {
    slug: "best-fantasy-audiobooks",
    title: "Best Fantasy Audiobooks on Audible",
    description: "High-rated fantasy audiobooks worth an Audible credit, ranked by listener rating across epic fantasy, romantasy, and dragon-heavy series.",
    filter: (b) => b.categories.includes("fantasy") || b.categories.includes("fiction"),
    sort: (a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount,
    limit: 12
  },
  {
    slug: "best-litrpg-audiobooks",
    title: "Best LitRPG Audiobooks on Audible",
    description: "The best LitRPG and progression fantasy audiobooks, from Dungeon Crawler Carl to wholesome monster-raising adventures.",
    filter: (b) => (b.tags || []).includes("litrpg") || /litrpg/i.test(b.title),
    sort: (a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount,
    limit: 12
  },
  {
    slug: "best-audiobooks-over-20-hours",
    title: "Best Audible Audiobooks Over 20 Hours",
    description: "The best value audiobooks on Audible: long, high-rated listens that give you weeks of listening for one credit.",
    filter: (b) => b.durationMinutes >= 1200,
    sort: (a, b) => b.durationMinutes - a.durationMinutes || b.rating - a.rating,
    limit: 12
  },
  {
    slug: "best-dark-romance-audiobooks",
    title: "Best Dark Romance Audiobooks on Audible",
    description: "The most talked-about dark romance audiobooks, with possessive heroes, high heat, and unforgettable narrators.",
    filter: (b) => (b.tags || []).includes("dark-romance"),
    sort: (a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount,
    limit: 12
  },
  {
    slug: "best-self-improvement-audiobooks",
    title: "Best Self-Improvement Audiobooks on Audible",
    description: "The best self-development audiobooks for habits, mindset, productivity, and emotional resilience, ranked by rating.",
    filter: (b) => b.categories.includes("self-improvement"),
    sort: (a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount,
    limit: 12
  },
  {
    slug: "best-mystery-thriller-audiobooks",
    title: "Best Mystery and Thriller Audiobooks on Audible",
    description: "The best mystery, thriller, and suspense audiobooks, from domestic thrillers to hard-boiled detective stories.",
    filter: (b) => b.categories.includes("mystery-thriller"),
    sort: (a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount,
    limit: 12
  }
];

const BEST_OF_BY_CATEGORY = {
  fantasy: "best-fantasy-audiobooks",
  "self-improvement": "best-self-improvement-audiobooks",
  "mystery-thriller": "best-mystery-thriller-audiobooks"
};

function formatNumber(num) {
  if (num >= 1000000) return (num/1000000).toFixed(1) + "M";
  if (num >= 1000) return (num/1000).toFixed(1) + "K";
  return num.toString();
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Static book card used on the homepage so crawlers see links without JS.
function generateBookCard(book) {
  const affiliateLink = buildAffiliateLink(book.asin);
  const durationHrs = (book.durationMinutes / 60).toFixed(1);
  const safeTitle = escapeHtml(book.title);
  return `
    <div class="book-card" data-asin="${book.asin}" data-categories="${book.categories.join(",")}" data-rating="${book.rating}" data-duration="${book.durationMinutes}">
      <div class="book-card-inner">
        <img class="book-cover" src="${book.coverUrl}" alt="${safeTitle}" loading="lazy" onerror="this.src='images/placeholder.svg'">
        <div class="book-info">
          <a href="audiobooks/${book.slug}" class="book-title">${safeTitle}</a>
          <div class="book-author">by ${escapeHtml(book.author)}</div>
          <div class="book-meta">
            <div class="book-rating">
              <span class="stars">${renderStars(book.rating)}</span>
              <span>${book.rating}</span>
            </div>
            <div class="book-duration">${durationHrs}h (${book.duration})</div>
          </div>
          <div class="book-price-info">
            ${book.onSale ? '<span class="on-sale">ON SALE</span>' : ''}
            ${book.audiblePrice === 0 ? '<span class="price-free">Free with Trial</span>' : ''}
            ${book.listPrice > 0 ? '<span class="price-list">$' + book.listPrice.toFixed(2) + '</span>' : ''}
            <span class="price-credit">1 Credit</span>
          </div>
        </div>
      </div>
      <a href="${affiliateLink}" class="book-cta" target="_blank" rel="nofollow sponsored">Start Free Trial & Get This Book</a>
    </div>`;
}

// Homepage is statically generated so Google can follow internal links without JS.
function generateHomePage() {
  const cards = books.map(generateBookCard).join("\n");
  const tags = ['<span class="filter-tag active" data-category="all">All</span>'].concat(
    categories.map((cat) => `<span class="filter-tag" data-category="${cat.id}">${cat.icon} ${escapeHtml(cat.name)}</span>`)
  ).join("\n");
  const avgRating = (books.reduce((s, b) => s + b.rating, 0) / books.length).toFixed(1);
  const totalHours = Math.round(books.reduce((s, b) => s + b.durationMinutes, 0) / 60);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AudibleCreditOptimizer - Best Value Audiobooks | Maximize Your Audible Credits</title>
<meta name="description" content="Find the best value Audible audiobooks. ${books.length} curated audiobooks with ratings, lengths, and free-trial links. Compare high-value audiobooks and never waste a credit.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://audiobookvalue.com/">
<meta property="og:title" content="AudibleCreditOptimizer - Best Value Audiobooks">
<meta property="og:description" content="${books.length} curated high-value audiobooks. Top-rated, long-duration books updated daily.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://audiobookvalue.com/">
<link rel="stylesheet" href="css/style.css">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AudibleCreditOptimizer",
  "url": "https://audiobookvalue.com/",
  "description": "Find the best value Audible audiobooks. Maximize your credits with our curated recommendations."
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
    <div style="font-size:.8rem;color:#9ca3af">🏷️ Every link supports your free trial</div>
  </div>
</header>

<section class="hero">
  <h1>Maximize Every <span>Audible Credit</span></h1>
  <p>Curated recommendations of the highest-rated, longest-duration audiobooks. ${books.length} titles analyzed so you never waste another credit.</p>
  <div class="hero-stats">
    <div><strong id="stat-books">${books.length}</strong>Curated Audiobooks</div>
    <div><strong id="stat-rating">${avgRating}</strong>Avg Rating</div>
    <div><strong id="stat-hours">${totalHours}+</strong>Hours of Listening</div>
  </div>
</section>

<div class="controls">
  <input type="text" id="search-box" class="search-box" placeholder="Search audiobooks by title, author...">
  <select id="sort-select" class="sort-select">
    <option value="rating">Sort by Rating</option>
    <option value="duration">Sort by Duration (Longest)</option>
    <option value="title">Sort by Title A-Z</option>
    <option value="rating-count">Sort by Popularity</option>
  </select>
</div>

<div id="filter-tags" class="filter-tags">
${tags}
</div>
<div class="results-count" id="results-count">Showing ${books.length} of ${books.length} audiobooks</div>

<div id="book-grid" class="book-grid">
${cards}
</div>

<footer class="site-footer">
  <p>© 2026 <a href="https://audiobookvalue.com">AudibleCreditOptimizer</a> — audiobookvalue.com</p>
  <p style="margin-top:8px">
    ${BEST_OF_PAGES.map((p) => '<a href="' + p.slug + '">' + escapeHtml(p.title.replace(" on Audible", "")) + '</a>').join(" | ")}
  </p>
  <p>We participate in the Amazon Services LLC Associates Program. <span id="affiliate-disclaimer">${escapeHtml(site.affiliateDisclaimer)}</span></p>
  <p style="margin-top:8px"><a href="/">Home</a> | <a href="sitemap.xml">Sitemap</a></p>
</footer>

<script src="js/app.js"></script>
</body>
</html>`;
}

// Personalized why-listen block to strengthen page uniqueness.
function buildWhyListen(book) {
  const durationHrs = (book.durationMinutes / 60).toFixed(1);
  const catNames = book.categories.map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(", ");
  return `<div class="why-listen">
    <h2>Why audiobook listeners choose ${escapeHtml(book.title)}</h2>
    <p>${escapeHtml(book.title)} by ${escapeHtml(book.author)} gives you ${durationHrs} hours of ${catNames} storytelling, narrated by ${escapeHtml(book.narrator)}, with a ${book.rating}/5 listener rating. It is free to start with a 30-day Audible trial, so you can try it before spending a credit.</p>
  </div>`;
}

// Related books section creates internal links between pages.
function buildRelatedSection(book) {
  const related = books
    .filter((b) => b.asin !== book.asin && b.categories.some((c) => book.categories.includes(c)))
    .slice(0, 6);
  const fill = books.filter((b) => b.asin !== book.asin && !related.includes(b)).slice(0, 6 - related.length);
  const picks = related.concat(fill);
  if (picks.length === 0) return "";
  const bestOfLink = Object.keys(BEST_OF_BY_CATEGORY)
    .filter((cat) => book.categories.includes(cat))
    .map((cat) => '<a href="/' + BEST_OF_BY_CATEGORY[cat] + '">View the best ' + cat.replace("-", " ") + ' audiobooks →</a>')
    .join(" · ");
  return `<div class="related-section">
    <h2>Related Audiobooks You May Enjoy</h2>
    ${bestOfLink ? '<p class="related-best-link">' + bestOfLink + "</p>" : ""}
    <div class="related-grid">
      ${picks.map((rb) => `<a class="related-card" href="/audiobooks/${rb.slug}">
        <img src="${rb.coverUrl}" alt="${escapeHtml(rb.title)}" loading="lazy" onerror="this.src='/images/placeholder.svg'">
        <div>
          <strong>${escapeHtml(rb.title)}</strong>
          <span>${rb.rating}/5 · ${(rb.durationMinutes / 60).toFixed(1)}h</span>
        </div>
      </a>`).join("\n")}
    </div>
  </div>`;
}

// Best-of roundup page (SEO traffic entry).
function generateBestOfPage(def) {
  const picked = books.filter(def.filter).sort(def.sort).slice(0, def.limit);
  const cards = picked.map(generateBookCard).join("\n");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(def.title)} | AudibleCreditOptimizer</title>
<meta name="description" content="${escapeHtml(def.description)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://audiobookvalue.com/${def.slug}">
<meta property="og:title" content="${escapeHtml(def.title)}">
<meta property="og:description" content="${escapeHtml(def.description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="https://audiobookvalue.com/${def.slug}">
<link rel="stylesheet" href="css/style.css">
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
<section class="hero">
  <h1>${escapeHtml(def.title)}</h1>
  <p>${escapeHtml(def.description)}</p>
  <div class="hero-stats"><div><strong>${picked.length}</strong>Top Picks</div></div>
</section>
<div id="book-grid" class="book-grid">
${cards}
</div>
<footer class="site-footer">
  <p>© 2026 <a href="https://audiobookvalue.com">AudibleCreditOptimizer</a> — audiobookvalue.com</p>
  <p>We participate in the Amazon Services LLC Associates Program. <span id="affiliate-disclaimer">${escapeHtml(site.affiliateDisclaimer)}</span></p>
  <p style="margin-top:8px"><a href="/">Home</a> | <a href="sitemap.xml">Sitemap</a></p>
</footer>
</body>
</html>`;
}

// Category listing page (SEO traffic entry).
function generateCategoryPage(category) {
  const picked = books.filter((b) => b.categories.includes(category.id)).sort((a, b) => b.rating - a.rating);
  if (picked.length === 0) return null;
  const cards = picked.map(generateBookCard).join("\n");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(category.name)} Audiobooks | AudibleCreditOptimizer</title>
<meta name="description" content="Browse ${picked.length} ${escapeHtml(category.name)} audiobooks with ratings, lengths, and free-trial links.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://audiobookvalue.com/category/${category.id}">
<base href="/">
<meta property="og:title" content="${escapeHtml(category.name)} Audiobooks">
<meta property="og:type" content="website">
<meta property="og:url" content="https://audiobookvalue.com/category/${category.id}">
<link rel="stylesheet" href="../css/style.css">
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
<section class="hero">
  <h1>${escapeHtml(category.name)} Audiobooks</h1>
  <p>Browse ${picked.length} ${escapeHtml(category.name)} audiobooks ranked by rating.</p>
</section>
<div id="book-grid" class="book-grid">
${cards}
</div>
<footer class="site-footer">
  <p>© 2026 <a href="https://audiobookvalue.com">AudibleCreditOptimizer</a> — audiobookvalue.com</p>
  <p>We participate in the Amazon Services LLC Associates Program. <span id="affiliate-disclaimer">${escapeHtml(site.affiliateDisclaimer)}</span></p>
  <p style="margin-top:8px"><a href="/">Home</a> | <a href="/sitemap.xml">Sitemap</a></p>
</footer>
</body>
</html>`;
}

// Replace placeholders in template
function renderTemplate(template, vars) {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp("\\{\\{" + key + "\\}\\}", "g"), value);
  }
  return result;
}

// Generate book detail page
function generateBookPage(book) {
  const affiliateLink = buildAffiliateLink(book.asin);
  const durationHrs = (book.durationMinutes / 60).toFixed(1);
  const questions = book.questions || {};
  
  const qList = [
    { q: "What is this audiobook?", a: questions.q1 || book.description },
    { q: "Who is it for? What problem does it solve?", a: questions.q2 },
    { q: "What is the best use scenario?", a: questions.q3 },
    { q: "What makes it different?", a: questions.q4 },
    { q: "Can you start using it immediately?", a: questions.q5 }
  ].filter(item => item.a);

  const questionSections = qList.map((item, i) => {
    const num = i + 1;
    const qText = escapeHtml(item.q);
    const aText = escapeHtml(item.a).replace(/\n/g, "<br>");
    return `
      <div class="question-section">
        <div class="question-header">
          <span class="num">${num}</span>
          ${qText}
        </div>
        <div class="question-body">
          <p>${aText}</p>
        </div>
      </div>`;
  }).join("\n");

  const catNames = book.categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(", ");
  const safeTitle = escapeHtml(book.title);
  const safeAuthor = escapeHtml(book.author);
  const safeNarrator = escapeHtml(book.narrator);
  const safeDesc = escapeHtml(book.description).substring(0, 160);
  const stars = renderStars(book.rating);
  const ratingFormatted = formatNumber(book.ratingCount);
  const whyListenHtml = buildWhyListen(book);
  const relatedHtml = buildRelatedSection(book);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${safeTitle} by ${safeAuthor} Audiobook Review | AudibleCreditOptimizer</title>
<meta name="description" content="Read our review of ${safeTitle} by ${safeAuthor}. ${book.rating}/5 stars, ${durationHrs}h long. Is this audiobook worth your credit? Find out now.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://audiobookvalue.com/audiobooks/${book.slug}">
<meta property="og:title" content="${safeTitle} by ${safeAuthor} - Audiobook Review">
<meta property="og:description" content="${book.rating}/5 stars | ${durationHrs}h | Free with Audible trial. Read our full review.">
<meta property="og:type" content="book">
<meta property="og:url" content="https://audiobookvalue.com/audiobooks/${book.slug}">
<meta property="og:image" content="${book.coverUrl}">
<link rel="stylesheet" href="../css/style.css">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Book",
  "name": ${JSON.stringify(book.title)},
  "author": ${JSON.stringify(book.author)},
  "datePublished": "${book.releaseDate}",
  "abridged": false,
  "audioFormat": "Audiobook",
  "duration": "PT${book.durationMinutes}M",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "${book.rating}",
    "reviewCount": "${book.ratingCount}",
    "bestRating": "5"
  },
  "offers": {
    "@type": "Offer",
    "url": "${affiliateLink}",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "description": "Free with 30-day Audible trial"
  }
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
  <div class="book-detail-header">
    <img class="book-detail-cover" src="${book.coverUrl}" alt="${safeTitle}" onerror="this.src="../images/placeholder.jpg"">
    <div class="book-detail-info">
      <h1>${safeTitle}</h1>
      <p class="author">by ${safeAuthor} · Narrated by ${safeNarrator}</p>
      <div class="detail-meta">
        <div class="detail-meta-item">
          <div class="value" style="color:#f5a623">${stars}</div>
          <div class="label">${book.rating}/5 (${ratingFormatted} ratings)</div>
        </div>
        <div class="detail-meta-item">
          <div class="value">${durationHrs}h</div>
          <div class="label">Duration (${book.duration})</div>
        </div>
        <div class="detail-meta-item">
          <div class="value" style="color:#10b981">${book.onSale ? '<span class="on-sale">ON SALE</span>' : 'FREE'}</div>
          <div class="label">With 30-Day Trial</div>
        </div>
        <div class="detail-meta-item">
          <div class="value">${catNames}</div>
          <div class="label">Categories</div>
        </div>
      </div>
      <a href="${affiliateLink}" class="detail-cta" target="_blank" rel="nofollow sponsored">🎧 Start Free Trial & Download Now</a>
      <p style="font-size:.8rem;color:#6b7280;margin-top:8px">Free 30-day Audible trial. Cancel anytime. Keep the book forever.</p>
    </div>
  </div>
  
  ${whyListenHtml}
  
  <div id="questions-container">
${questionSections}
  </div>
  
  <div style="text-align:center;margin-top:32px;padding:24px;background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:10px">
    <h3 style="margin-bottom:8px">Ready to start listening?</h3>
    <p style="color:#374151;margin-bottom:16px">Get "${safeTitle}" free with your 30-day Audible trial. No commitment, cancel anytime.</p>
    <a href="${affiliateLink}" class="detail-cta" target="_blank" rel="nofollow sponsored">🎧 Claim Your Free Trial & Download</a>
  </div>
  
  ${relatedHtml}
  
  <div style="margin-top:32px">
    <p style="font-size:.8rem;color:#6b7280;text-align:center">
      As an Amazon Associate we earn from qualifying purchases. When you sign up for a free trial through our links, we may earn a commission. 
      Last updated: ${new Date().toLocaleDateString()}
    </p>
  </div>
</main>

<footer class="site-footer">
  <p>© 2026 <a href="https://audiobookvalue.com">AudibleCreditOptimizer</a> — audiobookvalue.com</p>
  <p>We participate in the Amazon Services LLC Associates Program. ${escapeHtml(site.affiliateDisclaimer)}</p>
  <p style="margin-top:8px"><a href="/">Home</a> | <a href="/sitemap.xml">Sitemap</a></p>
</footer>

</body>
</html>`;
}

// Generate sitemap
function generateSitemap() {
  const now = new Date().toISOString().split("T")[0];
  const urls = [
    "https://audiobookvalue.com/",
    ...BEST_OF_PAGES.map((p) => "https://audiobookvalue.com/" + p.slug),
    ...categories.filter((c) => books.some((b) => b.categories.includes(c.id))).map((c) => "https://audiobookvalue.com/category/" + c.id),
    ...books.map(b => "https://audiobookvalue.com/audiobooks/" + b.slug)
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const url of urls) {
    const priority = url === "https://audiobookvalue.com/" ? "1.0" : "0.8";
    xml += `  <url>\n    <loc>${url}</loc>\n    <lastmod>${now}</lastmod>\n    <priority>${priority}</priority>\n  </url>\n`;
  }
  xml += '</urlset>';
  return xml;
}

// Redirect .html and trailing-slash variants to the canonical extensionless URL.
function generateRedirects() {
  const lines = books.map((b) => {
    return "/audiobooks/" + b.slug + ".html /audiobooks/" + b.slug + " 301\n" +
           "/audiobooks/" + b.slug + "/ /audiobooks/" + b.slug + " 301";
  });
  return lines.join("\n") + "\n";
}

// --- Main ---
const audiobooksDir = path.join(ROOT, "audiobooks");
if (!fs.existsSync(audiobooksDir)) {
  fs.mkdirSync(audiobooksDir, { recursive: true });
}

let generated = 0;
const byAsin = new Map(books.map((b) => [b.asin, b]));
for (const book of books) {
  const html = generateBookPage(book, byAsin);
  const filePath = path.join(audiobooksDir, book.slug + ".html");
  fs.writeFileSync(filePath, html, "utf-8");
  generated++;
  console.log("  OK " + book.slug + ".html");
}
console.log("\nGenerated " + generated + " audiobook pages");

// Static homepage with internal links (crawler-friendly)
fs.writeFileSync(path.join(ROOT, "index.html"), generateHomePage(), "utf-8");
console.log("  OK index.html (static)");

// Redirect rules
fs.writeFileSync(path.join(ROOT, "_redirects"), generateRedirects(), "utf-8");
console.log("  OK _redirects");

// Sitemap
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), generateSitemap(), "utf-8");
console.log("  OK sitemap.xml");

// Best-of roundup pages
const categoryDir = path.join(ROOT, "category");
if (!fs.existsSync(categoryDir)) fs.mkdirSync(categoryDir, { recursive: true });
for (const def of BEST_OF_PAGES) {
  fs.writeFileSync(path.join(ROOT, def.slug + ".html"), generateBestOfPage(def), "utf-8");
  console.log("  OK " + def.slug + ".html");
}
// Category pages
let categoryCount = 0;
for (const cat of categories) {
  const html = generateCategoryPage(cat);
  if (html) {
    fs.writeFileSync(path.join(categoryDir, cat.id + ".html"), html, "utf-8");
    categoryCount++;
    console.log("  OK category/" + cat.id + ".html");
  }
}
console.log("Generated " + BEST_OF_PAGES.length + " best-of pages and " + categoryCount + " category pages");

// Stats
const stats = {
  totalBooks: books.length,
  totalCategories: categories.length,
  avgRating: (books.reduce((s, b) => s + b.rating, 0) / books.length).toFixed(1),
  generatedAt: new Date().toISOString()
};
fs.writeFileSync(path.join(ROOT, "stats.json"), JSON.stringify(stats, null, 2), "utf-8");
console.log("  OK stats.json");

console.log("\n✅ All pages generated successfully!");
