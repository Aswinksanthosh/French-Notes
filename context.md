# context.md — Read This First

This file is project memory for Claude Code sessions on this repo. It exists
because Claude Code sessions get compacted/reset, and re-explaining the
project from scratch every time was costing the user tokens and patience.

**If a new session is told "read the code and comments and context.md to
find the report of the user"** — this file, the big comment block at the
very top of `index.html`, and the inline comments near the JS functions
(`classOrder`, `updateChapterColors`, `updateProgress`,
`saveChecklistState`/`loadChecklistState`) together ARE that report. Read
all of them before making changes, especially before "apply this to the
rest of the classes"-type requests (see **The Recurring Failure Mode**
below — that's the single most important section in this file).

This file replaces the old `prompt.md` (renamed 2026-09-24). Older,
resolved incident details from `prompt.md` are compressed into **History**
below; nothing load-bearing was dropped, just shortened.

## Standing instruction: report to context.md every chat

**At the end of every session/turn that changes `index.html` (or this
file), update this file before finishing:** add a short entry to
**History** for any bug found+fixed, and update **Status** if the overall
state of the site changed. Do this even if the user doesn't explicitly ask
for it that turn — it's the whole point of this file, and it's cheap to do
right after the work while the details are fresh. Skipping it is what
caused the need for this file in the first place.

## Standing instruction: read this file at the start of every session (added 2026-10-07)

**Read this entire file at the start of every session — and again any
time the environment resets or the conversation is compacted/summarized**,
before touching `index.html`. A compaction summary is not a substitute:
it can drop or distort the project-specific conventions below (checkbox
id scheme, escaping traps, A1/A2 header variants, the standing-instruction
policies themselves). Re-reading this file directly is cheap; re-deriving
its contents from a lossy summary is how mistakes creep back in.

## Standing instruction: generate extra content, and reorganize, when the
source material isn't enough on its own (added 2026-10-06)

**The user studies from this site exclusively — if a chapter is thin,
confusing, or poorly ordered, that directly hurts their studying, not
just the site's polish.** When building or updating ANY chapter from a
transcript, worksheet, or pasted notes the user provides, don't just
transcribe what was given if it falls short. Specifically:

- **If the source material has a real content gap** that would leave the
  user unable to actually use the grammar point — a rule stated but
  never generalized, a pattern shown for one verb but not stated as a
  rule, an example given with no explanation of why it works — generate
  the missing explanatory content yourself, using sound French-teaching
  judgment. This is exactly what happened with classes 35-40 (the -RE
  verb rule didn't exist anywhere until it was written from scratch,
  and the "-issant test" for verb-group classification was invented to
  fix a genuinely wrong existing rule) and classes 41/42 (the tense-
  choice reasoning behind each sentence of the worked story was added,
  not just the sentences themselves). Keep doing this by default, not
  only when explicitly asked.
- **If the source material's own ordering is confusing, scattered, or
  just follows the chronological/conversational order of a live class**
  (which is rarely the best teaching order), reorganize it into the
  site's established per-class pattern — numbered `<h3>` topic sections
  that build logically on each other — rather than preserving the
  transcript's original order. A transcript is a source to teach FROM,
  not a script to transcribe.
- **Generated content must match the rest of the site in quality and
  tone**: concrete examples (never an abstract grammar question with no
  example sentence — this is an explicit, longstanding rule already
  baked into every chapter's Gemini-prompt header), tables where a
  table is clearer than prose, an audio-narrated expandable explainer
  for the core concept, and a checklist item per topic. The goal is
  that no chapter is good only because of what happened to come up that
  particular day in class — every chapter should stand on its own as a
  complete, well-organized lesson.
- This is a standing default for all **future** chapter work, not a
  one-time retroactive task — don't go rewrite all existing chapters
  because of this entry alone. (Separately, the 2026-10-02/06
  quality/order audit already identified specific existing chapters
  with real gaps — see that entry below — act on those if/when the user
  greenlights it, same as always.)

---

## What this site is

A single-file, no-build French learning curriculum: `index.html` only
(plus static data files like `CLASS-NAMES.md`, `french_notes_data.md` that
feed content, not code — `CLASS-NAMES.md` is known-stale, see Open
suggestions below). 41 lesson cards ("classes") as of 2026-10-06:

- **A1: classes 1, 2, 35-40, 3-21** (beginner — classes 35-40, the
  dedicated verb-conjugation arc added 2026-10-02, are positioned early
  in `classOrder`/the nav even though their ids are high, so a learner
  hits verb foundations before anything that needs them)
- **A2: classes 22, 23, 25-34, 41, 42** (intermediate — note there is no
  class 24, it was renumbered away; navigation code walks a `classOrder`
  array instead of assuming a contiguous range, see the comment above
  that array in `index.html`)

Always check the actual current `classOrder` array and nav dropdown
before trusting any class count/range stated in prose anywhere
(including this file) — this project has grown continuously across many
sessions and a stale summary is a recurring risk. `grep -n 'id="class'
index.html` and `grep -n 'const classOrder' index.html` are the ground
truth.

Live site: GitHub Pages, deployed automatically from `main`.
Repo: https://github.com/Aswinksanthosh/French-Notes

**The user uses this site almost exclusively on a phone.** Every change —
CSS, layout, new sections, checklist styling — has to work at phone width.
Don't design or verify against a desktop-width assumption. When in doubt
about a layout change, say explicitly that you couldn't test it on a real
phone rather than asserting it works.

## How the user works, and the failure loop to avoid

The user is careful with tokens. Their normal pattern is:

1. Pick **one** class, iterate on it directly with Claude until it's fully
   correct and debugged (a new feature, a restructuring, a bugfix).
2. Then ask Claude to **apply the same change to the rest of the classes**.

**Step 2 is where almost every bug in this project's history has come
from.** The shared JS (`updateProgress`, `updateChapterColors`,
`saveChecklistState`/`loadChecklistState`, the `showClass`/`goToClass`/
`nextChapter`/`previousChapter` nav functions) was written assuming
whatever the per-class HTML structure was *at the time*. When the
structure changes during step 1 (e.g., one checklist block per class →
multiple checklist blocks split by topic), the shared JS goes stale
silently — it doesn't error, it just quietly undercounts progress, mismatches
state, or breaks navigation around edge cases (like the missing class 24).
Then step 2 propagates both the intended change AND the now-wrong
assumptions across 20 more classes at once, which is expensive to debug.

**Rule for any future session doing a batch/replicate task across
classes:** before touching class 2, re-read the ACTUAL current shared JS
near the bottom of `index.html` (don't rely on memory of how it used to
work), confirm which functions are dead vs. live (grep for duplicate
function names — see History, "duplicate updateProgress" — duplicates are
silently shadowed, not errors), and run the verification checklist below
after *every single class*, not just at the end of the batch.

## Fix obvious bugs without being asked

If you notice something clearly, mechanically wrong while working in this
file — a mismatched `for=`/`id` pair, a duplicate function declaration, a
stray unclosed tag, an obviously dead code path — fix it as part of your
current edit rather than leaving it and waiting to be told. Note what you
fixed and why in the commit message and, if it's the kind of thing that
could recur, as a short comment at the spot. This project's biggest
recurring cost has been silent, structural bugs that nobody noticed for a
while — proactively closing them is worth more here than strict
scope-minimalism.

## The established per-class pattern (apply this to every class)

1. `<p class="topic">...</p>` line, then a progress bar + counter right
   after it: `<div class="progress-label"><span class="progress-count"
   data-lesson="classN">0 / X done</span></div>` +
   `<div class="progress-bar-wrap"><div class="progress-bar"
   data-lesson="classN"></div></div>`.
2. Content under `<h3>` topic headers. A `<ul class="checklist"
   data-lesson="classN">` sits immediately after the specific topic it
   checks off — not bunched at the bottom. Workflow being encouraged:
   read a topic, check its item(s), move to the next topic.
3. If — and only if — one checklist item is genuinely general/comprehensive
   rather than tied to a single topic, it goes under a final `<h3>✅
   Overall Mastery</h3>` at the very bottom. If every item already maps
   cleanly to a topic, don't add that section (many A1 classes don't have
   one — that's correct, not incomplete).
4. Every checkbox `id` must be **globally unique across the whole file**.
   State is saved keyed by checkbox id (not list position) — see
   `saveChecklistState()`. A reused id will silently share/clobber saved
   progress with whatever else uses that id.
5. The "📋 Copy for Gemini" button's prompt text starts with a "Complete
   Site Features & How To Use Them" write-up before the lesson content —
   green/A1 variant (mentions green checkboxes, the 🎓 A1 badge) for
   classes 1–21, blue/A2 variant for 22/23/25/26.
6. Any standalone French word/letter/phrase shown to the learner (not just
   the worked examples) should be clickable-to-pronounce: wrap it in
   `<span class="fr">...</span>` and it just works — there's already a
   global `document` click listener that calls `speakFrench()` for any
   `.fr` element, no per-word `onclick` needed. (Class 1's A–Z alphabet
   line was missed originally — only the example words below it were
   clickable — fixed 2026-09-24. Check other classes for the same gap:
   vocab lists, standalone letters/numbers, anything presented as plain
   text that a learner would want to hear.)
7. Verify after every class, before moving to the next one:
   - checkbox `id` vs label `for` match 1:1 (no mismatches)
   - unique checkbox id count equals the number of checklist items for
     that class
   - `<div>`/`</div>` balance within that class's line range
   - `node --check` on the extracted `<script>` contents (whole file) still
     passes
   - grep for duplicate function names in the shared `<script>` before
     editing any shared function
   - if you touched any `onclick="..."` attribute text (prompt text,
     speakFrench text, anything with quotes/apostrophes in it): run a
     headless-browser check, not just a text/regex check. `node --check`
     on extracted `<script>` contents does NOT see attribute text and will
     miss a broken `onclick`. Load the page with Playwright
     (`/opt/pw-browsers/chromium`, already installed — don't reinstall),
     read each button's parsed `onclick` attribute via
     `el.getAttribute('onclick')`, and confirm
     `new Function('event', thatText)` doesn't throw, for every class. A
     raw `'` or a `\"` (backslash+doublequote — wrong, breaks the HTML
     attribute; use `&quot;` instead) anywhere in prompt text is a bug.

## Standing rule: adding or removing a chapter/class — full sync checklist

Added 2026-09-25 after the user asked to "fix the navigation menu every
time we add or remove chapters" — this exact gap between steps is what
caused the earlier nav-breaking-around-missing-class-24 bug (see History
below). The full top-of-file HTML comment in `index.html` now carries
this same checklist too (search "ADDING OR REMOVING A CHAPTER"), so it
survives even if this file isn't read. Go through ALL of these, every
time, not just the obviously-affected one:

1. **`classOrder` array** (search `const classOrder =` near the bottom
   `<script>`). Single source of truth for chapter count, Prev/Next
   traversal order, and which class numbers are valid. Add/remove the
   number here.
2. **The nav dropdown** (search `<nav id="toc">`): add/remove the
   `<a href="#" onclick="goToClass(N)">Name</a>` line under the correct
   `.level-content.a1` or `.level-content.a2` div. **Its position in this
   list must match its position in `classOrder`** — Prev/Next follows
   `classOrder`'s order, not DOM order, so if the two disagree, Prev/Next
   silently jumps somewhere different from what's shown above/below the
   current chapter in the dropdown.
3. **A2-specific CSS** (search `data-lesson="class22"` — there's a block
   styling A2 checklist labels with a different color scheme than A1's,
   listing every A2 class number explicitly). A new A2 class left out of
   this list silently renders with A1's default styling instead.
4. **The lesson card itself**: `<div class="lesson-card" id="classN">`,
   its `.progress-count`/`.progress-bar` pair (both need
   `data-lesson="classN"`), and every `<ul class="checklist"
   data-lesson="classN">` block. Confirm checkbox ids stay globally
   unique after the edit.
5. `totalClasses` and the "Class X of Y" indicator are **derived** from
   `classOrder.length` — never hand-edit a count anywhere.
6. **Verify with a headless test after editing**, not just by eye: load
   the page in Playwright and confirm (a) the nav dropdown's
   `goToClass(N)` numbers, in order, exactly equal `classOrder`; (b) every
   `classOrder` entry has both a real `#classN` element and a nav link;
   (c) clicking each nav link actually activates the matching card; (d)
   walking `nextChapter()` from the first class the full length of
   `classOrder` never lands outside it. This is a ~30-line script, cheap
   to re-run, and it's exactly the class of bug that a visual check alone
   misses (a bare div-balance/JS-syntax check doesn't catch nav/order
   drift at all — verified 2026-09-25 that this exact 4-part check catches
   it and passed on the then-current 25-class dropdown).
7. **Also verify the nav LABEL TEXT itself against each class's real
   `<h2>` title, not just the numbers.** The check in step 6 only proves
   the numbers/links/order are structurally consistent - it says nothing
   about whether "Numbers" actually says "Numbers" and not some other
   class's old name. This is not hypothetical: it happened for real (see
   History below, "nav labels for classes 2-15 were off by one"), and the
   step-6 audit earlier the same day passed cleanly while this exact bug
   was live, because it never compared label text to content. A one-line
   script: regex out each `goToClass(N)` link's text, regex out class N's
   `<h2>` text, confirm one contains the other (case-insensitive).

Verified 2026-09-25 (proactive audit, not a live bug report): nav dropdown,
`classOrder`, and all 25 lesson cards were fully in sync at that time —
gap at class 24 is intentional (documented at the top of `index.html`)
and every consumer of class numbers already goes through `classOrder`
rather than assuming a contiguous 1..N range, so the gap itself doesn't
break anything on its own. The risk is future edits skipping one of the
6 steps above, not the current state.

**First real test of this checklist: Class 27 added 2026-09-25** (see
"Class 27 added" below). Went through all 6 steps plus the label-sync
check; the headless verification (nav order matches `classOrder`, every
class has both a card and a nav link, every link activates the right
card, Next traversal never leaves `classOrder`, nav label text matches
each `<h2>`) all passed on the first attempt — the checklist held up.

## Class 27 added 2026-09-25: "Prepositions — Cause, Purpose & Fixed
Expressions" (A2, follow-up to Class 25)

User uploaded a PDF ("LES PRÉPOSITIONS EN FRANÇAIS") plus a raw
transcript of that day's live class, both about prepositions, and asked
to add "today's class." **Before building anything**, checked whether
this duplicated existing content: Class 25 ("A2: Prepositions") already
covers nearly every topic in the PDF, almost section-for-section (place,
time, cities/countries, means, cause, direction, verb+preposition,
adjective+preposition, compound prepositions, contracted forms, common
mistakes, B1-B2 sentences) — the PDF looks like it may have been the
original source Class 25 was built from in an earlier session. Asked the
user directly rather than guessing whether to (a) enrich Class 25 instead
of duplicating it, (b) build a new class anyway since this was a separate
live session, or (c) do nothing. **User chose (b): a new class anyway.**

Rather than re-covering ground Class 25 already owns, built Class 27
around what the live-class transcript actually emphasized that Class 25
doesn't have as its own topic: the distinction between the five ways to
express CAUSE (à cause de = negative cause, parce que = neutral
explanation with no blame, grâce à = positive cause, en raison de =
neutral/formal, faute de = for lack of — Class 25's cheat sheet only
lists 3 of these with no "parce que" comparison), a dedicated PURPOSE/BUT
section (pour, afin de, dans le but de — not a topic in Class 25 at all),
verb+preposition and adjective+preposition expressions (overlaps Class 25
but re-taught since it came up heavily in this specific live session), a
short contracted-articles review, and a common-mistakes table specific to
this session's errors.

Followed the full "adding a chapter" checklist above: `classOrder` →
appended `27`; nav dropdown → added under `.level-content.a2`, positioned
last to match `classOrder`'s order; A2 checklist-label CSS (the
`data-lesson="class22"`-style selector list) → added `class27` to both
the label-color and checked-label selectors; lesson card itself → 8
checklist items across 7 topics + Overall Mastery, `data-lesson="class27"`
throughout, checkbox ids `ca27-1` through `ca27-8` (confirmed globally
unique against all 208 checkboxes site-wide, not just A2's); both new
tables wrapped in `.table-wrap` from the start (see the table-overflow
bug above — never ship a bare `<table>` again); added the
"🔎 What's in this chapter?" button per the established rollout pattern.
Verified: JS syntax, div balance (comments-stripped), checkbox id
uniqueness, checkbox id/label matching, nav-label-vs-h2 sync (all 26,
zero mismatches), all 26 "Copy for Gemini" buttons parse, class27 reaches
`0 / 8 done`, chapter indicator shows "Class 26 of 26", and no viewport
overflow on class27 at 390px phone width. Also updated `README.md`'s
curriculum list to include it.

## Three more site-wide features added 2026-09-25 (after Class 27)

All three are global, mechanical edits applied identically across every
class via a script rather than by hand per class — same reasoning as the
earlier `\"` → `&quot;` fix in History: 26 classes is too many to edit by
hand reliably, and a script plus a full verification pass afterward is
both faster and safer.

**1. Exam-completion line in the Gemini prompt.** User asked: at the end
of the exam, Gemini should say "excellent ✅ you are done here go back to
next lesson." Added as a new bullet in the shared LEARNING STRATEGY list
that's baked into every class's "📋 Copy for Gemini" `onclick` prompt text
(right after the existing "🎤 BEFORE ANY SPEAKING..." bullet, before the
`═══` separator line), via a single `str.replace()` matched against the
exact shared bullet text — found and replaced in all 26 occurrences in
one pass. Verified all 26 "Copy for Gemini" buttons still parse
(`new Function('event', onclick)` doesn't throw) and all 26 now contain
the new line.

**2. "Complete Gemini skill test" checklist item.** User then asked for a
matching checklist item at the end of every chapter, not just an
instruction inside the Gemini prompt text. Script-inserted one `<li>`
(checkbox id `gemini-skill-classN`, globally unique) as the LAST item in
each class's LAST `<ul class="checklist" data-lesson="classN">` block —
found by taking each class's HTML region (from its own `id="classN"` div
to the next class's, or to the footer for the last class) and locating
that region's final `</ul>`. This correctly lands as the true end of the
chapter's checklist regardless of whether that final block is titled
"Overall Mastery" or not (many A1 classes don't have that heading at all
— see pattern rule #3). Also recalculated and updated every class's
`progress-count` "X / Y done" total to include the new item (JS
recalculates this on load anyway, but keeping the static HTML accurate
matters for anyone reading the source, and matches established practice
from the Class 27 build). Verified: 234 total checkboxes site-wide
(208 + 26 new), zero duplicate ids, every checkbox id has a matching
`label for=`, every class's displayed total matches its actual checkbox
count, and checking the new box actually moves the counter (tested on
class1: 0/8 → 1/8).

**3. "Back to Top" button at the end of every chapter.** Script-inserted
a `<button class="back-to-top-btn" onclick="window.scrollTo({top:0,
behavior:'smooth'})">` right after each class's now-final checklist
`</ul>` and immediately before that class's own closing `</div>` — found
by searching, within each class's region, for the first `</div>` that
occurs after the region's last `</ul>` (verified against the file's
consistent `</ul>\n</div>\n\n<!-- next class comment -->` pattern before
writing the script, not assumed). New CSS class `.back-to-top-btn`,
styled to match `.chapter-btn`'s look (light-blue pill, blue border).
Verified: present in all 26 classes, clicking it actually reaches
`scrollY === 0` (checked after the smooth-scroll animation finishes, not
just that it started moving), and the usual JS-syntax/div-balance/copy-
button regression checks all still pass.

**Housekeeping while reading back through the project 2026-09-28:**
noticed these three entries were missing from this file (a real gap
against the standing "update context.md after significant work" rule —
they'd been committed to `index.html` but never written up here) and
that the top-of-file HTML comment in `index.html` still said "25 lesson
cards ... A2 = classes 22,23,25,26", stale since Class 27's addition.
Fixed both while writing this entry.

## Class 28 added 2026-09-28: "Le Passé Récent & Le Passé Composé" (A2)

User uploaded an image (a 3-panel cheat sheet covering passé récent,
passé composé, AND l'imparfait) plus a transcript of that day's live
class, and said "next class." **Checked scope before building**: the
transcript's own clean summary explicitly says l'imparfait is deferred
to the *next* session ("la suite du cours est annoncée pour
après-demain") — only passé récent and passé composé were actually
taught this session, even though the image already has ready material
for all three tenses. Asked the user directly rather than guessing
whether to build just the two actually-taught tenses or all three from
the image; **user chose the two actually-taught tenses**. L'imparfait
will get its own class later, when that session happens — the image's
third panel is sitting there ready for it.

Built from the transcript's clean top-of-file summary (more reliable
than the raw call transcript underneath it, which is messy speech-to-
text) plus the image's polished conjugation tables: passé récent
(venir + de + infinitif, elision before a vowel, the "tu viens d'où"
trap), what passé composé actually is (auxiliary + past participle,
never used alone), forming the past participle (regular -er/-ir/-re
rules plus the venir/tenir/devenir and ouvrir-family irregular
shortcuts), passé composé with avoir (no agreement, the "vous avez un
billet" vs "vous avez acheté un billet" confusion), and passé composé
with être (the 16 "Dr & Mrs Vandertramp" verbs, pronominal verbs, past
participle DOES agree here) — 6 topics + common mistakes + mastery = 8
checklist items, matching the Class 27 build's scope.

Followed the full chapter-add checklist again: `classOrder` → appended
`28`; nav dropdown → added under `.level-content.a2`, last position to
match `classOrder`; A2 checklist-label CSS selector list → added
`class28`; lesson card → `data-lesson="class28"` throughout, checkbox
ids `c28-1` through `c28-7` plus `gemini-skill-class28`, both new tables
wrapped in `.table-wrap` from the start; chapter summary button;
Back to Top button. **New this time**: the nav-label-vs-h2 sync check
(step 7, added after the Class 2-15 nav bug) actually caught something —
the first nav label picked ("Past Tenses") wasn't a literal substring of
the h2 ("A2: Le Passé Récent & Le Passé Composé"), even though it was an
accurate description, not a stale/wrong one. Renamed to "Passé Composé"
(which does appear in the h2) rather than loosen the check — a nav label
that's independently worded from its own chapter's title is exactly the
kind of drift that check exists to catch early, even when the specific
instance turns out harmless. Verified: 242 total checkboxes site-wide, 0
duplicates, all id/label pairs match, all 27 nav labels now pass the
h2-substring check, all 27 "Copy for Gemini" buttons parse, class28
reaches `0 / 8 done`, chapter indicator shows "Class 27 of 27", and no
phone-width overflow. Updated `README.md`'s curriculum list too.

## Class 29 added 2026-09-29: "Group 3 Irregular Verbs" (A2, vocabulary
reference, not a grammar class)

User pasted a raw list of 55 Group 3 (irregular) French verbs, grouped
into 5 categories, with no instruction attached — just the list. Asked
what to do with it rather than guessing (build a new class? fold into an
existing one? just notes, no site change?) — **user chose: build a new
class.**

Important difference from Classes 27/28: this source had **no example
sentences, no live-class transcript, no grammar explanation** — just
French↔English verb pairs, pre-grouped by the user into 5 categories
(core irregulars, more common irregulars, -oir verbs, irregular -re
verbs, irregular -ir verbs). Built the class honestly around what was
actually given: a vocabulary reference (5 tables matching the user's own
grouping exactly, each verb wrapped in `.fr` for pronunciation) rather
than inventing example sentences or conjugation drills that weren't in
the source material. Added a few genuinely useful notes that don't
require inventing content: `falloir`/`pleuvoir` are impersonal (only
`il faut`/`il pleut` exist, no other conjugated forms), the `-uire`
family (conduire/construire/traduire/produire/détruire/cuire) shares one
conjugation pattern, and `ouvrir/offrir/couvrir/découvrir/souffrir`
conjugate like -ER verbs in the present tense despite ending in -ir (a
real trap). **Lesson for future sessions: when source material is a bare
list with no examples, don't pad the class with invented example
sentences to make it "feel" like the other classes — build what the
actual source supports, and say so in the Gemini prompt text too (told
Gemini explicitly not to invent example sentences either).**

Followed the chapter-add checklist: `classOrder` → appended `29`; nav
dropdown → added under `.level-content.a2`, last position; label picked
as "Group 3" specifically because the site already has a class labeled
"Irregular" (Class 19, A1) — needed something that passes the h2-
substring check *and* doesn't collide in meaning with an existing label;
A2 checklist-label CSS → added `class29`; lesson card → `data-lesson=
"class29"` throughout, checkbox ids `c29-1` through `c29-6` plus
`gemini-skill-class29`, all 5 new tables wrapped in `.table-wrap` from
the start; chapter summary + Back to Top buttons. **Caught my own
mistake before shipping**: first wrote the progress-count as `0 / 6
done` by miscounting (5 topic items + mastery = 6, forgot the
gemini-skill item makes it 7) — caught it by re-reading the checklist
items rather than trusting my own arithmetic, fixed to `0 / 7 done`
before running verification. Verified: 249 total checkboxes site-wide, 0
duplicates, all id/label pairs match, all 28 nav labels pass the
h2-substring check, all 28 "Copy for Gemini" buttons parse, class29
reaches `0 / 7 done` correctly, chapter indicator shows "Class 28 of
28", no phone-width overflow. Updated `README.md` too.

## Dialogue examples added to all 21 A1 chapters (2026-09-29)

User feedback: existing "example" content was just 2-3 word phrases -
wanted a real back-and-forth conversation between two people per
chapter, tailored to that chapter's own grammar/vocabulary, with audio,
at the end of every A1 class.

This followed directly after two rounds of "fix the blue sentences" bug
reports that turned out to be about different chapters than first
assumed (see the two entries above this one) - worth remembering that
when a user names a chapter by feel rather than its exact site label,
double-check which chapter they actually mean before doing a lot of
work, since "Gender" and "Endings" are topically adjacent and easy to
conflate. The Gender-chapter cheat sheet from the misfire two rounds ago
was reverted once the correct target (Endings) was confirmed.

**Format chosen**: `<h3>💬 Conversation Example</h3>` + a `.note` div
containing one context sentence and 4-5 lines of `<strong>Name:</strong>
<span class="fr">French line</span> <em>(English translation)</em><br>`.
Deliberately did NOT use the existing `.example` class (which speaks an
entire multi-line block as one unit via em-dash splitting) - instead
each line is its own `.fr` span, individually tappable exactly like
every other clickable phrase on the site. This sidesteps a real problem
with speaker labels: if "Léo:" were inside the parsed/spoken text it
would get read aloud awkwardly ("L é o colon..."); keeping the label
outside the `.fr` span means only the actual French sentence is ever
passed to `speakFrench()`.

**Placement**: right before each chapter's `.back-to-top-btn`, found
programmatically per class (same start/end-boundary approach as the
gemini-skill-checklist and back-to-top insertions) rather than assuming
a fixed offset - reliable because every class was already confirmed to
have exactly one `.back-to-top-btn`.

**Content**: each of the 21 dialogues is unique and drawn from that
specific chapter's actual topic (checked via the `<p class="topic">`
line before writing any of them) - e.g. spelling a name for Alphabet,
noun-gender guessing for Endings, an airport announcement for Listening,
price + prepositions of place for Irregular. Not template-filled generic
sentences.

Verified: JS syntax and div balance hold (808/808), exactly 21
"Conversation Example" headings (a 22nd match was a pre-existing
unrelated "Real-World Family Conversation Examples" heading in Family,
not a duplicate), every dialogue sits immediately before its chapter's
Back to Top button, spot-checked a 5-line dialogue (Class 15) end to end
confirming every single line's `.fr` span calls `speakFrench` with
exactly the right text, no phone-width overflow on any class, all 28
copy buttons still parse, nav order intact.

**If asked to do the same for A2 (Classes 22-29) later**: same pattern,
same insertion approach (find `.back-to-top-btn` per class), just write
dialogues matching each A2 chapter's actual content first.

**Immediate correction (same day):** user said the new section "felt
duplicated" and the dialogue itself felt fake/quiz-like ("Le tourisme ou
la tourisme?" is a grammar drill wearing a dialogue costume, not two
people talking). Root cause of the duplication complaint: every A1
chapter already had a pre-existing "📚 Real-World ... Examples" section
(a `.note` full of disconnected example sentences) right next to where
the new "💬 Conversation Example" section landed - two different-content
but same-*shape* blocks back to back reads as one redundant block to a
user skimming, even though the actual sentences differed.

**Fix**: removed the new section entirely (script-reversed the same
insertion, by matching the exact `<h3>💬 Conversation Example</h3>...`
block per class) and instead rewrote the *existing* examples block's
content in place - same location, same heading level, renamed to "💬
Natural Conversation" - as a casual conversation between two named
people about ordinary things (weekend plans, shopping, family, a
voicemail invite) where the chapter's grammar/vocabulary shows up
naturally rather than being the explicit topic being quizzed. Three
chapters (1, 3, 12) use an older toggle/flashcard format for single-word
examples that's structurally distinct enough not to read as duplicated -
left those alone and added the new conversation right after them instead
of replacing anything.

**Lesson for future content requests like this**: when writing an
"example" or "conversation" for a language-learning grammar point, the
instinct is to make the dialogue explicitly ABOUT the grammar point
("is le or la correct here?") because that's the most direct way to
demonstrate it - but that's exactly what makes it feel like a quiz
instead of natural speech. A native conversation uses the grammar
without commenting on it. Write the dialogue as two people actually
talking about something (plans, shopping, family, weather), and let the
target grammar surface on its own within that - never make the grammar
point itself the topic of the sentence.

## Gemini prompt: always require a concrete example (2026-09-29)

Separate complaint, same session: Gemini was teaching/testing grammar in
the abstract - e.g. asking "is this word feminine or masculine?" with no
sentence attached, which the user said is useless because "I cannot use
that grammar in real life" without seeing it in context. Added one more
line to the shared prompt header (site-wide, all 28 classes, same
find-count-replace pattern as the other shared-instruction edits): "💡
ALWAYS GIVE A CONCRETE EXAMPLE" - every explanation and every question
must come with a real French sentence, not a bare abstract question.
Placed right before the existing "🎯 CHECK ONLY WHEN YOU UNDERSTAND"
bullet. Verified all 28 copy buttons still parse afterward (this class
of edit has broken buttons twice before this session, both times from
an unescaped apostrophe/newline inside the single-quoted JS prompt
string - built this one in a standalone Python script file rather than
an inline `-c` string specifically to avoid shell-escaping compounding
the risk, and it came out clean on the first attempt).

## Push workflow

One commit per class/change (not batched), descriptive commit message,
pushed to both `claude/wonderful-darwin-idhgvx` and `main`:
```
git add index.html
git commit -m "..."
git push -u origin claude/wonderful-darwin-idhgvx
git push origin claude/wonderful-darwin-idhgvx:main
```

**Standing instruction: always push to `main` too, every time, without
asking first (added 2026-10-07).** `main` is what GitHub Pages actually
deploys and what the user's phone loads — a change that only reaches the
feature branch isn't live, and the user has explicitly said not to wait
for a separate go-ahead on this. Before pushing, confirm it's a clean
fast-forward (`git fetch origin main && git merge-base --is-ancestor
origin/main claude/wonderful-darwin-idhgvx`) — if it's not (main has
commits the feature branch doesn't), stop and ask, don't force-push. This
is the one exception to the general "confirm before pushing" caution
elsewhere in these instructions, scoped specifically to this repo and
this branch→main sync.

### Backups/checkpoints

Use a **branch**, not a git tag: pushing `refs/tags/*` to this repo gets a
consistent 403 from this environment's proxy (confirmed 2026-09-24, retried
4x with backoff - not a transient network error, branch pushes to the same
remote work fine in the same session, so it's a policy/permission scoping
thing specific to tag refs). A branch gives the same "known-good point to
recover from" without needing tag-push rights:
```
git branch backup-vX.Y
git push -u origin backup-vX.Y
```
`backup-v1.1` exists on GitHub as of 2026-09-24, pointing at the commit
that finished the full A1 rollout + Gemini button fix + phone-use features
(home-screen install, scroll memory, swipe nav, intro guide).

## ⚠️ MAJOR RESTRUCTURING 2026-09-25: class numbers 2–15 changed

**Read this before trusting any class number mentioned elsewhere in this
file dated 2026-09-24 or earlier — many are now wrong.** Per explicit user
request, a new chapter was inserted as the literal Class 2 (not an
interstitial like Class 4.5), and old Class 15 was deleted entirely after
its content moved into the new chapter. Everything from old-2 through
old-14 shifted by +1; classes 16–21 and all A2 classes ended up back at
their OLD numbers (the +1 insertion and the old-15 deletion cancel out
past that point) — a coincidence specific to old-15 sitting where it did,
not a general rule.

**Old → new mapping:**
| Old # | New # | Name | Notes |
|---|---|---|---|
| 1 | 1 | Alphabet | unchanged |
| — | **2** | **Numbers, Calendar & Time** | brand new |
| 2 | 3 | Greetings | |
| 3 | 4 | Calendar | lost days-of-week + months (now in ch. 2) |
| 4 | 5 | Classroom | |
| 5 | 6 | Endings | |
| 6 | 7 | Articles | |
| 7 | 8 | Gender | |
| 8 | 9 | Hobbies | lost numbers 32–69 (now in ch. 2) |
| 9 | 10 | Family | |
| 10 | 11 | Professions | |
| 11 | 12 | Reflexive | |
| 12 | 13 | Future | |
| 13 | 14 | Demonstratives | |
| 14 | 15 | Negation | lost numbers 70–100+ (now in ch. 2) |
| 15 | **deleted** | Telling | entire chapter moved into ch. 2 |
| 16–21 | 16–21 | Colors...Description | **unchanged**, see above |
| 22,23,25,26 | same | A2 classes | untouched |

New Chapter 2 has 14 checklist items (`c2-1`..`c2-14`): numbers 0–19,
20–69, 70–99, 100+, days of the week, months, asking the time, times of
day, key time words, telling-time worked examples, gender agreement in
numbers, plus one Overall Mastery item. Site total: 199 → 200 items
(199 − 13 moved-out + 14 new).

**Every checkbox id in classes 2–15 changed** (they're keyed to their
class number, e.g. old Class 8's `c7-2` is gone; its content is now
`c2-2` in the new chapter). Anyone's saved localStorage progress for
old classes 2–15 is effectively reset by this - an accepted, explicit
consequence the user confirmed before this was done (see below).

**How this was approved:** the user's literal first message was "add an
extra chapter as 2nth chapter" with "numbers until 100... weeks, month,
saying time" — genuinely ambiguous. Before touching anything, three
rounds of clarifying questions were asked and answered: (1) insert as
literal Class 2 with full renumbering, explicitly chosen over the
much-safer interstitial "Class 2.5" pattern already established for
Class 4.5; (2) move (not duplicate) the existing numbers/days/months/time
content out of classes 3/8/14/15 into the new chapter; (3) final
confirmation after being told plainly that this deletes Class 15 entirely
and renumbers everything after it. **Lesson: when a request is this
ambiguous and this consequential (deletes existing content, renumbers
most of the site), asking before acting was the right call and is worth
repeating for anything of similar scope** - don't infer intent silently
on a request this size just because a smaller version of it seems
"obviously" what they meant.

**Three real bugs hit and fixed during this work, all worth knowing
about for any future large-scale renumbering:**

1. **Line-index shift bug in the first renumbering attempt.** A Python
   script processed each class-to-renumber as `lines[start:end] =
   [new_text]` using line numbers captured from the ORIGINAL file, but
   processed classes top-to-bottom. Since collapsing a multi-line slice
   into one list element shrinks the list, every subsequent segment's
   "line numbers" pointed at the wrong place by the time it was reached
   - corrupting unrelated classes' checkbox ids (renaming checkboxes
   that happened to fall in the wrong now-shifted slice) while leaving
   the actually-intended target classes' ids untouched. Caught by
   grepping for duplicate/missing class ids right after running it -
   the numbers didn't add up. **Fixed by reverting `index.html` to the
   last commit and redoing it bottom-to-top** (process the
   highest-line-number segment first): editing a segment only ever
   shifts line numbers *after* it, and everything not-yet-processed is
   *before* it, so earlier-captured line numbers stay valid for the
   rest of the run. **Rule: any script that rewrites multiple line
   ranges of the same file by index must process them bottom-to-top, or
   recompute boundaries fresh before each single edit — never batch
   top-to-bottom against line numbers captured up front.**
2. **Pre-existing off-by-one checkbox-prefix drift, discovered (not
   caused) by this work.** Classes 16–21 all used a checkbox prefix one
   less than their real class number (old Class 16/Colors used `c15-`,
   old Class 17/Meals used `c16-`, etc. — apparently a historical
   artifact from before this session, harmless until something else
   legitimately claimed those prefixes). Once old Class 14/Negation was
   correctly renumbered to claim `c15-`, it collided with Colors'
   pre-existing (buggy) `c15-` ids. Found via a global duplicate-id scan
   (`grep -oE 'id="c[a-zA-Z0-9]*-[0-9]+"' | sort | uniq -d`) run as a
   matter of course after the renumbering - not something a per-class
   balance check would catch, since each class was internally
   consistent on its own. Fixed by shifting classes 16–21's prefixes up
   by one to match their real numbers (processed bottom-to-top again,
   same reason as above). Separately, Class 6/Endings (old Class 5) had
   a `c4b-` prefix that didn't match `c\d+-\d+` at all and so silently
   escaped every prior regex-based check - found by manually eyeballing
   one class's rendered output, not by any automated scan. **Rule: a
   duplicate-id scan across the WHOLE file (not just within each class)
   is mandatory after any renumbering, and don't assume a checkbox
   prefix matches its class's number just because it looks like it
   should - grep for the actual distinct prefixes in use
   (`grep -oE 'id="c[a-zA-Z0-9]*-[0-9]+"' | sed -E
   's/id="(c[a-zA-Z0-9]*)-[0-9]+"/\1/' | sort -u`) and verify each one
   by hand.**
3. **A Python regex nearly deleted the entire page header/nav (most
   severe issue this session).** A cosmetic cleanup pass regenerated the
   stale `<!-- CLASS N -->` comment markers using a pattern like
   `(<!--.*?-->\s*\n)?(<div class="lesson-card" id="(class\d+)">...)`
   with `re.DOTALL`. For Class 1 specifically, `.*?` backtracked from
   the large top-of-file instructional HTML comment (added earlier this
   session, right after `<!DOCTYPE html>`) all the way through the
   *entire* `<head>`, `<body>` opening, intro section, global progress
   bar, and nav (including `#chapterIndicator`, `#prevBtn`, `#nextBtn`)
   - because DOTALL lets `.` cross newlines with no distance limit, and
   the optional-group backtracking kept extending past each intervening
   `-->` (none of which were immediately followed by Class 1's div)
   until it finally reached the one real `-->` that WAS followed by it,
   swallowing ~520 lines as "the old comment" to be discarded. This
   passed a per-class div-balance check and even a `.lesson-card`-scoped
   DOM check (both only look inside lesson-cards) - it was only caught
   because a live `showClass()` call threw `Cannot set properties of
   null` for the now-missing `chapterIndicator` element. Fixed by
   extracting lines 1–522 from the last git commit (that whole region
   was never meant to change) and splicing it back in, keeping the new
   comment text. **Rule: never use `re.DOTALL` with a non-greedy
   optional leading group `(X.*?Y)?` to "find the nearest preceding
   marker" across a whole-file blob - an unrelated earlier occurrence of
   the closing token anywhere in the file can make backtracking span
   the entire distance between them. Anchor such patterns tightly (e.g.
   require the comment to start on its own line with nothing but
   whitespace before it, or operate strictly within an already-sliced
   per-class segment, never across the whole file) - and always verify
   with something broader than a per-section check afterward: a full
   `document.body.children` structure dump, not just `.lesson-card`
   counts, would have caught this immediately instead of needing a
   runtime error to surface it.**

After all three fixes, verified: JS syntax, whole-file AND per-class div
balance, checkbox id/label matching (200 pairs), zero duplicate ids
site-wide, all 25 Gemini buttons parse and their clipboard content is
correct, nav Next/Prev walks correctly across the old-15 gap, and a full
`document.body.children` dump confirmed the header/intro/nav chrome and
all 25 lesson-cards are back in the correct order.

**Stale as of this restructuring, not yet reconciled:** any History entry
below dated 2026-09-24 that names a specific old class number (e.g.
"Class 8's numbers 32-69") is talking about content that has since moved;
the content and lesson still exist, just under a new class number per the
table above. `CLASS-NAMES.md` was already stale before this change (its
numbering didn't even match the pre-restructuring site) and is now
doubly so - continue treating it as unreliable, not authoritative (see
Open Suggestions below, already flagged pre-restructuring).

## Status (as of 2026-09-25)

All 26 classes (A1: 1–21, A2: 22,23,25,26,27) follow the per-class pattern
above. **Class numbers 2–15 changed on 2026-09-25 — see the restructuring
section above before assuming any class number below is still correct.**
The full A1 rollout (bringing the structure originally established on the
A2 reference classes to every class) is complete. All 25 "Copy for
Gemini" buttons verified working end-to-end (headless-browser click test,
clipboard content checked) after fixing the two quoting bugs in History
below.

**In progress (started 2026-09-24, class numbers below are POST-restructuring,
i.e. current):** a content-quality pass through the classes one by one, per
the user's usual workflow (see "How the user works" above) — going class
by class checking/improving actual lesson content, not structure. Class 1
(Alphabet) done: made the A–Z line clickable-to-pronounce (see pattern #6
above), fixed the shared expandable-audio double-play bug found while
testing it on this class's Accent Marks section (see History — that fix
applies site-wide, not just Class 1), then piloted a NEW feature on this
class only: a purple "🔎 What's in this chapter?" button (renamed from
"...section?" per user request). **Went through two shapes before
landing:** first built as one button per `<h3>` topic (3 buttons in Class
1, each a preview of just that topic) — user then said only ONE such
button per class/chapter, covering the whole chapter, not one per topic.
Now: exactly one button, placed near the top right after the progress
bar, whose spoken text summarizes everything the chapter covers in one
short preview. `toggleSectionSummary()` shares the same play/pause engine
as `toggleExpandable()` via `deactivateOtherAudioButton()`/
`setExpandButtonIcon()` — this button's onclick doesn't reference a class
number, so it survived the 2026-09-25 renumbering with no changes needed.
**When rolling this out to other classes, build it as ONE button per
class near the top — do not default back to one-per-topic, that shape
was explicitly rejected.** Currently present on Classes 1–22 (Class 2
had one by default since it was included when that chapter's content
was written on 2026-09-25). **All of A1 (1-21) is now done; Class 22 is
the first A2 class to get it — same button, same pattern, A1/A2 doesn't
change anything about how it's built.** Not yet on Classes 23–26 — continue the
same one-button-per-chapter pattern when asked to do more, in whatever
batch size the user asks for (they've been doing this 5 at a time);
don't assume they want all remaining classes done at once unless they
say so. **Before trusting any "currently present on / not yet on"
claim in this file, `grep` and check directly** — an earlier version of
this note wrongly said Class 2 didn't have the button yet, simply
because it hadn't been checked.

Separately, the content-quality pass (Class 1's alphabet-clickable fix,
the audio double-play/resume fixes) has only actually touched Class 1
so far — every other class has NOT had that pass, only the button
rollout above (and, for the new Class 2, none of it at all). If resuming
this after a compaction, ask the user which class/task they're on rather
than assuming — this file won't always be updated mid-pass
for every single small content tweak, only for anything structural/bug-like
or a full class being marked done.

---

## History — bugs found, and why they happened

Kept short on purpose: enough to recognize the pattern again, not a full
incident transcript.

- **Content loss via rebuild-and-force-push (Sept 21, 2026).** A branch
  meant to *add* new professor content was actually a from-scratch rebuild
  that only included 9 of 20 classes. It was force-pushed to `main` without
  comparing line/class counts, silently deleting 12 complete lessons. User
  caught it by noticing missing notes. Recovered from the last good commit.
  **Lesson: before pushing to main, confirm class count and rough line
  count aren't shrinking. A large unexplained reduction is a hard stop,
  not a detail to mention after the fact. Never force-push to main without
  it being an explicit, discussed decision.**
- **Nav silently failing around the class-24 gap.** Class numbering skips
  24, but nav functions did plain arithmetic (`currentClass + 1`) assuming
  a contiguous range, and `totalClasses` was hardcoded. Fixed by
  introducing the `classOrder` array and rewriting all nav functions
  (`showClass`, `goToClass`, `nextChapter`, `previousChapter`,
  `restoreLastViewedChapter`, `updateChapterColors`) to walk it. Also fixed
  nav-link highlighting, which matched by DOM position (broken after the
  gap) — now matches by the link's actual `onclick="goToClass(N)"` target.
- **`updateProgress`/`updateChapterColors` undercounting.** Originally used
  `document.querySelector` (singular), which only found the *first*
  `<ul class="checklist">` for a lesson. Once checklists were split into
  multiple per-topic blocks (see pattern above), this silently undercounted
  progress. Fixed by switching to `querySelectorAll` and summing across all
  blocks sharing the same `data-lesson`, and by keying saved state by
  checkbox `id` instead of list position (position collides once there are
  multiple `<ul>`s).
- **Class 25 duplicate checklist.** 11 items existed twice — once inline
  per-topic, once again in a leftover bottom block, with the bottom copies
  using the wrong `for="ca24-X"` ids (copy-paste from another class).
  Removed the duplicate block and fixed the id typo.
- **Class 26 malformed HTML.** A stray `</tr>` inside an `<li>` with no
  matching `<tr>`, and a duplicated `<label>` open tag with no second close
  tag. Found via the div-balance check, fixed while restructuring.
- **Duplicate `updateProgress()` function (found/fixed 2026-09-24).** Two
  `function updateProgress(lesson)` declarations existed in the same
  `<script>` — an old single-block version (using `querySelector`, dead
  since the multi-block restructuring) and the correct multi-block
  aggregating version further down. JS silently keeps only the last
  declaration of a duplicated function name, so the old one was inert but
  looked live to anyone reading top-to-bottom — exactly the kind of bug
  that's obvious once you notice it and invisible otherwise. Removed the
  dead one, left a comment explaining why, and added this line to the
  verification checklist: **grep for a function's name before editing it —
  duplicates don't error, they just silently shadow.**
- **All 25 "Copy for Gemini" buttons broken (found/fixed 2026-09-24, user-
  reported).** Two independent bugs, both inside the `onclick="..."`
  double-quoted HTML attribute of every `mergeClassAndPrompt(...)` /
  `speakFrench(...)` call:
  1. Prompt text authored with literal `\"` (backslash + double-quote) to
     "escape" a quote — that's a JS-string escaping habit, but it does
     nothing at the HTML level: an HTML double-quoted attribute ends at
     the next raw `"` character no matter what precedes it. Every prompt
     with `\"` in it (146 occurrences, all 25 classes, pre-existing content
     plus this session's own FEATURES write-up) had its `onclick` silently
     truncated by the browser. Fixed by replacing all `\"` with `&quot;`
     (the correct way to put a literal quote inside an HTML attribute; it
     decodes to a plain `"` before the JS ever runs, which is valid
     unescaped inside a single-quoted JS string).
  2. The FEATURES write-up text added earlier this session had an
     **unescaped apostrophe**: `read a topic's content` inside a
     single-quoted JS string, present in all 25 classes (both the A1/green
     and A2/blue variants share this line). That ended the JS string
     early and broke the rest of the call (`missing ) after argument
     list`). Fixed by escaping it to `topic\'s`.
  **Lesson: a `\"` or a raw `'` inside prompt text that lands inside an
  `onclick="..."` HTML attribute is a landmine — it can't be caught by
  `node --check` on extracted script contents (that check never sees
  attribute text) or by the div-balance/checkbox-id checks. Verified this
  time with a headless-browser check instead: load the page, read each
  button's actual parsed `onclick` attribute, and try
  `new Function('event', thatText)` for every class — a real syntax check
  against what the browser will actually try to run. Worth doing this
  after any change that touches prompt text, not just eyeballing quotes.**
- **Expandable-section audio played twice on a second tap (found/fixed
  2026-09-24, user-reported on Class 1's "Accent Marks Explained"
  button, but the shared function affects all 94 "🎧 ... Explained"
  buttons site-wide).** `toggleExpandable()` called
  `speechSynthesis.speak()` on every tap that left the section open,
  without ever cancelling the still-running utterance - Web Speech API's
  `speak()` queues rather than replaces, so two taps while narration was
  playing queued a second, overlapping/sequential playback. Fixed by
  giving each button a tracked audio state (idle/playing/paused): a tap
  only calls `speak()` from a truly idle state; while audio is live, taps
  pause/resume instead, and the button's leading icon swaps between
  🎧 (idle) / ⏸ (playing) / ▶ (paused) to show which. Starting a new
  section's audio cancels/resets whichever button was previously active,
  so only one section narrates at a time.
  **Lesson: any UI control wired to the Web Speech API needs to check
  `speechSynthesis.speaking`/its own tracked state before calling
  `.speak()` again — `.speak()` silently queues instead of
  interrupting, so a bug like this produces no error, just audio that
  sounds "wrong" in a way that's easy to dismiss as a one-off glitch
  rather than the systemic bug it was.**
  **Follow-up, same day: the first fix used `speechSynthesis.pause()`/
  `.resume()` for the pause/resume step. User reported resume didn't
  work. Root cause: `pause()`/`.resume()` are unreliable across real
  browsers — a long-standing Chromium bug (notably on Android) where
  `resume()` silently does nothing after `pause()`, leaving the button
  stuck showing "playing" with dead silence, no error thrown. This
  environment can't verify that failure directly either (headless
  Chromium here has no real TTS engine behind `speechSynthesis` — audio
  API *calls* can be tested, actual sound output can't). Fix: stopped
  using `pause()`/`.resume()` entirely. "Pause" now calls `cancel()`
  outright (state → paused, icon → ▶); the next tap fully restarts the
  narration via `speak()` from the beginning rather than trying to
  resume mid-sentence — a non-issue since these clips are only 1-2
  sentences. **Lesson: `speechSynthesis.pause()`/`.resume()` should be
  treated as unreliable on this project — prefer `cancel()` + restart
  for anything short enough that restarting is unnoticeable. Don't
  reintroduce `pause()`/`.resume()` without a real-device test, which
  this sandboxed environment cannot perform.**
- **Nav labels for classes 2–15 off by one (found/fixed 2026-09-25,
  user-reported — "cannot find number chapter button from navbar").**
  When the new Chapter 2 ("Numbers, Calendar & Time") was inserted and the
  old classes 2–14 renumbered to 3–15 (see the MAJOR RESTRUCTURING section
  above), the `classOrder` array and the lesson cards themselves were
  updated correctly, but the nav dropdown's `<a>` label *text* was never
  touched — it still showed each old label attached to its old number
  (class 2 said "Greetings", class 3 said "Calendar", etc.), and there was
  no "Numbers" entry anywhere. **This is the exact failure this session
  had just written a prevention checklist for a couple hours earlier** (see
  "Standing rule: adding or removing a chapter" above) — and that
  checklist's own step 6 (headless Playwright check of nav numbers/order/
  clickability) had been run and passed *while this bug was live*, because
  it only checked that numbers and links were structurally consistent, not
  that label text matched real content. Added step 7 to that checklist
  specifically because of this: always diff nav label text against each
  class's actual `<h2>` too, not just the numbers. Fixed by relabeling
  classes 2–15 to match their real current `<h2>` titles (verified against
  the live HTML, not the stale `CLASS-NAMES.md`, which predates this
  restructuring entirely and should not be trusted as a source of truth
  for current class numbers/names).
- **13 of 132 tables not wrapped in `.table-wrap` (found/fixed 2026-09-25,
  user-reported with a screenshot — "sometimes the contents zoom a little
  bit and move around").** Most tables across the site are wrapped in
  `<div class="table-wrap">` (`overflow-x: auto`), so a wide table scrolls
  within its own box on a narrow phone. 13 "Common Mistakes to Avoid"
  -style tables (3 columns: WRONG/CORRECT/Explanation) were bare `<table>`
  elements with no wrapper, so on a phone-width viewport they forced the
  whole page wider than the screen — which is what triggers a mobile
  browser's zoom/shift behavior (e.g. double-tap-to-fit-column) that the
  user was seeing. Wrapped all 13 to match the rest; verified with a
  headless check across all 25 classes at 390px width that nothing
  overflows the viewport anymore. **Lesson: when adding a new `<table>`
  anywhere on this site, always wrap it in `<div class="table-wrap">` —
  a bare table is a real, user-visible mobile bug, not just untidy
  markup.**
- **Accidental chapter changes while scrolling (fixed 2026-09-25, user-
  reported — "sometimes I accidentally scroll" while trying to read).**
  The swipe-to-navigate handler already required a mostly-horizontal
  gesture (`dx > 70` and `dx > dy*2`), but a single stray swipe (e.g. a
  slightly diagonal scroll) could still fire it immediately. Per the
  user's explicit choice (asked directly rather than guessed — see
  general note on asking before implementing ambiguous UI requests),
  changed it to require **two swipes in the same direction**: the first
  only shows a "swipe again" hint pill (armed for 1.2s via
  `pendingSwipeDir`/`pendingSwipeTimer`), and only a second matching swipe
  within that window actually calls `nextChapter()`/`previousChapter()`.
  Also added a slide-in animation (`.slide-next`/`.slide-prev`, driven by
  a new optional `direction` param on `showClass()`) so the transition
  reads as an intentional page change rather than an abrupt jump. Applies
  to both the confirmed swipe and the Prev/Next buttons (they share the
  same functions); a dropdown jump (`goToClass`) stays instant since
  there's no "direction" to animate toward.

## Features added 2026-09-24 (in response to "what am I missing")

User picked these from a proactive feature review; not bugs, new additions:

- **Home-screen install.** `manifest.webmanifest` + `icon-192.png`/
  `icon-512.png`/`icon-180.png` (generated via a Playwright screenshot of a
  plain HTML div — no image tooling installed in this environment, that's
  the trick if icons are needed again) + `<link rel="manifest">` and
  apple-touch-icon/theme-color meta tags in `<head>`, plus
  `service-worker.js` (registered near the bottom `<script>`). The service
  worker does NOT cache anything or add offline support — it exists purely
  because Chrome/Android requires a fetch-handling service worker before
  it will offer the install prompt. Real offline caching would be a
  separate, deliberate follow-up if ever wanted.
- **Resume scroll position per class + swipe nav.** `showClass()` now
  saves `window.scrollY` to `localStorage` keyed by
  `scrollpos_class<N>` before switching away, and restores it (via
  `requestAnimationFrame`) when a class is reopened, instead of always
  jumping to the top. A debounced `scroll` listener keeps it fresh even if
  you close the tab mid-class instead of navigating away through the app.
  `touchstart`/`touchend` listeners on `document` detect a mostly-
  horizontal swipe (>70px, >2x the vertical delta) and call
  `nextChapter()`/`previousChapter()` — additive to the existing
  Prev/Next buttons, doesn't replace them.
- **Collapsible "How to use this site" intro.** Sits right below the page
  title, above the progress bar. State (`introOpen` in `localStorage`)
  defaults to open on a first-ever visit, collapses to a single toggle
  line (not a big empty box) once dismissed, and stays that way on future
  visits until manually reopened. Uses `localStorage` rather than cookies
  for consistency with every other piece of state on this site (checklist
  progress, last-viewed class, etc. are all `localStorage` already) — same
  effect, no server/cookie machinery needed for a static single-file site.

All four verified in a real headless browser (Playwright): install
metadata present, intro open/closed state actually persists across a
reload, scroll position is actually restored on return to a class (not
just "looked right in the HTML"), and swipe events actually call the nav
functions in both directions.

## Gemini prompt fix 2026-09-24: tell Gemini to enable voice mode first

User reported Gemini asked them to pronounce words without first asking
them to switch on voice/speaking mode in the Gemini app, so there was
nothing to actually listen to when practicing pronunciation. Fixed by
adding one bullet to the "🚀 LEARNING STRATEGY" block that every single
class's Gemini prompt text already carries near its top:

> • 🎤 BEFORE ANY SPEAKING/PRONUNCIATION PRACTICE: ask me to turn on your
> voice/speaking mode first (tap the mic/voice icon in Gemini), so you
> can actually hear me say the words out loud

Found via the shared trailing substring `"🎯 CHECK ONLY WHEN YOU
UNDERSTAND\n💾 AUTO-SAVE with localStorage\n\n═..."`, which is byte-identical
across all 25 classes (A1 and A2 variants converge to this exact text
even though A2 has one extra bullet above it) — one Python string
`.replace()` on that substring updated every class's prompt in a single
pass, same technique as the earlier site-wide quoting-bug fixes. Verified
in a headless browser that the new line is actually present in the
copied clipboard content for A1 and A2 sample classes (1, 9, 22, 26), not
just in the source HTML.

**Pattern for future prompt-wording changes that should apply to every
class:** look for text shared verbatim across all/most classes' prompt
blocks (via `content.count(exact_substring)` in Python) before editing
classes one at a time — if it's shared, one replace does the whole site
and is far less error-prone than 25 manual edits.

## Color fix 2026-09-24: blue means "tap to hear it", nothing else

`.expandable-text strong { color: var(--blue); }` made every bold phrase
inside a "🎧 ... Explained" audio panel the same blue as `.fr` clickable
French text (same variable, same bold weight) — user sent a screenshot
of Class 2's Subject Pronouns panel where the entire explanation was
blue, making it impossible to tell what's actually tappable-for-audio
vs. just emphasized. Removed the rule (deleted, not recolored — `<strong>`
needs no CSS to render bold). `.fr` has its own separate color rule so
was unaffected.

**Rule going forward: `var(--blue)` inline within body/prose text means
"clickable to hear pronunciation" and ONLY that.** It's fine for UI
chrome (h1, h3 topic headers, nav links, buttons, the chapter indicator)
since those aren't inline prose competing with `.fr` spans for
attention — checked those during this fix and left them as-is. But
never give plain emphasis/bold text inside note/expandable-text/example
content the blue color, even via a different rule than the one just
removed — that reintroduces the exact same confusion. If new content
sections are added with bold/emphasized text (tables, notes, etc.),
check they aren't blue before considering them done.

## iOS-only bug 2026-09-25: TTS spoke a literal dash character (4 rounds, status: ABANDONED — user gave up, do not re-attempt without new info)

User reported: tapping alphabet letters in Class 1 works correctly on
Android but on iOS also audibly speaks a "-" symbol — annoying, and not
reproducible in this environment (no real iOS Safari here — headless
Chromium's speechSynthesis doesn't produce real audio, only the JS call
sequence could ever be verified from this sandbox). User was explicit:
"I don't mind seeing it, but don't read it aloud" — the dash should stay
visible, just not spoken.

**Round 1 (insufficient, but not wasted):** guessed the dash was
reaching `speakFrench()`'s input text, and stripped dash characters
inside that function before constructing the utterance (replacing with
a space so hyphenated compounds like `quatre-vingt-dix` stay
space-separated rather than running together). This is a real, correct,
harmless improvement — kept in place — but user confirmed afterward it
did NOT fix the report, and that it reproduces on a single isolated tap
(rules out a rapid-tap WebKit interruption glitch too).

**Round 2 (disproven — do not repeat this theory):** re-examined the
structure and confirmed each alphabet letter's `<span class="fr">`
genuinely never contains a dash — it's a separate sibling text node
between spans — so Round 1's fix was structurally incapable of touching
this specific case regardless of correctness. Hypothesized a native
OS-level accessibility reading feature (iOS's Speak Screen / Speak
Selection / VoiceOver) was reading the page's rendered/accessible text
directly, bypassing this app's `speechSynthesis` calls entirely. Wrapped
each " — " separator between the 26 alphabet letters in its own
`<span aria-hidden="true">` so any accessibility-tree-based reader skips
them. Verified in headless testing (26 letters still individually
clickable, simulated a11y-tree walk produced a dash-free alphabet) —
**but the user confirmed after a hard refresh (ruling out caching) that
the dash is still audible, and separately confirmed none of Speak
Screen/Speak Selection/VoiceOver are enabled on their device.** The
native-accessibility-reader theory is conclusively ruled out. The
`aria-hidden` wrapping is harmless and was left in place, but it is not
the fix.

**Round 3 (current attempt, NOT yet confirmed by user):** with both text-
content and OS-accessibility theories disproven, and the bug confirmed to
reproduce on a single isolated tap (so it's not a rapid tap-then-tap
interruption race either), the remaining lead is `speakFrench()` calling
`window.speechSynthesis.cancel()` unconditionally on every tap — including
the very first tap of a session, when nothing was ever speaking, where
`cancel()` is a pure no-op. Calling `cancel()` on an empty iOS Safari
speechSynthesis queue is a documented source of a spurious audible
click/artifact on WebKit's implementation specifically (not on
Android/Chrome's), which would explain: happens on a single tap, doesn't
depend on the tapped text, doesn't depend on OS accessibility settings,
and is iOS-only. Changed the guard so `cancel()` only runs when
`speechSynthesis.speaking || speechSynthesis.pending` is true:

```js
if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
  window.speechSynthesis.cancel();
}
```

Verified in headless Playwright (patching the real `speechSynthesis`
object's methods rather than replacing it outright, since it's a
non-configurable global — a plain `window.speechSynthesis = {...}`
reassignment silently no-ops in real Chromium and was a dead end the
first time through): first tap on a letter with nothing speaking now
calls `speak()` only, no `cancel()`; tapping a second letter while one is
still speaking calls `cancel()` then `speak()` as before (interrupt
behavior preserved); all 26 letters produce dash-free text at the
`speak()` call site; all 25 Copy-for-Gemini buttons still parse.
**This cannot be tested for real audio output in this sandbox — there is
no iOS Safari here.** Pushed to `main` and the feature branch. **User
confirmed this did NOT fix it either.** The guard is still correct
behavior to keep (cancel() should only run when something is actually
speaking, regardless of this bug), but it was not the cause.

**Round 4 (conclusive negative result — the dash character is NOT the
cause, full stop):** with three theories disproven, user asked whether
we'd tried deleting the dash and using a space instead. Round 1 had
already done this for the *spoken* text; this round went further and
removed the " — " separator from the **visible HTML** entirely, replacing
`<span aria-hidden="true"> — </span>` between all 26 letters with a plain
space character — so there was no dash/hyphen character anywhere in that
line at all, in markup or on screen (`index.html` line 539). This was a
clean, deliberate diagnostic: if the sound disappeared, something really
was reading that literal character; if not, the dash was never the
cause of anything. **User confirmed the sound is still there with the
dash character completely gone from the page.** This is conclusive: the
audible artifact has nothing to do with the dash/hyphen character
itself, in any form, spoken or visual. Every theory involving the dash
character — text content, accessibility-tree reading, or literal
on-screen presence — is now fully exhausted and ruled out.

**Status: user said "leave it, I gave up."** Stop working on this bug
unless the user brings it back up with new information. Do NOT re-attempt
any of the four theories above (dash-stripping, aria-hidden separators,
cancel()-guarding, removing the dash from display) — all confirmed not to
work. The visible dash separator (" — ") was NOT restored to the alphabet
line after Round 4 — it currently reads as "A B C D... Z" with plain
spaces instead of "A — B — C — D... — Z". If the user later asks for the
dashes back for visual/readability reasons (independent of the audio
bug), that's a one-line revert of the Round 4 change, not a new
investigation.

**If this bug resurfaces and the user wants to try again someday**, the
remaining un-tried avenues from the reasoning above are still valid: (a)
ask the user to describe the sound more precisely — click/pop vs. an
actual spoken word vs. a truncated first-phoneme of the next letter's
name; (b) check whether it's specific to certain iOS voices, since a
single bare capital letter at rate 0.85 is an unusual short input some
voice engines mishandle; (c) most promising given everything ruled out
so far — the sound may not be caused by *any* character in our text at
all, but be an artifact of how iOS's voice engine synthesizes a bare
single letter in isolation (some engines render an isolated capital
letter with a leading/trailing glottal stop or click that a user could
easily describe as "hearing a dash"). If revisited, the next real
experiment is speaking the French letter *name* instead of the bare
character (e.g. "a", "bé", "cé", "dé"...) to see if a full syllable
avoids whatever artifact a bare single letter triggers — a different
mechanism than anything tried in rounds 1-4, so it isn't ruled out by
this investigation.

**If a similar report comes in for any other dash-separated row of
clickable `.fr` words elsewhere on the site** (this exact
letter-A-dash-letter-B pattern likely exists nowhere else, but a similar
"list of clickable words joined by a decorative separator" shape might),
none of the four approaches tried here fixed the actual bug — don't
assume any of them will work elsewhere either. Start instead from
whichever of the theories above is still standing once Round 3's outcome
is known.

**Lesson: when a platform-specific bug can't be reproduced in this
sandboxed environment, the first plausible-sounding fix can still be
wrong — verify the actual DOM/text structure supports the theory before
shipping it, and treat user confirmation that a fix didn't work as a
real signal to re-derive the cause, not just retry a variant of the same
fix.** Also: **a bug that reproduces in this app's own UI isn't
necessarily caused by this app's own code** — OS-level accessibility
features read the rendered page independently of any JS on it, and
`aria-hidden` is the correct tool for telling them to skip purely
decorative content.

## Classes 30 & 31 added 2026-09-30: être-agreement deep dive + practice
bank (A2)

Source: a new transcript (uploaded 2026-09-28,
`44db6904-French_Past_Tense_Grammar_Lesson__Avoir_and__tre_Verbs.txt`)
covering an entire live class spent drilling passé composé être-agreement
(the four forms, mixed-group rule, the mort/morte pronunciation exception)
through many corrected student examples. User asked to "teach passé
composé in detail" and split it into "2 or 3 classes" with "somany
examples" — confirmed via AskUserQuestion that scope was passé composé
only (two separate homework docs pasted in the same message — Prépositions
A2 and Adjectifs vs Adverbes A2 — were context, not a request; not
touched).

Built as two new classes rather than editing Class 28, since Class 28
already covers the avoir/être *choice* and lists the 16 Dr & Mrs
Vandertramp verbs, but never went into the agreement mechanics — this
transcript is entirely new content on top of that.

- **Class 30** ("A2: Passé Composé avec Être — L'Accord en Détail"): the
  4-way agreement table (masc sing/fem sing/masc plur/fem plur), the
  mixed-group-is-always-masculine-plural rule, the mort/morte pronunciation
  exception, a full agreement table for all 16 Dr & Mrs Vandertramp verbs
  (all 4 forms each — added `rentrer`, which class28's original list has
  but wasn't in my first agreement-table draft), worked examples quoted
  from the actual live-class corrections, and a mistakes table.
- **Class 31** ("A2: Passé Composé — Pratique Intensive"): pure practice
  bank, no new grammar — ~60 example sentences split into an avoir-only
  table (~20), an être-only table (~24, all 16 Dr & Mrs Vandertramp verbs
  represented), and a mixed-review table (~16) for drilling auxiliary
  choice. Kept the Gemini-prompt copy of this content short (a handful of
  model examples + instructions to quiz using the visible tables) rather
  than duplicating all 60 sentences into the onclick string — unlike
  Class 29's vocab list, these are invented practice sentences, not a
  fixed list that needs to survive verbatim into the prompt.

Mechanics: `classOrder` extended to `[...,29,30,31]`, nav dropdown got two
new `<a>` entries after "Group 3". **First attempt at the nav labels
("Être Agreement", "Passé Composé Practice") failed the standing
nav-label-substring-of-h2 check** (step 7 of the add/remove-chapter
checklist) since neither was a literal substring of its h2 heading text —
renamed to "L'Accord" and "Pratique Intensive", which are. A reminder that
this check is easy to skip when a class is being added fresh rather than
renumbered — it caught a real mismatch here, not a renumbering artifact.
Full verification suite re-run clean: JS syntax, div balance (comments
stripped), 201 checkbox ids all unique, 147/147 tables `.table-wrap`d, all
31 copy buttons parse, nav order matches `classOrder`, no horizontal
overflow at 390px, screenshots of both new chapters visually confirmed.

README.md curriculum list updated (29. L'Accord, 30. Pratique Intensive).

## Class 30 follow-up 2026-10-02: added person-by-person agreement table

User asked (after reviewing Class 30) whether the être-agreement rule was
broken down by grammatical person (je/tu/il/nous/vous/ils) anywhere, not
just by gender+number category. Checked every chapter first: Class 3
(Greetings) has a full 6-person table, but for the *present-tense*
être/avoir conjugation ("je suis" = I am), not past-participle agreement;
Class 28/31 only use je/tu/nous/vous inside scattered example sentences,
no structured table. Confirmed the person-by-person breakdown genuinely
didn't exist anywhere, then built it into Class 30 (not a new class) since
that's where the agreement rule itself already lives.

Inserted a new section 2️⃣ "Person-by-Person: Je / Tu / Il / Nous / Vous /
Ils" right after the existing "Four Agreement Forms" section, using
`aller` as the model verb: a masc/fem table for all 6 persons plus a
callout that **vous has four possible forms** (singular-formal vs plural,
masculine vs feminine) since that's the one genuinely confusing case, plus
12 example sentences (one masc + one fem per person where both exist).
This pushed the old sections 2-5 down to 3-6 (renumbered the h3 emoji
headers) and all their checkbox ids up by one (c30-2..c30-6 → c30-3..c30-7);
progress count updated 0/6 → 0/7.

**Bug caught during the renumbering script itself:** the id-bump regex
(`c30-N → c30-(N+1)` for N in 2..6) was run over the *whole* class30 block
*after* the new section (with its own hardcoded `id="c30-2"`) had already
been spliced in — so the regex matched and bumped that brand-new id too,
producing a `c30-3` duplicate instead of leaving it at `c30-2`. Caught
immediately by the standard checkbox-uniqueness check (part of the regular
verification suite), fixed by hand, re-verified clean. **Lesson: when a
script inserts new content and then does a renumbering pass over the same
region, the newly-inserted content isn't exempt from the renumbering
regex just because it "looks" already correct — scope the regex to the
pre-existing content only, or do the renumbering before insertion, not
after.**

Full verification re-run clean after the fix: JS syntax, div balance (814
open/close), 202 checkbox ids all unique, 148/148 tables `.table-wrap`d,
all 31 copy buttons parse, nav order matches `classOrder`, no horizontal
overflow at 390px, screenshot of Class 30 visually confirmed.

## Class 30 split into three 2026-10-02: too dense after the person-by-
person addition

User feedback: "Its hard to learn. Lets split them up into 3 chapters."
Confirmed via AskUserQuestion that scope was Class 30 alone (which had
grown to 7 checklist items across 6 sections after the person-by-person
table was added) — Class 31 (Pratique Intensive, the practice bank) was
explicitly left untouched content-wise.

Split by teaching function, each assuming the previous one:
- **Class 30** "La Règle de Base": the four agreement forms + the
  person-by-person table. Just the rule, two ways of looking at it.
- **Class 31** "Cas Particuliers &amp; Référence": mixed groups/named
  subjects, the mort/morte pronunciation exception, and the full 16-verb
  agreement table — the edge cases and the reference material built on
  the rule from Class 30.
- **Class 32** "Exemples &amp; Erreurs": the live-class worked examples
  (given their own checklist item this time, since previously they had
  none of their own) and the common-mistakes table — pure application.

Since Class 31 (Pratique Intensive) had to move to make room, it was
renumbered to **Class 33**, content unchanged. This time the renumbering
was done differently from the person-by-person incident: the old
class31-content block was extracted and renumbered (`id`, `data-lesson`,
`c31-N` → `c33-N`, `gemini-skill-class31` → `gemini-skill-class33`) in
total isolation *before* any new class30/31/32 content existed in the
same string — avoiding the exact double-bump collision bug from the
previous session. Verified zero leftover `c31-`/`class31` references in
the isolated block before splicing it back in.

Also discovered while re-deriving the checkbox-count semantics for the
split (not a bug, just a thing to remember): the hardcoded "X / Y done"
text and 0%-width progress bar baked into each chapter's initial HTML
**do not need to be exactly right** — an IIFE near the bottom of the
`<script>` block runs `loadChecklistState` + `updateProgress` for every
lesson on every page load, which recomputes `total`/`checked` live from
the DOM and overwrites whatever was hardcoded. Confirmed empirically
(checked a box, reloaded, count stayed correct). This means a classic
off-by-one in the authored "0 / N done" text is cosmetic only, not a
functional bug — useful to know before spending effort getting it exactly
right during a future split/merge.

`classOrder` is now `[...,29,30,31,32,33]`. Nav dropdown: "Group 3" →
"La Règle" → "Cas Particuliers" → "Exemples &amp; Erreurs" → "Pratique
Intensive". CSS checklist-label selector list extended to class32/33.
Full verification suite clean: JS syntax, div balance (826 open/close),
207 checkbox ids all unique, 148/148 tables `.table-wrap`d, all 33 copy
buttons parse, nav order matches `classOrder`, no substring mismatches,
no horizontal overflow at 390px, all four chapters (30/31/32/33)
screenshotted and visually confirmed — Class 33 in particular checked
byte-for-byte equivalent in content to the old Class 31, just renumbered.

README.md curriculum list updated (29. La Règle, 30. Cas Particuliers,
31. Exemples &amp; Erreurs, 32. Pratique Intensive).

## Class 34 added 2026-10-02: "L'Imparfait" (A2, from a practice worksheet)

Source: a pasted worksheet ("EXERCICES AVEC L'IMPARFAIT") with the
formation reminder (nous-stem + -ais/-ais/-ait/-ions/-iez/-aient) and 10
fill-in-the-blank sentences. User said fuller l'imparfait class notes/a
transcript are coming later the same day — confirmed via AskUserQuestion
to build this worksheet into its own chapter now rather than wait, since
"something today" isn't a committed timeline and this worksheet alone was
already enough for a first-pass chapter.

Built as: 1️⃣ formation rule (nous-stem minus -ons + endings, modeled on
manger, including the mangeons→mangions e-drop spelling quirk), 2️⃣ the
one irregular stem (être → ét-, explicitly contrasted with other
present-irregular verbs like faire/avoir/prendre/vouloir/aller which
still follow the normal nous-minus-ons rule for imparfait), 3️⃣ all 10
worksheet sentences solved as worked examples, categorized into the three
use-cases (habitual, description/state, ongoing-background). Sentences 7
and 8 mix imparfait + passé composé in the same sentence (ongoing action
interrupted by a single action) — flagged with a callout note rather than
taught in full, since a dedicated imparfait-vs-passé-composé contrast
class was explicitly described as coming later; this chapter only
previews it so the worksheet's own answers make sense.

**When the fuller imparfait transcript arrives, expect it to either**
(a) extend this chapter with more formation/usage detail, or (b) become
a separate Class 35 for the full imparfait-vs-passé-composé contrast —
decide based on how much new material it actually contains, same as the
Class 30 split precedent (don't just assume one new class by default).

`classOrder` → `[...,33,34]`. Nav: "Pratique Intensive" → "L'Imparfait".
CSS checklist-label selector list extended to class34. Full verification
clean: JS syntax, div balance (839 open/close), 212 checkbox ids unique,
150/150 tables `.table-wrap`d, all 34 copy buttons parse, nav order
matches `classOrder`, no substring mismatches, no overflow at 390px,
screenshot visually confirmed.

README.md curriculum list updated (33. L'Imparfait).

## Major restructuring 2026-10-02: dedicated verb-conjugation arc added,
scattered/wrong verb content cleaned up

User feedback (after a live-chat teaching attempt on regular -ER verbs):
"Don't teach me here. Update the site... bad arrangement and lack of
knowledge will hurt my studies" — they study entirely from the site
notes, for the TCF exam. Confirmed via AskUserQuestion: full reorg, not
just a new reference chapter.

**Audit first** (delegated to an Explore agent, read-only): verb
conjugation teaching was scattered across class3 (être/avoir), class4
(aller, s'appeler), class11 (-ER rule, one section among many unrelated
topics), class12 (-GER spelling quirk + a genuinely good, complete
reflexive-verbs lesson), class16 (a verb-group table that was flatly
WRONG — claimed all -ir verbs are 2nd group, which is false: partir,
venir, ouvrir etc. are irregular 3rd group), class18 (devoir), class19
(-IR group-2 rule + vendre/mettre). Real gaps: -RE verbs never got a
generalized rule (only vendre as a single example), and no chapter
anywhere taught the correct way to classify an unfamiliar verb.

**Judgment call before touching anything:** read every target chapter in
full first. Several (class12 especially) turned out to be well-built,
complete lessons in their own right (daily-routine vocab, natural
conversation, mistakes table) — not just "scattered junk." Decided
against gutting/deleting any existing chapter wholesale, since that would
destroy checklist progress the user may have already completed and throw
away genuinely good content. Instead: build a new, correctly-sequenced,
authoritative verb arc, and do narrow, surgical removals in old chapters
— only the specific sections that were pure duplicates or factually
wrong — replaced with a one-line pointer to the new chapter. Chapters
that only reference verbs in passing (class3, class4, class14's vocab
list, class18's devoir) were left untouched entirely.

**6 new chapters added, ids 35-40**, positioned EARLY in `classOrder`
(right after class2, before class3 Greetings) so a learner hits verb
foundations before any content that assumes them — but given new
(non-contiguous) ids, so no existing chapter's id/checkbox ids changed:
- **35 Les Groupes de Verbes** — the corrected 3-group classification,
  centered on the "-issant test" for telling true 2nd-group -ir verbs
  from irregular 3rd-group ones (partir/venir/ouvrir), plus the aller
  exception.
- **36 Être, Avoir, Aller** — the 3 essential irregular verbs, with
  avoir's full idiom list (age, hunger, fear, luck...) flagged as the
  #1 English-to-French translation trap.
- **37 Verbes -ER** — the rule, the silent-endings trick (je/tu/il/ils
  sound identical), and all three spelling quirks (-GER, -CER,
  -ELER/-ETER doubling) in one place for the first time.
- **38 Verbes -IR** — finir/choisir + more practice verbs.
- **39 Verbes -RE** — NEW generalized rule (closes the real gap),
  vendre + 4 more regular verbs, explicit warning that mettre/prendre
  are irregular despite the -re ending.
- **40 Verbes Pronominaux — Le Mécanisme** — just the reflexive-pronoun
  mechanism (s'appeler, laver vs se laver), explicitly deferring to
  class12 for the fuller daily-routine vocabulary.

**Surgical edits to 4 existing chapters** (not deleted, not renumbered):
class11 (removed the -ER rule section + 2 checklist items, now redundant
with class37), class12 (removed the -GER spelling section + 1 checklist
item, kept everything else), class16 (replaced the WRONG verb-group table
with a corrected summary + pointer to class35), class19 (removed the -IR
group-2 section + 2 checklist items, kept vendre/mettre and the
present-participle rule). Each chapter's progress-count, topic line, and
Gemini-prompt text were trimmed to match — including renumbering the
prompt's own "TEACH ME SLOWLY" / "STUDY OBJECTIVES" lists where removing
an item left a numbering gap (e.g. 1,2,3,6,7 → 1,2,3,4,5).

**2 new escaping-trap bugs caught and fixed** (same family as every prior
incident this project): body37 and body39 (new chapters) each had one
plain English contraction ("it's", "don't") typed directly into the
prompt-building Python script instead of through the established `AP`
token, breaking those two chapters' Copy-for-Gemini buttons. Caught by
the standard headless button-parsing check, fixed by locating the exact
raw-apostrophe offsets programmatically (not by eye) and patching them
directly in the live file. Also caught a nav-label substring violation
(classes 37/38/39 initially labeled "Verbes -ER" etc., which isn't a
literal substring of "verbes du 1er groupe (-er)") — fixed to "Groupe
(-ER)" etc.

Full verification suite clean at the end: JS syntax, div balance (903
open/close), 236 checkbox ids all unique, 163/163 tables `.table-wrap`d,
all 40 copy buttons parse, nav order matches `classOrder`, no substring
mismatches, no horizontal overflow at 390px, screenshots of all 6 new
chapters plus all 4 edited chapters visually confirmed.

README.md curriculum list fully renumbered to reflect the new A1 verb
arc (display items 3-8) and the resulting A2 shift (+6 to every A2 item).

**Deliberately deferred, not done this round:** future-tense content
(futur proche/simple/conditionnel) is ALSO scattered across class4,
class13, class20, and class26 — flagged by the same audit but out of
scope here, since the user's stated pain point was specifically present-
tense regular/irregular verbs, not future tense. Revisit if asked.

## Speaking-pass pronunciation echo added 2026-10-06 (site-wide)

User: during the spoken-answer (2nd) pass of the exam, if Gemini just
says "Correct!" the user can't tell whether their pronunciation was
actually right or Gemini's speech-to-text silently "corrected" what it
heard into what it expected. Asked for Gemini to always say back what it
heard before confirming, so mispronunciations surface even on an answer
that's otherwise correct.

Added a new bullet (`🎤 DURING THE SPOKEN-ANSWER PASS`) right after the
existing `🏁 RUN THE EXAM TWICE` bullet in the shared Gemini-prompt
header, site-wide (39 occurrences, same scripted find-replace pattern as
the exam-rule strengthening). Instructs Gemini to say "Correct! You
said: ___" (echoing exactly what it heard) before confirming on every
correct spoken answer, and to flag a mismatch as a pronunciation note
separate from the grammar/content verdict. Verified clean: JS syntax,
div balance (903), 236 checkbox ids unique, nav/substring checks, all 40
copy buttons parse.

## Full-site quality/order audit 2026-10-02/06 — findings not yet acted on

Ran a second Explore-agent audit (beyond the verb-conjugation one)
covering every remaining A1/A2 chapter's content quality, ordering, and
overall French-grammar coverage vs. TCF needs. Reported to the user in
chat; NOT yet implemented — flagging here so a future session doesn't
have to re-derive it. User was asked "want me to build any of this?" and
has not yet answered.

**Quality/order issues found, not fixed:**
- class6 ("Endings") is actually the noun-gender-by-ending rules chapter
  — confusingly titled; class8 ("Gender") teaches something different
  (gender vocab, nationality adjectives, liaison). Not adjacent either.
- Future tense fully re-taught 3x with no cross-references: class13
  ("Future", -ER only), class20 ("Conditional", all groups + irregular
  stems), class26 (A2, re-teaches futur proche AND simple from scratch).
  This is the exact present-tense-arc problem already fixed by classes
  35-40 — same remedy pattern would apply if tackled.
- class15 (Negation): topic line promises an "ER verb quiz and DELF A1
  exam format overview" that doesn't exist in the chapter body — stale
  leftover. Also has an orphaned homework block telling the student to
  revise numbers that were moved to Chapter 2 in an earlier session.
- A2 chapters 27 onward (Passé Composé through L'Imparfait) have zero
  natural-dialogue/real-world-example content — just vocab/rule tables,
  unlike every A1 chapter and early A2 chapters (22/23/25/26).
- class18: "Passé Composé (intro)" and "Question formation (inversion)"
  are each just one unexplained example sentence, no table/audio/
  mistakes-table, and no checklist item of their own — breaks the site's
  own "every topic gets its own checklist item" pattern. This is also
  the ONLY place inversion questions are covered anywhere on the site.
- Minor: one heading-style inconsistency in class26 (h3 ALL-CAPS instead
  of the standard h4 "❌ Common Mistakes to Avoid"); a few harmless
  "revise ER verbs" homework leftovers now superseded by class37;
  `CLASS-NAMES.md` (repo doc, not learner-facing) is stale.

**Grammar topics confirmed entirely MISSING from the whole site** (none
found anywhere, verified by full-file search): direct/indirect object
pronouns (le/la/les, lui/leur), y and en, relative pronouns (qui/que/
dont/où), comparatives/superlatives, the imperative mood, the
subjunctive mood, si-clauses (si + imparfait + conditional), passive
voice, plus-que-parfait, double-pronoun sentences. Question formation
via inversion exists but is extremely thin (see class18 above); via
intonation doesn't exist as a taught topic (though used implicitly
everywhere); est-ce que is used constantly in examples but never taught
as its own method.

**Recommended priority if/when this gets built** (per the audit, given
TCF relevance and what's already well covered): (1) object pronouns,
(2) relative pronouns, (3) imperative, (4) si-clauses (natural next step
since the conditional tense itself is already built in class20), (5)
subjunctive. Comparatives/superlatives and y/en next; passive voice and
plus-que-parfait lowest priority (more B2-leaning).

## Classes 41 & 42 added 2026-10-06: narration (passé composé +
imparfait together) and the COD, from a live-class transcript

Source: "Expression_Orale/COD" transcript (narration speaking practice
+ a video story about a grandmother, grandson Alex, a pineapple cake,
and €20, followed by a COD introduction). User said simply "Next class"
— built straight from the transcript per established convention, no
scope-clarifying question needed (single clear transcript, pattern well
established by now).

Two topics in one transcript, genuinely different in kind (tense usage
vs. a brand-new sentence-structure concept), so built as two chapters
rather than one, continuing the sequence after L'Imparfait:

- **Class 41 "Narrer au Passé"**: not new tense formation (that's
  already covered) — this is about USING passé composé and imparfait
  *together* to narrate, the way real storytelling works. Flags a
  specific recurring pattern from class — reporting verbs (a dit que /
  a demandé que / a expliqué pourquoi) + imparfait for the ongoing
  action being reported — plus 9 new narration verbs (entendre, être
  inquiet, tomber, dire, chercher, vouloir, se souvenir, avoir confiance
  en qqn, laisser) and a fully worked story (the video transcript's own
  grandmother/Alex/€20 narrative), each sentence tagged with why it's
  one tense or the other. One sentence in the source ("sa grand-mère
  voulait qu'il remette...") uses the subjunctive after vouloir que —
  kept as-is with a one-line "you'll learn this properly in a future
  class" note rather than explained, since subjunctive isn't taught
  anywhere on the site yet (flagged as missing in the 2026-10-02/06
  audit below) and explaining it here would be scope creep.
- **Class 42 "Le COD"**: brand new grammar topic, not previously on the
  site at all — direct object identification (answers qui?/quoi?, no
  preposition, follows the verb) contrasted with COI (prepositions à
  qui/de qui/avec qui/pour qui signal COI, not COD). Deliberately scoped
  to identification only, not pronoun replacement (le/la/les) — the
  transcript's own instructor explicitly deferred that to a future
  class, and this chapter is a natural first step toward the "object
  pronouns" gap flagged in the quality/grammar audit above.

`classOrder` → `[...,34,41,42]` (appended at the end, matching the
established pattern for new transcript-based content — unlike the
verb-arc reorg, this wasn't a restructuring, just normal sequential
growth). Nav: "L'Imparfait" → "Narrer au Passé" → "Le COD". CSS
checklist-label selector list extended to class41/42. Full verification
clean on the first pass this time (no escaping-trap bugs): JS syntax,
div balance (928), 245 checkbox ids unique, 167/167 tables
`.table-wrap`d, all 42 copy buttons parse, nav matches `classOrder`, no
substring mismatches, no overflow at 390px, both chapters screenshotted
and visually confirmed.

README.md curriculum list updated (40. Narrer au Passé, 41. Le COD).

## Content-sufficiency audit 2026-10-06 — new standing-instruction lens,
findings not yet acted on

User asked to read context.md and check gaps/quality "for all classes."
Ran a THIRD audit, distinct from the 2026-10-02/06 structural/order one:
this one applies the new 2026-10-06 standing instruction's actual test
("is there a stated rule + enough examples + a why, not just a shown
pattern") to every chapter, including classes 35-42 which had never been
checked under any lens before (35-40 postdate the first audit; 41-42
were built after it). Full chapter bodies read, not just headings.

**Classes 35-40 (verb arc) and class42 (Le COD): all sufficient**, hold
up to their own standard — stated rule, 4-5+ examples, explicit why
(the -issant test, the mettre/prendre exception warning, the laver vs
se laver contrast) in every one. No gaps.

**Real sufficiency gaps found, not yet fixed:**
- **class41 (Narrer au Passé), section 4** "TCF Speaking Tip" is one
  unexplained line with zero example sentences, no connector list
  (d'abord/ensuite/puis/enfin etc.), no checklist item — thin compared
  to the rest of that chapter, which is otherwise strong.
- **class10 (Family)** asks the learner to produce possessive sentences
  (mon frère, ma sœur...) via its own checklist item, but the
  generalizable possessive-adjective rule isn't taught until class11,
  the NEXT chapter in `classOrder` — a real forward-dependency gap, not
  just thinness.
- **class21 (Description)**: 6 of its vocab sections (Clothes,
  Accessories, Materials, Weather, Technology, Everyday Objects, ~50
  words) are bare French→English tables with zero example sentences,
  unlike comparable vocab chapters elsewhere (class9/10/17) which embed
  at least one usage sentence per set. Also a separately-noted possible
  structural issue: a misplaced closing div / back-to-top button around
  the Natural Conversation block — worth a direct look, not confirmed.
- **class29 (Group 3 Irregular Verbs)**: 55 verbs, zero example
  sentences for any of them, BY DESIGN at authoring time (the
  chapter's own Gemini prompt says "no example sentences... stick to
  testing recall"). This was a deliberate scope choice before the
  sufficiency standard existed, not an oversight — now conflicts with
  the standing instruction's vocab criterion. Flagging for a decision
  rather than auto-fixing, since adding examples to a 55-verb pure
  reference list is a real design call (and a sizable chunk of new
  content), not a quick patch.

Everything else spot-checked (class1, 9, 17, 22, 23, 25, 30, 33, 34)
confirmed sufficient — stated rules, multiple examples, mistakes
tables, why/when explanations present throughout.

Reported to the user in chat; not yet actioned, same pattern as the
prior audit. If this gets greenlit, class41's gap is the smallest/
safest fix (self-contained addition to one chapter); class10/class11
and class21 need a bit more care (an ordering dependency and a
vocab-chapter backfill respectively); class29 needs a user decision on
whether 55 examples is worth adding before anyone touches it.

## Sufficiency-audit gaps 1-3 fixed 2026-10-06 (gap 4, class29, explicitly
declined by user)

User said "1-3 is enough" in response to the content-sufficiency audit
above — fixed the three real gaps, left class29 (55 irregular verbs, no
examples) as a deliberate pure-reference chapter, untouched.

- **class41 section 4** expanded from one unexplained line into a real
  topic: a sequencing-connector table (d'abord/ensuite/puis/après/
  enfin), a before/after example contrasting flat repetitive narration
  with connector-linked narration, and its own checklist item (`c41-5`,
  pushing the chapter to 0/5). Gemini prompt updated to match, including
  an instruction to have the student retell a story using at least 3
  connectors.
- **class10 (Family)**: added a compact possessive-adjective table (mon/
  ma, ton/ta, son/sa, notre/votre/leur) with 3 example sentences,
  inserted directly before the `c10-5` checklist item that needs it
  (which already existed and was unchanged) — explicitly scoped as "the
  short version for family words," with a forward note to class11
  (Professions) for the full rule including the vowel exception. No new
  checkbox added, so class10 stays at 0/7.
- **class21 (Description)**: added one `<p class="example">` (2
  sentences each) after all 6 previously-bare vocab tables (Clothes,
  Accessories, Materials, Weather, Technology, Everyday Objects), and
  separately fixed the structural bug the audit flagged but hadn't
  confirmed: the back-to-top button was nested inside the Common
  Mistakes table's `.table-wrap` div, landing it BEFORE the Natural
  Conversation section instead of after — moved to its correct position
  as the true last element before the chapter's closing div. Gemini
  prompt updated with the same 6 example pairs.

**3 escaping-trap bugs this round** (class10 ×1, class21 ×4) — all raw
apostrophes in ENGLISH contractions this time ("member's", "I'm",
"She's", "it's" ×2, "It's") typed directly into prompt-building Python
strings instead of through the `AP` token — notably NOT in the French
text, which is usually where this bug hides; a reminder that English
translation text inside the prompt string needs the same care. Caught
by the standard headless button-parsing check (flagged class10 and
class21 specifically, not class41 — confirms the check isolates the
exact broken chapter reliably), fixed by locating exact raw-quote
offsets programmatically, same method as every prior incident.

Full verification clean after fixes: JS syntax, div balance (931),
246 checkbox ids unique, 169/169 tables `.table-wrap`d, all 42 copy
buttons parse, nav/substring checks clean, no overflow at 390px, all
three edited chapters screenshotted and visually confirmed (class10's
new rule sits directly before the checklist item needing it; class21's
mistakes table → Natural Conversation → Back to Top now in the correct
order; class41's new section renders with its table and example intact).

## Classes 43 & 44 added 2026-10-07 — relative pronouns and y/en

User uploaded 5 files from "another batch, same syllabus" and asked for a
usefulness assessment before building anything (established pattern: ask
first, build on explicit go-ahead). Read all 5 (3 PDFs read directly; the
2 .docx files failed via the Read tool — binary file error — extracted
instead with a small Python script unzipping `word/document.xml` and
stripping tags). Verdict given to the user:

- **Relatif_pronom_cheat_sheet.pdf** (qui/que/où) — genuinely new, fills a
  confirmed gap (class42's COD chapter explicitly notes relative pronouns
  as a "future class"). Built as new Class 43.
- **Pronoms_Y_et_EN.docx** — topic (y/en) is a confirmed gap, but the file
  itself is only blank drill exercises with no grammar explanation or
  answer key. Per the standing "generate extra content when source isn't
  enough" instruction, wrote the grammar rule from scratch (à-verbs → y,
  de-verbs/quantity → en, the two-step "quick test", word order including
  the negative) and used the drill topics as inspiration for the
  worked-example set, not as copied content. Built as new Class 44.
- **French_Adjectives.pdf** (BAGS rule, agreement, placement, meaning-shift
  grammar guide) — skipped, confirmed duplicate: existing Class 22
  (Adjectives) already covers all of it in equal or greater depth.
- **Passe_Compose_Imparfait.docx** — skipped, confirmed duplicate: blank
  drill worksheets only, no new grammar; site already has this covered in
  depth (classes 28, 30-34, 41) plus a dedicated practice-bank chapter
  (class33).
- **French_Adjectives_by_Category.pdf** (~250 adjectives, 19 themed
  categories) — flagged as "maybe", not built: it's vocabulary, not
  grammar, and the site has no vocab-bank-style chapter format yet. Left
  for the user to request explicitly if wanted.

Both new chapters follow the standard pattern exactly (numbered `<h3>`
topics with per-topic checklist right after, `❌ Common Mistakes to Avoid`
table, `✅ Overall Mastery` section, `⬆️ Back to Top` as the true last
element). Both are A2-topic chapters (relative pronouns and object
pronouns are post-A1 grammar), so both got the blue-checkbox CSS treatment
alongside classes 22-34/41/42, not the default A1 green. `classOrder` and
the nav dropdown extended to `...,42,43,44`.

**1 escaping-trap bug this round** (class44 only): "I'm not going there"
and "I've thought about it" — raw apostrophes in ENGLISH contractions
typed directly into the Python prompt-building string instead of through
the `AP` token, same recurring pattern as the class10/21 incident. Caught
by the standard headless copy-button-parsing check (correctly isolated
button index 43 = class44, class43 passed clean), fixed by locating the
exact raw-apostrophe offset and swapping in `AP`, same method as every
prior incident. Lesson still holds: English translation text inside the
prompt string needs the same escaping care as the French text.

Full verification clean after the fix: JS syntax, div balance (962/962),
317 checkbox ids all unique, label↔id 1:1 match, table-wrap coverage 4/4
on the two new chapters, all 44 copy buttons parse, nav order matches
`classOrder`, all nav labels substring-match their chapter's `<h2>`, no
console errors, no horizontal overflow at 390px, both chapters
screenshotted and visually confirmed.

Also added a new standing instruction to this file (see near the top):
read this entire file at the start of every session and after any
environment reset / context compaction, not just when told to — a
compaction summary can drop or distort the project-specific conventions
here, and re-reading the file directly is cheap insurance against that.

## Study-time estimates added to nav menu only 2026-10-07

User asked: "Read all notes and estimate studying time for each. Example
gender 40 min. Hobbies: 60 min. Write that inside navigation menu only."
— explicit scope: nav dropdown labels only, nowhere else on the site.

**Method:** read every one of the 43 chapters' full content (not just
stats) before estimating, because the two calibration examples the user
gave prove a surface-stat formula (checklist-item count, word count)
would get this wrong: Hobbies has only 6 checklist items yet the user
rated it ABOVE Gender (7 items) at 60 vs 40 minutes — because Hobbies
hides a large, dense "Comprehensive Prepositions Guide" (place/time/
cause/purpose/after-verb prepositions, ~30 items) inside what looks like
a short vocab chapter. This confirmed that genuine content density
(vocab volume + number/difficulty of distinct grammar rules + worked-
example load), not any structural proxy, is what the user is actually
asking for. Used the two given numbers as calibration anchors and judged
every other chapter the same way after reading it in full. Heaviest
chapters by this method: Adverbs (class23, 100 min — by far the largest
chapter on the site, 21 checklist items, 7 categories, nuanced
distinctions, placement across multiple tenses), Prepositions (class25,
80 min), Numbers/Conditional (class2 and class20, 70 min each — both
cram a huge amount of conjugation/numeral memorization into one class).
Lightest: short single-concept chapters like Classroom (class5),
Negation (class15), La Règle/Exemples & Erreurs/Le COD (classes 30/32/42,
20 min each).

**Implementation:** appended `<span class="study-time">· NN min</span>`
inside each nav `<a>` link's existing text, in both `.level-content.a1`
and `.level-content.a2` — e.g. `Gender <span class="study-time">· 40
min</span>`. New CSS rule `nav a .study-time` (muted opacity 0.65,
smaller 12px, regular weight) keeps it a clearly secondary annotation,
not competing with the chapter name. Deliberately did NOT touch anything
on the lesson-card pages themselves (no `<p class="topic">` edit, no new
checklist item, no Gemini-prompt change) — scope was nav-only, as asked.

**Note for future sessions:** this changes nav link `textContent` (now
"Label · NN min" instead of just "Label"), which breaks the OLD
nav-label-vs-h2 substring verification method described earlier in this
file (step 7 of the chapter-add checklist) if run unmodified — that
check was only ever a manual verification script, not live site logic,
so nothing on the actual site depends on nav link text being a bare
label. Confirmed via grep that no production JS reads nav link
`textContent` for anything. If re-running that specific verification
script in the future, strip everything from `·` onward first, or check
`a.firstChild.textContent` instead of the full link text.

Verified: JS syntax, div balance (962/962 — unchanged, only text content
added), all 43 `.study-time` spans present and correctly paired to their
chapter, no console errors, no horizontal overflow at 390px on either
A1 or A2 open nav state, clicking a relabeled link still navigates to
the correct chapter (spot-checked class8/Gender). Screenshotted the open
A1 nav and confirmed the time annotations render as a clearly secondary
line under each chapter name, not crowding the tap target.

## Class 45 added 2026-10-07: "Les Pronoms Compléments : COD et COI" (A2)

User uploaded a structured transcript summary + raw call transcript (COD/
COI pronoun lesson) plus two reference-sheet screenshots, and said "New
class notes. Generate extra materials if needed for explanation." —
matching the established "build it" pattern (no separate assessment step
needed this time, unlike the 5-file usefulness-check earlier this
session).

This class directly fulfills a forward-reference class42 (Le COD) had
been carrying since it was built: "It's the first step toward eventually
using object pronouns like le/la/les... that's a future class... COI
gets its own full class later." Updated that note in class42 to name
this chapter specifically now that it exists (found via grep, confirmed
unique, single `.replace()`).

**Content gap found and fixed in the source material itself** (not just
thin content — an actual error), per the standing "generate extra
content" instruction: one of the two uploaded reference images lists the
COD/COI pronoun sets with a typo — "les" appears twice in the COD box
and "leur" appears twice (with a stray "elle") in the COI box. The
correct, standard sets are COD: me/te/le/la/les/nous/vous, COI: me/te/
lui/nous/vous/leur. Built the chapter around the corrected sets, and
added a teaching insight the source material never stated explicitly but
that's genuinely true and useful: me/te/nous/vous are IDENTICAL for COD
and COI — the two pronoun sets only actually diverge in the 3rd person
(le/la/les vs lui/leur). This reduces "6 new words to memorize" down to
"3 new words, since you already know the other half."

Structure: recap of COD vs COI (building on class42, finally giving COI
its full treatment as promised), the pronoun sets with the shared-forms
insight, word order (pronoun before the verb — same position as y/en
from class44, called out as a connection) + le/la → l' elision, then
choosing the right pronoun via the same preposition test from class42/43
— using the transcript's own best example (same verb "parler", COD vs
COI depending on the object: "je parle français" → "je le parle" vs "je
parle à mon ami" → "je lui parle"). A "🎁 Going Further" NON-checklist
box covers the double-pronoun pattern (COD before COI: "je le lui lis"),
deliberately not given a mandatory checklist item because the live
instructor explicitly called it "secondary, the priority is mastering
COD and COI pronouns separately first" — matched that framing rather
than over-teaching past what the source class itself prioritized.
Also added an explicit "coming in a future class, not covered here"
note for passé composé agreement with a preceding COD pronoun, since the
transcript explicitly says that's next week's topic — avoids the
all-too-common trap of a chapter quietly absorbing a future class's
content just because it came up in passing in the source material.

Followed the full chapter-add checklist: `classOrder` → appended `45`;
nav dropdown → added under `.level-content.a2`, last position, labeled
"Pronoms Compléments" (picked specifically because "COD et COI Pronoms"
— the first, more descriptive label tried — failed the nav-label-vs-h2
substring check; "Pronoms Compléments" does appear literally in the h2
and passed); A2 checklist-label CSS → added `class45`; lesson card →
`data-lesson="class45"` throughout, checkbox ids `c45-1` through `c45-5`
plus `gemini-skill-class45` (6 total), one table using `rowspan`/
`colspan` to show the shared-vs-divergent pronoun structure compactly
(screenshotted and confirmed it renders correctly on a 390px phone
width, no overflow). Study-time estimate added to its own nav entry in
the same pass (35 min), matching the convention from the task right
before this one.

**Also fixed while in the file**: classes 43 and 44 (added last session)
had a stale `progress-count` — both said "0 / 5 done" but actually have
6 checkboxes each (5 topic items + the `gemini-skill-classN` item that
gets added as the true last item). The JS recalculates this correctly
at runtime regardless, but the static HTML was wrong for anyone reading
source — fixed both to "0 / 6 done" per the standing "fix obvious bugs
without being asked" rule.

Verified: JS syntax, div balance (978/978), 323 checkbox ids all unique,
label↔id 1:1 match, table-wrap coverage 193/193 (an earlier regex-based
check falsely flagged a mismatch — `<table>` with no attributes vs
`<table` matching any attributes; the broader match confirmed clean),
all 45 copy buttons parse, nav order matches `classOrder`, all 45 nav
labels pass the h2-substring check (after the one relabel), no console
errors, no horizontal overflow at 390px, chapter screenshotted and
visually confirmed including the merged-cell pronoun table.

## Class 46 added 2026-10-07: "Adjectifs par Catégorie" (A2, vocabulary reference)

User confirmed building the one file from the earlier 5-file usefulness
assessment that had been explicitly held back ("hold on that for a
minute" — see that entry above): `French_Adjectives_by_Category.pdf`, a
19-category, ~274-word adjective vocabulary reference. Re-read the PDF in
full this time (page-by-page text extraction; image rendering failed —
no `pdftoppm`/poppler-utils in this environment — but text extraction
alone was complete and reliable) rather than relying on the earlier
session's summary, to get exact word lists, genders, and example
sentences rather than reconstructing them from memory.

**Scale**: 18 themed categories (Personality, Feelings, Appearance,
Colours, Size, Quantity, Time, Objects, Food, House, Work, School, Money,
Transport, Weather, Intelligence, Relationships, Evaluation) + a 19th
"Opposite Adjectives" category reshaped from the PDF's own
redundant format (it listed many pairs twice, once in each direction —
built a clean deduplicated 30-pair table instead, one direction only).
Every category table restructured from the PDF's "English | French |
Example" shape (which crammed masculine/feminine into one slash-separated
cell, e.g. "gentil / gentille") into "English | Masculine | Feminine |
Example" — matching the site's established pattern (see Class 16/Colors)
and giving each gender form its own clickable `.fr` span instead of one
span that would have spoken "gentil slash gentille" aloud as one
utterance.

Checklist items grouped 5 categories-worth of checkboxes per topic-cluster
(People = 1-3, The Physical World = 4-5-8, Daily Life = 6-7-9-10,
Professional & Academic = 11-12-13-14, Abstract Qualities = 15-16-17-18)
rather than one checkbox per category (which would have meant 18+
checkboxes just for this one chapter) — plus Opposites on its own, plus
the Grammar Reminder/TEF-DELF tip boxes reused directly from the PDF
(both legitimately useful, tie back to the existing `Adjectives` class's
agreement rule, not padding), plus mastery + Gemini test = 8 checkboxes
total.

**Built via a data-driven Python script, not hand-typed HTML** — all 244
category words + 30 opposite pairs defined as plain Python tuples with
normal apostrophes, then an `esc()` helper programmatically replaced
every `'` with the `AP` token when building the JS prompt string. This
was a deliberate change from the usual manual-typing-with-AP-tokens
approach used in every prior chapter build, specifically **to eliminate
the single most recurring bug class in this project's history** (raw
apostrophes missed in hand-typed prompt text, logged repeatedly in
History below). It worked almost perfectly — only one bug surfaced, and
it was in a short hand-typed instructional sentence I added *outside*
the data-driven parts (see below), not anywhere in the 274 programmatically-generated entries. **This confirms the fix: generate from data
with automatic escaping wherever the content volume makes hand-typing
risky, don't hand-type-with-manual-AP-tokens for anything at this scale.**

**Two real bugs found and fixed this build:**
1. **Escaping bug, same recurring class as always, but now isolated to
   non-data-driven text**: one sentence I typed directly into the prompt
   ("...that's fine and expected...") used a raw apostrophe instead of
   the `AP` token. Caught by the standard headless copy-button-parsing
   check, fixed by locating the exact offset and swapping in `AP` — but
   notably, this is the only escaping bug in the entire ~72KB chapter,
   versus 1-4 bugs in past chapters of a fraction of the size, which
   validates the data-driven approach above.
2. **Python variable-scoping bug, new bug class for this project**: the
   checklist-group-building code used `_` as a loop variable name in one
   loop, then referenced `_` again in a *later, separate* loop expecting
   it to still hold useful data — but Python has no block scoping, so by
   the second loop `_` had been left holding whatever the *last* value
   from the *first* loop happened to be. Result: all 5 category-group
   checkboxes showed the same (wrong, last-group's) description text
   instead of their own. A second, related bug in the same code: calling
   `.upper()` on a group name string that already contained the
   HTML-escaped entity `&amp;` corrupted it into `&AMP;` (entities are
   case-sensitive). Neither bug was caught by any existing automated
   check (JS syntax, div balance, checkbox-id uniqueness, table-wrap
   coverage, copy-button parsing all passed clean) — found only by
   actually reading a rendered screenshot and noticing the Daily Life
   checkbox described Weather/Intelligence/Relationships/Evaluation
   instead of Quantity/Time/Food/House. **Lesson: none of the standing
   automated checks catch "right-shaped but wrong-content" bugs — a
   visual screenshot read-through remains necessary specifically for
   chapters with programmatically-generated repeated structures (tables,
   grouped checkboxes), not just the usual "does it render without
   overflow" check.** Fixed by naming each loop variable uniquely instead
   of reusing `_`, and uppercasing display strings before HTML-escaping
   them rather than after.

Followed the full chapter-add checklist: `classOrder` → appended `46`;
nav dropdown → added under `.level-content.a2`, last position, labeled
"Adjectifs par Catégorie" (matches the h2 substring check); A2
checklist-label CSS → added `class46`; lesson card → `data-lesson=
"class46"` throughout, checkbox ids `ca46-1` through `ca46-7` plus
`gemini-skill-class46`; all 19 new tables (18 category tables + 1
opposites table) wrapped in `.table-wrap` from the start, generated
programmatically so coverage was correct by construction. Study-time
estimate added to the nav entry in the same pass (90 min — by far the
largest single vocabulary load on the site, reflects the ~274-word
scale honestly rather than underselling it).

The Gemini prompt itself lists all 274 words in compact "French (English)"
form grouped by category (not full sentences — those live in the visible
HTML tables below the button, the prompt just needs scope, matching the
Class 29/Group-3-verbs precedent for large vocab-reference chapters), with
an explicit instruction not to invent new vocabulary outside the list but
to freely build new example sentences from it, and to drill both
directions (French↔English) and both genders for every word, since gender-pair
recall at volume is the actual point of organizing 274 words by theme.

Verified: JS syntax, div balance (1006/1006), 331 checkbox ids all
unique, label↔id 1:1 match, table-wrap coverage 213/213, all 46 copy
buttons parse (one pre-existing, unrelated static demo button in the
site's own intro card accounts for the "46 copy buttons but 45 classes"
count — confirmed harmless, not something this build touched), nav order
matches `classOrder`, all nav labels pass the h2-substring check, no
console errors, no horizontal overflow at 390px, multiple chapter
sections screenshotted and visually confirmed — which is specifically
how bug #2 above was caught, underscoring why that step isn't optional
for data-driven chapters.

## Class 47 added 2026-10-07: "Cheat Sheet: Verb Conjugation Reference" (A1)

User gave a literal 5-column markdown table (4 verb patterns side by
side — manger/finir/attendre/partir — plus a row label column) and asked
for it to become a chapter called "Cheat Sheet." Built as a lean
reference card, not a full taught lesson: one topic section containing
the table, a single checklist item ("I can use this cheat sheet to
conjugate any verb from these four patterns correctly, on sight") plus
the standard Gemini-test item — 2 checkboxes total, the smallest chapter
on the site by a wide margin, which is correct for what a cheat sheet is
(nothing new to teach, nothing to break into topics).

**Placement decision (not specified by the user, used judgment):**
positioned logically right after <span class="fr">Verbes Pronominaux</span>
(class40) in `classOrder`/nav, since this table is a direct side-by-side
consolidation of exactly the four verb-conjugation classes that precede
it (`Les Groupes de Verbes` through `Verbes Pronominaux`) — it only makes
sense once those four patterns have actually been taught. Physically,
the HTML itself was still appended at the end of the file before
`<footer>`, same as every other recent build — confirmed this is safe
because nothing in the JS (nav, `showClass`, Prev/Next, progress
counting) depends on DOM order, only on `classOrder`'s array order and
matching `id`/`data-lesson` attributes. This is the first time a new
chapter's logical nav position and physical file position have
deliberately diverged — worth knowing for future chapter placement: it's
fine to insert anywhere logically needed without having to carefully
splice HTML into the middle of a 9000+ line file.

**Content note**: the user's partir column is a genuine extra value-add
beyond the original verb-arc classes — `Les Groupes de Verbes` only used
`partir` as an abstract example when explaining the -issant test (why
it's 3rd group, not 2nd), it was never given a full conjugation table of
its own anywhere on the site before this chapter. Added a callout box
explicitly cross-referencing that test for anyone who forgets why
`partir` behaves differently from `finir` despite both ending in `-ir`.

Since this chapter is A1-level (uses `header_a1.txt`, not the A2 blue
variant) but was built well after the A2-focused chapters 41-46, it's a
reminder that **level is determined by content/position in the
curriculum, not by build order** — always check which header variant
and which checklist-color CSS block (or lack thereof — A1 needs no
`data-lesson="classN"` entry in the A2-specific blue-label CSS list,
unlike every other recent build) actually applies before reusing the
most recent build script as a template.

Verified: JS syntax, div balance (1014/1014), 333 checkbox ids all
unique, label↔id 1:1 match, table-wrap coverage 214/214, all 47 copy
buttons parse, nav order matches `classOrder`, all nav labels pass the
h2-substring check, no console errors, no horizontal overflow at 390px
(the 5-column table scrolls horizontally within its own `.table-wrap`,
as intended — confirmed this is the existing wide-table behavior, not a
new issue). Also renumbered the rest of `README.md`'s A1/A2 curriculum
lists since this was a genuine mid-list insertion, not an append.

## Class 47 revised same day: 4 verbs per pattern + avoir/être added

Immediately after the initial build, user asked for two changes: add
avoir/être, and "give 4 examples instead of 1" (the original table had
exactly one model verb per pattern — manger/finir/attendre/partir).
Read this as: 4 example verbs per pattern, to prove the ending pattern
generalizes across different verbs rather than being specific to one —
not "4 example sentences," since a cheat sheet's whole point is bare
conjugation tables, not worked sentences (those already exist in the
classes this chapter summarizes).

Rebuilt from scratch rather than patching: removed the old class47
block entirely (single clean `text.index()` slice between its comment
marker and `<footer>`, confirmed exactly one `lesson-card` div in the
removed region before deleting) and reinserted a new one at the same
`id`, keeping `classOrder`/nav untouched since the chapter's identity
and position didn't change, only its content.

**New structure**: 4 verbs per table for each of the 4 regular/irregular
patterns (1st -ER: manger/parler/habiter/aimer; 2nd -IR regular: finir/
choisir/réussir/grandir; 3rd -RE: attendre/vendre/perdre/répondre; 3rd
-IR irregular, the "partir family": partir/sortir/dormir/sentir — all
four share partir's stem-dropping behavior, a genuine addition beyond
what any earlier class had fully conjugated), each as a Person × 4-verb
table (not one bloated 20-column table — kept each pattern's table to a
sane width for phone scrolling). **Avoir/être deliberately NOT forced
into the same "4 examples" shape** — they're each uniquely irregular,
there's no second verb that conjugates like avoir or like être, so
giving them "4 examples" would mean inventing fake parallel verbs that
don't exist. Instead: one combined 2-column (avoir + être) table, with a
note explicitly explaining why these two don't get the 4-verb treatment
the other patterns got. This was a judgment call, not something the
user specified — flagging it here in case the user actually wanted
avoir/être padded out with unrelated irregular verbs for symmetry
instead; revisit if they push back.

Checklist grew from 2 to 3 items (the four-pattern table, avoir/être,
plus the Gemini-test item) — still deliberately lean for a reference
chapter, now proportional to covering 5 conceptual groups instead of 4.
Gemini prompt rewritten to explicitly test with NEW verbs from the same
families, not just the 4 listed per pattern — reinforcing that the
point is pattern recognition, not memorizing these specific 16 examples
plus avoir/être.

Verified: JS syntax, div balance (1018/1018), 334 checkbox ids all
unique, label↔id 1:1 match, table-wrap coverage 218/218, exactly one
`id="class47"` in the file (confirms the remove-then-reinsert left no
duplicate), all copy buttons parse, nav/substring checks clean, no
console errors, no overflow at 390px, full chapter screenshotted and
visually confirmed — all 5 tables render correctly including the
narrower 3-column avoir/être table at the end.

## Open suggestions / things to keep an eye on

Not done, just flagged so a future session doesn't have to rediscover them:

- Features proposed 2026-09-24 but NOT picked (don't build unasked):
  progress backup/export (everything is localStorage-only right now -
  clearing browser data or switching phones still loses all progress with
  no way back), dark mode, and a cross-class vocab search. Ask before
  building any of these; they were declined this round, not forgotten.
- No automated check currently blocks a content-shrinking push to `main`.
  If another rebuild-style change happens, manually compare class count /
  line count before pushing (see History, first entry).
- `french_notes_data.md` and `CLASS-NAMES.md` are separate reference/data
  files — check whether they're still authoritative sources when adding
  new class content, or just historical scratch.
- If checklist ids ever need renumbering across many classes, double-check
  global uniqueness afterward (grep `id="c` across the whole file for
  collisions) — nothing currently enforces this automatically.
