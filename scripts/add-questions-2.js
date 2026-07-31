const fs = require("fs");
const p = "C:\\Users\\My Windows\\Documents\\亚马逊有声书\\audiobookvalue.com\\books.json";
const d = JSON.parse(fs.readFileSync(p, "utf-8"));
const q = {};
function sq(slug, q1, q2, q3, q4, q5) { q[slug] = { q1, q2, q3, q4, q5 }; }

sq("the-unselected-journals-emma-m-lion-vol7",
"The Unselected Journals of Emma M. Lion Vol. 7 by Beth Brower continues the beloved found-family series set in Victorian London, narrated by Genevieve Gaunt. This 4-hour 30-minute audiobook has a 4.7-star rating and delivers the witty, cozy storytelling fans love.",
"Fans of cozy historical fiction, diary-style storytelling, and readers who have been following Emma's world. It solves the problem of wanting a warm, character-driven escape that feels like spending time with old friends.",
"Perfect for short commutes, lunch breaks, or a cozy Sunday afternoon. At under 5 hours it is one of the quickest, most charming listens you can get with a credit.",
"Brower's journal format and Gaunt's narration create an intimate, diary-like feel you don't get from typical historical fiction. The gentle humor and found-family warmth keep listeners returning volume after volume.",
"Absolutely. Start your free trial, download, and the journal style welcomes you immediately. It is an easy, low-commitment listen that fits perfectly in a trial.");
sq("cottonwood-cove-box-set-pavlov",
"The Cottonwood Cove Box Set by Laura Pavlov collects three swoony small-town romances into one massive audio bundle, narrated by Connor Crais and others. At over 30 hours with a 4.6-star rating, it delivers a full series for a single Audible credit.",
"Small-town romance fans who love binge-reading series, meet-cutes, and found-family dynamics. It solves the problem of running out of book before the weekend ends — three complete novels in one credit.",
"Ideal for long road trips, marathon listening weekends, or commutes over a month. At 30+ hours it is one of the highest-value single-credit listens available.",
"Most romance audiobooks are one story per credit; this box set gives you three interconnected novels plus a cast of narrators. Pavlov's cozy small-town world is perfect for listeners who want to stay in one universe for a long time.",
"Yes. Start your free trial, download, and the first story pulls you in immediately. With 30+ hours, you get enormous value inside your trial period.");
sq("circe-madeline-miller",
"Circe by Madeline Miller reimagines the life of the witch from Homer's Odyssey, narrated by Perdita Weeks. This 12-hour 31-minute audiobook has a 4.7-star rating from over 45,000 listeners and became a modern literary phenomenon.",
"Readers who love literary fiction, Greek mythology, and strong female protagonists. It solves the problem of finding a book that is both intellectually rich and emotionally gripping — a bestseller that actually deserves the hype.",
"Perfect for immersive evening listening, weekend sessions, or commutes over two weeks. The gorgeous prose rewards focused listening, and 12.5 hours is ideal for a trial.",
"Miller gives a minor mythological figure a full, fierce voice, and Weeks' narration is widely considered one of the best audiobook performances in years. Unlike many retellings, it transforms the original rather than just retelling it.",
"Absolutely. Start your free trial, download, and Circe's exile is set up beautifully in the opening chapters. You will be pulled into her world immediately.");
sq("one-by-one-mcfadden",
"One by One by Freida McFadden is a locked-room psychological thriller set at a luxury corporate retreat, narrated by Alyson Krawchuk. This 9-hour 15-minute audiobook has a 4.5-star rating and is one of McFadden's most popular page-turners.",
"Thriller fans who love survival scenarios, unreliable narrators, and guessing until the last chapter. It solves the problem of finding a genuinely addictive listen that makes housework or commutes fly by.",
"Great for commutes, gym sessions, or evening listens when you can keep going 'just one more chapter.' At just over 9 hours, it is a fast binge.",
"McFadden has become a phenomenon by delivering twisty plots without dragging, and this one raises the stakes as colleagues disappear one by one. Krawchuk's narration keeps the tension taut and the red herrings believable.",
"Yes. Start your free trial, download, and the first disappearance happens quickly. You will likely finish it in a weekend — perfect for a trial.");
sq("the-wrong-side-of-goodbye-connelly",
"The Wrong Side of Goodbye by Michael Connelly returns Harry Bosch to the hunt, narrated by Titus Welliver (who plays Bosch on TV). This 10-hour 30-minute audiobook has a 4.7-star rating and is a standout entry in the legendary series.",
"Crime fiction fans who love procedural detail, Los Angeles settings, and a detective who never quits. It solves the problem of finding a reliably excellent crime series with deep character history and real-world texture.",
"Great for commutes, evening listens, or road trips. Welliver's narration feels like watching the show, and 10.5 hours fits perfectly in a trial.",
"Connelly writes Bosch better than almost anyone writes a detective, and Welliver's performance adds cinematic weight. This entry juggles a cold case and a serial rapist hunt with characteristic precision.",
"Absolutely. Start your free trial, download, and Bosch is in motion from the first chapter. No prior series knowledge is required to enjoy it.");
sq("morning-star-red-rising-iii-brown",
"Morning Star by Pierce Brown concludes the original Red Rising trilogy, narrated by Tim Gerard Reynolds. This 21-hour 26-minute audiobook has a 4.7-star rating and delivers one of the most acclaimed sci-fi finales of the decade.",
"Science fiction fans who love rebellion epics, military strategy, and unforgettable characters. It solves the problem of finding a series finale that actually sticks the landing — rare in modern sci-fi.",
"Perfect for long road trips, marathon weekends, or commutes over a month. At 21+ hours it is exceptional value per credit, and the action keeps the pace relentless.",
"Reynolds' narration is legendary among audiobook fans, bringing Darrow and the Red Rising cast to life. Brown combines epic scale with brutal emotional stakes, making this finale as moving as it is thrilling.",
"Yes. Start your free trial, download, and you are thrown back into the rebellion immediately. Series fans get a payoff; newcomers can still enjoy it with minimal backstory.");
sq("the-writer-patterson",
"The Writer by James Patterson is a twisty thriller about a ghostwriter who uncovers dangerous secrets while helping a reclusive billionaire finish his memoir. Narrated by Peter Ganim, this 9-hour 25-minute audiobook has a 4.6-star rating.",
"Thriller fans who like fast pacing, celebrity secrets, and locked-room suspense. It solves the problem of wanting a quick, satisfying read with a high-concept hook and Patterson's signature short-chapter momentum.",
"Perfect for commutes, travel, or evening listens. Under 10 hours means you can finish it in a few days, and the short chapters make every session feel productive.",
"Patterson teams the meta premise of writing a memoir with genuine mystery, and Ganim's narration keeps the tension sharp. It is a fresh setup from a master of the genre.",
"Absolutely. Start your free trial, download, and the ghostwriter premise hooks you immediately. A fast, suspenseful listen for your trial.");
sq("operation-paperclip-jacobsen",
"Operation Paperclip by Annie Jacobsen uncovers the secret US program that brought Nazi scientists to America after WWII, narrated by the author herself. This 14-hour 30-minute audiobook has a 4.6-star rating and is a chilling work of investigative history.",
"History buffs, WWII readers, and anyone fascinated by how the Cold War began. It solves the problem of shallow history podcasts by delivering deeply researched narrative nonfiction with names, documents, and moral complexity.",
"Great for long commutes, road trips, or multi-week listening. The chapter-driven investigation is easy to pause and resume, and 14.5 hours is strong value per credit.",
"Jacobsen did years of original research including declassified records and interviews, and her own narration adds journalistic authority. It goes beyond the famous von Braun story to show the full scope of the program.",
"Yes. Start your free trial, download, and the opening chapters lay out the shocking premise quickly. You will see post-war history differently after the first hour.");
sq("the-goldfinch-tartt",
"The Goldfinch by Donna Tartt is the Pulitzer Prize-winning novel about a boy who steals a priceless painting after a museum bombing, narrated by David Pittu. This 32-hour 15-minute audiobook has a 4.5-star rating and is a modern literary epic.",
"Literary fiction readers who love sprawling, character-driven novels about art, loss, and obsession. It solves the problem of finding a masterpiece that lasts — 32 hours of gorgeous prose for one credit.",
"Best for long road trips, cross-country flights, or a month of commutes. The immersive, novelistic scope rewards extended listening sessions.",
"Tartt won the Pulitzer for a reason, and Pittu's narration captures Theo's voice across decades. Few audiobooks combine this level of literary quality with this much listening time per credit.",
"Absolutely. Start your free trial, download, and the museum bombing sequence grips you from the first minutes. At 32+ hours, you get extraordinary value inside your trial.");
sq("an-echo-of-things-to-come-islington",
"An Echo of Things to Come is the second book in James Islington's Licanius trilogy, an epic fantasy of time, prophecy, and forbidden magic. Narrated by Michael Kramer, this 21-hour 12-minute audiobook has a 4.7-star rating.",
"Epic fantasy fans who love intricate plotting, time-travel mechanics, and characters who grow with the story. It solves the problem of finding a complex series that rewards careful listening and delivers a satisfying middle book.",
"Perfect for long road trips, marathon weekends, or a month of commutes. At 21+ hours it is outstanding value per credit, and Kramer's narration keeps the dense plot clear.",
"Islington's plotting is famously tight — foreshadowing in book one pays off here — and Kramer is one of the most beloved narrators in fantasy audiobooks. This series deserves the same shelf as Sanderson and Jordan.",
"Yes. Start your free trial, download, and the continuation hooks you quickly. New listeners can start here, but series readers will get the most from the payoff.");

let added = 0;
for (const book of d.books) {
  if (q[book.slug]) { Object.assign(book, { questions: q[book.slug] }); added++; }
}
fs.writeFileSync(p, JSON.stringify(d, null, 2));
console.log("Part 2 added questions: " + added);
const missing = d.books.filter(b => !b.questions).map(b => b.slug);
console.log("Missing questions: " + JSON.stringify(missing));