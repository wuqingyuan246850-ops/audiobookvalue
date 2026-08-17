/**
 * audiobookvalue.com - ASIN / Cover Audit
 *
 * Validates every book ASIN via the Amazon Creators API and checks that a
 * cover image exists. Prints a report; exits 1 if any invalid entries found.
 *
 * Env: AMAZON_CLIENT_ID, AMAZON_CLIENT_SECRET, AMAZON_PARTNER_TAG (optional)
 * Usage: node scripts/audit-books.js
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
  process.exit(2);
}

async function getToken() {
  const resp = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grant_type: "client_credentials", client_id: clientId, client_secret: clientSecret, scope: "creatorsapi::default" })
  });
  if (!resp.ok) throw new Error("Token failed: " + resp.status);
  return (await resp.json()).access_token;
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function getItems(token, batch) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const resp = await fetch(API_URL, {
        method: "POST",
        headers: { Authorization: "Bearer " + token, "Content-Type": "application/json", "x-marketplace": MARKETPLACE },
        body: JSON.stringify({
          itemIds: batch,
          itemIdType: "ASIN",
          marketplace: MARKETPLACE,
          partnerTag,
          resources: ["images.primary.large", "itemInfo.title"]
        })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(JSON.stringify(data).slice(0, 200));
      return data.itemsResult?.items || [];
    } catch (err) {
      lastError = err;
      if (attempt < 3) await delay(1000 * attempt);
    }
  }
  throw lastError;
}

function targetFor(categories) {
  if (categories.includes("fantasy")) return "/best-fantasy-audiobooks";
  if (categories.includes("self-improvement")) return "/best-self-improvement-audiobooks";
  if (categories.includes("mystery-thriller")) return "/best-mystery-thriller-audiobooks";
  if (categories.includes("romance")) return "/category/romance";
  if (categories.includes("fiction")) return "/category/fiction";
  if (categories.includes("children")) return "/category/children";
  if (categories.includes("sci-fi")) return "/category/sci-fi";
  return "/";
}

async function main() {
  const autoRemove = process.argv.includes("--auto-remove");
  const data = JSON.parse(fs.readFileSync(BOOKS_PATH, "utf-8"));
  const books = data.books || [];
  const token = await getToken();
  const found = new Map();
  for (let i = 0; i < books.length; i += 10) {
    const items = await getItems(token, books.slice(i, i + 10).map((b) => b.asin));
    items.forEach((item) => found.set(item.asin, item));
    await new Promise((r) => setTimeout(r, 250));
  }

  const invalid = [];
  const noCover = [];
  for (const book of books) {
    const item = found.get(book.asin);
    if (!item) {
      invalid.push(book);
      continue;
    }
    if (!item.images?.primary?.large?.url && !book.coverUrl.startsWith("https://m.media-amazon")) {
      noCover.push(book.asin + " | " + book.slug);
    }
  }

  console.log("Audited " + books.length + " books");
  console.log("Invalid ASINs: " + invalid.length);
  invalid.forEach((x) => console.log("  " + x.asin + " | " + x.slug));
  console.log("No cover: " + noCover.length);
  noCover.forEach((x) => console.log("  " + x));

  if (invalid.length > 0 && autoRemove) {
    const invalidAsins = new Set(invalid.map((b) => b.asin));
    data.books = books.filter((b) => !invalidAsins.has(b.asin));
    fs.writeFileSync(BOOKS_PATH, JSON.stringify(data, null, 2));

    const redirectsPath = path.join(ROOT, "scripts", "redirects-extra.json");
    const redirects = fs.existsSync(redirectsPath) ? JSON.parse(fs.readFileSync(redirectsPath, "utf-8")) : [];
    invalid.forEach((b) => redirects.push({ from: "/audiobooks/" + b.slug, to: targetFor(b.categories || []) }));
    fs.writeFileSync(redirectsPath, JSON.stringify(redirects, null, 2));

    console.log("Auto-removed " + invalid.length + " invalid books; regenerating...");
    const { spawnSync } = require("child_process");
    const result = spawnSync(process.execPath, [path.join(ROOT, "scripts", "generate.js")], { stdio: "inherit" });
    if (result.status !== 0) {
      console.error("generate.js failed after auto-remove");
      process.exit(1);
    }
    console.log("Remaining books: " + data.books.length);
    process.exit(0);
  }
  process.exit(invalid.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("Audit failed:", e.message);
  process.exit(1);
});
