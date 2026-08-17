const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BOOKS_PATH = path.join(ROOT, "books.json");
const REDIRECTS_PATH = path.join(ROOT, "scripts", "redirects-extra.json");

const CORRECT_ASINS = {
  "B07DJX91Q3": {
    asin: "B0189PVAWY",
    coverUrl: "https://m.media-amazon.com/images/I/51CTJKORW7L._SL500_.jpg",
    detailPageURL: "https://www.amazon.com/dp/B0189PVAWY?tag=yuanyuan07-20&linkCode=ogi&th=1&psc=1"
  },
  "B00NQ4E0GS": {
    asin: "B0741F3M7C",
    coverUrl: "https://m.media-amazon.com/images/I/41HWFhtig3L._SL500_.jpg",
    detailPageURL: "https://www.amazon.com/dp/B0741F3M7C?tag=yuanyuan07-20&linkCode=ogi&th=1&psc=1"
  }
};

const REMOVE_ASINS = new Set([
  "B0G53ZL9GN", "B0GH2LS337", "B0GJTXLD6V", "B08G6MHRWC", "B07Y2BK67J",
  "B09KHH7PNR", "B07PMFKLTY", "B09GDGBZ7P", "B0FBH1651D", "B0BS29375V",
  "B0H45GLTSX", "B005RZ7COU", "B0GJTC6LTK", "B07BZ3T3K", "B002V5A2JQ",
  "B07QWH8L5G", "B079D2LJ5R", "B00H7QDS3M", "B01COQ1E4I", "B08D4YQJ2Q",
  "B00DI1I1GK", "B07P2YJFSX", "B07KPY46ML", "B000H2NJU0", "B01J4VWY9E",
  "B07N4L385Y", "B01MSZS1CX", "B07QH6BJN1", "B07BBN3V2P", "B0031TJA0S",
  "B0FB63LD1T", "B0FF666V97", "B00X0TKUS0", "B0FL88D4F3", "B07JR5C68S",
  "B0CVBL96F9", "B0CYQYCZ9B", "B09M8WKTN7", "B07C3WM559", "B0GHSNJQ6Z"
]);

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

const data = JSON.parse(fs.readFileSync(BOOKS_PATH, "utf-8"));
const remaining = [];
const redirects = [];
let fixed = 0;
let removed = 0;

for (const book of data.books) {
  if (CORRECT_ASINS[book.asin]) {
    const fix = CORRECT_ASINS[book.asin];
    book.asin = fix.asin;
    book.coverUrl = fix.coverUrl;
    book.detailPageURL = fix.detailPageURL;
    fixed++;
    console.log("FIXED: " + book.slug + " -> " + fix.asin);
  }
  if (REMOVE_ASINS.has(book.asin)) {
    redirects.push({ from: "/audiobooks/" + book.slug, to: targetFor(book.categories || []) });
    removed++;
    console.log("REMOVED: " + book.slug + " -> " + redirects[redirects.length - 1].to);
    continue;
  }
  remaining.push(book);
}

data.books = remaining;
fs.writeFileSync(BOOKS_PATH, JSON.stringify(data, null, 2));
fs.writeFileSync(REDIRECTS_PATH, JSON.stringify(redirects, null, 2));
console.log("Fixed " + fixed + ", removed " + removed + ", total books now " + remaining.length);
