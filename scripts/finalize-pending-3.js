const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BOOKS_PATH = path.join(ROOT, "books.json");
const PENDING_PATH = path.join(ROOT, "pending-books.json");

const FINALIZED = {
  "B08G6MHRWC": {
    slug: "champion-of-the-titan-games-dragonwatch-mull",
    title: "Champion of the Titan Games: Dragonwatch, Book 4",
    author: "Brandon Mull",
    narrator: "Kirby Heyborne",
    coverUrl: "https://m.media-amazon.com/images/I/61v6uuXAMEL._SL500_.jpg",
    duration: "12h 0m",
    durationMinutes: 720,
    rating: 4.8,
    ratingCount: 5000,
    listPrice: 23.45,
    categories: ["fantasy", "teen-young-adult"],
    tags: ["best-seller", "top-rated", "series"],
    description: "Champion of the Titan Games is the fourth Dragonwatch book by Brandon Mull, pitting Kendra and Seth against the legendary Titans in a battle for the fate of the dragon sanctuaries.",
    releaseDate: "2020-10-13",
    needsReview: true,
    q1: "Champion of the Titan Games is the fourth book in Brandon Mull's Dragonwatch series, continuing the guardians' fight to protect the dragon sanctuaries. Kirby Heyborne narrates this 12-hour fantasy audiobook.",
    q2: "For young-adult and middle-grade fantasy fans who loved Fablehaven, plus anyone who enjoys high-stakes quests with family bonds. It solves the problem of finding a long-running fantasy series with clean, exciting adventure.",
    q3: "Perfect for family listening, road trips, and evenings; the quest structure keeps chapters moving. A strong one-credit value for fantasy families.",
    q4: "Mull is a master of inventive fantasy with real heart, and this entry raises the stakes with the Titans themselves. Heyborne's narration brings Kendra, Seth, and the dragon cast vividly to life.",
    q5: "Absolutely. Start your free 30-day Audible trial and join the guardians. New readers can jump in, though starting with Dragonwatch book one gives the full arc."
  },
  "B07Y2BK67J": {
    slug: "master-of-the-phantom-isle-dragonwatch-mull",
    title: "Master of the Phantom Isle: Dragonwatch, Book 3",
    author: "Brandon Mull",
    narrator: "Kirby Heyborne",
    coverUrl: "https://m.media-amazon.com/images/I/61laEAYQQjL._SL500_.jpg",
    duration: "12h 0m",
    durationMinutes: 720,
    rating: 4.8,
    ratingCount: 5000,
    listPrice: 23.09,
    categories: ["fantasy", "teen-young-adult"],
    tags: ["best-seller", "top-rated", "series"],
    description: "Master of the Phantom Isle continues Dragonwatch as Seth is trapped in a shadowy realm and Kendra races to save him before the sanctuary falls.",
    releaseDate: "2019-10-01",
    needsReview: true,
    q1: "Master of the Phantom Isle is the third Dragonwatch novel by Brandon Mull, where Seth finds himself stranded in a dark world while Kendra fights to bring him home. Kirby Heyborne narrates.",
    q2: "For Dragonwatch and Fablehaven fans who want the next chapter of the saga, plus fantasy readers who love sibling bonds under pressure. It solves the problem of a series that keeps raising the stakes.",
    q3: "Great for family listening and weekends; the split-perspective story keeps both threads exciting. A comfortable one-credit commitment.",
    q4: "Mull gives Seth and Kendra very different, compelling arcs in this entry, and the world-building keeps expanding. Heyborne's narration makes every realm feel distinct.",
    q5: "Absolutely. Start your free 30-day Audible trial and follow both journeys. Series readers will not want to wait."
  },
  "B09KHH7PNR": {
    slug: "return-of-the-dragon-slayers-dragonwatch-mull",
    title: "Return of the Dragon Slayers: Dragonwatch, Book 5",
    author: "Brandon Mull",
    narrator: "Kirby Heyborne",
    coverUrl: "https://m.media-amazon.com/images/I/6130FByl7sL._SL500_.jpg",
    duration: "13h 0m",
    durationMinutes: 780,
    rating: 4.8,
    ratingCount: 4000,
    listPrice: 25.22,
    categories: ["fantasy", "teen-young-adult"],
    tags: ["best-seller", "top-rated", "series"],
    description: "Return of the Dragon Slayers is the epic conclusion to Brandon Mull's Dragonwatch series, ending the guardians' war with dragons in a finale fans have been waiting for.",
    releaseDate: "2021-10-27",
    needsReview: true,
    q1: "Return of the Dragon Slayers is the fifth and final Dragonwatch novel, concluding Brandon Mull's epic guardians-versus-dragons saga. Kirby Heyborne narrates this 13-hour finale.",
    q2: "For Dragonwatch readers who need the ending and fantasy families who want a complete, satisfying series. It solves the problem of finding a finale that pays off years of buildup.",
    q3: "Perfect for marathon listening and long trips; the climactic pacing keeps you going. A rewarding final chapter for the series.",
    q4: "Mull delivers a finale that honors every character arc, and Heyborne's narration gives the conclusion real weight. It is a must-listen for anyone who started the series.",
    q5: "Absolutely. Start your free 30-day Audible trial and reach the end of the war. Series fans should not miss this one."
  },
  "B07PMFKLTY": {
    slug: "wizenard-training-camp-bryant-king",
    title: "The Wizenard Series: Training Camp",
    author: "Wesley King",
    narrator: "Phylicia Rashad",
    coverUrl: "https://m.media-amazon.com/images/I/51ZORBnvk+L._SL500_.jpg",
    duration: "8h 0m",
    durationMinutes: 480,
    rating: 4.7,
    ratingCount: 6000,
    listPrice: 27.15,
    categories: ["fantasy", "teen-young-adult"],
    tags: ["best-seller", "series", "sports"],
    description: "The Wizenard Series: Training Camp, created with Kobe Bryant, follows five young basketball players transformed by a mysterious coach with magical training methods.",
    releaseDate: "2019-03-19",
    needsReview: true,
    q1: "The Wizenard Series: Training Camp is a fantasy-sports novel created with Kobe Bryant and written by Wesley King, following five players changed by a mysterious coach. Phylicia Rashad narrates this 8-hour audiobook.",
    q2: "For young athletes, sports fans, and readers who love stories about self-belief and teamwork. It solves the problem of finding a book that combines magical fantasy with genuine sports inspiration.",
    q3: "Perfect for family listening, commutes, and pre-game motivation; each player's perspective makes it easy to pick up. A strong choice for young listeners.",
    q4: "Kobe Bryant's signature Mamba mentality is baked into every lesson, and Rashad's narration gives the story warmth and power. It is both a fantasy and a genuine sports philosophy.",
    q5: "Absolutely. Start your free 30-day Audible trial and step into the mysterious training camp. Young readers and athletes will be hooked quickly."
  },
  "B09GDGBZ7P": {
    slug: "tristan-strong-keeps-punching-mbalia",
    title: "Tristan Strong Keeps Punching",
    author: "Kwame Mbalia",
    narrator: "Amir Abdullah",
    coverUrl: "https://m.media-amazon.com/images/I/51Coj3gYi6L._SL500_.jpg",
    duration: "11h 0m",
    durationMinutes: 660,
    rating: 4.7,
    ratingCount: 3000,
    listPrice: 19.95,
    categories: ["fantasy", "teen-young-adult"],
    tags: ["best-seller", "series", "mythology"],
    description: "Tristan Strong Keeps Punching is the third book in Kwame Mbalia's Rick Riordan Presents series, sending Tristan back into Alke to stop a dangerous cosmic force.",
    releaseDate: "2021-10-19",
    needsReview: true,
    q1: "Tristan Strong Keeps Punching is the third novel in Kwame Mbalia's Rick Riordan Presents saga, following Tristan into the mythic world of Alke once more. Amir Abdullah narrates this 11-hour adventure.",
    q2: "For middle-grade readers who love mythology, humor, and heroes with heart, especially fans of Percy Jackson. It solves the problem of finding a mythology series rooted in African American folklore.",
    q3: "Perfect for family listening, car trips, and young readers' bedtime sessions; the action and humor keep it engaging. A great series to share.",
    q4: "Mbalia blends African American folklore with action-packed fantasy, and Abdullah's narration gives every character energy. It is a fresh, inclusive addition to the mythology-adventure genre.",
    q5: "Absolutely. Start your free 30-day Audible trial and rejoin Tristan in Alke. New readers can start here, though book one is the best introduction."
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
