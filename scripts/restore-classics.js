const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BOOKS_PATH = path.join(ROOT, "books.json");
const CLASSICS_PATH = path.join(ROOT, "scripts", "classics.json");

const data = JSON.parse(fs.readFileSync(BOOKS_PATH, "utf-8"));
const classics = JSON.parse(fs.readFileSync(CLASSICS_PATH, "utf-8"));
const existingAsins = new Set(data.books.map((b) => b.asin));
const existingTitles = new Set(data.books.map((b) => b.title.toLowerCase()));
const existingSlugs = new Set(data.books.map((b) => b.slug));

let added = 0;
let skipped = 0;
for (const book of classics) {
  if (existingAsins.has(book.asin)) {
    skipped++;
    console.log("Skip existing ASIN: " + book.asin + " " + book.title);
    continue;
  }
  if (existingTitles.has(book.title.toLowerCase())) {
    skipped++;
    console.log("Skip duplicate title: " + book.title);
    continue;
  }
  if (existingSlugs.has(book.slug)) {
    skipped++;
    console.log("Skip duplicate slug: " + book.slug + " (" + book.title + ")");
    continue;
  }
  const restored = {
    ...book,
    needsReview: true,
    tags: [...(book.tags || []).filter((t) => t !== "candidate"), "classic"]
  };
  data.books.push(restored);
  existingAsins.add(book.asin);
  existingTitles.add(book.title.toLowerCase());
  existingSlugs.add(book.slug);
  added++;
  console.log("Restored: " + book.title);
}

fs.writeFileSync(BOOKS_PATH, JSON.stringify(data, null, 2));
console.log("Restored " + added + " classic books. Total: " + data.books.length + ", skipped " + skipped);
