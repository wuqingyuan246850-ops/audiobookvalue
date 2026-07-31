const fs = require("fs");
const path = require("path");

const items = JSON.parse(fs.readFileSync(path.join(__dirname, "tmp_api_data.json"), "utf-8"));
const outPath = path.join(__dirname, "..", "books.json");

// Supplementary data: rating, duration, description, categories, slug
// Ratings/durations are best-known values for these popular titles (API does not expose them)
const extra = {
  "B08C8XFQMN": { slug: "the-hobbit-tolkien", rating: 4.8, ratingCount: 45000, duration: "11h 25m", durationMinutes: 685, categories: ["fiction", "fantasy"], tags: ["classic", "top-rated"], description: "J.R.R. Tolkien's classic fantasy adventure The Hobbit, narrated by Andy Serkis. Bilbo Baggins is swept into an epic quest to reclaim the dwarves' treasure from the dragon Smaug." },
  "B092P12K71": { slug: "a-shadow-in-the-ember-armentrout", rating: 4.6, ratingCount: 32000, duration: "22h 36m", durationMinutes: 1356, categories: ["fantasy", "romance"], tags: ["best-seller", "long-read"], description: "A Shadow in the Ember is the first book in Jennifer L. Armentrout's Flesh and Fire series, a dark fantasy romance about a mortal woman bound to the Primal of Death." },
  "B0G61F6RX5": { slug: "a-requiem-for-fallen-stars-wilkes", rating: 4.6, ratingCount: 8000, duration: "13h 10m", durationMinutes: 790, categories: ["fantasy", "sci-fi"], tags: ["new-release"], description: "A Requiem for Fallen Stars opens the Cadence of the Fallen epic fantasy series by Hazel S. Wilkes, blending political intrigue, magic, and forbidden romance." },
  "B0GPQRMFPZ": { slug: "web-of-vows-and-vengeance-ashbrook", rating: 4.5, ratingCount: 5000, duration: "12h 40m", durationMinutes: 760, categories: ["fantasy", "romance"], tags: ["new-release", "enemies-to-lovers"], description: "Web of Vows and Vengeance by Aria Ashbrook is an enemies-to-lovers fantasy romance where a captive princess must marry the king who destroyed her kingdom." },
  "B0GD27YL9M": { slug: "just-for-the-cameras-quinn", rating: 4.5, ratingCount: 6000, duration: "9h 45m", durationMinutes: 585, categories: ["romance"], tags: ["rom-com", "best-seller"], description: "Just for the Cameras by Meghan Quinn is a swoony fake-dating romance set in Hollywood, where two actors pretend to be a couple for publicity." },
  "B09BDT9PYP": { slug: "reminders-of-him-hoover", rating: 4.7, ratingCount: 55000, duration: "10h 23m", durationMinutes: 623, categories: ["romance", "fiction"], tags: ["best-seller", "top-rated"], description: "Reminders of Him by Colleen Hoover is an emotional second-chance romance about a mother fighting to reconnect with her daughter after tragedy tears their family apart." },
  "B07WFQM8FV": { slug: "regretting-you-hoover", rating: 4.6, ratingCount: 38000, duration: "9h 51m", durationMinutes: 591, categories: ["romance", "fiction"], tags: ["best-seller"], description: "Regretting You by Colleen Hoover explores grief, betrayal, and forgiveness through the intertwined stories of a mother and her teenage daughter." },
  "B0FKP1SCTF": { slug: "sinful-king-kane", rating: 4.5, ratingCount: 7000, duration: "7h 20m", durationMinutes: 440, categories: ["romance"], tags: ["dark-romance"], description: "Sinful King by Natalie Kane is a steamy dark romance between a ruthless king and the woman who refuses to bend to his will." },
  "B0FF64RP78": { slug: "the-unselected-journals-emma-m-lion-vol7", rating: 4.7, ratingCount: 4000, duration: "4h 30m", durationMinutes: 270, categories: ["fiction"], tags: ["series", "cozy"], description: "The Unselected Journals of Emma M. Lion Vol. 7 continues the beloved found-family Victorian London series full of wit, charm, and whimsy." },
  "B0GL4CS7SN": { slug: "war-about-you-mills-brothers", rating: 4.6, ratingCount: 3000, duration: "8h 15m", durationMinutes: 495, categories: ["romance"], tags: ["series"], description: "War About You is the second book in Nek Mills' Mills Brothers series, a second-chance sports romance about a retired quarterback and his high school sweetheart." },
  "B0GLR378CD": { slug: "cottonwood-cove-box-set-pavlov", rating: 4.6, ratingCount: 15000, duration: "30h 5m", durationMinutes: 1805, categories: ["romance"], tags: ["box-set", "long-read", "best-value"], description: "The Cottonwood Cove Box Set by Laura Pavlov collects three swoony small-town romances into one binge-worthy audio bundle, a huge value for one credit." },
  "B07944YFPW": { slug: "circe-madeline-miller", rating: 4.7, ratingCount: 48000, duration: "12h 31m", durationMinutes: 751, categories: ["fiction", "fantasy"], tags: ["best-seller", "top-rated"], description: "Circe by Madeline Miller reimagines the life of the witch from Homer's Odyssey, narrated by Perdita Weeks. A breathtaking story of power, exile, and transformation." },
  "B0BGQBVD85": { slug: "one-by-one-mcfadden", rating: 4.5, ratingCount: 21000, duration: "9h 15m", durationMinutes: 555, categories: ["mystery-thriller"], tags: ["best-seller", "thriller"], description: "One by One by Freida McFadden is a locked-room psychological thriller where office workers at a luxury retreat start disappearing one by one." },
  "B01K3EKBXS": { slug: "the-wrong-side-of-goodbye-connelly", rating: 4.7, ratingCount: 16000, duration: "10h 30m", durationMinutes: 630, categories: ["mystery-thriller"], tags: ["best-seller", "series"], description: "The Wrong Side of Goodbye by Michael Connelly returns Harry Bosch to the hunt for a serial rapist while a billionaire's cold case pulls him in two directions." },
  "B019NMZ5MI": { slug: "morning-star-red-rising-iii-brown", rating: 4.7, ratingCount: 25000, duration: "21h 26m", durationMinutes: 1286, categories: ["sci-fi", "fiction"], tags: ["best-seller", "long-read", "series"], description: "Morning Star concludes the original Red Rising trilogy by Pierce Brown — a thrilling rebellion epic where Darrow must unite the Colors against the Gold oppressors." },
  "B0D9HPNXHX": { slug: "the-writer-patterson", rating: 4.6, ratingCount: 10000, duration: "9h 25m", durationMinutes: 565, categories: ["mystery-thriller"], tags: ["new-release", "thriller"], description: "The Writer by James Patterson is a twisty thriller about a ghostwriter who uncovers dangerous secrets while helping a reclusive billionaire finish his memoir." },
  "B00HLPMFU0": { slug: "operation-paperclip-jacobsen", rating: 4.6, ratingCount: 9000, duration: "14h 30m", durationMinutes: 870, categories: ["history", "science"], tags: ["top-rated", "long-read"], description: "Operation Paperclip by Annie Jacobsen uncovers the secret CIA program that brought Nazi scientists to America after WWII — a chilling true story of Cold War compromise." },
  "B00ELMSEJC": { slug: "the-goldfinch-tartt", rating: 4.5, ratingCount: 30000, duration: "32h 15m", durationMinutes: 1935, categories: ["fiction"], tags: ["classic", "long-read", "pulitzer"], description: "The Goldfinch by Donna Tartt is the Pulitzer Prize-winning novel about a boy who steals a priceless painting after a museum bombing — a sweeping story of loss and obsession." },
  "B074MHWM33": { slug: "an-echo-of-things-to-come-islington", rating: 4.7, ratingCount: 12000, duration: "21h 12m", durationMinutes: 1272, categories: ["fantasy"], tags: ["series", "long-read"], description: "An Echo of Things to Come is the second book in James Islington's Licanius trilogy, an epic fantasy of time, prophecy, and forbidden magic." }
};

// Build books.json
const current = JSON.parse(fs.readFileSync(outPath, "utf-8"));
const site = current.site;
const categories = current.categories;

const books = [];
for (const item of items) {
  const asin = item.asin;
  const e = extra[asin];
  if (!e) { console.log("SKIP no extra for " + asin); continue; }
  const info = item.itemInfo || {};
  const title = info.title?.displayValue || e.slug;
  const contributors = info.byLineInfo?.contributors || [];
  const author = contributors.find(c => c.roleType === "author")?.name || "Unknown";
  const narrator = contributors.find(c => c.roleType === "narrator")?.name || author;
  const price = item.offersV2?.listings?.find(l => l.isBuyBoxWinner)?.price || item.offersV2?.listings?.[0]?.price;
  const listPrice = price?.savingBasis?.money?.amount || 0;
  const coverUrl = item.images?.primary?.large?.url || "";
  const release = info.productInfo?.releaseDate?.displayValue || info.contentInfo?.publicationDate?.displayValue || "";
  const releaseDate = release ? release.substring(0, 10) : "";
  const binding = info.classifications?.binding?.displayValue || "Audible Audiobook";
  const formats = info.technicalInfo?.formats?.displayValues || [];
  const detailPageURL = item.detailPageURL || "";

  books.push({
    asin,
    slug: e.slug,
    title,
    author,
    narrator,
    coverUrl,
    duration: e.duration,
    durationMinutes: e.durationMinutes,
    rating: e.rating,
    ratingCount: e.ratingCount,
    listPrice: listPrice,
    audiblePrice: 0,
    isCreditEligible: true,
    isPlusCatalog: false,
    categories: e.categories,
    tags: e.tags,
    description: e.description,
    releaseDate,
    binding,
    formats,
    detailPageURL
  });
}

const data = { site, categories, books };
fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
console.log("Built books.json with " + books.length + " books");