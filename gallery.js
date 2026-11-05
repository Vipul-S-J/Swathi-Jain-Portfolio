'use strict';
/* Morphing gallery: one set of photos, three arrangements (coverflow, grid, stack).
   Every item is absolutely positioned; switching layout only changes each item's
   transform/size, and CSS transitions animate the move. Click opens a lightbox. */
(function () {
  const stage = document.getElementById('gStage');
  if (!stage) return;
  const items = [...stage.querySelectorAll('.g-item')];
  const N = items.length;
  const count = document.getElementById('gCount');
  const bar = document.querySelector('.g-bar');
  let layout = 'coverflow', cur = 0;
  const mod = (i) => ((i % N) + N) % N;
  const pad2 = (n) => String(n).padStart(2, '0');

  function set(el, w, h, t, op, z, bright) {
    el.style.width = w + 'px';
    el.style.height = h + 'px';
    el.style.transform = t;
    el.style.opacity = op;
    el.style.zIndex = z;
    el.style.pointerEvents = op ? 'auto' : 'none';
    el.style.filter = bright < 1 ? 'brightness(' + bright + ')' : 'none';
    el.tabIndex = op ? 0 : -1;
  }

  function place() {
    const W = stage.clientWidth;
    const narrow = W < 640;
    let H;
    if (layout === 'grid') {
      const cols = W < 460 ? 2 : W < 860 ? 3 : 4, gap = narrow ? 10 : 18;
      const w = (W - gap * (cols - 1)) / cols, h = w * 1.25, rows = Math.ceil(N / cols);
      H = rows * h + (rows - 1) * gap;
      items.forEach((el, i) => {
        const x = (i % cols) * (w + gap), y = Math.floor(i / cols) * (h + gap);
        set(el, w, h, 'translate3d(' + x + 'px,' + y + 'px,0)', 1, 1, 1);
      });
    } else {
      const w = Math.min(narrow ? W * 0.62 : 340, W * 0.8), h = w * 1.25;
      H = h + 40;
      const x0 = (W - w) / 2, y0 = 20;
      items.forEach((el, i) => {
        let d = i - cur;
        if (d > N / 2) d -= N;
        if (d < -N / 2) d += N;
        const ad = Math.abs(d);
        if (layout === 'coverflow') {
          const step = w * (narrow ? 0.5 : 0.62);
          const vis = ad <= (narrow ? 1 : 2);
          const tx = x0 + d * step + Math.sign(d) * (ad ? w * 0.18 : 0);
          set(el, w, h,
            'translate3d(' + tx + 'px,' + y0 + 'px,' + (-ad * 120) + 'px) rotateY(' + (-Math.sign(d) * Math.min(ad, 1) * 38) + 'deg) scale(' + (1 - ad * 0.06) + ')',
            vis ? 1 : 0, 100 - ad, ad ? 0.55 : 1);
        } else {
          const pos = d < 0 ? 9 : d;
          const side = pos % 2 ? 1 : -1;
          const rot = pos === 0 ? 0 : side * (3 + pos * 2);
          const vis = pos < 4;
          const px = pos && pos < 9 ? side * pos * 14 : 0;
          set(el, w, h,
            'translate3d(' + (x0 + px) + 'px,' + (y0 + Math.min(pos, 4) * 6) + 'px,' + (-Math.min(pos, 4) * 40) + 'px) rotate(' + rot + 'deg) scale(' + (1 - Math.min(pos, 4) * 0.035) + ')',
            vis ? 1 : 0, 100 - pos, pos ? 0.7 : 1);
        }
      });
    }
    stage.style.height = H + 'px';
    count.textContent = layout === 'grid' ? N + ' photos' : pad2(cur + 1) + ' / ' + pad2(N);
    bar.querySelectorAll('.nav-b').forEach((b) => { b.style.visibility = layout === 'grid' ? 'hidden' : 'visible'; });
  }

  const go = (d) => { cur = mod(cur + d); place(); };

  bar.querySelectorAll('[data-layout]').forEach((b) => b.addEventListener('click', () => {
    layout = b.dataset.layout;
    bar.querySelectorAll('[data-layout]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    place();
  }));
  document.getElementById('gPrev').addEventListener('click', () => go(-1));
  document.getElementById('gNext').addEventListener('click', () => go(1));

  /* click: a side card in coverflow centres it; otherwise open the viewer */
  items.forEach((el, i) => {
    el.addEventListener('click', () => {
      if (layout === 'coverflow' && i !== cur) { cur = i; place(); } else openBox(i);
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
  });

  /* swipe */
  let sx = null, swiped = false;
  stage.addEventListener('pointerdown', (e) => { sx = e.clientX; });
  stage.addEventListener('pointerup', (e) => {
    if (sx === null || layout === 'grid') { sx = null; return; }
    const dx = e.clientX - sx;
    sx = null;
    if (Math.abs(dx) > 50) { swiped = true; go(dx < 0 ? 1 : -1); setTimeout(() => { swiped = false; }, 60); }
  });
  stage.addEventListener('click', (e) => { if (swiped) { e.stopPropagation(); e.preventDefault(); } }, true);

  /* lightbox */
  const box = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  let bi = 0;
  function show(i) {
    bi = mod(i);
    const img = items[bi].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = pad2(bi + 1) + ' / ' + pad2(N);
  }
  function openBox(i) { show(i); if (box.showModal) box.showModal(); }
  document.getElementById('lbX').addEventListener('click', () => box.close());
  document.getElementById('lbP').addEventListener('click', () => show(bi - 1));
  document.getElementById('lbN').addEventListener('click', () => show(bi + 1));
  box.addEventListener('click', (e) => { if (e.target === box || e.target.classList.contains('lb-in')) box.close(); });
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(bi - 1);
    if (e.key === 'ArrowRight') show(bi + 1);
  });
  box.addEventListener('close', () => { if (layout !== 'grid') { cur = bi; place(); } });

  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(place, 100); });
  place();
})();
