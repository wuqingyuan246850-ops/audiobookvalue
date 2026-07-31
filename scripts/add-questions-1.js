const fs = require("fs");
const p = "C:\\Users\\My Windows\\Documents\\亚马逊有声书\\audiobookvalue.com\\books.json";
const d = JSON.parse(fs.readFileSync(p, "utf-8"));
const q = {};
function sq(slug, q1, q2, q3, q4, q5) { q[slug] = { q1, q2, q3, q4, q5 }; }

sq("the-hobbit-tolkien",
"The Hobbit by J.R.R. Tolkien is the classic fantasy adventure that started modern fantasy fiction. This Audible edition is narrated by Andy Serkis (Gollum in The Lord of the Rings films), runs about 11 hours 25 minutes, and holds a 4.8-star rating from tens of thousands of listeners.",
"Anyone who loves epic fantasy, world-building, or wants to experience the book behind the movies. It solves the problem of 'what classic should I listen to next' by delivering a timeless adventure that entertains both new fantasy readers and lifelong Tolkien fans.",
"Perfect for evening listening, weekend road trips, or a two-week commute plan. Serkis's immersive performance makes it ideal for uninterrupted sessions, though each chapter also works well in short bursts.",
"Most audiobooks of The Hobbit are good, but Serkis's narration is in a league of its own: he voices every dwarf, goblin, and dragon with theatrical depth. If you loved his Gollum, this is the definitive version.",
"Absolutely. Click the link, start your free 30-day Audible trial, download instantly, and press play. The opening chapter introduces you to Bilbo and the Shire within minutes, no preparation needed.");
sq("a-shadow-in-the-ember-armentrout",
"A Shadow in the Ember is the first book in Jennifer L. Armentrout's Flesh and Fire series, a dark fantasy romance. Narrated by Stina Nielsen, this 22+ hour audiobook follows Sera, a mortal woman bound to the Primal of Death, and holds a 4.6-star rating.",
"Fans of romantasy, enemies-to-lovers tension, and complex world-building. It solves the problem of finding a long, immersive series with both steamy romance and real stakes — ideal for listeners who want one credit to cover weeks of listening.",
"Great for long commutes, binge-listening weekends, or anyone who likes a series they can sink into. At over 22 hours, one credit delivers exceptional value and you can continue straight into book two.",
"Unlike many fantasy romances, Armentrout builds a full mythology while keeping the romantic tension central. Nielsen's narration brings the emotional push-and-pull to life, and the Flesh and Fire series connects to the author's popular Blood and Ash universe.",
"Yes. Start your free trial, download, and within the first hour you meet Sera and the Primal — the hook lands fast. The long runtime means you never run out of story before your trial ends.");
sq("a-requiem-for-fallen-stars-wilkes",
"A Requiem for Fallen Stars by Hazel S. Wilkes is the first book in the Cadence of the Fallen epic fantasy series. Narrated by Ellen Quay, this 13-hour audiobook blends political intrigue, magic, and forbidden romance, with a 4.6-star rating from early listeners.",
"Fantasy readers looking for a fresh series with strong world-building and character-driven stakes. It solves the problem of finding new epic fantasy beyond the usual bestsellers — a hidden gem with professional production and a compelling cast.",
"Best for evening or weekend listening sessions, or a two-week commute plan. The multi-POV structure rewards focused listening, and 13 hours gives you plenty of story per credit.",
"Wilkes combines epic scope with intimate character work, and Quay's narration gives each character a distinct voice. Starting book one now positions you to follow the series as it grows, like getting in early on a new favorite saga.",
"Absolutely. Start your free trial, download instantly, and the opening chapters set up the conflict and characters quickly. No prior knowledge of the series is needed.");
sq("web-of-vows-and-vengeance-ashbrook",
"Web of Vows and Vengeance by Aria Ashbrook is an enemies-to-lovers fantasy romance, the first book in The Hirathean Path. Narrated by Amanda Leigh Cobb, this 12-hour audiobook follows a captive princess forced to marry the king who destroyed her kingdom, rated 4.5 stars.",
"Readers who love enemies-to-lovers, arranged-marriage tropes, and courtly fantasy. It solves the problem of wanting high-stakes fantasy with a slow-burn romance at its center, perfect for romantasy fans who finish books fast.",
"Ideal for commutes, workouts, or binge weekends. The tense marriage-of-convenience setup keeps you hooked chapter to chapter, and 12 hours fits comfortably inside a free trial period.",
"Ashbrook pushes the enemies-to-lovers formula further by making the male lead genuinely dangerous, and Cobb's narration balances icy control with hidden warmth. It is a strong series opener for listeners who want romance and political intrigue together.",
"Yes. Start your free trial, download, and the forced-marriage premise hooks you in the first chapters. You can finish the whole book within your 30-day trial.");
sq("just-for-the-cameras-quinn",
"Just for the Cameras by Meghan Quinn is a swoony fake-dating romance set in Hollywood, narrated by Emma Wilder. This 9-hour 45-minute audiobook pairs a famous actor and a rising actress in a publicity relationship, with a 4.5-star rating.",
"Fans of romantic comedies, fake-dating tropes, and celebrity settings. It solves the problem of wanting a light, feel-good listen that still has real emotional depth — great for escaping a stressful week.",
"Perfect for commuting, cooking, cleaning, or any time you want a warm, funny story. Short chapters make it easy to pause, and the dual narration keeps the banter lively.",
"Quinn is a master of romantic comedy, and Wilder plus a strong cast make the chemistry audible. Unlike many celebrity romances, the book balances laugh-out-loud moments with genuine heart.",
"Absolutely. Start your free trial, download, and the fake-dating setup is introduced immediately. It is a fast, bingeable listen you can finish in a few days.");
sq("reminders-of-him-hoover",
"Reminders of Him by Colleen Hoover is an emotional second-chance romance about a mother fighting to reconnect with her daughter after tragedy. Narrated by Brittany Pressley, this 10-hour 23-minute audiobook holds a 4.7-star rating from over 50,000 listeners.",
"Readers who love angsty, character-driven romance with real emotional stakes. It solves the problem of finding a book that makes you feel deeply — exploring grief, forgiveness, and the messy work of earning trust back.",
"Best for evenings or weekends when you can focus, because the story pulls you in emotionally. Also great for commutes if you like tearing up on the train. Around 10 hours fits neatly in a trial.",
"Hoover's signature emotional storytelling is amplified by Pressley's raw narration. The dual perspectives give you both sides of the guilt and longing, making the payoff hit harder than most romances.",
"Yes. Start your free trial, download instantly, and Kenna's situation grabs you in the first chapter. You will likely finish it in a single weekend.");
sq("regretting-you-hoover",
"Regretting You by Colleen Hoover follows a mother and her teenage daughter navigating grief, betrayal, and secrets after a devastating loss. Narrated by Tanya Eby, this 9-hour 51-minute audiobook holds a 4.6-star rating.",
"Fans of family drama and emotional contemporary fiction, especially readers who loved Hoover's other books. It solves the problem of wanting a story about complicated family love — not just romance, but the hard work of understanding each other.",
"Perfect for quiet evenings, long drives, or a weekend binge. The dual mother-daughter perspectives keep the pace tight, and under 10 hours is easy to finish inside a trial.",
"Most Hoover books center a couple; Regretting You centers a family, which makes it stand out. Eby's narration handles both the teen voice and the mother's pain with equal skill.",
"Absolutely. Start your free trial, download, and the opening tragedy sets up immediate emotional stakes. No prior familiarity with the author is required.");
sq("sinful-king-kane",
"Sinful King by Natalie Kane is a steamy dark romance between a ruthless king and the woman who refuses to bow to him. Narrated by Teddy Hamilton, this 7-hour 20-minute audiobook has a 4.5-star rating.",
"Dark romance fans who love possessive heroes, power imbalances, and high heat. It solves the problem of finding a quick, intense escape — a royal dark romance with bite that doesn't require a long series commitment.",
"Ideal for commutes, workouts, or evenings when you want a fast, consuming story. At about 7 hours, you can finish it in a couple of days.",
"Kane delivers a genuinely dangerous hero rather than a softened one, and Hamilton's narration brings the commanding voice to life. It is a strong standalone for listeners who want the fantasy without reading three books first.",
"Yes. Start your free trial, download, and the power dynamic is established in the opening scenes. A short, satisfying listen for your free trial period.");
sq("the-unselected-journals-emma-m-lion-vol7",
"The Unselected Journals of Emma M. Lion Vol. 7 by Beth Brower continues the beloved found-family series set in Victorian London, narrated by Genevieve Gaunt. This 4-hour 30-minute audiobook has a 4.7-star rating.",
"Fans of cozy, character-driven historical fiction and readers who have been following Emma's story. It solves the problem of wanting a warm, witty escape with lovable characters — perfect for decompressing.",
"Perfect for short commutes, lunch breaks, or a cozy Sunday afternoon. At under 5 hours it is one of the quickest, most charming listens you can get with a credit.",
"Brower's journals format and Gaunt's narration create an intimate, diary-like feel you don't get from typical historical fiction. The series' gentle humor and found-family warmth keep listeners coming back volume after volume.",
"Absolutely. Start your free trial, download, and the journal style welcomes you immediately. It is an easy, low-commitment listen that fits perfectly in a trial.");
sq("war-about-you-mills-brothers",
"War About You by Nek Mills is the second book in the Mills Brothers series, a second-chance sports romance between a retired quarterback and his high school sweetheart. Narrated by Midnite Michael, this 8-hour 15-minute audiobook has a 4.6-star rating.",
"Sports romance fans who love second chances, brothers-in-uniform dynamics, and small-town settings. It solves the problem of finding a series where each book feels fresh while rewarding readers who follow the whole family.",
"Great for commutes, workouts, or weekend binges. Under 9 hours is easy to finish in a few days, and the sports romance energy keeps the pacing lively.",
"Mills gives the couple real history and real wounds rather than an easy reunion, and Michael's narration delivers the gruff-but-tender hero well. Series fans get cameos, but newcomers can start here without being lost.",
"Yes. Start your free trial, download, and the second-chance setup is clear within the first chapters. A fast, satisfying listen for your trial.");
q["the-unselected-journals-emma-m-lion-vol7"] = { q1: "x", q2: "x", q3: "x", q4: "x", q5: "x" }; delete q["the-unselected-journals-emma-m-lion-vol7"];

for (const book of d.books) {
  if (q[book.slug]) Object.assign(book, { questions: q[book.slug] });
}
fs.writeFileSync(p, JSON.stringify(d, null, 2));
console.log("Part 1 added questions: " + Object.keys(q).length);