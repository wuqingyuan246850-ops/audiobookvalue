const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BOOKS_PATH = path.join(ROOT, "books.json");
const PENDING_PATH = path.join(ROOT, "pending-books.json");

const FINALIZED = {
  "B07JR5C68S": {
    slug: "ethic-ii-ashley-antoinette",
    title: "Ethic II",
    author: "Ashley Antoinette",
    narrator: "Nicole Small",
    coverUrl: "https://m.media-amazon.com/images/I/41at9D6uT7L._SL500_.jpg",
    duration: "9h 30m",
    durationMinutes: 570,
    rating: 4.7,
    ratingCount: 5000,
    listPrice: 19.89,
    categories: ["fiction", "romance"],
    tags: ["best-seller", "series", "urban-fiction"],
    description: "Ethic II continues Ashley Antoinette's gripping urban romance saga, following the dangerous, loyal man known as Ethic as love, loyalty, and violence collide. Nicole Small's narration brings the heat and heartache to life.",
    releaseDate: "2018-11-06",
    needsReview: false,
    q1: "Ethic II by Ashley Antoinette is the second installment in the Ethic series, a raw and addictive urban romance about a man with a violent past and a soft spot for the woman who sees through it. Nicole Small narrates this 9.5-hour audiobook.",
    q2: "For readers who love intense urban romance, morally complex heroes, and family drama that pulls no punches. It solves the problem of finding a series that combines street-level grit with genuinely emotional love stories.",
    q3: "Perfect for evening listening and weekend binges; the fast pacing and dramatic turns make it hard to pause. A strong one-credit listen for fans of the genre.",
    q4: "Ashley Antoinette is one of the most popular voices in urban fiction, and Ethic stands out because the hero is dangerous yet tender. Small's narration captures both the tension and the vulnerability that made the series a favorite.",
    q5: "Absolutely. Start your free 30-day Audible trial, download Ethic II, and you will be drawn into the story in the first chapter. Series readers can jump straight in; new readers can start here and still get hooked."
  },
  "B0CVBL96F9": {
    slug: "blow-the-man-down-pirates-of-new-earth-sarah-branson",
    title: "Blow the Man Down: Pirates of New Earth, Book 4",
    author: "Sarah Branson",
    narrator: "Helen Laser",
    coverUrl: "https://m.media-amazon.com/images/I/51g-73B2F2L._SL500_.jpg",
    duration: "10h 0m",
    durationMinutes: 600,
    rating: 4.6,
    ratingCount: 3000,
    listPrice: 17.57,
    categories: ["fiction", "fantasy"],
    tags: ["series", "cozy", "adventure"],
    description: "Blow the Man Down is the fourth Pirates of New Earth adventure, a swashbuckling cozy fantasy romance about found family, second chances, and life on the high seas.",
    releaseDate: "2024-02-09",
    needsReview: false,
    q1: "Blow the Man Down is the fourth book in Sarah Branson's Pirates of New Earth series, a cozy fantasy adventure about pirates, romance, and chosen family. Helen Laser narrates this 10-hour audiobook.",
    q2: "For readers who love swashbuckling adventures with heart, found-family dynamics, and gentle romance. It solves the problem of finding a fantasy series that is adventurous without being dark or stressful.",
    q3: "Great for commutes, road trips, and relaxed evenings; the episodic adventure structure makes it easy to pick up and put down. A comforting, entertaining listen.",
    q4: "Branson blends classic pirate adventure with cozy warmth, and Laser's narration gives each crew member a distinct voice. It is a refreshing change from grimdark fantasy.",
    q5: "Absolutely. Start your free 30-day Audible trial, download Blow the Man Down, and join the crew. New listeners can jump in, though starting with book one gives the fullest story."
  },
  "B0CYQYCZ9B": {
    slug: "burn-the-ship-pirates-of-new-earth-sarah-branson",
    title: "Burn the Ship: Pirates of New Earth, Book 3",
    author: "Sarah Branson",
    narrator: "Helen Laser",
    coverUrl: "https://m.media-amazon.com/images/I/514nfcQ6cFL._SL500_.jpg",
    duration: "10h 0m",
    durationMinutes: 600,
    rating: 4.6,
    ratingCount: 3000,
    listPrice: 20.05,
    categories: ["fiction", "fantasy"],
    tags: ["series", "cozy", "adventure"],
    description: "Burn the Ship takes the Pirates of New Earth crew deeper into danger and romance, where committing fully means leaving the past behind.",
    releaseDate: "2024-03-21",
    needsReview: false,
    q1: "Burn the Ship is the third book in Sarah Branson's Pirates of New Earth series, following the crew as they risk everything for the future they want. Helen Laser narrates this 10-hour cozy fantasy adventure.",
    q2: "For readers who love pirate adventures, slow-burn romance, and crews that feel like family. It solves the problem of finding a series that keeps improving while staying warm and fun.",
    q3: "Perfect for evenings and weekends; the adventure and romance pacing make it easy to binge. A comforting, entertaining listen.",
    q4: "The series gets richer with each book, and Burn the Ship raises the emotional stakes while keeping the swashbuckling fun. Laser's narration makes every crew member feel alive.",
    q5: "Absolutely. Start your free 30-day Audible trial and continue the voyage. Series fans will love this turning point; new readers can start at book one."
  },
  "B09M8WKTN7": {
    slug: "thud-terry-pratchett",
    title: "Thud!",
    author: "Terry Pratchett",
    narrator: "Jon Culshaw",
    coverUrl: "https://m.media-amazon.com/images/I/51KM+ju8ZiL._SL500_.jpg",
    duration: "11h 30m",
    durationMinutes: 690,
    rating: 4.8,
    ratingCount: 10000,
    listPrice: 0,
    categories: ["fiction", "fantasy"],
    tags: ["classic", "top-rated", "series"],
    description: "Thud! is Terry Pratchett's brilliant Discworld novel about Commander Vimes unraveling a conspiracy that could reignite a centuries-old war. Jon Culshaw's narration is a tour de force.",
    releaseDate: "2023-05-25",
    needsReview: false,
    q1: "Thud! by Terry Pratchett is a Discworld classic following Commander Sam Vimes as he hunts a conspiracy threatening to restart an ancient dwarfish war. Jon Culshaw narrates this 11.5-hour audiobook.",
    q2: "For Discworld fans, fantasy readers who love wit, and anyone who enjoys detective stories with satire. It solves the problem of finding a book that is both hilarious and genuinely thoughtful about prejudice and violence.",
    q3: "Perfect for commutes and evenings; the mystery structure keeps chapters moving while the humor rewards close listening. A great entry point for newcomers to Pratchett.",
    q4: "Pratchett packs more ideas into one novel than most authors manage in a career, and Culshaw's one-man performance of the entire Discworld cast is extraordinary. Vimes is one of the greatest characters in fantasy.",
    q5: "Absolutely. Start your free 30-day Audible trial, download Thud!, and Vimes's investigation hooks you immediately. You do not need prior Discworld knowledge to enjoy it."
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
