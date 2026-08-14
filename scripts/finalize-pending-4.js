const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BOOKS_PATH = path.join(ROOT, "books.json");
const PENDING_PATH = path.join(ROOT, "pending-books.json");

const FINALIZED = {
  "B0FBH1651D": {
    slug: "heart-of-iron-cafae-latte-alongi",
    title: "Heart of Iron: The CaFae Latte Series, Book 1",
    author: "C. M. Alongi",
    narrator: "Em Grosland",
    coverUrl: "https://m.media-amazon.com/images/I/616MFPWpxOL._SL500_.jpg",
    duration: "10h 0m",
    durationMinutes: 600,
    rating: 4.7,
    ratingCount: 2000,
    listPrice: 23.99,
    categories: ["fantasy", "fiction"],
    tags: ["series", "cozy", "new-release"],
    description: "Heart of Iron opens the CaFae Latte series, a cozy fantasy about a fae coffee shop, found family, and the magic that brews between ordinary people.",
    releaseDate: "2025-10-07",
    needsReview: true,
    q1: "Heart of Iron is the first book in C.M. Alongi's CaFae Latte series, a cozy fantasy set around a fae-run coffee shop where magic and everyday life blend. Em Grosland narrates this 10-hour audiobook.",
    q2: "For readers who love cozy fantasy, found family, and gentle romance with a magical twist. It solves the problem of finding a warm, low-stress fantasy that still has real heart.",
    q3: "Perfect for commutes, cozy evenings, and weekend listening; the gentle pacing and charming characters make it easy to unwind. A comforting one-credit listen.",
    q4: "The CaFae Latte series stands out by putting a magical coffee shop at the center of its world, with characters who feel like friends. Grosland's narration brings the warmth and whimsy to life.",
    q5: "Absolutely. Start your free 30-day Audible trial, download Heart of Iron, and the coffee shop pulls you in immediately. Cozy-fantasy fans will be hooked."
  },
  "B0BS29375V": {
    slug: "fluff-2-wholesome-litrpg-ravensdagger",
    title: "Fluff 2: A Wholesome LitRPG",
    author: "RavensDagger",
    narrator: "Emma Galvin",
    coverUrl: "https://m.media-amazon.com/images/I/61eiImCwDvL._SL500_.jpg",
    duration: "12h 0m",
    durationMinutes: 720,
    rating: 4.8,
    ratingCount: 5000,
    listPrice: 21.83,
    categories: ["fantasy", "sci-fi"],
    tags: ["top-rated", "series", "cozy"],
    description: "Fluff 2 continues the wholesome LitRPG story of a girl raising adorable monsters in a system world where kindness is a superpower.",
    releaseDate: "2023-04-04",
    needsReview: true,
    q1: "Fluff 2 is the second book in RavensDagger's wholesome LitRPG series, following a young girl and her team of adorable monsters in a game-like world. Emma Galvin narrates this 12-hour audiobook.",
    q2: "For LitRPG readers who want a light, feel-good alternative to grim power fantasies, and families looking for a clean series to share. It solves the problem of finding a progression story without edge.",
    q3: "Perfect for family listening, commutes, and cozy weekends; the upbeat tone and monster antics make it easy to binge. A relaxing one-credit listen.",
    q4: "RavensDagger built a reputation for wholesome LitRPG, and Fluff 2 delivers the same charm with more depth. Galvin's narration makes every monster feel lovable.",
    q5: "Absolutely. Start your free 30-day Audible trial, download Fluff 2, and meet the monsters. New readers can start here, though book one is the best entry point."
  },
  "B0FH7LZ33H": {
    slug: "art-of-diploma-bee-bee-dungeon-icalos",
    title: "The Art of Diploma-Bee: A Dungeon-Core LitRPG: The Bee Dungeon, Book 3",
    author: "Icalos",
    narrator: "Savy Des-Etages",
    coverUrl: "https://m.media-amazon.com/images/I/51vMHQ5+3vL._SL500_.jpg",
    duration: "14h 0m",
    durationMinutes: 840,
    rating: 4.7,
    ratingCount: 1000,
    listPrice: 24.38,
    categories: ["fantasy", "sci-fi"],
    tags: ["series", "dungeon-core", "new-release"],
    description: "The Art of Diploma-Bee is the third Bee Dungeon book, where a dungeon-core bee empire takes on its biggest challenge yet.",
    releaseDate: "2025-11-11",
    needsReview: true,
    q1: "The Art of Diploma-Bee is the third book in Icalos' Bee Dungeon series, a dungeon-core LitRPG about a growing hive that builds its own dungeon. Savy Des-Etages narrates this 14-hour audiobook.",
    q2: "For dungeon-core and LitRPG fans who want a creative, unconventional progression story. It solves the problem of finding a series with genuinely fresh mechanics and a unique protagonist.",
    q3: "Great for long listening sessions and weekends; the hive-building systems reward focus. 14 hours is strong value for one credit.",
    q4: "A dungeon that is literally a bee empire is one of the most inventive premises in LitRPG, and Icalos executes it with humor and clever progression. Des-Etages brings the hive to life.",
    q5: "Absolutely. Start your free 30-day Audible trial and join the hive. New readers can start at book one for the full origin."
  },
  "B0DQX1JXYT": {
    slug: "all-the-dust-that-falls-four-zaifyr",
    title: "All the Dust That Falls Four: An Isekai LitRPG Adventure",
    author: "zaifyr",
    narrator: "Phil Thron",
    coverUrl: "https://m.media-amazon.com/images/I/51seT4cOTxL._SL500_.jpg",
    duration: "14h 0m",
    durationMinutes: 840,
    rating: 4.7,
    ratingCount: 4000,
    listPrice: 31.98,
    categories: ["fantasy", "sci-fi"],
    tags: ["top-rated", "series", "isekai"],
    description: "All the Dust That Falls Four continues the hilarious isekai LitRPG saga of a magical robot vacuum that accidentally conquers a fantasy world.",
    releaseDate: "2024-12-24",
    needsReview: true,
    q1: "All the Dust That Falls Four is the fourth book in zaifyr's isekai LitRPG series, following a robot vacuum cleaner that has become the most powerful being in a fantasy world. Phil Thron narrates this 14-hour audiobook.",
    q2: "For LitRPG fans who love absurd premises, dry humor, and unexpected heart. It solves the problem of finding a series that is genuinely funny while still delivering satisfying progression.",
    q3: "Perfect for commutes and marathon sessions; the comedic pacing keeps chapters flying. A great escape listen.",
    q4: "The concept is ridiculous in the best way, and zaifyr plays it completely straight, which is what makes it work. Thron's deadpan narration is perfect for the heroic Roomba.",
    q5: "Absolutely. Start your free 30-day Audible trial and meet the vacuum. New readers should begin with book one for the full joke."
  },
  "B0CZ1657J5": {
    slug: "end-of-the-trucking-world-battle-trucker-goldstein",
    title: "The End of the Trucking World: An Apocalypse LitRPG: Battle Trucker, Book 2",
    author: "Tom Goldstein",
    narrator: "Zura Johnson",
    coverUrl: "https://m.media-amazon.com/images/I/51fVvaDycJL._SL500_.jpg",
    duration: "12h 0m",
    durationMinutes: 720,
    rating: 4.6,
    ratingCount: 3000,
    listPrice: 23.17,
    categories: ["sci-fi", "fiction"],
    tags: ["series", "apocalypse", "litrpg"],
    description: "The End of the Trucking World is the second Battle Trucker book, following truckers who keep the supply lines running through a monster-filled apocalypse.",
    releaseDate: "2024-07-23",
    needsReview: true,
    q1: "The End of the Trucking World is the second book in Tom Goldstein's Battle Trucker series, an apocalypse LitRPG where truckers fight monsters to keep civilization moving. Zura Johnson narrates this 12-hour audiobook.",
    q2: "For LitRPG and apocalypse-fiction fans who want a grounded, working-class hero and high-octane action. It solves the problem of finding a series with a fresh profession-based angle.",
    q3: "Perfect for commutes, road trips, and action-packed evenings; the trucking premise fits long listening sessions especially well.",
    q4: "Goldstein turns truckers into underdog heroes, giving the apocalypse genre a blue-collar heart. Johnson's narration keeps the pace rolling.",
    q5: "Absolutely. Start your free 30-day Audible trial and hit the road. New readers can start here, though book one sets up the world."
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
