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
