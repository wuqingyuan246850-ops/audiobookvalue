#!/usr/bin/env node
// Blog SEO self-check for audiobookvalue.com.
// Usage: node scripts/check-blog-seo.js [repo-path]
const fs = require("fs");
const path = require("path");

const repo = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const blogDir = path.join(repo, "blog");
const errors = [];
const checked = [];

if (!fs.existsSync(blogDir)) {
  console.error("No blog directory found.");
  process.exit(1);
}

function words(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(/\s+/).length;
}

const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".html")).sort();

for (const file of files) {
  const html = fs.readFileSync(path.join(blogDir, file), "utf-8");
  const slug = file.replace(/\.html$/, "");
  const visible = html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ");
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "";
  const desc = (html.match(/<meta name="description" content="([\s\S]*?)">/) || [])[1] || "";
  const h1 = (html.match(/<h1>/g) || []).length;
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)">/) || [])[1] || "";
  const ogTitle = /<meta property="og:title"/.test(html);
  const ogDesc = /<meta property="og:description"/.test(html);
  const twitter = /<meta name="twitter:card"/.test(html);
  const ldBlocks = (html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || []);
  const ldTypes = [];
  for (const block of ldBlocks) {
    const raw = block.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "");
    try {
      const data = JSON.parse(raw);
      const types = Array.isArray(data) ? data.map((d) => d["@type"]) : [data["@type"]];
      ldTypes.push(...types);
    } catch (e) {
      errors.push(file + ": invalid JSON-LD");
    }
  }
  const wordCount = words(html);
  const row = { file, titleLen: title.length, descLen: desc.length, words: wordCount, h1, canonical, ogTitle, ogDesc, twitter, ldTypes };
  checked.push(row);

  if (h1 !== 1) errors.push(file + ": expected exactly 1 H1, found " + h1);
  if (title.length < 30 || title.length > 60) errors.push(file + ": title length " + title.length + " outside 30-60");
  if (desc.length < 120 || desc.length > 155) errors.push(file + ": description length " + desc.length + " outside 120-155");
  const expectedCanonical = file === "index.html" ? "https://audiobookvalue.com/blog" : "https://audiobookvalue.com/blog/" + slug;
  if (canonical !== expectedCanonical) errors.push(file + ": canonical mismatch " + canonical);
  if (!ogTitle) errors.push(file + ": missing og:title");
  if (!ogDesc) errors.push(file + ": missing og:description");
  if (!twitter) errors.push(file + ": missing twitter:card");
  if (ldTypes.length === 0) errors.push(file + ": missing JSON-LD");

  if (file === "index.html") {
    if (!ldTypes.includes("Blog")) errors.push(file + ": missing Blog JSON-LD");
  } else {
    if (!/class="breadcrumbs"/.test(html)) errors.push(file + ": missing breadcrumb nav");
    if (!ldTypes.includes("BreadcrumbList")) errors.push(file + ": missing BreadcrumbList JSON-LD");
    const minWords = slug.endsWith("-review") ? 400 : 300;
    if (wordCount < minWords) errors.push(file + ": only " + wordCount + " words, expected >= " + minWords);
    if (/^\d{4}-\d{2}-\d{2}-audiobook-deals$/.test(slug)) {
      const intro = "Here is what changed today at audiobookvalue.com";
      const count = visible.split(intro).length - 1;
      if (count > 1) errors.push(file + ": duplicated intro paragraph");
    }
  }
}

console.log("Checked " + checked.length + " blog pages");
console.log("Title outside 30-60: " + checked.filter((r) => r.titleLen < 30 || r.titleLen > 60).length);
console.log("Description outside 120-155: " + checked.filter((r) => r.descLen < 120 || r.descLen > 155).length);
console.log("Missing og:description: " + checked.filter((r) => !r.ogDesc).length);
console.log("Missing Twitter card: " + checked.filter((r) => !r.twitter).length);

if (errors.length > 0) {
  console.error("\nERRORS (" + errors.length + "):");
  errors.forEach((e) => console.error("  - " + e));
  process.exit(1);
}
console.log("\nBlog SEO OK");
