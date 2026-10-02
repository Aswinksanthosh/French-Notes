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
3. Les Groupes de Verbes (how to identify which of the 3 verb groups a verb belongs to)
4. Verbes Essentiels (être, avoir, aller)
5. Verbes -ER (regular 1st-group verbs, present tense)
6. Verbes -IR (regular 2nd-group verbs, present tense)
7. Verbes -RE (regular 3rd-group verbs, present tense)
8. Verbes Pronominaux (reflexive verb mechanism)
9. Greetings
10. Calendar
11. Classroom
12. Endings
13. Articles
14. Gender
15. Hobbies
16. Family
17. Professions
18. Reflexive
19. Future
20. Demonstratives
21. Negation
22. Colors
23. Meals
24. Listening
25. Irregular
26. Conditional
27. Description

**A2**

28. Adjectives
29. Adverbs
30. Prepositions
31. Prepositions + Future
32. Expressions (Prepositions II — cause, purpose, fixed expressions)
33. Passé Composé (Le Passé Récent & Le Passé Composé)
34. Group 3 (55 irregular verbs, grouped by family)
35. La Règle (Passé composé avec être — the core agreement rule)
36. Cas Particuliers (Passé composé avec être — mixed groups, pronunciation exception, full 16-verb reference)
37. Exemples & Erreurs (Passé composé avec être — worked examples and common mistakes)
38. Pratique Intensive (Passé composé — large avoir/être practice bank)
39. L'Imparfait (formation, the être exception, and worked worksheet examples)

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
