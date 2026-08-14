/**
 * audiobookvalue.com - AI Content Writer (Step 2)
 *
 * Reads pending-books.json, uses OpenAI to write final 5-question content,
 * descriptions, and estimated ratings/durations, then moves completed books
 * into books.json and regenerates the static site.
 *
 * Required env vars:
 *   OPENAI_API_KEY (script is a no-op without it)
 *   OPENAI_MODEL (defaults to gpt-4o-mini)
 *
 * Usage: node scripts/auto-write-content.js
 */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const BOOKS_PATH = path.join(ROOT, "books.json");
const PENDING_PATH = path.join(ROOT, "pending-books.json");

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.log("OPENAI_API_KEY not configured; skipping AI content generation.");
  process.exit(0);
}

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function writeContent(candidate) {
  const prompt = [
    "You are an audiobook reviewer for an Amazon Associates site. Write final English content for this audiobook landing page.",
    "Audiobook metadata:",
    JSON.stringify({
      title: candidate.title,
      author: candidate.author,
      narrator: candidate.narrator,
      categories: candidate.categories,
      listPrice: candidate.listPrice,
      detailPageURL: candidate.detailPageURL
    }, null, 2),
    "Return JSON only with these exact keys:",
    "description (1-2 sentences), q1 (What is this audiobook?), q2 (Who is it for? What problem does it solve?), q3 (What is the best use scenario?), q4 (What makes it different?), q5 (Can you start using it immediately?), rating (number 1-5 estimate), ratingCount (integer estimate), duration (string like '10h 0m'), durationMinutes (integer estimate)."
  ].join("\n");

  const resp = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You write conversion-focused audiobook landing page content. Values are estimates when not provided." },
        { role: "user", content: prompt }
      ]
    })
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error("OpenAI request failed: " + resp.status + " " + text.slice(0, 300));
  }
  const data = await resp.json();
  return JSON.parse(data.choices[0].message.content);
}

async function main() {
  if (!fs.existsSync(PENDING_PATH)) {
    console.log("No pending-books.json found; nothing to do.");
    return;
  }
  const pendingData = JSON.parse(fs.readFileSync(PENDING_PATH, "utf-8"));
  const pending = pendingData.candidates || [];
  const booksData = JSON.parse(fs.readFileSync(BOOKS_PATH, "utf-8"));
  const knownAsins = new Set(booksData.books.map((b) => b.asin));

  const remaining = [];
  let written = 0;
  for (const candidate of pending) {
    if (knownAsins.has(candidate.asin)) continue;
    try {
      console.log("Writing content for " + candidate.title + "...");
      const ai = await writeContent(candidate);
      const book = {
        ...candidate,
        slug: candidate.slug || slugify(candidate.title + " " + candidate.author),
        description: ai.description || candidate.description,
        rating: ai.rating || candidate.rating,
        ratingCount: ai.ratingCount || candidate.ratingCount,
        duration: ai.duration || candidate.duration,
        durationMinutes: ai.durationMinutes || candidate.durationMinutes,
        questions: { q1: ai.q1, q2: ai.q2, q3: ai.q3, q4: ai.q4, q5: ai.q5 },
        needsReview: true,
        tags: [...(candidate.tags || []), "ai-drafted"]
      };
      delete book.sourceKeyword;
      delete book.searchRank;
      delete book.discoveredAt;
      booksData.books.push(book);
      knownAsins.add(book.asin);
      written++;
    } catch (err) {
      console.warn("Failed for " + candidate.asin + ": " + err.message);
      remaining.push(candidate);
    }
  }

  fs.writeFileSync(BOOKS_PATH, JSON.stringify(booksData, null, 2));
  fs.writeFileSync(PENDING_PATH, JSON.stringify({ updatedAt: new Date().toISOString(), candidates: remaining }, null, 2));
  console.log("Wrote " + written + " books to books.json; " + remaining.length + " remain pending.");

  if (written > 0) {
    console.log("Regenerating static pages...");
    const result = spawnSync(process.execPath, [path.join(__dirname, "generate.js")], { stdio: "inherit" });
    if (result.status !== 0) {
      throw new Error("generate.js exited with status " + result.status);
    }
  }
}

main().catch((err) => {
  console.error("Auto-write failed:", err.message);
  process.exit(1);
});
