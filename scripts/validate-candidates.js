/**
 * audiobookvalue.com - Validate Pending Candidates
 *
 * Verifies each pending candidate ASIN via the Creators API before it can be
 * published. Invalid candidates are moved to blocked-books.json for review.
 *
 * Env: AMAZON_CLIENT_ID, AMAZON_CLIENT_SECRET, AMAZON_PARTNER_TAG (optional)
 * Usage: node scripts/validate-candidates.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PENDING_PATH = path.join(ROOT, "pending-books.json");
const BLOCKED_PATH = path.join(ROOT, "blocked-books.json");
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

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function getToken() {
  const resp = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grant_type: "client_credentials", client_id: clientId, client_secret: clientSecret, scope: "creatorsapi::default" })
  });
  if (!resp.ok) throw new Error("Token failed: " + resp.status);
  return (await resp.json()).access_token;
}

async function getItem(token, asin) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const resp = await fetch(API_URL, {
        method: "POST",
        headers: { Authorization: "Bearer " + token, "Content-Type": "application/json", "x-marketplace": MARKETPLACE },
        body: JSON.stringify({
          itemIds: [asin],
          itemIdType: "ASIN",
          marketplace: MARKETPLACE,
          partnerTag,
          resources: ["images.primary.large", "itemInfo.title"]
        })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(JSON.stringify(data).slice(0, 200));
      return (data.itemsResult?.items || [])[0] || null;
    } catch (err) {
      lastError = err;
      if (attempt < 3) await delay(1000 * attempt);
    }
  }
  throw lastError;
}

async function main() {
  if (!fs.existsSync(PENDING_PATH)) {
    console.log("No pending-books.json found; nothing to validate.");
    return;
  }
  const pendingData = JSON.parse(fs.readFileSync(PENDING_PATH, "utf-8"));
  const pending = pendingData.candidates || [];
  const blockedData = fs.existsSync(BLOCKED_PATH) ? JSON.parse(fs.readFileSync(BLOCKED_PATH, "utf-8")) : { blocked: [] };
  const blocked = blockedData.blocked || [];

  const token = await getToken();
  const valid = [];
  const blockedNow = [];

  for (const c of pending) {
    if (!c.asin || !c.title) {
      blockedNow.push({ ...c, blockedAt: new Date().toISOString(), reason: "missing-fields" });
      console.log("Blocked (missing fields): " + (c.title || c.asin || "?"));
      continue;
    }
    try {
      const item = await getItem(token, c.asin);
      const hasCover = !!(item?.images?.primary?.large?.url || (c.coverUrl && c.coverUrl.startsWith("https://")));
      if (item && hasCover) {
        valid.push(c);
        console.log("Valid: " + c.title);
      } else {
        blockedNow.push({ ...c, blockedAt: new Date().toISOString(), reason: item ? "no-cover" : "asin-not-found" });
        console.log("Blocked (" + (item ? "no-cover" : "asin-not-found") + "): " + c.title);
      }
    } catch (err) {
      blockedNow.push({ ...c, blockedAt: new Date().toISOString(), reason: "api-error" });
      console.warn("API error for " + c.title + ": " + err.message + " (kept pending as blocked)");
    }
    await delay(250);
  }

  fs.writeFileSync(PENDING_PATH, JSON.stringify({ updatedAt: new Date().toISOString(), candidates: valid }, null, 2));
  fs.writeFileSync(BLOCKED_PATH, JSON.stringify({ updatedAt: new Date().toISOString(), blocked: blocked.concat(blockedNow) }, null, 2));
  console.log("Valid candidates: " + valid.length + ", blocked: " + blockedNow.length + ", total blocked: " + (blocked.length + blockedNow.length));
}

main().catch((e) => {
  console.error("Validation failed:", e.message);
  process.exit(1);
});
