/**
 * audiobookvalue.com - Template Finalizer
 *
 * Reads pending-books.json and moves candidates into books.json using
 * pure template content (no LLM API). Marks every book with
 * needsReview: true and contentSource: "template" for later polishing.
 *
 * Usage: node scripts/template-finalize.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BOOKS_PATH = path.join(ROOT, "books.json");
const PENDING_PATH = path.join(ROOT, "pending-books.json");

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function audienceFor(categories) {
  const c = categories.join(" ");
  if (/fantasy|sci-fi|litrpg|fiction/.test(c)) {
    return "listeners who love immersive fantasy, science fiction, or progression stories with strong ratings and long runtimes";
  }
  if (/romance/.test(c)) {
    return "fans of romance and character-driven love stories who want a satisfying escape";
  }
  if (/mystery|thriller/.test(c)) {
    return "thriller fans who enjoy suspense, twists, and stories that are hard to pause";
  }
  if (/children|teen/.test(c)) {
    return "young listeners and families looking for a clean, engaging audiobook";
  }
  if (/self-improvement/.test(c)) {
    return "anyone looking for practical ideas to improve habits, mindset, or daily life";
  }
  if (/business|money/.test(c)) {
    return "professionals and lifelong learners who want practical business and finance insight";
  }
  if (/history|science/.test(c)) {
    return "curious listeners who love well-researched history, science, and nonfiction";
  }
  if (/biograph|memoir/.test(c)) {
    return "readers who enjoy intimate true stories and character-driven nonfiction";
  }
  return "listeners who enjoy well-rated audiobooks across the " + categories.join("/") + " category";
}

function buildContent(candidate) {
  const title = candidate.title;
  const author = candidate.author || "Unknown";
  const narrator = candidate.narrator || "";
  const duration = candidate.duration || "10h 0m";
  const durationMin = candidate.durationMinutes || 600;
  const rating = candidate.rating || 4.5;
  const ratingCount = candidate.ratingCount || 0;
  const categories = candidate.categories || ["fiction"];
  const hours = (durationMin / 60).toFixed(1);
  const longBook = durationMin >= 600;

  const narratorPart = narrator ? " narrated by " + narrator : "";
  const ratingPart = ratingCount > 0 ? " from " + formatNumber(ratingCount) + " listeners" : "";
  const seriesPart = (candidate.tags || []).includes("series") ? ", a strong series entry" : "";
  const catText = categories.map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join("/");

  const q1 = title + " by " + author + " is an Audible audiobook" + narratorPart + ". It runs " + duration + " (about " + hours + " hours), carries a " + rating + "/5 rating" + ratingPart + ", and is free to start with a 30-day Audible trial.";
  const q2 = "This audiobook is for " + audienceFor(categories) + ". It solves the problem of finding a well-rated title you can start today without spending a credit.";
  const q3 = longBook
    ? "Best for commutes, road trips, or marathon listening sessions; at " + duration + ", it delivers strong value for one Audible credit."
    : "Perfect for a quick session, commute, or family listening; at " + duration + ", it fits easily into a busy day.";
  const q4 = "What makes it stand out is its " + rating + "/5 rating" + ratingPart + narratorPart + seriesPart + ", plus a " + duration + " runtime that gives real value per credit in the " + catText + " category.";
  const q5 = "Yes. Start your free 30-day Audible trial, download " + title + ", and press play within minutes. You can cancel anytime and keep the book.";

  return {
    description: title + " by " + author + " is an Audible audiobook" + narratorPart + " in the " + catText + " category, rated " + rating + "/5" + ratingPart + ". Start it free with a 30-day Audible trial.",
    questions: { q1, q2, q3, q4, q5 }
  };
}

function main() {
  if (!fs.existsSync(PENDING_PATH)) {
    console.log("No pending-books.json found; nothing to do.");
    return;
  }
  const pendingData = JSON.parse(fs.readFileSync(PENDING_PATH, "utf-8"));
  const pending = pendingData.candidates || [];
  const booksData = JSON.parse(fs.readFileSync(BOOKS_PATH, "utf-8"));
  const knownAsins = new Set(booksData.books.map((b) => b.asin));
  const knownSlugs = new Set(booksData.books.map((b) => b.slug));

  let added = 0;
  const remaining = [];
  for (const c of pending) {
    if (!c.asin || !c.title || !c.coverUrl || !c.coverUrl.startsWith("https://") || knownAsins.has(c.asin) || knownSlugs.has(c.slug)) {
      console.log("Skip invalid candidate: " + (c.title || c.asin || "?"));
      remaining.push(c);
      continue;
    }
    const content = buildContent(c);
    const book = {
      ...c,
      description: content.description,
      questions: content.questions,
      needsReview: true,
      contentSource: "template",
      tags: [...(c.tags || []).filter((t) => t !== "candidate"), "template"]
    };
    delete book.sourceKeyword;
    delete book.searchRank;
    delete book.discoveredAt;
    booksData.books.push(book);
    knownAsins.add(book.asin);
    knownSlugs.add(book.slug);
    added++;
    console.log("Template finalized: " + book.title + " (" + book.asin + ")");
  }

  fs.writeFileSync(BOOKS_PATH, JSON.stringify(booksData, null, 2));
  fs.writeFileSync(PENDING_PATH, JSON.stringify({ updatedAt: new Date().toISOString(), candidates: remaining }, null, 2));
  console.log("Finalized " + added + " template books. Total: " + booksData.books.length + ", pending remaining: " + remaining.length);
}

main();
