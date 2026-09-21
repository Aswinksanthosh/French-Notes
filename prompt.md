# French-Notes Project: Development & Tracking Document

**Last Updated:** September 21, 2026 (Session 2)
**Session:** Claude Haiku 4.5  
**Branch:** `claude/merged-professors-a1`

---

## 🎯 Project Overview

**French-Notes** is an interactive web-based French language learning platform built with HTML, CSS, and JavaScript. It provides structured A1-A2 level lessons with vocabulary, grammar, audio explanations, real-world examples, and interactive checklists.

**Key Features:**
- 📚 20 A1 lessons + growing A2 content
- 🎧 Expandable audio explanations for grammar concepts
- ❌✓ Common mistakes tables with explanations
- 🌍 Real-world examples with clickable French pronunciation
- ✅ Progress-tracking checklists
- 💡 Gemini prompt templates for study with AI
- 🎓 Professor's notes with actual classroom Q&A

---

## ✅ COMPLETED WORK

### Session 1 (Previous)
- Git conflict resolution between branches
- A1 Class 4 (Old Professor) feature enhancement with audio, mistakes table, professor's notes
- A1 Class 4 cheat sheet creation

### Session 2 (Current - Token Efficient Approach)
**Focus:** Complete ONE chapter thoroughly before expanding to others

#### 1. **Merged Repository Structure** ✓
   - **Created:** New `index.html` with dual-professor support
   - **Features:**
     - Professor selector (Old / New / Compare modes)
     - Side-by-side lesson viewing capability
     - Dynamic navigation for 20 old professor lessons + 9 new professor lessons
     - Full JavaScript infrastructure for professor switching, chapter navigation, and progress tracking

#### 2. **NEW PROFESSOR CLASS 1: GENDER** ✓
   - **File:** `index.html` (class1-new section) + `A1/New-Prof-1-Gender-CHEAT-SHEET.txt`
   - **Implementation Status:** FULLY COMPLETE
   
   **Features Implemented:**
   - ✅ 5 Audio Explanation Buttons (English language):
     * "What is Noun Gender?" (overview)
     * "Masculine Patterns: -ment, -age, -oir, -isme" (expandable details)
     * "Feminine Patterns: -tion/-sion, -ure, -ade, -e" (expandable details)
     * "English Loan Words = Usually Masculine"
     * "Days, Months & Seasons = All Masculine"
   
   - ✅ Vocabulary Tables:
     * Masculine patterns table (6 pattern types with examples)
     * Feminine patterns table (5 pattern types with examples)
   
   - ✅ Common Mistakes Table:
     * 4 typical errors with corrections and explanations
   
   - ✅ French Examples with Clickable Pronunciation:
     * All French terms marked with `<span class="fr">` 
     * Integrated with Web Speech API for pronunciation
   
   - ✅ Learning Checklist:
     * 9 progressive learning items
     * Progress bar with real-time percentage tracking
     * localStorage persistence for user progress
   
   - ✅ Gemini Prompt Button:
     * Comprehensive prompt with all grammar rules, patterns, exceptions
     * Includes checklist for student self-evaluation
     * JavaScript `copyPromptText()` function for one-click clipboard copying
   
   - ✅ Detailed Cheat Sheet:
     * Quick reference patterns
     * Active practice checklist
     * Pronunciation practice words
     * Study tips for retention
   
   **Commit:** `29029d1` — "New Professor Class 1 (Gender) - Complete with Cheat Sheet"
   - **Status:** PRODUCTION READY ✓

---

## 📋 ROADMAP (Token-Efficient Priority Order)

### PHASE 1: Complete One Lesson at a Time (Current Approach)
This avoids wasting tokens on partial implementations. Each lesson should be FULLY COMPLETE before moving to next.

#### NEW PROFESSOR - 9 Lessons to Complete:
1. ✅ **Class 1: Gender** (DONE - Commit 29029d1)
2. [ ] **Class 2: Articles** (le, la, les, un, une, des)
3. [ ] **Class 3: Demonstratives** (ce, cet, cette, ces)
4. [ ] **Class 4: Possessives** (mon, ton, son, notre, votre, leur)
5. [ ] **Class 5: Prepositions** (à, de, en, pour, avec, sans, etc.)
6. [ ] **Class 6: Reflexive Verbs** (se lever, s'asseoir, etc.)
7. [ ] **Class 7: Adjectives** (agreement, position, common adjectives)
8. [ ] **Class 8: Adverbs** (formation, placement, common adverbs)
9. [ ] **Class 9: Core Vocabulary** (300 essential words)

#### OLD PROFESSOR - 20 Lessons (Need to migrate to new HTML structure):
- All 20 classes exist in `/A1/` directory as `.txt` files
- Need to convert each to full-featured HTML in `index.html` with same feature set as Gender class

### PHASE 2: Cheat Sheet Coverage
- ✅ **Class 1 (Gender)** - DONE
- [ ] Classes 2-9 (New Professor) - create after each class completion
- [ ] Classes 1-20 (Old Professor) - create based on existing `.txt` files

### PHASE 3: Old Professor Integration
- [ ] Migrate all 20 old professor lessons to new HTML structure
- [ ] Ensure feature parity with new professor lessons

### PHASE 4: Advanced Features (Only after all lessons complete)
- [ ] Add flashcard quiz mode
- [ ] Add listening comprehension exercises
- [ ] Speech-to-text practice
- [ ] Spaced Repetition System (SRS)
- [ ] PDF export functionality

---

## 🔧 KNOWN ISSUES & WORKAROUNDS

### 1. Browser Compatibility
- Clickable French pronunciation requires `speakFrench()` JavaScript function
- Works on Chrome, Firefox, Safari (modern versions)
- Fallback: Manual pronunciation reading from context

### 2. localStorage State
- Checklist progress saved locally in browser storage
- Clears if browser data is cleared
- **Workaround:** Take screenshots of progress or note manually

### 3. Mobile Responsive Design
- Vocabulary tables can overflow on small screens
- **Workaround:** Horizontal scroll on mobile

---

## 📊 PROJECT STATISTICS

### Lessons Status
| Category | Count | Status |
|----------|-------|--------|
| Old Professor Classes | 20 | Available in .txt format, need HTML integration |
| New Professor Classes | 9 | 1 complete, 8 in queue |
| Classes with Full Features | 1 | New Prof Class 1 (Gender) |
| Cheat Sheets Created | 1 | New Prof Class 1 |

### New Prof Class 1 (Gender) - Feature Breakdown
| Feature | Count | Status |
|---------|-------|--------|
| Audio Explanation Buttons | 5 | ✅ Complete |
| Vocabulary Tables | 2 | ✅ Complete |
| Common Mistakes Table | 4 examples | ✅ Complete |
| Learning Checklist Items | 9 | ✅ Complete |
| French Pronunciation Examples | 20+ | ✅ Complete |
| Gemini Prompt Coverage | 100% | ✅ Complete |
| Cheat Sheet Sections | 8 | ✅ Complete |

---

## 🎯 HOW TO USE THE MERGED REPOSITORY

### For Students: Typical Study Session

1. **Open the Merged Index:**
   - Open `/index.html` in browser
   - Use the "Professor Selection" panel at top to choose:
     * **Old Professor:** View lessons from previous batch (20 classes)
     * **New Professor:** View lessons from current batch (9 classes, grammar-focused)
     * **Compare:** View both side-by-side

2. **Study New Professor Classes (Current Focus):**
   - Select "New Professor" tab
   - Choose a lesson (e.g., "Class 1: Gender")
   - Read audio explanations (click buttons to hear in English)
   - Study vocabulary tables
   - Review common mistakes
   - Complete the checklist (tracked in browser)
   - **Copy Gemini Prompt** → paste into Gemini for AI-assisted study

3. **Reference the Cheat Sheet:**
   - Each class has a `.txt` cheat sheet in `/A1/` folder
   - Print or keep open for quick reference
   - Contains patterns, exceptions, practice checklist, pronunciation guide

4. **Progress Tracking:**
   - Browser stores your checklist progress locally (localStorage)
   - Progress bar shows completion % in real-time
   - Review unchecked items before moving to next class

---

## 📝 ARCHITECTURE & TECHNICAL DECISIONS

### Current HTML Structure (Merged Repository):

**File:** `/index.html` (single page with dual-professor support)

1. **Professor Selector UI**
   - Buttons: "Old Professor" | "New Professor" | "Compare"
   - CSS classes: `.professor-tab`, `.professor-selector`, `.professor-tabs`
   - JavaScript: `switchProfessor(prof)` function
   - Color coding: Blue (Old) vs Green (New)

2. **Lesson Card System**
   - Each lesson: `<div class="lesson-card" id="class[N]-[prof]">`
   - Conditional display with `.active` class
   - Lesson header with topic badge and metadata
   - CSS: `.lesson-card`, `.lesson-header`, animations

3. **Expandable Audio Sections**
   - Structure: `<button class="expand-btn">` + `<div class="expandable-content">`
   - Data attribute: `data-audio="[English explanation]"` for Web Speech API
   - Function: `toggleExpandable(button)` for expand/collapse
   - JavaScript: Reads data-audio and speaks via browser's speech synthesis

4. **Progress Tracking (localStorage)**
   - Checkboxes stored with lesson-specific IDs: `data-lesson="classN-prof"`
   - Storage key: Checkbox ID (e.g., `c1new-1`, `c1old-2`)
   - Function: `updateProgress()` calculates % completion in real-time
   - Persistence: Survives page reload until browser cache cleared

5. **Gemini Prompt Copying**
   - Button: `<button class="copy-btn" onclick="copyPromptText(this, '[PROMPT TEXT]')">`
   - JavaScript function: `copyPromptText(button, text)`
   - Uses `navigator.clipboard.writeText()` API
   - Visual feedback: Button changes to "✅ Copied!" for 2 seconds

### Content Organization:
- **Cheat Sheets:** Separate `.txt` files for quick reference
  * File naming: `A1/New-Prof-N-[Topic]-CHEAT-SHEET.txt`
  * Content: Patterns, exceptions, study tips, practice checklist
  * Format: Plain text for easy copying/printing

### Design Philosophy:
1. **All-in-one index.html** - Fast loading, self-contained
2. **localStorage for UX** - No backend needed, instant feedback
3. **Text files for supplementary content** - Easy to edit, version control friendly
4. **Inline CSS + JS** - No dependencies, works offline
5. **Color-coded professors** - Visual distinction between content sources

---

## 🔄 GIT WORKFLOW

### Current Branch Structure:
- **`main`:** Stable, production-ready version
- **`claude/merged-professors-a1`:** Active development branch for merged repository
  * Contains dual-professor support
  * New HTML structure with professor selector
  * All new professor classes + old professor materials

### Commit Pattern (One Lesson Per Commit):
- Format: `New Professor Class N: [Topic] - Complete with Cheat Sheet`
- Example: `New Professor Class 1: Gender - Complete with Cheat Sheet`
- Each commit includes:
  * Updated `index.html` with new class content
  * New cheat sheet file (`A1/New-Prof-N-[Topic]-CHEAT-SHEET.txt`)
  * All required features (audio, vocabulary, mistakes, checklist, Gemini prompt)

### Push Strategy:
- After each complete lesson, commit and push
- Use: `git push -u origin claude/merged-professors-a1`
- Verify before push: `git status` and `git diff`
- Keep commit history clean (one lesson = one commit)

---

## 🎓 TEACHING PHILOSOPHY EMBEDDED

All lessons reflect the instructor's approach from class notes:

1. **No word-for-word translation:** Learn patterns, not individual words
2. **Rule explanations:** Show WHY the grammar works (not just formulas)
3. **Student questions:** Document actual classroom confusion points
4. **Active vocabulary building:** "Comment on dit..." practice encouraged
5. **Progressive difficulty:** Build from essentials to complex concepts
6. **Error patterns:** Common mistakes highlighted with corrections

---

## 📞 Contact / Attribution

- **Project Owner:** Aswinksanthosh (GitHub)
- **Repository:** https://github.com/Aswinksanthosh/French-Notes
- **Current Session:** Claude Haiku 4.5
- **Attribution:** Generated with Claude Code

---

## 🚀 NEXT SESSION CHECKLIST

When resuming work on this project:

### Quick Start:
- [ ] Verify branch: `git branch -a | grep claude/merged`
- [ ] Check current status: `git status` (should be clean)
- [ ] Pull latest: `git fetch origin && git pull origin claude/merged-professors-a1`

### Before Starting Next Lesson:
- [ ] Decide: Which of the 8 remaining NEW Professor classes to build next?
  * Suggested order: Class 2 (Articles) → Class 3 (Demonstratives) → Class 4 (Possessives) → Class 5 (Prepositions)
  * Each lesson should be COMPLETE before moving to next (avoid token waste)

### For Each New Lesson:
1. **HTML Implementation:**
   - Add new `<div class="lesson-card new-prof" id="class[N]-new">` to index.html
   - Implement 4-5 audio buttons (English explanations)
   - Create 2-3 vocabulary/reference tables
   - Add common mistakes table (4-5 examples)
   - Build 9-item learning checklist
   - Write comprehensive Gemini prompt with all material

2. **Supporting Files:**
   - Create `A1/New-Prof-[N]-[Topic]-CHEAT-SHEET.txt`
   - Format: Follow the Gender cheat sheet template
   - Include: Patterns, exceptions, study tips, practice checklist

3. **Quality Checks:**
   - Test clickable pronunciation (French words with `<span class="fr">`)
   - Test Gemini prompt copy button (should copy full prompt)
   - Test audio buttons (should play English explanation via text-to-speech)
   - Test checklist progress tracking (should persist across reloads)
   - Verify all links and formatting look correct

4. **Git Workflow:**
   - Commit with message: `New Professor Class [N]: [Topic] - Complete with Cheat Sheet`
   - Push: `git push -u origin claude/merged-professors-a1`
   - Update this prompt.md file with new progress

### Testing Browsers:
- [ ] Chrome (full feature support)
- [ ] Firefox (test Web Speech API)
- [ ] Safari (check CSS grid/flexbox compatibility)

---

**End of Document**
