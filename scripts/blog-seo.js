const SITE = {
  name: "AudibleCreditOptimizer",
  domain: "https://audiobookvalue.com"
};

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function cleanText(str) {
  return String(str || "").replace(/\s+/g, " ").trim();
}

function truncate(text, max = 58) {
  const clean = cleanText(text);
  if (clean.length <= max) return clean;
  let cut = clean.slice(0, max - 3);
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > max * 0.45) cut = cut.slice(0, lastSpace);
  return cut.trim().replace(/[.,;:!?]+$/, "") + "...";
}

function metaDescription(text, min = 120, max = 155) {
  const clean = cleanText(text);
  if (clean.length < min) {
    const padded = clean + " Find the best value Audible audiobook before you spend a credit.";
    return padded.length <= max ? padded : clean + " Read the full review.";
  }
  if (clean.length <= max) return clean;
  let cut = clean.slice(0, max - 3);
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > max * 0.4) cut = cut.slice(0, lastSpace);
  cut = cut.trim().replace(/[.,;:!?]+$/, "");
  if (cut.length < min) {
    const padded = clean.slice(0, min - 1).trim().replace(/[.,;:!?]+$/, "") + ".";
    return padded.length <= max ? padded : padded.slice(0, max);
  }
  return cut + "...";
}

function publisher() {
  return { "@type": "Organization", name: SITE.name, url: SITE.domain };
}

function canonicalUrl(path) {
  return SITE.domain + path;
}

function breadcrumb(items) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: canonicalUrl(item.path) } : {})
    }))
  };
  const html = `<nav aria-label="Breadcrumb" class="breadcrumbs"><ol>${items.map((item, i) => `<li${i === items.length - 1 ? ' aria-current="page"' : ""}>${item.path ? `<a href="${item.path}">${escapeHtml(item.name)}</a>` : escapeHtml(item.name)}</li>`).join("")}</ol></nav>`;
  return { html, jsonLd };
}

function seoHead({ title, description, path, type = "article", image, jsonLd = [] }) {
  const ld = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
  const twitterCard = image ? "summary_large_image" : "summary";
  return `<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${canonicalUrl(path)}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:type" content="${type}">
<meta property="og:url" content="${canonicalUrl(path)}">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="${twitterCard}">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
${image ? `<meta property="og:image" content="${escapeHtml(image)}">` : ""}
<script type="application/ld+json">
${JSON.stringify(ld, null, 2)}
</script>`;
}

module.exports = {
  SITE,
  escapeHtml,
  cleanText,
  truncate,
  metaDescription,
  publisher,
  canonicalUrl,
  breadcrumb,
  seoHead
};
