# French Class Notes

A single-page, mobile-first French learning site covering A1 and A2 level
curriculum — built to read on a phone, listen to native pronunciation on
tap, and self-test progress with per-topic checklists.

**Live site:** https://aswinksanthosh.github.io/French-Notes/

## Features

- **Tap to hear it** — any French word or example sentence is spoken
  aloud on tap (Web Speech API, French voice).
- **Per-topic checklists** — check off what you've mastered as you go;
  progress is saved automatically on your device.
- **"What's in this chapter?"** — a one-tap spoken summary at the top of
  every chapter.
- **Copy for Gemini** — copies the full lesson plus a ready-made study
  prompt, for a personal walkthrough in the Gemini app.
- **Swipe navigation** — swipe (twice, to confirm) or use Prev/Next to
  move between chapters; jump anywhere from the Chapters dropdown.
- **Installable** — works as a home-screen app (PWA) on phones.
- **No build step, no backend** — it's one HTML file. Progress is saved
  locally in the browser (`localStorage`).

## Curriculum

**A1**

1. Alphabet
2. Numbers
3. Greetings
4. Calendar
5. Classroom
6. Endings
7. Articles
8. Gender
9. Hobbies
10. Family
11. Professions
12. Reflexive
13. Future
14. Demonstratives
15. Negation
16. Colors
17. Meals
18. Listening
19. Irregular
20. Conditional
21. Description

**A2**

22. Adjectives
23. Adverbs
24. Prepositions
25. Prepositions + Future

*Remaining A2 classes will be updated weekly.*

## Structure

```
index.html            everything — content, styles, and logic
service-worker.js      lets the browser offer "Add to Home Screen"
manifest.webmanifest   PWA metadata (name, icons, theme color)
icon-*.png             app icons
context.md             project history / working notes
```

## Credits

Made by **[Aswin K Santhosh](https://github.com/Aswinksanthosh)**

[GitHub](https://github.com/Aswinksanthosh) ·
[LinkedIn](https://www.linkedin.com/in/aswin-santhosh-15557a245) ·
[aswinksanthosh000@gmail.com](mailto:aswinksanthosh000@gmail.com)
