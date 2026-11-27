const W=[
{"d":"2026-11-18","l":"Wed Nov 18","n":"Study day","b":[{"t":"Chapters","a":["Speak: say 5 sentences aloud using today's chapters (voice mode, 15 min)"]}]},
{"d":"2026-11-19","l":"Thu Nov 19","n":"Study day","b":[{"t":"Chapters","a":["Speak: say 5 sentences aloud using today's chapters (voice mode, 15 min)"]}]},
{"d":"2026-11-20","l":"Fri Nov 20","n":"Study day","b":[{"t":"Chapters","a":["Speak: say 5 sentences aloud using today's chapters (voice mode, 15 min)"]}]},
{"d":"2026-11-21","l":"Sat Nov 21","n":"Study day","b":[{"t":"Chapters","a":["Speak: say 5 sentences aloud using today's chapters (voice mode, 15 min)"]}]},
{"d":"2026-11-22","l":"Sun Nov 22","n":"Study day","b":[{"t":"Chapters","a":["Speak: say 5 sentences aloud using today's chapters (voice mode, 15 min)"]}]},
{"d":"2026-11-23","l":"Mon Nov 23","n":"Study day","b":[{"t":"Chapters","a":["Speak: say 5 sentences aloud using today's chapters (voice mode, 15 min)"]}]},
{"d":"2026-11-24","l":"Tue Nov 24","n":"Study day","b":[{"t":"Chapters","a":["Speak: say 5 sentences aloud using today's chapters (voice mode, 15 min)"]}]},
{"d":"2026-11-25","l":"Wed Nov 25","n":"Study day","b":[{"t":"Chapters","a":["Speak: say 5 sentences aloud using today's chapters (voice mode, 15 min)"]}]},
{"d":"2026-11-26","l":"Thu Nov 26","n":"Study day","b":[{"t":"Chapters","a":["Speak: say 5 sentences aloud using today's chapters (voice mode, 15 min)"]}]},
{"d":"2026-11-27","l":"Fri Nov 27","n":"Day 1 · Introduce yourself","b":[{"t":"Today (about 10 min)","a":["🗣️ Say your introduction aloud 3 times (name, age, nationality, home, job, family, hobbies). Third time from memory.","✍️ Write your introduction in 50–70 words. Check accents and apostrophes (à, j'ai, j'aime).","Optional: read the Greetings chapter (class 3) first."]}]},
{"d":"2026-11-28","l":"Sat Nov 28","n":"Day 2 · Daily routine","b":[{"t":"Today (about 10 min)","a":["🗣️ Say your daily routine from waking up to sleeping, with times. Use d'abord, ensuite, puis, enfin.","✍️ Write your routine, 8 lines with times (je me réveille, je me lève, je m'habille, je me couche).","Optional: read the Reflexive chapter (class 12) first."]}]},
{"d":"2026-11-29","l":"Sun Nov 29","n":"Day 3 · Family and hobbies","b":[{"t":"Today (about 10 min)","a":["🗣️ Say 6 sentences about your family and hobbies (Dans ma famille… Pendant mon temps libre…).","✍️ Write an invitation email to a friend, about 60 words: greeting, party, date, time, place, please reply, goodbye.","Optional: read the Hobbies chapter (class 9) first."]}]},
{"d":"2026-11-30","l":"Mon Nov 30","n":"Day 4 · Phone role-play","b":[{"t":"Today (about 10 min)","a":["🗣️ Role-play a phone call for information: greeting with vous, announce the subject, ask 3 questions, use 1 joker question (Pouvez-vous répéter, s'il vous plaît ?).","✍️ Write 2 replies to an invitation: one to accept, one to decline with a reason.","Optional: read chapter 69 (Role-Play) first."]}]},
{"d":"2026-12-01","l":"Tue Dec 1","n":"Day 5 · Convince a friend","b":[{"t":"Today (about 10 min)","a":["🗣️ Convince a friend (beach or mountain, or cook or restaurant): opinion, 2 arguments with De plus / Par exemple, one Certes… mais, conclusion.","✍️ Write a text message (30 words) inviting a friend, then a formal message with vous (3 lines).","Optional: read chapter 70 (Connectors) first."]}]},
{"d":"2026-12-02","l":"Wed Dec 2","n":"Day 6 · Mock 1","b":[{"t":"Today (about 10 min)","a":["🗣️ Gemini examiner for 10 minutes: introduction, routine, then a role-play. Use the examiner prompt.","✍️ Timer 15 minutes: write an invitation email, 60–80 words. Then get it corrected and write your 3 most common mistakes."]}]},
{"d":"2026-12-03","l":"Thu Dec 3","n":"Day 7 · Mock 2","b":[{"t":"Today (about 10 min)","a":["🗣️ Record yourself for 1 minute on one convince-a-friend subject. Listen back and fix 3 mistakes.","✍️ Timer 15 minutes: write a reply to an invitation + a short message. Get it corrected."]}]},
{"d":"2026-12-04","l":"Fri Dec 4","n":"Day 8 · Mock 3 (full)","b":[{"t":"Today (about 10 min)","a":["🗣️ 5 minutes in one go: introduction, routine, a role-play, convince a friend.","✍️ Timer 15 minutes: write an invitation email from scratch, 60–80 words. Get it corrected."]}]},
{"d":"2026-12-05","l":"Sat Dec 5","n":"Day 9 · Rest and review","b":[{"t":"Today (about 10 min)","a":["🗣️ Say your introduction and routine once, calmly.","✍️ Rewrite your best email from memory. Read your 3 most common mistakes once.","Prepare: ID, device charged, quiet room, sleep early."]}]},
{"d":"2026-12-06","l":"Sun Dec 6","n":"EXAM DAY","b":[{"t":"Exam","a":["Warm-up: say your greeting and 3 joker questions aloud (5 min)"]}]}];

// Shared by plan.html and index.html: where each chapter lands today.
// done(n) -> true when chapter n is fully ticked; M = manual moves; T = today 'YYYY-MM-DD'.
function planEff(done, M, T) {
  const days = W.map(d => d.d), first = days[0], last = days[days.length - 1];
  const orig = {};
  W.forEach(d => d.b.forEach(b => (b.c || []).forEach(n => orig[n] = d.d)));
  const eff = {};
  Object.keys(orig).forEach(n => {
    let d = M[n] || orig[n];
    if (d < T && !done(+n)) d = T;
    if (d < first) d = first;
    if (d > last) d = last;
    if (!days.includes(d)) d = days.find(x => x >= d) || last;
    eff[n] = d;
  });
  return { eff, orig, days };
}
