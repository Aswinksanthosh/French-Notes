const W=[
{d:"2026-11-18",l:"Wed Nov 18",n:"Study day",b:[{t:"Chapters",c:[67,68,69],a:["Speak: say 5 sentences aloud using today's chapters (voice mode, 15 min)","Add class connectors list (opinion, argument, example, contrast) to your notes"]}]},
{d:"2026-11-19",l:"Thu Nov 19",n:"Study day",b:[{t:"Chapters",c:[28,34,41],a:["Speak: say 5 sentences aloud using today's chapters (voice mode, 15 min)"]}]},
{d:"2026-11-20",l:"Fri Nov 20",n:"Study day",b:[{t:"Chapters",c:[20,60,58],a:["Speak: say 5 sentences aloud using today's chapters (voice mode, 15 min)"]}]},
{d:"2026-11-21",l:"Sat Nov 21",n:"Study day",b:[{t:"Chapters",c:[42,45,66,44],a:["Speak: say 5 sentences aloud using today's chapters (voice mode, 15 min)"]}]},
{d:"2026-11-22",l:"Sun Nov 22",n:"Study day",b:[{t:"Chapters",c:[62,22],a:["Speak: say 5 sentences aloud using today's chapters (voice mode, 15 min)"]}]},
{d:"2026-11-23",l:"Mon Nov 23",n:"Study day",b:[{t:"Chapters",c:[25,54],a:["Speak: say 5 sentences aloud using today's chapters (voice mode, 15 min)"]}]},
{d:"2026-11-24",l:"Tue Nov 24",n:"Study day",b:[{t:"Chapters",c:[61,53,55,56],a:["Speak: say 5 sentences aloud using today's chapters (voice mode, 15 min)"]}]},
{d:"2026-11-25",l:"Wed Nov 25",n:"Study day",b:[{t:"Chapters",c:[27],a:["Speak: say 5 sentences aloud using today's chapters (voice mode, 15 min)"]}]},
{d:"2026-11-26",l:"Thu Nov 26",n:"Study day",b:[{t:"Chapters",c:[23],a:["Speak: say 5 sentences aloud using today's chapters (voice mode, 15 min)"]}]},
{d:"2026-11-27",l:"Fri Nov 27",n:"Study day",b:[{t:"Chapters",c:[57,59,63,43],a:["Speak: say 5 sentences aloud using today's chapters (voice mode, 15 min)"]}]},
{d:"2026-11-28",l:"Sat Nov 28",n:"Study day",b:[{t:"Chapters",c:[29,50,51,49,48],a:["Speak: say 5 sentences aloud using today's chapters (voice mode, 15 min)"]}]},
{d:"2026-11-29",l:"Sun Nov 29",n:"Study day",b:[{t:"Chapters",c:[52,46],a:["Speak: say 5 sentences aloud using today's chapters (voice mode, 15 min)"]}]},
{d:"2026-11-30",l:"Mon Nov 30",n:"Study day",b:[{t:"Chapters",c:[26,30,31,32],a:["Speak: say 5 sentences aloud using today's chapters (voice mode, 15 min)"]}]},
{d:"2026-12-01",l:"Tue Dec 1",n:"Study day",b:[{t:"Chapters",c:[33],a:["Speak: say 5 sentences aloud using today's chapters (voice mode, 15 min)"]}]},
{d:"2026-12-02",l:"Wed Dec 2",n:"Practice 1: Speaking",b:[{t:"Practice",a:["Speaking: sujets 1 and 2 (beach/mountain, sport/culture) with the connectors from chapter 70, record yourself","Writing: fill a form + 40-word text, timed 20 min"]}]},
{d:"2026-12-03",l:"Thu Dec 3",n:"Practice 2: Writing + Speaking",b:[{t:"Practice",a:["Speaking: sujets 3 and 4 (Canada/India, cook/restaurant) with the 4 steps","Writing: 40+ word text, timed 20 min, then check with Gemini"]}]},
{d:"2026-12-04",l:"Fri Dec 4",n:"Practice 3: Mock",b:[{t:"Practice",a:["Speaking: sujet 5 (yoga/gym) + role-play: phone call to ask for information, with joker questions","Writing: one full timed mock (form + text); listening: 1 practice audio twice"]}]},
{d:"2026-12-05",l:"Sat Dec 5",n:"Buffer day",b:[{t:"Buffer",a:["Catch up anything unfinished, or rest. Light read: A1 and A2 cheat sheets (15 min)","Prepare: ID, device charged, quiet room, sleep early"]}]},
{d:"2026-12-06",l:"Sun Dec 6",n:"EXAM DAY",b:[{t:"Exam",a:["Warm-up: say your greeting and 3 joker questions aloud (5 min)"]}]}];

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
