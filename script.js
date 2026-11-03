'use strict';

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Theme (light "silk" by default, remembers choice) ---------- */
const themeBtn = document.getElementById('theme');
function applyTheme(t) {
  root.dataset.theme = t;
  themeBtn.setAttribute('aria-label', `Switch to ${t === 'dark' ? 'light' : 'dark'} theme`);
  document.querySelector('meta[name="theme-color"]').content = t === 'dark' ? '#10241c' : '#f7f1e3';
}
applyTheme(localStorage.getItem('theme') || 'light');
themeBtn.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  const swap = () => { applyTheme(next); localStorage.setItem('theme', next); };
  document.startViewTransition && !reduced ? document.startViewTransition(swap) : swap();
});

/* ---------- Spotlight on the hero name follows the pointer ---------- */
if (!reduced && matchMedia('(pointer: fine)').matches) {
  document.querySelector('.hero').addEventListener('pointermove', (e) => {
    document.querySelectorAll('.spot').forEach((el) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--spot-x', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      el.style.setProperty('--spot-y', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  });
}

/* ---------- Work filter with View Transitions ---------- */
const buttons = [...document.querySelectorAll('.filters button')];
const credits = [...document.querySelectorAll('.credit')];
credits.forEach((c, i) => { c.style.viewTransitionName = `credit-${i}`; });

function applyFilter(f) {
  credits.forEach((c) => { c.hidden = f !== 'all' && c.dataset.type !== f; });
  buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.f === f)));
}
buttons.forEach((b) => b.addEventListener('click', () => {
  const f = b.dataset.f;
  document.startViewTransition && !reduced
    ? document.startViewTransition(() => applyFilter(f))
    : applyFilter(f);
}));

/* ---------- Fallback reveal when scroll-driven animations are unsupported ---------- */
if (!CSS.supports('animation-timeline: view()')) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.animate(
        [{ opacity: 0, transform: 'translateY(2rem)' }, { opacity: 1, transform: 'none' }],
        { duration: reduced ? 0 : 600, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }
      );
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
}

/* ---------- Count-up numbers ---------- */
if (!reduced) {
  const io2 = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count, t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / 900, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io2.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((n) => io2.observe(n));
}

document.getElementById('yr').textContent = new Date().getFullYear();
