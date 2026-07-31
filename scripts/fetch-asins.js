const fs = require("fs");
const path = require("path");

const TOKEN_FILE = path.join(__dirname, "tmp_access_token.txt");
const OUT_FILE = path.join(__dirname, "tmp_api_data.json");
const token = fs.readFileSync(TOKEN_FILE, "utf-8").trim();

const asins = [
  "B08C8XFQMN","B092P12K71","B0G61F6RX5","B0GPQRMFPZ","B0GD27YL9M",
  "B09BDT9PYP","B07WFQM8FV","B0FKP1SCTF","B0FF64RP78","B0GL4CS7SN",
  "B0GLR378CD","B07944YFPW","B0BGQBVD85","B07P6DCWPQ","B01K3EKBXS",
  "B019NMZ5MI","B0D9HPNXHX","B00HLPMFU0","B00ELMSEJC","B074MHWM33"
];

const resources = [
  "images.primary.large",
  "itemInfo.title",
  "itemInfo.byLineInfo",
  "itemInfo.contentInfo",
  "itemInfo.classifications",
  "itemInfo.productInfo",
  "itemInfo.technicalInfo",
  "itemInfo.features",
  "customerReviews.starRating",
  "customerReviews.count",
  "offersV2.listings.price",
  "offersV2.listings.availability",
  "offersV2.listings.type",
  "offersV2.listings.isBuyBoxWinner",
  "browseNodeInfo.browseNodes",
  "parentASIN"
];

async function getItems(batch) {
  const resp = await fetch("https://creatorsapi.amazon/catalog/v1/getItems", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json",
      "x-marketplace": "www.amazon.com"
    },
    body: JSON.stringify({
      itemIds: batch,
      itemIdType: "ASIN",
      marketplace: "www.amazon.com",
      partnerTag: "yuanyuan07-20",
      resources
    })
  });
  const data = await resp.json();
  if (!resp.ok) {
    console.error("Batch failed:", JSON.stringify(data).substring(0, 500));
    return [];
  }
  return data.itemsResult?.items || [];
}

async function main() {
  const all = [];
  for (let i = 0; i < asins.length; i += 5) {
    const batch = asins.slice(i, i + 5);
    const items = await getItems(batch);
    all.push(...items);
    console.log("Batch " + (i / 5 + 1) + ": got " + items.length);
    await new Promise(r => setTimeout(r, 500));
  }
  fs.writeFileSync(OUT_FILE, JSON.stringify(all, null, 2));
  console.log("Saved " + all.length + " items to tmp_api_data.json");
  for (const item of all) {
    const t = item.itemInfo?.title?.displayValue || "?";
    const author = item.itemInfo?.byLineInfo?.contributors?.find(c => c.roleType === "author")?.name || "?";
    const narrator = item.itemInfo?.byLineInfo?.contributors?.find(c => c.roleType === "narrator")?.name || "?";
    const rating = item.customerReviews?.starRating?.displayValue || "N/A";
    const count = item.customerReviews?.count?.displayValue || "N/A";
    const price = item.offersV2?.listings?.[0]?.price?.money?.displayAmount || "N/A";
    const saved = item.offersV2?.listings?.[0]?.price?.savingBasis?.money?.displayAmount || "";
    console.log(`[${item.asin}] ${t} | ${author} | narrator:${narrator} | rating:${rating}(${count}) | price:${price} save:${saved}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });