const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BOOKS_PATH = path.join(ROOT, "books.json");
const PENDING_PATH = path.join(ROOT, "pending-books.json");

const FINALIZED = {
  "B0H4HPJKVY": {
    slug: "sword-saint-and-the-fall-of-evermarch-stahl",
    title: "The Sword Saint and the Fall of Evermarch: A Second Chance LitRPG Progression Fantasy",
    author: "D STAHL",
    narrator: "Nikki Lyons",
    coverUrl: "https://m.media-amazon.com/images/I/510V3QrfhAL._SL500_.jpg",
    duration: "16h 0m",
    durationMinutes: 960,
    rating: 4.7,
    ratingCount: 1000,
    listPrice: 26.79,
    categories: ["fantasy", "sci-fi"],
    tags: ["litrpg", "new-release", "progression"],
    description: "The Sword Saint and the Fall of Evermarch is a second-chance LitRPG where a legendary sword saint returns to a crumbling world armed with knowledge from a previous life.",
    releaseDate: "2026-06-08",
    needsReview: true,
    q1: "The Sword Saint and the Fall of Evermarch is a 2026 LitRPG progression fantasy by D STAHL, following a legendary sword saint reborn into a world on the brink of collapse. Nikki Lyons narrates this 16-hour audiobook.",
    q2: "For LitRPG fans who love second-chance stories, deep progression systems, and a protagonist with decades of hard-won skill. It solves the problem of finding a fresh power-fantasy with real stakes.",
    q3: "Perfect for long listening sessions and weekends; the progression grind and world-building reward dedicated listening. 16 hours is strong value for one credit.",
    q4: "The second-chance setup lets the hero be genuinely powerful without losing tension, and the sword-saint premise adds a martial elegance rare in LitRPG. Lyons' narration carries both action and introspection.",
    q5: "Absolutely. Start your free 30-day Audible trial, download it, and the rebirth hook lands in the first chapter. LitRPG fans will be immediately engaged."
  },
  "B07KYV91LG": {
    slug: "hive-queen-wings-of-fire-sutherland",
    title: "The Hive Queen: Wings of Fire, Book 12",
    author: "Tui T. Sutherland",
    narrator: "Shannon McManus",
    coverUrl: "https://m.media-amazon.com/images/I/51+FQjpX73L._SL500_.jpg",
    duration: "6h 30m",
    durationMinutes: 390,
    rating: 4.8,
    ratingCount: 10000,
    listPrice: 17.02,
    categories: ["fantasy", "teen-young-adult"],
    tags: ["best-seller", "top-rated", "series"],
    description: "The Hive Queen is the twelfth Wings of Fire book, following Cricket as she uncovers the terrifying truth behind the LeafWings and the hive-controlled queen.",
    releaseDate: "2018-12-26",
    needsReview: true,
    q1: "The Hive Queen is the twelfth book in Tui T. Sutherland's Wings of Fire series, a dragon fantasy about a curious young dragon discovering a dark secret. Shannon McManus narrates this 6.5-hour audiobook.",
    q2: "For middle-grade and young-adult fantasy readers who love dragons, found family, and brave heroines, plus parents looking for a clean series to share. It solves the problem of finding a long-running series with real heart.",
    q3: "Perfect for family listening, car trips, and bedtime sessions; the fast pace and short chapters keep young listeners hooked.",
    q4: "Wings of Fire is one of the most beloved dragon series in middle-grade fiction, and McManus gives every dragon a distinct voice. Book 12 introduces a compelling new protagonist without losing the series' magic.",
    q5: "Absolutely. Start your free 30-day Audible trial and join the dragons. New readers can start here, though book one is the best introduction."
  },
  "B07BFH32TN": {
    slug: "lost-continent-wings-of-fire-sutherland",
    title: "The Lost Continent (Wings of Fire, Book 11)",
    author: "Tui T. Sutherland",
    narrator: "Shannon McManus",
    coverUrl: "https://m.media-amazon.com/images/I/51ueZ4nx9zL._SL500_.jpg",
    duration: "7h 0m",
    durationMinutes: 420,
    rating: 4.8,
    ratingCount: 9000,
    listPrice: 19.49,
    categories: ["fantasy", "teen-young-adult"],
    tags: ["best-seller", "top-rated", "series"],
    description: "The Lost Continent launches the second Wings of Fire arc, following five young dragons who must save a hidden world from a mysterious danger.",
    releaseDate: "2018-06-26",
    needsReview: true,
    q1: "The Lost Continent is the eleventh Wings of Fire book and the start of the second story arc, following a new generation of dragon heroes in a hidden land. Shannon McManus narrates this 7-hour audiobook.",
    q2: "For Wings of Fire fans ready for a new arc and middle-grade fantasy readers who love adventure, prophecy, and diverse casts. It solves the problem of finding a fresh entry point into a beloved series.",
    q3: "Perfect for family listening and weekends; the new setting and characters make it easy to pick up. A great series starter.",
    q4: "The Lost Continent opens up the Wings of Fire world with new tribes and a new prophecy, and McManus keeps the energy high. It is a perfect place for new listeners to begin.",
    q5: "Absolutely. Start your free 30-day Audible trial and cross the ocean. New readers can start here without prior series knowledge."
  },
  "B07ZDM41RB": {
    slug: "dragonslayer-wings-of-fire-legends-sutherland",
    title: "Dragonslayer: Wings of Fire: Legends",
    author: "Tui T. Sutherland",
    narrator: "Shannon McManus",
    coverUrl: "https://m.media-amazon.com/images/I/5118uQEDh-L._SL500_.jpg",
    duration: "8h 0m",
    durationMinutes: 480,
    rating: 4.7,
    ratingCount: 5000,
    listPrice: 22.49,
    categories: ["fantasy", "teen-young-adult"],
    tags: ["top-rated", "series", "legend"],
    description: "Dragonslayer is a Wings of Fire Legends novel set centuries before the main series, telling the story of the last human dragonslayer and his fateful encounter with dragons.",
    releaseDate: "2020-03-03",
    needsReview: true,
    q1: "Dragonslayer is a Wings of Fire Legends novel, a standalone prequel about the last human dragonslayer set long before the main series. Shannon McManus narrates this 8-hour audiobook.",
    q2: "For Wings of Fire fans who want the world's history and readers who enjoy human-dragon perspectives. It solves the problem of a companion novel that deepens the main series.",
    q3: "Perfect for weekends and family listening; the standalone story makes it easy to enjoy without catching up on the whole series.",
    q4: "Seeing the world through a human dragonslayer's eyes gives the series a fresh, mythic scale, and McManus handles the dual perspective with skill. It is essential lore for Wings of Fire fans.",
    q5: "Absolutely. Start your free 30-day Audible trial and step into the legends. No prior Wings of Fire knowledge is required."
  },
  "B07DJTKWRF": {
    slug: "princess-in-black-science-fair-scare-hale",
    title: "The Princess in Black and the Science Fair Scare",
    author: "Shannon Hale",
    narrator: "Julia Whelan",
    coverUrl: "https://m.media-amazon.com/images/I/61cbbDwPV2L._SL500_.jpg",
    duration: "1h 0m",
    durationMinutes: 60,
    rating: 4.7,
    ratingCount: 1000,
    listPrice: 6.30,
    categories: ["children"],
    tags: ["series", "kids", "quick-listen"],
    description: "The Princess in Black and the Science Fair Scare is a short, delightful adventure where a science fair monster interruption needs a princess-sized rescue.",
    releaseDate: "2018-09-25",
    needsReview: true,
    q1: "The Princess in Black and the Science Fair Scare is a short children's adventure by Shannon and Dean Hale, narrated by Julia Whelan. At about 1 hour, it is perfect for young listeners.",
    q2: "For early readers and families who want a quick, clean audiobook for car rides or bedtime. It solves the problem of finding kid-friendly stories with heart and humor.",
    q3: "Perfect for a single car ride, nap-time wind-down, or a classroom listening session; the short runtime fits any schedule.",
    q4: "The Princess in Black series is a modern classic of early chapter books, and Whelan's narration makes the monster-fighting princess irresistible. This entry is a bite-sized delight.",
    q5: "Absolutely. Start your free 30-day Audible trial and let your child enjoy it immediately. It is a perfect first audiobook."
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
