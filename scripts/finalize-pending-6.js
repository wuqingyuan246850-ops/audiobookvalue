const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BOOKS_PATH = path.join(ROOT, "books.json");
const PENDING_PATH = path.join(ROOT, "pending-books.json");

const FINALIZED = {
  "B0C3NS71SX": {
    slug: "quinn-jade-treasure-dragon-dragon-girls-mara",
    title: "Quinn the Jade Treasure Dragon (Dragon Girls #6)",
    author: "Maddy Mara",
    narrator: "Emily Eiden",
    coverUrl: "https://m.media-amazon.com/images/I/51fu5OOSF6L._SL500_.jpg",
    duration: "2h 0m",
    durationMinutes: 120,
    rating: 4.8,
    ratingCount: 5000,
    listPrice: 9.64,
    categories: ["children", "fantasy"],
    tags: ["best-seller", "top-rated", "series"],
    description: "Quinn the Jade Treasure Dragon is the sixth Dragon Girls adventure, where a brave girl must protect the magical Treasure Dragon realm.",
    releaseDate: "2023-11-14",
    needsReview: true,
    q1: "Quinn the Jade Treasure Dragon is the sixth book in Maddy Mara's Dragon Girls series, a short, magical adventure about a girl who must protect the Treasure Dragon realm. Emily Eiden narrates this 2-hour audiobook.",
    q2: "For young readers and families who love dragon stories with strong, kind heroines. It solves the problem of finding a clean, quick chapter book that keeps kids excited.",
    q3: "Perfect for car rides, bedtime, and classroom listening; the short runtime fits any schedule. A delightful pick for emerging readers.",
    q4: "The Dragon Girls series is a favorite for young fantasy fans, and Quinn's adventure adds charm and heart. Eiden's narration makes the magic feel immediate.",
    q5: "Absolutely. Start your free 30-day Audible trial and let your child meet Quinn. It is a perfect first audiobook."
  },
  "B0H3MHQH5W": {
    slug: "sam-battles-the-machine-eerie-elementary-chabert",
    title: "Sam Battles the Machine!: A Branches Book (Eerie Elementary, Book 6)",
    author: "Jack Chabert",
    narrator: "Charles Linshaw",
    coverUrl: "https://m.media-amazon.com/images/I/51yrbLw97ML._SL500_.jpg",
    duration: "1h 30m",
    durationMinutes: 90,
    rating: 4.8,
    ratingCount: 2000,
    listPrice: 21.62,
    categories: ["children"],
    tags: ["series", "kids", "new-release"],
    description: "Sam Battles the Machine! is the sixth Eerie Elementary Branches book, where Sam and his friends face the school's scariest robot yet.",
    releaseDate: "2026-12-01",
    needsReview: true,
    q1: "Sam Battles the Machine! is the sixth book in Jack Chabert's Eerie Elementary Branches series, a spooky-but-fun early chapter book about kids defending their haunted school. Charles Linshaw narrates.",
    q2: "For early readers who love mild scares, school adventures, and fast action. It solves the problem of finding a fun, kid-safe series for reluctant readers.",
    q3: "Perfect for car rides, bedtime, and short listening sessions; the brisk pace keeps young listeners hooked from start to finish.",
    q4: "Eerie Elementary is a staple of the Branches line, blending humor with just enough spookiness. Linshaw's narration brings the machine menace to life.",
    q5: "Absolutely. Start your free 30-day Audible trial and join Sam's fight. It is a quick, exciting listen for young readers."
  },
  "B0H45GLTSX": {
    slug: "still-lost-tales-from-2080-miller",
    title: "Still Lost: Tales from 2080",
    author: "Sam A. Miller",
    narrator: "Sam A. Miller",
    coverUrl: "https://m.media-amazon.com/images/I/518jG6bLNTL._SL500_.jpg",
    duration: "11h 0m",
    durationMinutes: 660,
    rating: 4.6,
    ratingCount: 1000,
    listPrice: 0,
    categories: ["sci-fi", "fiction"],
    tags: ["new-release", "humor", "bestseller"],
    description: "Still Lost: Tales from 2080 is a funny, sharp sci-fi collection for readers who love Matt Dinniman and Andy Weir, full of clever near-future stories.",
    releaseDate: "2026-09-29",
    needsReview: true,
    q1: "Still Lost: Tales from 2080 is a sci-fi short-story collection by Sam A. Miller, blending humor and big ideas in a near-future world. At 11 hours, it is a fun, clever listen for speculative-fiction fans.",
    q2: "For readers who love the wit of Matt Dinniman and the science of Andy Weir, and anyone who enjoys sharp short stories. It solves the problem of finding a varied, entertaining sci-fi listen.",
    q3: "Perfect for commutes and evenings; each story is self-contained, making it easy to pause between tales. A flexible, enjoyable listen.",
    q4: "Miller's collection captures the humor and curiosity of modern sci-fi favorites, with stories that are both funny and surprisingly thoughtful. Great for readers who want a taste of many ideas in one credit.",
    q5: "Absolutely. Start your free 30-day Audible trial and dive into 2080. Short-story fans will find something to love in every chapter."
  },
  "B005RZ7COU": {
    slug: "magic-school-bus-inside-the-earth-cole",
    title: "The Magic School Bus Inside the Earth",
    author: "Joanna Cole",
    narrator: "Polly Adams",
    coverUrl: "https://m.media-amazon.com/images/I/61SaVGBEoLL._SL500_.jpg",
    duration: "1h 0m",
    durationMinutes: 60,
    rating: 4.7,
    ratingCount: 1000,
    listPrice: 3.83,
    categories: ["children", "science"],
    tags: ["classic", "kids", "education"],
    description: "The Magic School Bus Inside the Earth is the classic science adventure where Ms. Frizzle takes her class on a journey to the planet's core.",
    releaseDate: "2011-10-01",
    needsReview: true,
    q1: "The Magic School Bus Inside the Earth is the beloved science classic by Joanna Cole, narrated by Polly Adams. In about 1 hour, Ms. Frizzle takes her class on a wild field trip to the center of the Earth.",
    q2: "For young science lovers and families who want learning disguised as adventure. It solves the problem of making geology and earth science genuinely fun for kids.",
    q3: "Perfect for car rides, classroom listening, and bedtime; the short runtime makes it easy to fit into any day.",
    q4: "The Magic School Bus remains one of the most successful educational franchises ever, and this audiobook captures the original's playful curiosity. It is a timeless way to introduce kids to science.",
    q5: "Absolutely. Start your free 30-day Audible trial and climb aboard the bus. It is a perfect first science audiobook for young listeners."
  },
  "B0GJTC6LTK": {
    slug: "the-next-war-tsarfati",
    title: "The Next War",
    author: "Amir Tsarfati",
    narrator: "Stephen Bowlby",
    coverUrl: "https://m.media-amazon.com/images/I/5131uwkOiYL._SL500_.jpg",
    duration: "9h 0m",
    durationMinutes: 540,
    rating: 4.7,
    ratingCount: 3000,
    listPrice: 21.09,
    categories: ["politics-social", "religion-spirituality"],
    tags: ["new-release", "best-seller", "prophecy"],
    description: "The Next War by Amir Tsarfati examines today's Middle East conflicts through a biblical prophecy lens, explaining what the next war could mean for the world.",
    releaseDate: "2026-05-05",
    needsReview: true,
    q1: "The Next War by Amir Tsarfati is a 2026 book examining Middle East conflicts through biblical prophecy, narrated by Stephen Bowlby. This 9-hour audiobook connects current events to end-times teaching.",
    q2: "For readers interested in prophecy, Bible teaching, and current Middle East geopolitics. It solves the problem of understanding today's headlines through a faith-based framework.",
    q3: "Great for commutes and focused evenings; the teaching structure makes it easy to digest chapter by chapter.",
    q4: "Tsarfati brings insider knowledge of Israel and the Middle East, and Bowlby's narration keeps the serious subject accessible. It is a compelling listen for prophecy-focused readers.",
    q5: "Absolutely. Start your free 30-day Audible trial and follow the analysis. It is an engaging listen for anyone following these events."
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
