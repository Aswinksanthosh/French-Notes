// Google sign-in + progress sync through Firebase (Auth + Firestore).
// Works offline-first: everything is still saved in localStorage; when signed in, the
// progress keys below are copied to Firestore (users/{uid}) and merged across devices.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { initializeFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA8CRdGJctshXn7lECGxJ6Yr4PUSAP9k-4",
  authDomain: "french-notes-ca66e.firebaseapp.com",
  projectId: "french-notes-ca66e",
  storageBucket: "french-notes-ca66e.firebasestorage.app",
  messagingSenderId: "488650197180",
  appId: "1:488650197180:web:5bd8690a874fca1e53a8b9"
};

// ---- which localStorage keys are synced ----
const FIXED = ['plan_acts', 'plan_moves', 'plan_rewards', 'plan_links'];
const isSync = k => /^checklist_class\d+$/.test(k) || FIXED.indexOf(k) >= 0;
const META = 'cloud_meta'; // { key: lastChangedMillis } for keys changed on this device

const store = window.localStorage;
const origSet = Storage.prototype.setItem;
const origRemove = Storage.prototype.removeItem;
const getMeta = () => { try { return JSON.parse(store.getItem(META) || '{}'); } catch (e) { return {}; } };
const saveMeta = m => origSet.call(store, META, JSON.stringify(m));

// ---- merge used only the first time a device meets existing cloud data ----
function parse(s) { try { return JSON.parse(s); } catch (e) { return null; } }
export function mergeVals(key, localStr, cloudStr) {
  const a = parse(localStr), b = parse(cloudStr);
  if (a === null || b === null) return localStr;
  if (/^checklist_class/.test(key) || key === 'plan_acts') {          // a tick on either side stays
    const out = Object.assign({}, b);
    Object.keys(a).forEach(k => { if (a[k]) out[k] = a[k]; else if (!(k in out)) out[k] = a[k]; });
    return JSON.stringify(out);
  }
  if (key === 'plan_links') {                                         // lists per day, no duplicates
    const out = Object.assign({}, b);
    Object.keys(a).forEach(d => {
      const list = (out[d] || []).slice();
      (a[d] || []).forEach(x => { if (!list.some(y => y.u === x.u && y.n === x.n)) list.push(x); });
      out[d] = list;
    });
    return JSON.stringify(out);
  }
  return JSON.stringify(Object.assign({}, b, a));                     // moves / rewards: this device wins
}

// ---- sync ----
let app, auth, db, user = null, timer = null, busy = false, lastSync = null, suppressAutoUntil = 0;

function localKeys() {
  const ks = [];
  for (let i = 0; i < store.length; i++) { const k = store.key(i); if (isSync(k)) ks.push(k); }
  return ks;
}
function reloadOnce() {
  try {
    const t = parseInt(sessionStorage.getItem('cloud_reload_t') || '0', 10);
    if (Date.now() - t < 20000) return;
    sessionStorage.setItem('cloud_reload_t', String(Date.now()));
  } catch (e) {}
  location.reload();
}

// Boxes that are ticked in `fromStr` but not in `toStr` (JSON objects of id -> truthy).
const isTickKey = k => /^checklist_class/.test(k) || k === 'plan_acts';
export function tickedDiff(fromStr, toStr) {
  const a = parse(fromStr), b = parse(toStr);
  if (!a || !b) return [];
  return Object.keys(a).filter(id => a[id] && !b[id]);
}
// Decide what a key should become. Pure function, so it can be tested.
//   lv/lt = local value + last local change time (0 = never synced), c = cloud {v,t} or undefined
export function decide(k, lv, lt, c, now) {
  if (c && lv !== null && lt === 0) {                     // first meeting: merge, never lose ticks
    return { action: 'merge', finalV: mergeVals(k, lv, c.v), t: now, removed: [], side: '' };
  }
  if (c && (lv === null || c.t > lt)) {                    // cloud is newer: this device would change
    return { action: 'pull', finalV: c.v, t: c.t, side: 'un-ticked on another device',
             removed: lv !== null && isTickKey(k) ? tickedDiff(lv, c.v) : [] };
  }
  if (lv !== null && (!c || lt > c.t)) {                   // this device is newer: the cloud would change
    return { action: 'push', finalV: lv, t: lt || now, side: 'un-ticked on this device',
             removed: c && isTickKey(k) ? tickedDiff(c.v, lv) : [] };
  }
  return { action: 'none', finalV: lv, t: lt, removed: [], side: '' };
}
function keepTicked(finalV, ids) {
  const o = parse(finalV) || {};
  ids.forEach(id => { o[id] = true; });
  return JSON.stringify(o);
}

// ---- the question shown when a sync would un-tick boxes ----
function describe(k, id) {
  if (k === 'plan_acts') return { chapter: 'Study Plan', text: id.replace(/^c(\d+)$/, 'Chapter $1') };
  let chapter = k.replace('checklist_class', 'Chapter '), text = id;
  try {
    const input = document.getElementById(id);
    if (input) {
      const card = input.closest('.lesson-card'), h2 = card && card.querySelector('h2');
      if (h2) chapter = h2.firstChild.textContent.replace(/^A2:\s*/, '').trim();
      const lab = document.querySelector('label[for="' + id + '"]');
      if (lab) text = lab.textContent.trim().slice(0, 110);
    }
  } catch (e) {}
  return { chapter: chapter, text: text };
}
function askAboutUnticks(items) {
  return new Promise(resolve => {
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:14px;font:15px/1.4 system-ui,sans-serif';
    const rows = items.map((it, i) => {
      const d = describe(it.k, it.id);
      return '<label style="display:flex;gap:10px;align-items:flex-start;padding:9px 0;border-top:1px solid #e3e8ef"><input type="checkbox" checked data-i="' + i + '" style="width:20px;height:20px;flex:none;margin-top:2px">' +
        '<span><b>' + d.chapter.replace(/</g, '&lt;') + '</b><br>' + d.text.replace(/</g, '&lt;') +
        '<br><small style="color:#8a4b00">' + it.side + '</small></span></label>';
    }).join('');
    ov.innerHTML = '<div style="background:#fff;color:#1b2a3a;border-radius:14px;max-width:520px;width:100%;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 12px 40px rgba(0,0,0,.35)">' +
      '<div style="padding:16px 16px 6px"><div style="font-size:18px;font-weight:800">⚠️ Sync would un-tick ' + items.length + ' box' + (items.length > 1 ? 'es' : '') + '</div>' +
      '<div style="color:#556;margin-top:4px">Leave a box <b>ticked</b> to keep it ticked everywhere. <b>Untick</b> it only if you really want it un-ticked.</div></div>' +
      '<div style="padding:0 16px;overflow:auto;flex:1">' + rows + '</div>' +
      '<div style="display:flex;gap:8px;padding:14px 16px"><button id="uOk" style="flex:1;padding:11px;border:0;border-radius:10px;background:#1976d2;color:#fff;font:inherit;font-weight:700;cursor:pointer">Apply</button>' +
      '<button id="uNo" style="flex:1;padding:11px;border:1px solid #cfd8e3;border-radius:10px;background:#fff;font:inherit;cursor:pointer">Cancel sync</button></div></div>';
    document.body.appendChild(ov);
    const done = v => { ov.remove(); resolve(v); };
    ov.querySelector('#uNo').onclick = () => done(null);
    ov.querySelector('#uOk').onclick = () => {
      const keep = new Set();
      ov.querySelectorAll('input[data-i]').forEach(cb => { if (cb.checked) keep.add(Number(cb.dataset.i)); });
      done(keep);
    };
  });
}

async function syncNow(manual) {
  if (!user || busy) return;
  if (manual !== true && Date.now() < suppressAutoUntil) return;  // you cancelled recently
  busy = true; setStatus('Syncing…');
  try {
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    const cloud = snap.exists() && snap.data().data ? snap.data().data : {};
    const meta = getMeta(), now = Date.now();
    const keys = new Set(Object.keys(cloud).filter(isSync).concat(localKeys()));
    const plan = {}, items = [];
    keys.forEach(k => {
      const lv = store.getItem(k), lt = meta[k] || 0, c = cloud[k];
      const d = decide(k, lv, lt, c, now);
      plan[k] = d;
      d.removed.forEach(id => items.push({ k: k, id: id, side: d.side }));
    });
    if (items.length) {                               // ask before any box gets un-ticked
      setStatus('Waiting for your choice…');
      const keep = await askAboutUnticks(items);
      if (keep === null) {
        suppressAutoUntil = Date.now() + 5 * 60 * 1000;
        setStatus('Sync cancelled'); busy = false; return;
      }
      const byKey = {};
      items.forEach((it, i) => { if (keep.has(i)) (byKey[it.k] = byKey[it.k] || []).push(it.id); });
      Object.keys(byKey).forEach(k => { plan[k].finalV = keepTicked(plan[k].finalV, byKey[k]); plan[k].t = now; });
    }
    const out = Object.assign({}, cloud);
    let changedLocal = false;
    Object.keys(plan).forEach(k => {
      const d = plan[k], lv = store.getItem(k), c = cloud[k];
      if (d.action === 'none' || d.finalV === null) return;
      if (d.finalV !== lv) { origSet.call(store, k, d.finalV); changedLocal = true; }
      if (!c || d.finalV !== c.v) out[k] = { v: d.finalV, t: d.t };
      meta[k] = d.t;
    });
    await setDoc(ref, { data: out, updatedAt: Date.now() });
    saveMeta(meta);
    lastSync = new Date();
    setStatus('Synced ' + lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    if (changedLocal) reloadOnce();
  } catch (e) {
    setStatus('Sync failed: ' + (e.code || e.message));
  }
  busy = false;
}
function schedulePush() {
  if (!user) return;
  clearTimeout(timer);
  timer = setTimeout(() => syncNow(false), 2000);
}
// record when a synced key changes on this device, then push
Storage.prototype.setItem = function (k, v) {
  origSet.call(this, k, v);
  if (this === store && isSync(k)) { const m = getMeta(); m[k] = Date.now(); saveMeta(m); schedulePush(); }
};
Storage.prototype.removeItem = function (k) {
  origRemove.call(this, k);
  if (this === store && isSync(k)) { const m = getMeta(); m[k] = Date.now(); saveMeta(m); schedulePush(); }
};

// ---- UI: 👤 button + small panel ----
let btn, panel, statusEl;
function setStatus(s) { if (statusEl) statusEl.textContent = s; }
function buildUI() {
  btn = document.getElementById('acctBtn');
  if (!btn) return;
  panel = document.createElement('div');
  panel.id = 'acctPanel';
  panel.hidden = true;
  panel.style.cssText = 'position:fixed;right:12px;top:56px;z-index:9999;background:#fff;color:#1b2a3a;border:1px solid #cfd8e3;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.2);padding:14px;min-width:230px;font:14px/1.4 system-ui,sans-serif';
  panel.innerHTML = '<div id="acctWho" style="font-weight:700;margin-bottom:2px"></div><div id="acctStatus" style="color:#667;margin-bottom:10px"></div>' +
    '<button id="acctSync" style="width:100%;margin-bottom:6px;padding:8px;border-radius:8px;border:1px solid #cfd8e3;background:#f3f6fa;font:inherit;cursor:pointer">🔄 Sync now</button>' +
    '<button id="acctOut" style="width:100%;padding:8px;border-radius:8px;border:1px solid #cfd8e3;background:#fff;font:inherit;cursor:pointer">Sign out</button>';
  document.body.appendChild(panel);
  statusEl = panel.querySelector('#acctStatus');
  panel.querySelector('#acctSync').onclick = () => syncNow(true);
  panel.querySelector('#acctOut').onclick = async () => { await signOut(auth); panel.hidden = true; };
  btn.addEventListener('click', async () => {
    if (!user) {
      try { await signInWithPopup(auth, new GoogleAuthProvider()); }
      catch (e) {
        if (e.code === 'auth/popup-blocked') { try { await signInWithRedirect(auth, new GoogleAuthProvider()); } catch (e2) { alert('Sign-in failed: ' + e2.code); } }
        else if (e.code === 'auth/unauthorized-domain') alert('Sign-in failed: add this site address under Firebase → Authentication → Settings → Authorized domains.');
        else if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') alert('Sign-in failed: ' + (e.code || e.message));
      }
    } else {
      panel.hidden = !panel.hidden;
    }
  });
  document.addEventListener('click', ev => { if (panel && !panel.hidden && !ev.target.closest('#acctPanel') && !ev.target.closest('#acctBtn')) panel.hidden = true; });
}
function renderUser() {
  if (!btn) return;
  btn.textContent = user ? '👤✓' : '👤';
  btn.title = user ? 'Signed in — tap for sync options' : 'Sign in with Google to sync';
  if (user) { panel.querySelector('#acctWho').textContent = user.displayName || user.email; }
}

function start() {
  buildUI();
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  // auto-detect long polling: works on networks / blockers that break the default connection
  db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
  onAuthStateChanged(auth, u => { user = u; renderUser(); if (u) syncNow(false); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) syncNow(false); });
  window.addEventListener('online', () => syncNow(false));
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
