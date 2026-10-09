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
9. Cheat Sheet (quick-reference conjugation tables — 4 example verbs for each of the 4 verb patterns, plus avoir/être)
10. Greetings
11. Calendar
12. Classroom
13. Endings
14. Articles
15. Gender
16. Hobbies
17. Family
18. Professions
19. Reflexive
20. Future
21. Demonstratives
22. Negation
23. Colors
24. Meals
25. Listening
26. Irregular
27. Conditional
28. Description

**A2**

29. Adjectives
30. Adverbs
31. Prepositions
32. Prepositions + Future
33. Expressions (Prepositions II — cause, purpose, fixed expressions)
34. Passé Composé (Le Passé Récent & Le Passé Composé)
35. Group 3 (55 irregular verbs, grouped by family)
36. La Règle (Passé composé avec être — the core agreement rule)
37. Cas Particuliers (Passé composé avec être — mixed groups, pronunciation exception, full 16-verb reference)
38. Exemples & Erreurs (Passé composé avec être — worked examples and common mistakes)
39. Pratique Intensive (Passé composé — large avoir/être practice bank)
40. L'Imparfait (formation, the être exception, and worked worksheet examples)
41. Narrer au Passé (combining passé composé and imparfait to narrate a story)
42. Le COD (complément d'objet direct — identifying the direct object)
43. Les Pronoms Relatifs (qui/que/où — joining two sentences into one)
44. Les Pronoms Y et EN (replacing à/de + thing with y or en, and correct word order)
45. Les Pronoms Compléments : COD et COI (le/la/les and lui/leur — the pronouns that replace a COD or COI)
46. Adjectifs par Catégorie (274 adjectives across 18 themed categories plus an opposites reference — vocabulary, not grammar)
47. Choisir le Bon "What" (quoi vs. que vs. quel vs. qu'est-ce que — choosing the right word for "what")
48. Négation — Rien, Personne, Plus (ne...rien, ne...personne, ne...plus — continues the ne...pas/ne...jamais negation from Class 14)

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
