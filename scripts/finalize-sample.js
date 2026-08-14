const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BOOKS_PATH = path.join(ROOT, "books.json");
const PENDING_PATH = path.join(ROOT, "pending-books.json");

const ASIN = "B0FL88D4F3";

const finalized = {
  asin: ASIN,
  slug: "lonesome-dove-larry-mcmurtry",
  title: "Lonesome Dove: A Novel",
  author: "Larry McMurtry",
  narrator: "Will Patton",
  coverUrl: "https://m.media-amazon.com/images/I/41hleWqOTKL._SL500_.jpg",
  duration: "36h 8m",
  durationMinutes: 2168,
  rating: 4.8,
  ratingCount: 50000,
  listPrice: 29.99,
  audiblePrice: 0,
  isCreditEligible: true,
  isPlusCatalog: false,
  categories: ["fiction", "history"],
  tags: ["classic", "best-seller", "long-read", "pulitzer"],
  description: "Lonesome Dove is Larry McMurtry's Pulitzer Prize-winning Western epic, following retired Texas Rangers Gus McCrae and Woodrow Call on a cattle drive from Texas to Montana. Will Patton's narration turns this sprawling classic into one of the greatest audiobook experiences in American literature.",
  releaseDate: "2025-09-23",
  binding: "Audible Audiobook",
  formats: ["Unabridged"],
  detailPageURL: "https://www.amazon.com/dp/B0FL88D4F3?tag=yuanyuan07-20&linkCode=ogi&th=1&psc=1",
  needsReview: false,
  questions: {
    q1: "Lonesome Dove by Larry McMurtry is the Pulitzer Prize-winning novel that redefined the American Western. Narrated by Will Patton, this 36-hour audiobook follows former Texas Rangers Gus McCrae and Woodrow Call on an epic cattle drive from the Rio Grande to Montana.",
    q2: "For readers who love sweeping American epics, unforgettable characters, and literary fiction with real adventure. It solves the problem of finding a long, immersive classic that earns every hour, appealing to both Western fans and readers who normally avoid the genre.",
    q3: "Perfect for long road trips, cross-country flights, or a month of daily commutes. At 36 hours, it delivers exceptional value per Audible credit, and the episodic chapters make it easy to pause without losing the thread.",
    q4: "Few novels capture the American West with this much heart, humor, and grief. Will Patton's narration is widely praised as one of the best audiobook performances ever recorded, giving Gus and Call a voice that stays with you long after the final chapter.",
    q5: "Absolutely. Start your free 30-day Audible trial, download Lonesome Dove, and you will be hooked within the first hour. At 36 hours, one credit buys a full month of extraordinary listening."
  }
};

const books = JSON.parse(fs.readFileSync(BOOKS_PATH, "utf-8"));
if (books.books.some((b) => b.asin === ASIN)) {
  console.log("ASIN already in books.json; nothing to do.");
} else {
  books.books.push(finalized);
  fs.writeFileSync(BOOKS_PATH, JSON.stringify(books, null, 2));
  console.log("Added Lonesome Dove to books.json");
}

const pending = JSON.parse(fs.readFileSync(PENDING_PATH, "utf-8"));
const before = pending.candidates.length;
pending.candidates = pending.candidates.filter((c) => c.asin !== ASIN);
fs.writeFileSync(PENDING_PATH, JSON.stringify({ updatedAt: new Date().toISOString(), candidates: pending.candidates }, null, 2));
console.log("Removed from pending: " + (before - pending.candidates.length) + ", remaining: " + pending.candidates.length);
