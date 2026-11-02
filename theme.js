// Light / dark theme for both pages. Saved in localStorage ('theme' = 'dark' | 'light').
(function () {
  var isPlan = !!document.getElementById('week');
  var root = document.documentElement;
  function saved() { try { return localStorage.getItem('theme'); } catch (e) { return null; } }
  function apply(mode) {
    if (isPlan) {
      if (mode) root.setAttribute('data-theme', mode); else root.removeAttribute('data-theme');
    } else {
      root.classList.toggle('dark', mode === 'dark');
    }
    var b = document.getElementById('themeBtn');
    if (b) b.textContent = isDark() ? '☀️' : '🌙';
  }
  function isDark() {
    var m = saved();
    if (m) return m === 'dark';
    return isPlan && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  apply(saved());
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.getElementById('themeBtn');
    if (!b) return;
    b.textContent = isDark() ? '☀️' : '🌙';
    b.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      try { localStorage.setItem('theme', next); } catch (e) {}
      apply(next);
    });
  });
})();
