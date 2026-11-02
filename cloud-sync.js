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
let app, auth, db, user = null, timer = null, busy = false, lastSync = null;

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
async function syncNow() {
  if (!user || busy) return;
  busy = true; setStatus('Syncing…');
  try {
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    const cloud = snap.exists() && snap.data().data ? snap.data().data : {};
    const meta = getMeta(), out = Object.assign({}, cloud);
    let changedLocal = false;
    const keys = new Set(Object.keys(cloud).filter(isSync).concat(localKeys()));
    keys.forEach(k => {
      const lv = store.getItem(k), lt = meta[k] || 0, c = cloud[k];
      if (c && lv !== null && lt === 0) {                    // first meeting: merge, never lose ticks
        const m = mergeVals(k, lv, c.v);
        if (m !== lv) { origSet.call(store, k, m); changedLocal = true; }
        const t = Date.now(); out[k] = { v: m, t: t }; meta[k] = t;
      } else if (c && (lv === null || c.t > lt)) {           // cloud is newer
        if (lv !== c.v) { origSet.call(store, k, c.v); changedLocal = true; }
        meta[k] = c.t;
      } else if (lv !== null && (!c || lt > c.t)) {          // this device is newer
        const t = lt || Date.now(); out[k] = { v: lv, t: t }; meta[k] = t;
      }
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
  timer = setTimeout(syncNow, 2000);
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
  panel.querySelector('#acctSync').onclick = syncNow;
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
  onAuthStateChanged(auth, u => { user = u; renderUser(); if (u) syncNow(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) syncNow(); });
  window.addEventListener('online', syncNow);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
