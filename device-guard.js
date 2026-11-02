// Laptop / desktop lockdown: this site is built for a phone. On a mouse-driven,
// wide screen it shows a full-screen warning instead of the notes.
// Escape hatch for maintenance: add ?desktop=1 to the address.
(function () {
  try {
    if (/[?&]desktop=1\b/.test(location.search)) return;
    try { if (sessionStorage.getItem('guardUnlocked') === '1') return; } catch (e) {}
    var mm = window.matchMedia;
    if (!mm) return;
    // Phone/tablet signals: touch is the primary input, or a mobile browser. These stay true
    // even when the phone asks for the "desktop site", so phones are never locked out.
    var touchPrimary = mm('(pointer: coarse)').matches || mm('(hover: none)').matches ||
      /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    var forced = /[?&]guard=1\b/.test(location.search); // preview the warning on any device
    var isDesktop = !touchPrimary && window.innerWidth >= 768;
    if (!isDesktop && !forced) return;

    function show() {
      if (document.getElementById('deviceGuard')) return;
      var d = document.createElement('div');
      d.id = 'deviceGuard';
      d.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:#10151b;color:#e8eef4;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;font-family:system-ui,sans-serif';
      d.innerHTML = '<div style="max-width:420px"><div style="font-size:56px;margin-bottom:12px">📱</div>' +
        '<h1 style="font-size:24px;margin:0 0 12px;color:#fff;border:0;padding:0">Not optimised for a laptop</h1>' +
        '<p style="font-size:17px;line-height:1.5;margin:0 0 16px">This site is built for a phone: tap-to-hear audio, swipe between chapters and saved progress work best there.</p>' +
        '<p style="font-size:20px;font-weight:700;margin:0;color:#ffd54f">Please use your phone.</p></div>';
      document.body.appendChild(d);
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      // Cheat code: type "opensimsim" (no input box needed) to open the site.
      var CODE = 'opensimsim', buf = '';
      document.addEventListener('keydown', function onKey(ev) {
        if (!ev.key || ev.key.length !== 1) return;
        buf = (buf + ev.key.toLowerCase()).slice(-CODE.length);
        if (buf === CODE) {
          document.removeEventListener('keydown', onKey);
          try { sessionStorage.setItem('guardUnlocked', '1'); } catch (e) {}
          if (d.parentNode) d.parentNode.removeChild(d);
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
        }
      });
    }
    if (document.body) show(); else document.addEventListener('DOMContentLoaded', show);
  } catch (e) {}
})();
