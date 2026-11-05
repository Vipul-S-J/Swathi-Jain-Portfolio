'use strict';
/* Horizontal photo gallery driven by vertical scroll.
   Same pattern as motion.dev/examples/react-scroll-horizontal, written for plain JS:
   a tall container, a sticky viewport, and a track that translates sideways
   from "first photo centred" to "last photo centred" as you scroll through it. */
(function () {
  var container = document.getElementById('scrollContainer');
  var track = document.getElementById('galleryTrack');
  if (!container || !track) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; // CSS shows a swipeable row instead

  var items = track.children, total = items.length;
  var noEl = document.getElementById('galleryNo');
  var barEl = document.getElementById('galleryBar');
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  function distance() {
    if (total < 2) return 0;
    return items[total - 1].offsetLeft - items[0].offsetLeft;   // (items - 1) * (width + gap)
  }
  function hud(p) {
    var i = Math.min(total, Math.max(1, Math.round(p * (total - 1)) + 1));
    if (noEl) noEl.textContent = pad(i) + ' / ' + pad(total);
    if (barEl) barEl.style.transform = 'scaleX(' + p + ')';
  }
  function progress() {
    var r = container.getBoundingClientRect();
    var span = r.height - innerHeight;
    return span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
  }

  /* Fallback: no library, just a scroll listener. */
  function plain() {
    var d = distance(), ticking = false;
    function update() {
      var p = progress();
      track.style.transform = 'translateX(' + (-d * p) + 'px)';
      hud(p); ticking = false;
    }
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', function () { d = distance(); update(); });
    update();
  }

  /* Preferred: Motion's scroll() + animate(). */
  import('https://cdn.jsdelivr.net/npm/motion@12/+esm').then(function (m) {
    var animate = m.animate, scroll = m.scroll;
    var stopA, stopB, anim;
    function build() {
      if (stopA) stopA(); if (stopB) stopB(); if (anim) anim.cancel();
      var d = distance();
      anim = animate(track, { transform: ['translateX(0px)', 'translateX(' + (-d) + 'px)'] }, { ease: 'linear' });
      var opts = { target: container, offset: ['start start', 'end end'] };
      stopA = scroll(anim, opts);
      stopB = scroll(hud, opts);
    }
    build();
    var t; addEventListener('resize', function () { clearTimeout(t); t = setTimeout(build, 150); });
  }).catch(plain);
})();
