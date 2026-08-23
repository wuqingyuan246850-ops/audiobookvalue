/**
 * audiobookvalue.com - One-time rebuild for historical daily blog posts.
 *
 * Reads existing daily deal pages, extracts the highlighted ASINs, and
 * re-renders each page with the current SEO article template. Pages from
 * today are skipped so blog-post.js owns today's article.
 *
 * Usage: node scripts/rebuild-daily-posts.js
 */

const fs = require("fs");
const path = require("path");
const { generateArticle, articleSlug } = require("./blog-post");

const ROOT = path.resolve(__dirname, "..");
const BOOKS_PATH = path.join(ROOT, "books.json");
const BLOG_DIR = path.join(ROOT, "blog");

function today() {
  return new Date().toISOString().slice(0, 10);
}

function parseCards(html) {
  const cards = [];
  const parts = html.split(/<div class="book-card">|<article class="blog-book">/).slice(1);
  for (const part of parts) {
    const asin = part.match(/amazon\.com\/dp\/([A-Z0-9]{10})\?tag=/);
    const slug = part.match(/href="\/audiobooks\/([^"]+)"/);
    const title = part.match(/class="book-title">([\s\S]*?)<\/a>/) || part.match(/<h3><a href="[^"]+">([\s\S]*?)<\/a><\/h3>/);
    const author = part.match(/class="book-author">by ([\s\S]*?)(?:<\/div>|<\/p>)/);
    const cover = part.match(/<img class="book-cover" src="([^"]+)"/);
    const rating = part.match(/<span class="stars">[\s\S]*?<\/span><span>([0-9.]+)<\/span>/) || part.match(/Rating: ([0-9.]+)\/5/);
    const duration = part.match(/<div class="book-duration">([0-9.]+)h \(([^)]+)\)<\/div>/) || part.match(/Runtime: ([^<]+)/);
    const price = part.match(/<span class="price-list">\$([0-9.]+)<\/span>/) || part.match(/List price: \$([0-9.]+)/);
    if (!asin || !slug || !title) continue;
    const durationText = duration ? (duration[2] || duration[1]) : "10h 0m";
    const hours = duration ? parseFloat(duration[1]) : 10;
    cards.push({
      asin: asin[1],
      slug: slug[1],
      title: (title[1] || "").replace(/<[^>]+>/g, "").trim(),
      author: author ? author[1].trim() : "Unknown",
      coverUrl: cover ? cover[1] : "",
      rating: rating ? parseFloat(rating[1]) : 4.5,
      duration: durationText,
      durationMinutes: Math.round(hours * 60),
      ratingCount: 0,
      listPrice: price ? parseFloat(price[1]) : 0,
      categories: ["fiction"],
      tags: [],
      description: "",
      needsReview: true
    });
  }
  return cards;
}

function main() {
  const data = JSON.parse(fs.readFileSync(BOOKS_PATH, "utf-8"));
  const booksByAsin = new Map(data.books.map((b) => [b.asin, b]));
  const files = fs.readdirSync(BLOG_DIR).filter((f) => /^\d{4}-\d{2}-\d{2}-audiobook-deals\.html$/.test(f));
  const now = today();
  let rebuilt = 0;

  for (const file of files) {
    const date = file.slice(0, 10);
    if (date === now) continue;
    const html = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const cards = parseCards(html);
    const books = cards.map((c) => booksByAsin.get(c.asin) || c).filter((b) => b && b.asin);
    const changes = {
      newAsins: books.map((b) => b.asin),
      onSaleAsins: [],
      priceDropAsins: [],
      removedAsins: [],
      picks: []
    };
    const rebuiltHtml = generateArticle(date, changes, booksByAsin);
    fs.writeFileSync(path.join(BLOG_DIR, file), rebuiltHtml, "utf-8");
    rebuilt++;
    console.log("Rebuilt " + file + " (" + books.length + " books)");
  }
  console.log("Rebuilt " + rebuilt + " daily posts");
}

main();
