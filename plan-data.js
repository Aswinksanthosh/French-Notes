const W=[
{d:'2026-10-26',l:'Mon Oct 26',n:'Work day',b:[{t:'Tonight',c:[10,11]}]},
{d:'2026-10-27',l:'Tue Oct 27',n:'Work day',b:[{t:'Chapters',c:[12,13]},{t:'Combo',a:['Combo 1: Lingopie episode + 15 min flashcards + Translate talk']}]},
{d:'2026-10-28',l:'Wed Oct 28',n:'Work day',b:[{t:'Chapters',c:[15,14]},{t:'Combo',a:['Combo 2: TEF practice (listening, reading, writing)']}]},
{d:'2026-10-29',l:'Thu Oct 29',n:'Work day',b:[{t:'Chapters',c:[16,17]},{t:'Combo',a:['Combo 1: Lingopie episode + 15 min flashcards + Translate talk']}]},
{d:'2026-10-30',l:'Fri Oct 30',n:'Day off — 4 + 4',b:[{t:'Morning',c:[18,19],a:['Combo 1: Lingopie episode + 15 min flashcards + Translate talk']},{t:'Evening',c:[21,22],a:['Combo 2: TEF practice (listening, reading, writing)']}]},
{d:'2026-10-31',l:'Sat Oct 31',n:'Work day',b:[{t:'Chapters',c:[23,25]},{t:'Combo',a:['Combo 2: TEF practice (listening, reading, writing)']}]},
{d:'2026-11-01',l:'Sun Nov 1',n:'Work day',b:[{t:'Chapters',c:[26,27]},{t:'Combo',a:['Combo 1: Lingopie episode + 15 min flashcards + Translate talk']}]}];

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
