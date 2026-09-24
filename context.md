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

---

## What this site is

A single-file, no-build French learning curriculum: `index.html` only
(plus static data files like `CLASS-NAMES.md`, `french_notes_data.md` that
feed content, not code). 25 lesson cards ("classes"):

- **A1: classes 1–21** (beginner)
- **A2: classes 22, 23, 25, 26** (intermediate — note there is no class 24,
  it was renumbered away; navigation code walks a `classOrder` array
  instead of assuming a contiguous range, see the comment above that array
  in `index.html`)

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

## Push workflow

One commit per class/change (not batched), descriptive commit message,
pushed to both `claude/wonderful-darwin-idhgvx` and `main`:
```
git add index.html
git commit -m "..."
git push -u origin claude/wonderful-darwin-idhgvx
git push origin claude/wonderful-darwin-idhgvx:main
```

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

## Status (as of 2026-09-24)

All 25 classes (A1: 1–21, A2: 22,23,25,26) follow the per-class pattern
above. The full A1 rollout (bringing classes 1–21 up to the structure
originally established on the A2 reference classes) is complete. All 25
"Copy for Gemini" buttons verified working end-to-end (headless-browser
click test, clipboard content checked) after fixing the two quoting bugs
in History below.

**In progress (started 2026-09-24):** a content-quality pass through the
classes one by one, per the user's usual workflow (see "How the user
works" above) — going class by class checking/improving actual lesson
content, not structure. Class 1 (Alphabet) in progress: made the A–Z line
clickable-to-pronounce (see pattern #6 above), fixed the shared
expandable-audio double-play bug found while testing it on this class's
Accent Marks section (see History — that fix applies site-wide, not just
Class 1), then piloted a NEW feature on this class only: a purple
"🔎 What's in this chapter?" button (renamed from "...section?" per user
request). **Went through two shapes before landing:** first built as one
button per `<h3>` topic (3 buttons in Class 1, each a preview of just
that topic) — user then said only ONE such button per class/chapter,
covering the whole chapter, not one per topic. Now: exactly one button,
placed near the top right after the progress bar, whose spoken text
summarizes everything the chapter covers in one short preview.
`toggleSectionSummary()` shares the same play/pause engine as
`toggleExpandable()` via `deactivateOtherAudioButton()`/
`setExpandButtonIcon()`. **When rolling this out to other classes,
build it as ONE button per class near the top — do not default back to
one-per-topic, that shape was explicitly rejected.** This preview-button
feature is NOT yet rolled out past Class 1 — ask the user if/when they
want it on the other 24 classes before adding it there; don't assume.
Not yet touched: classes
2–26. If resuming this after a compaction, ask the user which
class they're on rather than assuming — this file won't always be updated
mid-pass
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
