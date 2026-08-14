const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BOOKS_PATH = path.join(ROOT, "books.json");
const PENDING_PATH = path.join(ROOT, "pending-books.json");

const FINALIZED = {
  "B07C3WM559": {
    slug: "ethic-ashley-antoinette",
    title: "Ethic",
    author: "Ashley Antoinette",
    narrator: "iiKane",
    coverUrl: "https://m.media-amazon.com/images/I/31f+TtWi5GL._SL500_.jpg",
    duration: "9h 15m",
    durationMinutes: 555,
    rating: 4.7,
    ratingCount: 10000,
    listPrice: 18.50,
    categories: ["fiction", "romance"],
    tags: ["best-seller", "series", "urban-fiction"],
    description: "Ethic is the series opener that made Ashley Antoinette a force in urban romance, following a dangerous man who thought he could never love again.",
    releaseDate: "2018-04-10",
    needsReview: true,
    q1: "Ethic by Ashley Antoinette is the first novel in the best-selling Ethic series, an urban romance about a ruthless man whose past catches up with him when love enters his life. iiKane narrates this 9-hour audiobook.",
    q2: "For readers who love urban romance, morally complex heroes, and love stories with real grit. It solves the problem of finding a series that balances street-level danger with genuine emotional depth.",
    q3: "Perfect for evenings and weekend binges; the fast pacing and dramatic twists make it hard to pause. A strong one-credit listen.",
    q4: "Ashley Antoinette built a devoted audience by writing heroes who are dangerous yet tender, and Ethic is where the phenomenon began. The audiobook's narration adds raw intensity to the story.",
    q5: "Absolutely. Start your free 30-day Audible trial, download Ethic, and you will be drawn into the story in the first chapter. This is where the series starts."
  },
  "B0GHSNJQ6Z": {
    slug: "finding-you-wright-heroes-of-maine-patchen",
    title: "Finding You: The Wright Heroes of Maine, Book 3",
    author: "Robin Patchen",
    narrator: "Leonor A. Woodworth",
    coverUrl: "https://m.media-amazon.com/images/I/519p5k6jArL._SL500_.jpg",
    duration: "9h 0m",
    durationMinutes: 540,
    rating: 4.6,
    ratingCount: 3000,
    listPrice: 21.39,
    categories: ["romance", "mystery-thriller"],
    tags: ["series", "romantic-suspense", "new-release"],
    description: "Finding You is the third Wright Heroes of Maine novel, a romantic suspense story about protecting the people you love in a town full of secrets.",
    releaseDate: "2026-01-20",
    needsReview: true,
    q1: "Finding You is the third book in Robin Patchen's Wright Heroes of Maine series, a romantic suspense novel about danger, faith, and second chances. Leonor A. Woodworth narrates this 9-hour audiobook.",
    q2: "For readers who love clean romantic suspense, small-town settings, and heroes who risk everything for family. It solves the problem of finding a series with both romance and genuine thriller tension.",
    q3: "Great for commutes and evenings; the suspense threads keep the pace moving while the romance builds. A satisfying one-credit listen.",
    q4: "Patchen is a reliable voice in inspirational romantic suspense, and the Wright Heroes series pairs a loving family dynamic with real stakes. Woodworth's narration keeps the tension and warmth in balance.",
    q5: "Absolutely. Start your free 30-day Audible trial and join the Wrights in Shadow Cove. New readers can start here, though book one gives the full family history."
  },
  "B0G53ZL9GN": {
    slug: "sheltering-you-wright-heroes-of-maine-patchen",
    title: "Sheltering You: Terror in Shadow Cove: The Wright Heroes of Maine, Book 4",
    author: "Robin Patchen",
    narrator: "Leonor A. Woodworth",
    coverUrl: "https://m.media-amazon.com/images/I/51OYGSRRDDL._SL500_.jpg",
    duration: "9h 30m",
    durationMinutes: 570,
    rating: 4.6,
    ratingCount: 2500,
    listPrice: 21.62,
    categories: ["romance", "mystery-thriller"],
    tags: ["series", "romantic-suspense", "new-release"],
    description: "Sheltering You raises the stakes in Shadow Cove as the Wright family faces a terror threat that puts everything on the line.",
    releaseDate: "2025-12-05",
    needsReview: true,
    q1: "Sheltering You is the fourth Wright Heroes of Maine novel, a romantic suspense thriller where the Wrights protect their town from a terrifying threat. Leonor A. Woodworth narrates this 9.5-hour audiobook.",
    q2: "For romantic-suspense readers who love family-centered heroes, faith themes, and high-stakes plots. It solves the problem of finding a clean thriller that still delivers real tension.",
    q3: "Perfect for evenings and weekends; the escalating threat makes it easy to keep listening. A strong one-credit read.",
    q4: "Patchen turns the series up a notch here, giving readers both the warm family dynamic and a genuinely frightening plot. Woodworth brings urgency to every scene.",
    q5: "Absolutely. Start your free 30-day Audible trial and see the Wrights tested like never before. Series fans should not miss this entry."
  },
  "B0GH2LS337": {
    slug: "innocent-lies-nutfield-saga-patchen",
    title: "Innocent Lies: Nutfield Saga, Book 4",
    author: "Robin Patchen",
    narrator: "Karen White",
    coverUrl: "https://m.media-amazon.com/images/I/51bTSGevLvL._SL500_.jpg",
    duration: "10h 0m",
    durationMinutes: 600,
    rating: 4.6,
    ratingCount: 2000,
    listPrice: 20.66,
    categories: ["romance", "mystery-thriller"],
    tags: ["series", "romantic-suspense", "new-release"],
    description: "Innocent Lies continues the Nutfield Saga with a web of small-town secrets and a love that has to survive the truth.",
    releaseDate: "2026-01-16",
    needsReview: true,
    q1: "Innocent Lies is the fourth book in Robin Patchen's Nutfield Saga, a romantic suspense novel about hidden pasts and dangerous truths in a small town. Karen White narrates this 10-hour audiobook.",
    q2: "For readers who love secret-laden small-town romance and suspense with emotional depth. It solves the problem of finding a series that balances mystery with a satisfying love story.",
    q3: "Great for commutes and longer listening sessions; the layered mystery rewards attention. A comfortable one-credit commitment.",
    q4: "Patchen weaves faith, family, and suspense into a story where the truth hurts but heals, and White's narration gives every secret real weight.",
    q5: "Absolutely. Start your free 30-day Audible trial and unravel the lies with the Nutfield family. New readers can jump in here."
  },
  "B0GJTXLD6V": {
    slug: "protecting-you-wright-heroes-of-maine-patchen",
    title: "Protecting You: Schemes and Lies in Shadow Cove (The Wright Heroes of Maine, Book 5)",
    author: "Robin Patchen",
    narrator: "Leonor A. Woodworth",
    coverUrl: "https://m.media-amazon.com/images/I/519QwnzXt-L._SL500_.jpg",
    duration: "9h 45m",
    durationMinutes: 585,
    rating: 4.6,
    ratingCount: 2000,
    listPrice: 22.51,
    categories: ["romance", "mystery-thriller"],
    tags: ["series", "romantic-suspense", "new-release"],
    description: "Protecting You is the fifth Wright Heroes of Maine novel, where schemes in Shadow Cove force the family to fight for the people they love.",
    releaseDate: "2026-01-26",
    needsReview: true,
    q1: "Protecting You is the fifth Wright Heroes of Maine novel, a romantic suspense story about family loyalty and the lengths love will go to protect its own. Leonor A. Woodworth narrates this 9.75-hour audiobook.",
    q2: "For readers invested in the Wright family and fans of clean, faith-filled romantic suspense. It solves the problem of waiting for the next chapter of a beloved series.",
    q3: "Perfect for evenings and weekends; the scheme-driven plot keeps chapters turning. A strong addition to the series.",
    q4: "Patchen keeps the family at the center while raising the stakes, and Woodworth's narration makes each Wright distinct. It is comfort reading with real tension.",
    q5: "Absolutely. Start your free 30-day Audible trial and return to Shadow Cove. Series readers will want this immediately."
  }
};

const books = JSON.parse(fs.readFileSync(BOOKS_PATH, "utf-8"));
const pending = JSON.parse(fs.readFileSync(PENDING_PATH, "utf-8"));
const known = new Set(books.books.map((b) => b.asin));

let added = 0;
for (const c of pending.candidates) {
  const f = FINALIZED[c.asin];
  if (!f || known.has(c.asin)) continue;
  books.books.push({
    asin: c.asin,
    slug: f.slug,
    title: f.title,
    author: f.author,
    narrator: f.narrator,
    coverUrl: f.coverUrl,
    duration: f.duration,
    durationMinutes: f.durationMinutes,
    rating: f.rating,
    ratingCount: f.ratingCount,
    listPrice: f.listPrice,
    audiblePrice: 0,
    isCreditEligible: true,
    isPlusCatalog: false,
    categories: f.categories,
    tags: f.tags,
    description: f.description,
    releaseDate: f.releaseDate,
    binding: "Audible Audiobook",
    formats: ["Unabridged"],
    detailPageURL: "https://www.amazon.com/dp/" + c.asin + "?tag=yuanyuan07-20&linkCode=ogi&th=1&psc=1",
    needsReview: f.needsReview,
    questions: { q1: f.q1, q2: f.q2, q3: f.q3, q4: f.q4, q5: f.q5 }
  });
  known.add(c.asin);
  added++;
  console.log("Added " + f.title);
}

pending.candidates = pending.candidates.filter((c) => !FINALIZED[c.asin] || known.has(c.asin) === false);
fs.writeFileSync(BOOKS_PATH, JSON.stringify(books, null, 2));
fs.writeFileSync(PENDING_PATH, JSON.stringify({ updatedAt: new Date().toISOString(), candidates: pending.candidates }, null, 2));
console.log("Added " + added + " books. Total: " + books.books.length + ", pending remaining: " + pending.candidates.length);
