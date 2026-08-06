/**
 * audiobookvalue.com - Daily Auto-Update Script
 *
 * Reads books.json, refreshes API-managed fields via the Amazon Creators API,
 * detects price drops, and writes updated data back to books.json.
 *
 * Required env vars:
 *   AMAZON_CLIENT_ID
 *   AMAZON_CLIENT_SECRET
 *   AMAZON_PARTNER_TAG (defaults to yuanyuan07-20)
 *
 * Usage: node scripts/auto-update.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BOOKS_PATH = path.join(ROOT, "books.json");
const TOKEN_URL = "https://api.amazon.com/auth/o2/token";
const API_URL = "https://creatorsapi.amazon/catalog/v1/getItems";
const MARKETPLACE = "www.amazon.com";

const clientId = process.env.AMAZON_CLIENT_ID;
const clientSecret = process.env.AMAZON_CLIENT_SECRET;
const partnerTag = process.env.AMAZON_PARTNER_TAG || "yuanyuan07-20";

if (!clientId || !clientSecret) {
  console.error("Missing AMAZON_CLIENT_ID or AMAZON_CLIENT_SECRET");
  process.exit(1);
}

const RESOURCES = [
  "images.primary.large",
  "itemInfo.title",
  "itemInfo.byLineInfo",
  "itemInfo.contentInfo",
  "itemInfo.classifications",
  "itemInfo.productInfo",
  "itemInfo.technicalInfo",
  "offersV2.listings.price",
  "offersV2.listings.availability",
  "offersV2.listings.type",
  "offersV2.listings.isBuyBoxWinner",
  "parentASIN"
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
  const data = await resp.json();
  return data.access_token;
}

async function getItemsBatch(token, batch) {
  const body = JSON.stringify({
    itemIds: batch,
    itemIdType: "ASIN",
    marketplace: MARKETPLACE,
    partnerTag,
    resources: RESOURCES
  });
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const resp = await fetch(API_URL, {
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
      return data.itemsResult?.items || [];
    } catch (err) {
      lastError = err;
      if (attempt < 3) {
        console.warn("Batch attempt " + attempt + " failed, retrying...");
        await delay(1000 * attempt);
      }
    }
  }
  throw lastError;
}

function pickBuyBox(listings) {
  return listings.find((l) => l.isBuyBoxWinner) || listings[0] || null;
}

function mergeBook(book, item) {
  const info = item.itemInfo || {};
  const byLine = info.byLineInfo || {};
  const contributors = byLine.contributors || [];

  const listing = pickBuyBox(item.offersV2?.listings || []);
  const buyboxPrice = listing?.price?.money?.amount;
  const savingBasis = listing?.price?.savingBasis?.money?.amount;

  const oldListPrice = book.lastListPrice != null ? book.lastListPrice : book.listPrice;
  const oldAudiblePrice = book.audiblePrice;
  const newListPrice = typeof savingBasis === "number" ? savingBasis : (book.listPrice || 0);
  const newAudiblePrice = typeof buyboxPrice === "number" ? buyboxPrice : (book.audiblePrice || 0);

  const becameFree = oldAudiblePrice > 0 && newAudiblePrice === 0;
  const bigDrop = oldListPrice > 0 && newListPrice > 0 && newListPrice <= oldListPrice * 0.8;
  const onSale = becameFree || bigDrop;

  const merged = {
    ...book,
    title: info.title?.displayValue || book.title,
    author: contributors.find((c) => c.roleType === "author")?.name || book.author,
    narrator: contributors.find((c) => c.roleType === "narrator")?.name || book.narrator,
    coverUrl: item.images?.primary?.large?.url || book.coverUrl,
    listPrice: newListPrice,
    audiblePrice: newAudiblePrice,
    detailPageURL: item.detailPageURL || book.detailPageURL,
    releaseDate: (info.productInfo?.releaseDate?.displayValue || info.contentInfo?.publicationDate?.displayValue || book.releaseDate || "").slice(0, 10),
    binding: info.classifications?.binding?.displayValue || book.binding,
    formats: info.technicalInfo?.formats?.displayValues || book.formats,
    lastListPrice: oldListPrice,
    lastCheckedAt: new Date().toISOString().slice(0, 10),
    onSale
  };
  return merged;
}

async function main() {
  const data = JSON.parse(fs.readFileSync(BOOKS_PATH, "utf-8"));
  const books = data.books || [];
  if (books.length === 0) {
    console.log("No books to update");
    return;
  }

  console.log("Fetching token...");
  const token = await getToken();
  console.log("Token acquired");

  const asins = books.map((b) => b.asin);
  const fetched = new Map();
  for (let i = 0; i < asins.length; i += 10) {
    const batch = asins.slice(i, i + 10);
    console.log("Fetching batch " + (i / 10 + 1) + " (" + batch.length + " ASINs)...");
    const items = await getItemsBatch(token, batch);
    for (const item of items) {
      fetched.set(item.asin, item);
    }
    await delay(500);
  }

  let changed = 0;
  let unchanged = 0;
  for (const book of books) {
    const item = fetched.get(book.asin);
    if (!item) {
      console.warn("No API data for ASIN " + book.asin + ", keeping existing data");
      unchanged++;
      continue;
    }
    const merged = mergeBook(book, item);
    if (JSON.stringify(merged) !== JSON.stringify(book)) {
      Object.assign(book, merged);
      changed++;
      console.log("Updated " + book.slug + (book.onSale ? " [ON SALE]" : ""));
    } else {
      unchanged++;
    }
  }

  fs.writeFileSync(BOOKS_PATH, JSON.stringify(data, null, 2));
  console.log("\nDone. Updated " + changed + ", unchanged " + unchanged);
  if (changed === 0) {
    console.log("No data changes detected; nothing else to do.");
  }
}

main().catch((err) => {
  console.error("Auto-update failed:", err.message);
  process.exit(1);
});
