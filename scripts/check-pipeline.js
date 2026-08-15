#!/usr/bin/env node
// Pipeline self-check for audiobookvalue.com.
// Usage: node scripts/check-pipeline.js [repo-path]   (defaults to current directory)
const fs = require("fs");
const path = require("path");

const repo = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const errors = [];
const warn = [];

function load(file, fallback) {
  const p = path.join(repo, file);
  if (!fs.existsSync(p)) return fallback;
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

const booksData = load("books.json", { books: [] });
const pendingData = load("pending-books.json", { candidates: [] });
const books = booksData.books || [];
const pending = pendingData.candidates || [];

console.log("Repo:", repo);
console.log("Books:", books.length, "| Pending:", pending.length);

if (books.length === 0) errors.push("books.json has no books");

const seen = new Set();
const seenSlugs = new Set();
for (const book of books) {
  if (!book.asin) errors.push("Book missing asin: " + (book.title || "?"));
  if (seen.has(book.asin)) errors.push("Duplicate ASIN: " + book.asin);
  seen.add(book.asin);
  if (!book.slug) errors.push("Book missing slug: " + (book.asin || "?"));
  if (seenSlugs.has(book.slug)) errors.push("Duplicate slug: " + book.slug);
  seenSlugs.add(book.slug);
  if (!book.rating || book.rating <= 0) errors.push("Book missing rating: " + (book.asin || "?"));
  if (!book.durationMinutes || book.durationMinutes <= 0) errors.push("Book missing duration: " + (book.asin || "?"));
  const q = book.questions || {};
  for (const key of ["q1", "q2", "q3", "q4", "q5"]) {
    if (!q[key] || !q[key].trim()) errors.push("Book missing " + key + ": " + (book.asin || "?"));
  }
  if (book.slug) {
    const page = path.join(repo, "audiobooks", book.slug + ".html");
    if (!fs.existsSync(page)) errors.push("Landing page missing: " + book.slug + ".html");
  }
}

for (const c of pending) {
  if (!c.asin) errors.push("Pending candidate missing asin");
  if (seen.has(c.asin)) errors.push("Pending ASIN already published: " + (c.asin || "?"));
  if (!c.questions) warn.push("Pending candidate missing draft questions: " + (c.asin || "?"));
}

if (errors.length > 0) {
  console.error("\nERRORS (" + errors.length + "):");
  errors.forEach((e) => console.error("  - " + e));
} else {
  console.log("\nPipeline OK");
}
if (warn.length > 0) {
  console.warn("\nWARNINGS (" + warn.length + "):");
  warn.forEach((w) => console.warn("  - " + w));
}
process.exit(errors.length > 0 ? 1 : 0);
