/**
 * audiobookvalue.com - Auto-Discover Script
 *
 * Searches Amazon via the Creators API for popular Audible audiobooks,
 * filters out non-audiobooks and already-known ASINs, then writes new
 * candidates to pending-books.json for review/polishing.
 *
 * Required env vars:
 *   AMAZON_CLIENT_ID
 *   AMAZON_CLIENT_SECRET
 *   AMAZON_PARTNER_TAG (defaults to yuanyuan07-20)
 *
 * Usage: node scripts/auto-discover.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BOOKS_PATH = path.join(ROOT, "books.json");
const PENDING_PATH = path.join(ROOT, "pending-books.json");
const TOKEN_URL = "https://api.amazon.com/auth/o2/token";
const SEARCH_URL = "https://creatorsapi.amazon/catalog/v1/searchItems";
const MARKETPLACE = "www.amazon.com";

const clientId = process.env.AMAZON_CLIENT_ID;
const clientSecret = process.env.AMAZON_CLIENT_SECRET;
const partnerTag = process.env.AMAZON_PARTNER_TAG || "yuanyuan07-20";

if (!clientId || !clientSecret) {
  console.error("Missing AMAZON_CLIENT_ID or AMAZON_CLIENT_SECRET");
  process.exit(1);
}

// Max new candidates per run. Increase carefully to avoid flooding the site.
const MAX_NEW_PER_RUN = parseInt(process.env.AUTO_DISCOVER_LIMIT || "5", 10);
// Default estimates until a human or AI writes real values.
const DEFAULT_RATING = 4.5;
const DEFAULT_DURATION_MINUTES = 600;

const SEARCH_RESOURCES = [
  "images.primary.large",
  "itemInfo.title",
  "itemInfo.byLineInfo",
  "itemInfo.classifications",
  "itemInfo.contentInfo",
  "itemInfo.productInfo",
  "itemInfo.technicalInfo",
  "offersV2.listings.price",
  "offersV2.listings.availability",
  "offersV2.listings.isBuyBoxWinner",
  "browseNodeInfo.browseNodes"
];

// Keywords/authors/types to probe each run. Edit freely; each line is a search.
const DISCOVERY_SOURCES = [
  "best audiobooks",
  "fantasy audiobook series",
  "dark romance audiobook",
  "litrpg audiobook",
  "science fiction audiobook",
  "mystery thriller audiobook",
  "self improvement audiobook",
  "biography audiobook"
];

const CATEGORY_KEYWORDS = [
  { match: ["fantasy", "dragon", "fae", "magic"], cat: ["fantasy", "fiction"] },
  { match: ["romance", "rom-com"], cat: ["romance"] },
  { match: ["litrpg", "lit rpg", "gamelit"], cat: ["sci-fi", "fiction"] },
  { match: ["science fiction", "sci-fi", "space"], cat: ["sci-fi", "fiction"] },
  { match: ["thriller", "mystery", "suspense"], cat: ["mystery-thriller"] },
  { match: ["self improvement", "self-help", "habit"], cat: ["self-improvement"] },
  { match: ["biography", "memoir"], cat: ["biographies-memoirs"] },
  { match: ["history"], cat: ["history"] }
];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function getToken() {
  const body = JSON.stringify({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope: "creatorsapi::default"
  });
  const resp = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error("Token request failed: " + resp.status + " " + text.slice(0, 300));
  }
  return (await resp.json()).access_token;
}

async function searchItems(token, keyword, retries = 3) {
  const body = JSON.stringify({
    partnerTag,
    keywords: keyword,
    itemCount: 10,
    sortBy: "AvgCustomerReviews",
    resources: SEARCH_RESOURCES
  });
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const resp = await fetch(SEARCH_URL, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json",
          "x-marketplace": MARKETPLACE
        },
        body
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(JSON.stringify(data).slice(0, 300));
      }
      return data.searchResult?.items || [];
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        console.warn("Search '" + keyword + "' attempt " + attempt + " failed, retrying...");
        await delay(1000 * attempt);
      }
    }
  }
  throw lastError;
}

function isAudible(item) {
  const info = item.itemInfo || {};
  const classifications = info.classifications || {};
  const binding = (classifications.binding?.displayValue || "").toLowerCase();
  const group = (classifications.productGroup?.displayValue || "").toLowerCase();
  return binding.includes("audible") || group === "audible";
}

function isInStock(item) {
  const listing = (item.offersV2?.listings || [])[0];
  return !listing || (listing.availability?.type || "IN_STOCK") !== "OUT_OF_STOCK";
}

function isEnglish(item) {
  const langs = item.itemInfo?.contentInfo?.languages?.displayValues;
  if (!langs || langs.length === 0) return true; // no language data: allow
  return langs.some((l) => (l.displayValue || l).toLowerCase() === "english");
}

function pickListing(item) {
  const listings = item.offersV2?.listings || [];
  return listings.find((l) => l.isBuyBoxWinner) || listings[0] || null;
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function inferCategories(keyword) {
  const k = keyword.toLowerCase();
  for (const rule of CATEGORY_KEYWORDS) {
    if (rule.match.some((m) => k.includes(m))) return rule.cat;
  }
  return ["fiction"];
}

function buildDraftQuestions(candidate) {
  const title = candidate.title;
  const author = candidate.author;
  const narrator = candidate.narrator;
  const price = candidate.listPrice > 0 ? "$" + candidate.listPrice.toFixed(2) : "free with the trial";
  return {
    q1: title + " by " + author + " is an Audible audiobook" + (narrator ? " narrated by " + narrator : "") + ". It is currently available for " + price + " with a 30-day Audible free trial. [DRAFT - needs review]",
    q2: "This audiobook is a candidate for listeners interested in the " + (candidate.categories.join("/") || "audiobook") + " category. It was discovered because it ranks well in Amazon search results. [DRAFT - needs review]",
    q3: "Best listened to during commutes, workouts, or dedicated evening sessions. Exact runtime is pending verification, so plan around a 10-hour default until confirmed. [DRAFT - needs review]",
    q4: "This title was surfaced by Amazon's top-rated audiobook searches, which makes it a strong candidate for value, popularity, or listener satisfaction. Final differentiation details require review. [DRAFT - needs review]",
    q5: "You can start listening immediately by starting a free 30-day Audible trial, downloading this title, and pressing play. [DRAFT - needs review]"
  };
}

async function main() {
  const books = JSON.parse(fs.readFileSync(BOOKS_PATH, "utf-8")).books || [];
  const knownAsins = new Set(books.map((b) => b.asin));

  let pending = [];
  if (fs.existsSync(PENDING_PATH)) {
    pending = JSON.parse(fs.readFileSync(PENDING_PATH, "utf-8")).candidates || [];
  }
  const pendingAsins = new Set(pending.map((b) => b.asin));

  console.log("Fetching token...");
  const token = await getToken();
  console.log("Token acquired. Searching " + DISCOVERY_SOURCES.length + " sources...");

  const candidates = [];
  const seen = new Set();
  for (const keyword of DISCOVERY_SOURCES) {
    let items = [];
    try {
      items = await searchItems(token, keyword);
    } catch (err) {
      console.warn("Search failed for '" + keyword + "': " + err.message);
      continue;
    }
    items.forEach((item, rank) => {
      const asin = item.asin;
      if (!asin || seen.has(asin) || knownAsins.has(asin) || pendingAsins.has(asin)) return;
      if (!isAudible(item) || !isInStock(item) || !isEnglish(item)) return;
      const info = item.itemInfo || {};
      const title = info.title?.displayValue;
      if (!title) return;
      const contributors = info.byLineInfo?.contributors || [];
      const author = contributors.find((c) => c.roleType === "author")?.name || "Unknown";
      const narrator = contributors.find((c) => c.roleType === "narrator")?.name || "";
      const listing = pickListing(item);
      const listPrice = listing?.price?.savingBasis?.money?.amount || 0;
      const release = (info.productInfo?.releaseDate?.displayValue || info.contentInfo?.publicationDate?.displayValue || "").slice(0, 10);
      const categories = inferCategories(keyword);
      const slug = slugify(title + " " + author);

      seen.add(asin);
      candidates.push({
        asin,
        slug,
        title,
        author,
        narrator,
        coverUrl: item.images?.primary?.large?.url || "",
        duration: "10h 0m",
        durationMinutes: DEFAULT_DURATION_MINUTES,
        rating: DEFAULT_RATING,
        ratingCount: 0,
        listPrice,
        audiblePrice: 0,
        isCreditEligible: true,
        isPlusCatalog: false,
        categories,
        tags: ["candidate", "needs-review"],
        description: "Discovered by auto-discovery. Pending review before publication.",
        releaseDate: release,
        binding: info.classifications?.binding?.displayValue || "Audible Audiobook",
        formats: info.technicalInfo?.formats?.displayValues || [],
        detailPageURL: "https://www.amazon.com/dp/" + asin + "?tag=" + partnerTag + "&linkCode=ogi&th=1&psc=1",
        needsReview: true,
        sourceKeyword: keyword,
        searchRank: rank + 1,
        discoveredAt: new Date().toISOString().slice(0, 10)
      });
    });
    await delay(500);
  }

  console.log("Found " + candidates.length + " unique new candidates.");
  const toAdd = candidates.slice(0, MAX_NEW_PER_RUN);
  if (toAdd.length === 0) {
    console.log("No new candidates to add.");
    return;
  }

  for (const candidate of toAdd) {
    candidate.questions = buildDraftQuestions(candidate);
    pending.push(candidate);
    console.log("Candidate added: " + candidate.asin + " " + candidate.title);
  }

  fs.writeFileSync(PENDING_PATH, JSON.stringify({ updatedAt: new Date().toISOString(), candidates: pending }, null, 2));
  console.log("Wrote " + pending.length + " total candidates to pending-books.json");
  console.log("books.json was NOT modified.");
}

main().catch((err) => {
  console.error("Auto-discover failed:", err.message);
  process.exit(1);
});
