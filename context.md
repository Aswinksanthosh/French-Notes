<!-- PUBLIC. Short project memory for editing this site. Full history, user profile and the working playbook live in the private vault (vault-01/french-notes/CONTEXT-PRIVATE.md). -->
# context.md — Read This First (public)

Project memory for Claude Code sessions on this repo. Keep it short and generic. Anything personal, historical or about how the owner works goes in the private vault, not here.

**Private memory:** `Aswinksanthosh/vault-01` → `french-notes/CONTEXT-PRIVATE.md` (full history, working rules, build scripts, backups). If it is not attached to the session, attach it with `add_repo` (push access) before big changes, read that file, and report changes there.

## What this is
A single-file A1/A2 French study site, `index.html`, served by GitHub Pages from `main`. Side files: `plan.html` + `plan-data.js` (study plan), `cloud-sync.js` (Firebase sign-in and progress sync), `device-guard.js` (laptop banner), `private.html` (encrypted journal), `service-worker.js`, `manifest.webmanifest`.

## Rules for editing
1. Read the comment block at the top of `index.html` and this file before changing anything.
2. Adding or removing a chapter: update the `classOrder` array, the nav link (same position as in `classOrder`, under the right A1/A2 level div), the A2 CSS checklist selectors, the lesson card, and its progress counter. The "0 / N done" text must equal the real checkbox count. Checkbox ids must be globally unique. Counts are derived from `classOrder`; never hand-edit totals.
3. Tables go inside `.table-wrap`. Gemini prompts are single-quoted JS strings in each chapter's `mergeClassAndPrompt(...)` button: escape `'`, `"` and newlines.
4. Cheat sheets are classes 64 (A1) and 65 (A2); every other class is a chapter.
5. Verify after editing: `node --check` each inline script, ids unique, `classOrder` equals nav order, div balance, prompt strings parse.

## Git
Develop on the designated branch, then push to `main` too (Pages deploys `main`). One commit per change. Do not force-push without the owner's approval.

## Do not commit here
Class transcripts, recordings, teacher PDFs, course notes dumps, personal details, keys or passwords. These belong in the private vault.

## Standing instruction: fix the common vibe-coded technical mistakes (owner, 2026-11-15)
When the owner says "fix the mistakes" (or a session has spare time), audit this site for the usual problems and fix them in small commits, one per item, ticking the box here in the same commit. Ask before deleting a feature, file or library. Never touch the study content or the owner's data. Keep this file generic: nothing personal goes in it.
- [ ] Secrets and personal data: no keys, tokens, emails, names or recordings in the files or the git history. The Firebase web config is public by design; the real protection is `firestore.rules`, so review them (nobody may read or write another person's data) and test them, for example with the Firebase emulator.
- [ ] Silent failures: empty `catch` blocks or promises that fail without a word (cloud sync, service worker, device guard). Show a short message or log the problem.
- [ ] Service worker: a stale cache after an update leaves phones on old pages. Version the cache, delete old ones, and make sure an update reaches an already-installed phone.
- [ ] Never tested on the real target: check changes on the owner's real phones (Android and iPhone) and not only a desktop browser.
- [ ] No automatic checks: add a free GitHub Action that, on every push, checks each inline script with `node --check`, ids are unique, `classOrder` equals the nav order, links are not broken, and a secret scan passes (the same checks as "Verify after editing" above).
- [ ] Third-party scripts or fonts loaded from the internet without a pinned version or integrity hash: pin them, or keep a local copy.
- [ ] One huge `index.html`: never refactor it in one go; pull pieces out only when changing them anyway.
- [ ] Mobile and accessibility basics: tap targets, contrast, zoom allowed, text readable at phone size.
- [ ] Backups before anything risky: keep the vault's bundles current (see the private memory).

