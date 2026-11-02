// Laptop / desktop warning (not a lock): on a mouse-driven, wide screen a banner
// says the site is built for a phone. It shows again on every page load / refresh.
// Add ?guard=1 to the address to preview it on any device.
(function () {
  try {
    var mm = window.matchMedia;
    if (!mm) return;
    // Phone/tablet signals: touch is the primary input, or a mobile browser. These stay true
    // even when the phone asks for the "desktop site", so phones never see the warning.
    var touchPrimary = mm('(pointer: coarse)').matches || mm('(hover: none)').matches ||
      /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    var forced = /[?&]guard=1\b/.test(location.search);
    var isDesktop = !touchPrimary && window.innerWidth >= 768;
    if (!isDesktop && !forced) return;

    function show() {
      if (document.getElementById('deviceWarn')) return;
      var d = document.createElement('div');
      d.id = 'deviceWarn';
      d.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:2147483647;background:#ffd54f;color:#1b2a3a;display:flex;align-items:center;justify-content:center;gap:12px;padding:10px 16px;font:600 15px/1.35 system-ui,sans-serif;box-shadow:0 2px 10px rgba(0,0,0,.25)';
      d.innerHTML = '<span>📱 Not optimised for a laptop. Please use your phone.</span>' +
        '<button type="button" aria-label="Close" style="background:#1b2a3a;color:#fff;border:0;border-radius:6px;padding:4px 12px;font:inherit;cursor:pointer">OK</button>';
      d.querySelector('button').onclick = function () { d.parentNode.removeChild(d); };
      document.body.appendChild(d);
    }
    if (document.body) show(); else document.addEventListener('DOMContentLoaded', show);
  } catch (e) {}
})();
